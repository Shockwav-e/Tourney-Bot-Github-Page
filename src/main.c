#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <winsock2.h>
#include <Windows.h>
#include <iphlpapi.h>
#include <icmpapi.h>
#include "iup.h"
#include "common.h"

#pragma comment(lib, "iphlpapi.lib")
#pragma comment(lib, "ws2_32.lib")
#pragma comment(lib, "user32.lib")

// ! the order decides which module get processed first
Module* modules[MODULE_CNT] = {
    &lagModule,
    &dropModule,
    &throttleModule,
    &dupModule,
    &oodModule,
    &tamperModule,
    &resetModule,
	&bandwidthModule,
};

volatile short sendState = SEND_STATUS_NONE;

// global iup handlers
static Ihandle *dialog, *topFrame, *bottomFrame; 
static Ihandle *statusLabel;
static Ihandle *filterText, *filterButton;
Ihandle *filterSelectList;
// timer to update icons
static Ihandle *stateIcon;
static Ihandle *timer;
static Ihandle *timeout = NULL;
static Ihandle *pingLabel;
static BOOL pingEnabled = FALSE;
static int hotkeyId = 0;
static UINT hotkeyModifiers = 0;
static UINT hotkeyVKey = 0;
static BOOL hotkeyRegistered = FALSE;
static int hotkeyToggle = VK_XBUTTON1;
static BOOL hotkeyPressed = FALSE;
static Ihandle *hotkeyLabel;
static char hotkeyDisplayName[32] = "MOUSE4";
static HHOOK mouseHook = NULL;
static LRESULT CALLBACK MouseHookProc(int nCode, WPARAM wParam, LPARAM lParam);


void showStatus(const char *line);
static int uiOnDialogShow(Ihandle *ih, int state);
static int uiStopCb(Ihandle *ih);
static int uiStartCb(Ihandle *ih);
static int uiTimerCb(Ihandle *ih);
static int uiTimeoutCb(Ihandle *ih);
static int uiListSelectCb(Ihandle *ih, char *text, int item, int state);
static int uiFilterTextCb(Ihandle *ih);
static void uiSetupModule(Module *module, Ihandle *parent);
static void updatePing();
static void parseHotkey(const char *hotkeyStr);
static void registerHotkey(HWND hWnd);
static void unregisterHotkey();
static LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam);


// serializing config files using a stupid custom format
#define CONFIG_FILE "config.txt"
#define CONFIG_MAX_RECORDS 64
#define CONFIG_BUF_SIZE 4096
typedef struct {
    char* filterName;
    char* filterValue;
} filterRecord;
UINT filtersSize;
filterRecord filters[CONFIG_MAX_RECORDS] = {0};
char configBuf[CONFIG_BUF_SIZE+2]; // add some padding to write \n
BOOL parameterized = 0; // parameterized flag, means reading args from command line

// loading up filters and fill in
void loadConfig() {
    char path[MSG_BUFSIZE];
    char *p;
    FILE *f;
    GetModuleFileName(NULL, path, MSG_BUFSIZE);
    LOG("Executable path: %s", path);
    p = strrchr(path, '\\');
    if (p == NULL) p = strrchr(path, '/'); // holy shit
    strcpy(p+1, CONFIG_FILE);
    LOG("Config path: %s", path);
    f = fopen(path, "r");
    if (f) {
        size_t len;
        char *current, *last;
        len = fread(configBuf, sizeof(char), CONFIG_BUF_SIZE, f);
        if (len == CONFIG_BUF_SIZE) {
            LOG("Config file is larger than %d bytes, get truncated.", CONFIG_BUF_SIZE);
        }
        // always patch in a newline at the end to ease parsing
        configBuf[len] = '\n';
        configBuf[len+1] = '\0';

        // parse out the kv pairs. isn't quite safe
        filtersSize = 0;
        last = current = configBuf;
        do {
            // eat up empty lines
EAT_SPACE:  while (isspace(*current)) { ++current; }
            if (*current == '#') {
                current = strchr(current, '\n');
                if (!current) break;
                current = current + 1;
                goto EAT_SPACE;
            }

            // now we can start
            last = current;
            current = strchr(last, ':');
            if (!current) break;
            *current = '\0';
            filters[filtersSize].filterName = last;
            current += 1;
            while (isspace(*current)) { ++current; } // eat potential space after :
            last = current;
            current = strchr(last, '\n');
            if (!current) break;
            filters[filtersSize].filterValue = last;
            *current = '\0';
            if (*(current-1) == '\r') *(current-1) = 0;
            last = current = current + 1;
            ++filtersSize;
        } while (last && last - configBuf < CONFIG_BUF_SIZE);
        LOG("Loaded %u records.", filtersSize);
        
        // Load hotkey settings
        for (UINT i = 0; i < filtersSize; ++i) {
            if (strcmp(filters[i].filterName, "hotkey_toggle") == 0) {
                char trimmed[32];
                sscanf(filters[i].filterValue, "%31s", trimmed);
                strcpy(hotkeyDisplayName, trimmed);
                
                if (strcmp(trimmed, "F9") == 0) hotkeyToggle = VK_F9;
                else if (strcmp(trimmed, "F10") == 0) hotkeyToggle = VK_F10;
                else if (strcmp(trimmed, "F11") == 0) hotkeyToggle = VK_F11;
                else if (strcmp(trimmed, "F12") == 0) hotkeyToggle = VK_F12;
                else if (strcmp(trimmed, "MOUSE4") == 0) hotkeyToggle = VK_XBUTTON1;
                else if (strcmp(trimmed, "MOUSE5") == 0) hotkeyToggle = VK_XBUTTON2;
            }
        }
        
        fclose(f);
    }

    if (!f || filtersSize == 0)
    {
        LOG("Failed to load from config. Fill in a simple one.");
        // config is missing or ill-formed. fill in some simple ones
        filters[filtersSize].filterName = "loopback packets";
        filters[filtersSize].filterValue = "outbound and ip.DstAddr >= 127.0.0.1 and ip.DstAddr <= 127.255.255.255";
        filtersSize = 1;
    }
}

// Parse hotkey string from config (e.g., "F9", "MOUSE4", "MOUSE5")
static void parseHotkey(const char *hotkeyStr) {
    if (!hotkeyStr || strlen(hotkeyStr) == 0) {
        LOG("No hotkey configured");
        return;
    }

    // Trim whitespace
    char trimmed[64];
    sscanf(hotkeyStr, "%63s", trimmed);

    hotkeyModifiers = 0;

    if (strcmp(trimmed, "F9") == 0) {
        hotkeyVKey = VK_F9;
    } else if (strcmp(trimmed, "F10") == 0) {
        hotkeyVKey = VK_F10;
    } else if (strcmp(trimmed, "F11") == 0) {
        hotkeyVKey = VK_F11;
    } else if (strcmp(trimmed, "F12") == 0) {
        hotkeyVKey = VK_F12;
    } else if (strcmp(trimmed, "MOUSE4") == 0) {
        hotkeyVKey = VK_XBUTTON1;
    } else if (strcmp(trimmed, "MOUSE5") == 0) {
        hotkeyVKey = VK_XBUTTON2;
    } else {
        LOG("Unknown hotkey: %s", trimmed);
        hotkeyVKey = 0;
    }

    if (hotkeyVKey != 0) {
        LOG("Hotkey configured: %s (VKey: %d)", trimmed, hotkeyVKey);
    }
}

// Register global hotkey
static void registerHotkey(HWND hWnd) {
    if (hotkeyVKey == 0) return;

    // For mouse buttons, use a mouse hook instead of RegisterHotKey
    if (hotkeyToggle == VK_XBUTTON1 || hotkeyToggle == VK_XBUTTON2) {
        mouseHook = SetWindowsHookEx(WH_MOUSE_LL, MouseHookProc, GetModuleHandle(NULL), 0);
        if (mouseHook) {
            LOG("Mouse hook registered successfully");
            hotkeyRegistered = TRUE;
        } else {
            LOG("Failed to register mouse hook");
            hotkeyRegistered = FALSE;
        }
    } else {
        // For function keys, use RegisterHotKey
        hotkeyId = 1;
        if (RegisterHotKey(hWnd, hotkeyId, hotkeyModifiers, hotkeyVKey)) {
            LOG("Hotkey registered successfully");
            hotkeyRegistered = TRUE;
        } else {
            LOG("Failed to register hotkey");
            hotkeyRegistered = FALSE;
        }
    }
}

// Unregister global hotkey
static void unregisterHotkey() {
    if (hotkeyRegistered) {
        if (mouseHook) {
            UnhookWindowsHookEx(mouseHook);
            mouseHook = NULL;
            LOG("Mouse hook unregistered");
        } else if (hotkeyId != 0) {
            HWND hWnd = (HWND)IupGetAttribute(dialog, "HWND");
            if (hWnd) {
                UnregisterHotKey(hWnd, hotkeyId);
                LOG("Hotkey unregistered");
            }
        }
        hotkeyRegistered = FALSE;
    }
}

// Mouse hook for detecting mouse button presses
static LRESULT CALLBACK MouseHookProc(int nCode, WPARAM wParam, LPARAM lParam) {
    if (nCode >= 0) {
        // Check for mouse button 4 or 5
        if ((wParam == WM_XBUTTONDOWN) && lParam) {
            PMSLLHOOKSTRUCT pMouseStruct = (PMSLLHOOKSTRUCT)lParam;
            UINT button = GET_XBUTTON_WPARAM(pMouseStruct->mouseData);
            
            if ((hotkeyToggle == VK_XBUTTON1 && button == XBUTTON1) ||
                (hotkeyToggle == VK_XBUTTON2 && button == XBUTTON2)) {
                
                if (!hotkeyPressed) {
                    hotkeyPressed = TRUE;
                    const char* title = IupGetAttribute(filterButton, "TITLE");
                    if (strcmp(title, "Start") == 0) {
                        uiStartCb(filterButton);
                    } else if (strcmp(title, "Stop") == 0) {
                        uiStopCb(filterButton);
                    }
                }
            }
        } else if (wParam == WM_XBUTTONUP) {
            hotkeyPressed = FALSE;
        }
    }
    return CallNextHookEx(mouseHook, nCode, wParam, lParam);
}

// Toggle start/stop via hotkey
static void toggleFiltering() {
    if (IupGetInt(filterButton, "ACTIVE") == 0) return; // button disabled

    // Check current state by button title
    const char *buttonTitle = IupGetAttribute(filterButton, "TITLE");
    if (strcmp(buttonTitle, "Start") == 0) {
        uiStartCb(filterButton);
    } else if (strcmp(buttonTitle, "Stop") == 0) {
        uiStopCb(filterButton);
    }
}

void init(int argc, char* argv[]) {
    UINT ix;
    Ihandle *topVbox, *bottomVbox, *dialogVBox, *controlHbox;
    Ihandle *noneIcon, *doingIcon, *errorIcon;
    char* arg_value = NULL;
    WSADATA wsaData;

    // initialize winsock for ping functionality
    WSAStartup(MAKEWORD(2, 2), &wsaData);

    // fill in config
    loadConfig();

    // iup inits
    IupOpen(&argc, &argv);

    // status label
    statusLabel = IupLabel("Ready. Click Start to begin filtering.");
    IupSetAttribute(statusLabel, "EXPAND", "HORIZONTAL");
    IupSetAttribute(statusLabel, "PADDING", "8x8");
    IupSetAttribute(statusLabel, "FGCOLOR", "200 200 200");

    topFrame = IupFrame(
        topVbox = IupVbox(
            filterText = IupText(NULL),
            controlHbox = IupHbox(
                stateIcon = IupLabel(NULL),
                filterButton = IupButton("Start", NULL),
                IupFill(),
                pingLabel = IupLabel("Ping: --ms"),
                IupLabel("Hotkey:  "),
                hotkeyLabel = IupLabel("MOUSE4"),
                IupLabel("Presets:  "),
                filterSelectList = IupList(NULL),
                NULL
            ),
            NULL
        )
    );

    // parse arguments and set globals *before* setting up UI.
    // arguments can be read and set after callbacks are setup
    // FIXME as Release is built as WindowedApp, stdout/stderr won't show
    LOG("argc: %d", argc);
    if (argc > 1) {
        if (!parseArgs(argc, argv)) {
            fprintf(stderr, "invalid argument count. ensure you're using options as \"--drop on\"");
            exit(-1); // fail fast.
        }
        parameterized = 1;
    }

    IupSetAttribute(topFrame, "TITLE", "Filtering");
    IupSetAttribute(topFrame, "EXPAND", "HORIZONTAL");
    IupSetAttribute(filterText, "EXPAND", "HORIZONTAL");
    IupSetCallback(filterText, "VALUECHANGED_CB", (Icallback)uiFilterTextCb);
    IupSetAttribute(filterButton, "PADDING", "8x");
    IupSetCallback(filterButton, "ACTION", uiStartCb);
    // Ensure default Start button is visible: green background with dark text
    IupSetAttribute(filterButton, "BGCOLOR", "50 180 50");
    IupSetAttribute(filterButton, "FGCOLOR", "0 0 0");
    IupSetAttribute(topVbox, "NCMARGIN", "4x4");
    IupSetAttribute(topVbox, "NCGAP", "4x2");
    IupSetAttribute(controlHbox, "ALIGNMENT", "ACENTER");

    // setup state icon
    IupSetAttribute(stateIcon, "IMAGE", "none_icon");
    IupSetAttribute(stateIcon, "PADDING", "4x");

    // fill in options and setup callback
    IupSetAttribute(filterSelectList, "VISIBLECOLUMNS", "24");
    IupSetAttribute(filterSelectList, "DROPDOWN", "YES");
    for (ix = 0; ix < filtersSize; ++ix) {
        char ixBuf[4];
        sprintf(ixBuf, "%d", ix+1); // ! staring from 1, following lua indexing
        IupStoreAttribute(filterSelectList, ixBuf, filters[ix].filterName);
    }
    IupSetAttribute(filterSelectList, "VALUE", "1");
    IupSetCallback(filterSelectList, "ACTION", (Icallback)uiListSelectCb);
    // set filter text value since the callback won't take effect before main loop starts
    IupSetAttribute(filterText, "VALUE", filters[0].filterValue);
    
    // setup ping label styling
    IupSetAttribute(pingLabel, "FGCOLOR", "100 200 100");
    IupSetAttribute(pingLabel, "PADDING", "4x");
    
    // setup hotkey label styling
    IupSetAttribute(hotkeyLabel, "FGCOLOR", "100 150 255");
    IupSetAttribute(hotkeyLabel, "PADDING", "4x");
    IupStoreAttribute(hotkeyLabel, "TITLE", hotkeyDisplayName);

    // functionalities frame 
    bottomFrame = IupFrame(
        bottomVbox = IupVbox(
            NULL
        )
    );
    IupSetAttribute(bottomFrame, "TITLE", "Functions");
    IupSetAttribute(bottomVbox, "NCMARGIN", "4x4");
    IupSetAttribute(bottomVbox, "NCGAP", "4x2");

    // create icons
    noneIcon = IupImage(8, 8, icon8x8);
    doingIcon = IupImage(8, 8, icon8x8);
    errorIcon = IupImage(8, 8, icon8x8);
    IupSetAttribute(noneIcon, "0", "BGCOLOR");
    IupSetAttribute(noneIcon, "1", "224 224 224");
    IupSetAttribute(doingIcon, "0", "BGCOLOR");
    IupSetAttribute(doingIcon, "1", "109 170 44");
    IupSetAttribute(errorIcon, "0", "BGCOLOR");
    IupSetAttribute(errorIcon, "1", "208 70 72");
    IupSetHandle("none_icon", noneIcon);
    IupSetHandle("doing_icon", doingIcon);
    IupSetHandle("error_icon", errorIcon);

    // setup module uis
    for (ix = 0; ix < MODULE_CNT; ++ix) {
        uiSetupModule(*(modules+ix), bottomVbox);
    }

    // dialog
    dialog = IupDialog(
        dialogVBox = IupVbox(
            topFrame,
            bottomFrame,
            statusLabel,
            NULL
        )
    );

    IupSetAttribute(dialog, "TITLE", APP_NAME " " CLUMSY_VERSION);
    IupSetAttribute(dialog, "SIZE", "480x"); // add padding manually to width
    IupSetAttribute(dialog, "RESIZE", "NO");
    IupSetCallback(dialog, "SHOW_CB", (Icallback)uiOnDialogShow);

    // apply dark mode permanently
    applyDarkMode();

    // global layout settings to affect childrens
    IupSetAttribute(dialogVBox, "ALIGNMENT", "ACENTER");
    IupSetAttribute(dialogVBox, "NCMARGIN", "4x4");
    IupSetAttribute(dialogVBox, "NCGAP", "4x2");

    // setup timer
    timer = IupTimer();
    IupSetAttribute(timer, "TIME", STR(ICON_UPDATE_MS));
    IupSetCallback(timer, "ACTION_CB", uiTimerCb);

    // setup timeout of program
    arg_value = IupGetGlobal("timeout");
    if(arg_value != NULL)
    {
        char valueBuf[16];
        sprintf(valueBuf, "%s000", arg_value);  // convert from seconds to milliseconds

        timeout = IupTimer();
        IupStoreAttribute(timeout, "TIME", valueBuf);
        IupSetCallback(timeout, "ACTION_CB", uiTimeoutCb);
        IupSetAttribute(timeout, "RUN", "YES");
    }

    // Parse hotkey from config
    for (ix = 0; ix < filtersSize; ++ix) {
        if (strstr(filters[ix].filterName, "hotkey_toggle") != NULL) {
            parseHotkey(filters[ix].filterValue);
            break;
        }
    }
}

void startup() {
    // initialize seed
    srand((unsigned int)time(NULL));

    // kickoff event loops
    IupShowXY(dialog, IUP_CENTER, IUP_CENTER);
    IupMainLoop();
    // ! main loop won't return until program exit
}

void cleanup() {
    unregisterHotkey();

    IupDestroy(timer);
    if (timeout) {
        IupDestroy(timeout);
    }

    IupClose();
    endTimePeriod(); // try close if not closing
    WSACleanup(); // cleanup winsock
}

// ui logics
void showStatus(const char *line) {
    IupStoreAttribute(statusLabel, "TITLE", line); 
}

// in fact only 32bit binary would run on 64 bit os
// if this happens pop out message box and exit
static BOOL check32RunningOn64(HWND hWnd) {
    BOOL is64ret;
    // consider IsWow64Process return value
    if (IsWow64Process(GetCurrentProcess(), &is64ret) && is64ret) {
        MessageBox(hWnd, (LPCSTR)"You're running 32bit mucchad on 64bit Windows, which wouldn't work. Please use the 64bit mucchad version.",
            (LPCSTR)"Aborting", MB_OK);
        return TRUE;
    }
    return FALSE;
}

static BOOL checkIsRunning() {
    //It will be closed and destroyed when programm terminates (according to MSDN).
    HANDLE hStartEvent = CreateEventW(NULL, FALSE, FALSE, L"Global\\MUCCHAD_IS_RUNNING_EVENT_NAME");

    if (hStartEvent == NULL)
        return TRUE;

    if (GetLastError() == ERROR_ALREADY_EXISTS) {
        CloseHandle(hStartEvent);
        hStartEvent = NULL;
        return TRUE;
    }

    return FALSE;
}


static int uiOnDialogShow(Ihandle *ih, int state) {
    // only need to process on show
    HWND hWnd;
    BOOL exit;
    HICON icon;
    HINSTANCE hInstance;
    if (state != IUP_SHOW) return IUP_DEFAULT;
    hWnd = (HWND)IupGetAttribute(ih, "HWND");
    hInstance = GetModuleHandle(NULL);

    // set application icon
    icon = LoadIcon(hInstance, "MUCCHAD_ICON");
    SendMessage(hWnd, WM_SETICON, ICON_BIG, (LPARAM)icon);
    SendMessage(hWnd, WM_SETICON, ICON_SMALL, (LPARAM)icon);

    exit = checkIsRunning();
    if (exit) {
        MessageBox(hWnd, (LPCSTR)"There's already an instance of mucchad running.",
            (LPCSTR)"Aborting", MB_OK);
        return IUP_CLOSE;
    }

#ifdef _WIN32
    exit = check32RunningOn64(hWnd);
    if (exit) {
        return IUP_CLOSE;
    }
#endif

    // try elevate and decides whether to exit
    exit = tryElevate(hWnd, parameterized);

    if (!exit && parameterized) {
        setFromParameter(filterText, "VALUE", "filter");
        LOG("is parameterized, start filtering upon execution.");
        uiStartCb(filterButton);
    }

    // Register hotkey after dialog is shown
    registerHotkey(hWnd);

    return exit ? IUP_CLOSE : IUP_DEFAULT;
}

static int uiStartCb(Ihandle *ih) {
    char buf[MSG_BUFSIZE];
    UNREFERENCED_PARAMETER(ih);
    if (divertStart(IupGetAttribute(filterText, "VALUE"), buf) == 0) {
        showStatus(buf);
        return IUP_DEFAULT;
    }

    // successfully started
    showStatus("Started filtering. Enable functionalities to take effect.");
    IupSetAttribute(filterText, "ACTIVE", "NO");
    IupSetAttribute(filterButton, "TITLE", "Stop");
    // Running state: red background with dark text
    IupSetAttribute(filterButton, "BGCOLOR", "220 50 50");
    IupSetAttribute(filterButton, "FGCOLOR", "0 0 0");
    IupSetCallback(filterButton, "ACTION", uiStopCb);
    IupSetAttribute(timer, "RUN", "YES");
    pingEnabled = TRUE;
    Beep(800, 100);

    return IUP_DEFAULT;
}

static int uiStopCb(Ihandle *ih) {
    int ix;
    UNREFERENCED_PARAMETER(ih);
    
    // try stopping
    IupSetAttribute(filterButton, "ACTIVE", "NO");
    IupFlush(); // flush to show disabled state
    divertStop();

    IupSetAttribute(filterText, "ACTIVE", "YES");
    IupSetAttribute(filterButton, "TITLE", "Start");
    // Idle state: green background with dark text
    IupSetAttribute(filterButton, "BGCOLOR", "50 180 50");
    IupSetAttribute(filterButton, "FGCOLOR", "0 0 0");
    IupSetAttribute(filterButton, "ACTIVE", "YES");
    IupSetCallback(filterButton, "ACTION", uiStartCb);

    // stop timer and clean up icons
    IupSetAttribute(timer, "RUN", "NO");
    for (ix = 0; ix < MODULE_CNT; ++ix) {
        modules[ix]->processTriggered = 0; // use = here since is threads already stopped
        IupSetAttribute(modules[ix]->iconHandle, "IMAGE", "none_icon");
    }
    sendState = SEND_STATUS_NONE;
    IupSetAttribute(stateIcon, "IMAGE", "none_icon");
    pingEnabled = FALSE;
    IupStoreAttribute(pingLabel, "TITLE", "Ping: --ms");
    Beep(400, 150);

    showStatus("Stopped. To begin again, edit criteria and click Start.");
    return IUP_DEFAULT;
}

static int uiToggleControls(Ihandle *ih, int state) {
    Ihandle *controls = (Ihandle*)IupGetAttribute(ih, CONTROLS_HANDLE);
    short *target = (short*)IupGetAttribute(ih, SYNCED_VALUE);
    int controlsActive = IupGetInt(controls, "ACTIVE");
    if (controlsActive && !state) {
        IupSetAttribute(controls, "ACTIVE", "NO");
        InterlockedExchange16(target, I2S(state));
    } else if (!controlsActive && state) {
        IupSetAttribute(controls, "ACTIVE", "YES");
        InterlockedExchange16(target, I2S(state));
    }

    return IUP_DEFAULT;
}

static int uiTimerCb(Ihandle *ih) {
    int ix;
    UNREFERENCED_PARAMETER(ih);
    
    // Check toggle hotkey for function keys only (mouse buttons use hook)
    if (hotkeyToggle != VK_XBUTTON1 && hotkeyToggle != VK_XBUTTON2) {
        if (GetAsyncKeyState(hotkeyToggle) & 0x8000) {
            if (!hotkeyPressed) {
                hotkeyPressed = TRUE;
                const char* title = IupGetAttribute(filterButton, "TITLE");
                if (strcmp(title, "Start") == 0) {
                    uiStartCb(filterButton);
                } else if (strcmp(title, "Stop") == 0) {
                    uiStopCb(filterButton);
                }
            }
        } else {
            hotkeyPressed = FALSE;
        }
    }
    
    for (ix = 0; ix < MODULE_CNT; ++ix) {
        if (modules[ix]->processTriggered) {
            IupSetAttribute(modules[ix]->iconHandle, "IMAGE", "doing_icon");
            InterlockedAnd16(&(modules[ix]->processTriggered), 0);
        } else {
            IupSetAttribute(modules[ix]->iconHandle, "IMAGE", "none_icon");
        }
    }

    // update global send status icon
    switch (sendState)
    {
    case SEND_STATUS_NONE:
        IupSetAttribute(stateIcon, "IMAGE", "none_icon");
        break;
    case SEND_STATUS_SEND:
        IupSetAttribute(stateIcon, "IMAGE", "doing_icon");
        InterlockedAnd16(&sendState, SEND_STATUS_NONE);
        break;
    case SEND_STATUS_FAIL:
        IupSetAttribute(stateIcon, "IMAGE", "error_icon");
        InterlockedAnd16(&sendState, SEND_STATUS_NONE);
        break;
    }

    // update ping display
    updatePing();

    return IUP_DEFAULT;
}

static int uiTimeoutCb(Ihandle *ih) {
    UNREFERENCED_PARAMETER(ih);
    return IUP_CLOSE;
 }

static int uiListSelectCb(Ihandle *ih, char *text, int item, int state) {
    UNREFERENCED_PARAMETER(text);
    UNREFERENCED_PARAMETER(ih);
    if (state == 1) {
        IupSetAttribute(filterText, "VALUE", filters[item-1].filterValue);
    }
    return IUP_DEFAULT;
}

static int uiFilterTextCb(Ihandle *ih)  {
    UNREFERENCED_PARAMETER(ih);
    // unselect list
    IupSetAttribute(filterSelectList, "VALUE", "0");
    return IUP_DEFAULT;
}

static void uiSetupModule(Module *module, Ihandle *parent) {
    Ihandle *groupBox, *toggle, *controls, *icon;
    groupBox = IupHbox(
        icon = IupLabel(NULL),
        toggle = IupToggle(module->displayName, NULL),
        IupFill(),
        controls = module->setupUIFunc(),
        NULL
    );
    IupSetAttribute(groupBox, "EXPAND", "HORIZONTAL");
    IupSetAttribute(groupBox, "ALIGNMENT", "ACENTER");
    IupSetAttribute(controls, "ALIGNMENT", "ACENTER");
    IupAppend(parent, groupBox);

    // set controls as attribute to toggle and enable toggle callback
    IupSetCallback(toggle, "ACTION", (Icallback)uiToggleControls);
    IupSetAttribute(toggle, CONTROLS_HANDLE, (char*)controls);
    IupSetAttribute(toggle, SYNCED_VALUE, (char*)module->enabledFlag);
    IupSetAttribute(controls, "ACTIVE", "NO"); // startup as inactive
    IupSetAttribute(controls, "NCGAP", "4"); // startup as inactive

    // set default icon
    IupSetAttribute(icon, "IMAGE", "none_icon");
    IupSetAttribute(icon, "PADDING", "4x");
    module->iconHandle = icon;

    // parameterize toggle
    if (parameterized) {
        setFromParameter(toggle, "VALUE", module->shortName);
    }
}

// Ping implementation
static void updatePing() {
    static DWORD lastPingTime = 0;
    DWORD currentTime = GetTickCount();
    
    if (!pingEnabled) return;
    
    if (currentTime - lastPingTime >= 2000) {
        HANDLE hIcmpFile = IcmpCreateFile();
        if (hIcmpFile != INVALID_HANDLE_VALUE) {
            char SendData[32] = "mucchad";
            DWORD ReplySize = sizeof(ICMP_ECHO_REPLY) + sizeof(SendData) + 16;
            LPVOID ReplyBuffer = malloc(ReplySize);
            
            if (ReplyBuffer) {
                IPAddr ipaddr = inet_addr("8.8.8.8");
                if (ipaddr != INADDR_NONE) {
                    // Set IP options for better accuracy
                    IP_OPTION_INFORMATION IpOptions;
                    IpOptions.Ttl = 64;
                    IpOptions.Tos = 0;
                    IpOptions.Flags = 0;
                    IpOptions.OptionsSize = 0;
                    IpOptions.OptionsData = NULL;
                    
                    DWORD dwRetVal = IcmpSendEcho(hIcmpFile, ipaddr, 
                        SendData, sizeof(SendData), &IpOptions, ReplyBuffer, ReplySize, 3000);
                    
                    if (dwRetVal != 0) {
                        PICMP_ECHO_REPLY pEchoReply = (PICMP_ECHO_REPLY)ReplyBuffer;
                        if (pEchoReply->Status == IP_SUCCESS) {
                            char pingText[32];
                            ULONG rtt = pEchoReply->RoundTripTime;
                            if (rtt == 0) rtt = 1; // Show at least 1ms
                            sprintf(pingText, "Ping: %lums", rtt);
                            IupStoreAttribute(pingLabel, "TITLE", pingText);
                        } else {
                            IupStoreAttribute(pingLabel, "TITLE", "Ping: --ms");
                        }
                    } else {
                        IupStoreAttribute(pingLabel, "TITLE", "Ping: --ms");
                    }
                } else {
                    IupStoreAttribute(pingLabel, "TITLE", "Ping: --ms");
                }
                free(ReplyBuffer);
            }
            IcmpCloseHandle(hIcmpFile);
        } else {
            IupStoreAttribute(pingLabel, "TITLE", "Ping: --ms");
        }
        lastPingTime = currentTime;
    }
}

// Dark mode implementation
void applyDarkMode() {
    // Set global dark theme colors
    IupSetGlobal("DLGBGCOLOR", "30 30 30");
    IupSetGlobal("TXTBGCOLOR", "45 45 45");
    IupSetGlobal("TXTFGCOLOR", "220 220 220");
    
    // Apply to main dialog
    IupSetAttribute(dialog, "BGCOLOR", "30 30 30");
    IupSetAttribute(topFrame, "BGCOLOR", "30 30 30");
    IupSetAttribute(bottomFrame, "BGCOLOR", "30 30 30");
    
    // Apply to controls
    IupSetAttribute(filterText, "BGCOLOR", "45 45 45");
    IupSetAttribute(filterText, "FGCOLOR", "220 220 220");
    // Apply consistent default colors for Start button in dark mode
    IupSetAttribute(filterButton, "BGCOLOR", "50 180 50");
    IupSetAttribute(filterButton, "FGCOLOR", "0 0 0");
    IupSetAttribute(filterSelectList, "BGCOLOR", "45 45 45");
    IupSetAttribute(filterSelectList, "FGCOLOR", "220 220 220");
    IupSetAttribute(statusLabel, "BGCOLOR", "30 30 30");
    IupSetAttribute(statusLabel, "FGCOLOR", "200 200 200");
    
    IupRefresh(dialog);
}





int main(int argc, char* argv[]) {
    LOG("Is Run As Admin: %d", IsRunAsAdmin());
    LOG("Is Elevated: %d", IsElevated());
    init(argc, argv);
    startup();
    cleanup();
    return 0;
}
