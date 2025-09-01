// Custom cursor with trail
const cursors = [];
for (let i = 0; i < 5; i++) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor', `cursor-${i}`);
    document.body.appendChild(cursor);
    cursors.push(cursor);
}

document.addEventListener('mousemove', (e) => {
    cursors.forEach((cursor, index) => {
        setTimeout(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }, index * 50);
    });
});
// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    html.classList.add('dark');
    themeToggle.checked = true;
} else {
    html.classList.remove('dark');
    themeToggle.checked = false;
} themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
    });
});

// Intersection-based reveal animations
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
        }
    });
}, {threshold: 0.12});

function registerReveals() {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// Command list and search functionality
const commands = {
    "Bot": [
        {
            "name": "/about",
            "description": "Get information about the bot."
        }, {
            "name": "/help",
            "description": "Display all available commands with descriptions."
        }, {
            "name": "/ping",
            "description": "Get the bot's latency and uptime information."
        }
    ],
    "Attendance": [
        {
            "name": "/add_link",
            "description": "Add a recording link to an existing attendance record."
        },
        {
            "name": "/attendance",
            "description": "Mark attendance for the match in this channel."
        },
        {
            "name": "/delete_attendance",
            "description": "Delete a specific attendance record for a match."
        },
        {
            "name": "/get_attendance",
            "description": "Get attendance records for a user in a specific tournament."
        }, {
            "name": "/get_sheet",
            "description": "Generates an Excel file of a tournament's attendance and work counts."
        }, {
            "name": "/missing_links",
            "description": "Shows matches missing recording links with detailed information."
        }, {
            "name": "/staff_work",
            "description": "Get work count for all staff in a specific tournament."
        }, {
            "name": "/work_done",
            "description": "Get work count for a user in a specific tournament."
        }
    ],
    "Fun": [
        {
            "name": "/avatar",
            "description": "Get the avatar of a user."
        },
        {
            "name": "/choose",
            "description": "Choose random options."
        },
        {
            "name": "/countdown",
            "description": "Start a countdown timer."
        },
        {
            "name": "/enlarge",
            "description": "Enlarges a provided emoji."
        }, {
            "name": "/localtime",
            "description": "Converts UTC time to your local time."
        }, {
            "name": "/toss",
            "description": "Toss a coin and get heads or tails."
        }, {
            "name": "/translate",
            "description": "Translate text to a specified language."
        }, {
            "name": "/user",
            "description": "Get detailed information about a specified user."
        }, {
            "name": "/dm",
            "description": "Send a direct message to a specified user."
        }, {
            "name": "/fake_say",
            "description": "Say as someone else."
        }, {
            "name": "/say",
            "description": "Makes the bot say something."
        }, {
            "name": "/define",
            "description": "Get the definition of a word."
        }, {
            "name": "/image",
            "description": "Get high-quality images from Unsplash instantly."
        }, {
            "name": "/quote",
            "description": "Get a random inspirational quote."
        }, {
            "name": "/suggestion",
            "description": "Submit a suggestion to improve the bot or server."
        }
    ],
    "Guild Specific": [
        {
            "name": "/reload",
            "description": "Reloads a command."
        }, {
            "name": "/servers",
            "description": "Manage and view server information."
        }
    ],
    "Moderation": [
        {
            "name": "/clone",
            "description": "Clones the current channel, deleting the original."
        },
        {
            "name": "/embed",
            "description": "Create a custom embed message."
        },
        {
            "name": "/banlist",
            "description": "Generate a list of all banned users."
        },
        {
            "name": "/categorymonitor",
            "description": "Manage category monitoring."
        }, {
            "name": "/clear_category",
            "description": "Deletes all channels in a specified category."
        }, {
            "name": "/purge",
            "description": "Delete a specified number of messages from the channel."
        }, {
            "name": "/purge_all",
            "description": "Deletes all messages in the current channel, including those older than 14 days."
        }, {
            "name": "/purge_word",
            "description": "Privately deletes all messages containing a specific word in the current channel."
        }, {
            "name": "/recurringmessage",
            "description": "Manage recurring messages."
        }, {
            "name": "/resetnicks",
            "description": "Reset all member nicknames to their usernames."
        }, {
            "name": "/role",
            "description": "Manage roles for a specified user."
        }, {
            "name": "/roles",
            "description": "Get the number of users with a specified role and their details."
        }, {
            "name": "/server_info",
            "description": "Get information about the server."
        }, {
            "name": "/add",
            "description": "Add a user or role to the ticket."
        }, {
            "name": "/remove",
            "description": "Remove a user or role from the ticket."
        }, {
            "name": "/view",
            "description": "View users and roles with access to the ticket."
        }, {
            "name": "/youngest",
            "description": "Get the list of users whose accounts are less than the specified number of days old."
        }, {
            "name": "/close_ticket",
            "description": "Manually close a ticket."
        }, {
            "name": "/delete_ticket",
            "description": "Permanently delete a ticket channel."
        }, {
            "name": "/reopen_ticket",
            "description": "Reopen a closed ticket."
        }
    ],
    "Schedule": [
        {
            "name": "/result_delete",
            "description": "Delete recorded match results and revert to scheduled status."
        },
        {
            "name": "/schedule_create",
            "description": "Schedule a match in this channel with automatic player notifications."
        },
        {
            "name": "/schedule_delete",
            "description": "Delete the active schedule for this match."
        },
        {
            "name": "/schedule_refresh",
            "description": "Refresh schedule buttons and get schedule link."
        }, {
            "name": "/schedule_resign",
            "description": "Resign from your assigned staff role for this match."
        }, {
            "name": "/schedule_result",
            "description": "Mark the scheduled match as completed and record results."
        }, {
            "name": "/schedule_show",
            "description": "View match schedules and results."
        }, {
            "name": "/schedule_unassigned",
            "description": "View all pending matches without staff assignments."
        }
    ],
    "Settings": [
        {
            "name": "/settings",
            "description": "Manage bot settings."
        }, {
            "name": "/staff_config",
            "description": "Configure or view staff roles and channels."
        }, {
            "name": "/tournament",
            "description": "Manage tournaments."
        }
    ],
    "Tournament": [
        {
            "name": "/auto_room",
            "description": "Start or manually trigger the automatic room creation process."
        },
        {
            "name": "/correct_bracket",
            "description": "Correct a match score in a Challonge tournament."
        },
        {
            "name": "/players_list",
            "description": "Get a list of all players in the tournament."
        },
        {
            "name": "/room_create",
            "description": "Create rooms for open matches in a Challonge tournament."
        }, {
            "name": "/show_available_rooms",
            "description": "Show available rooms that can be created for a tournament."
        }, {
            "name": "/staff",
            "description": "Manage staff members."
        }, {
            "name": "/stop_auto_room",
            "description": "Stop automatic room creation for tournaments."
        }, {
            "name": "/team_info",
            "description": "Get information about a team or player in a tournament."
        }, {
            "name": "/toggle_auto_room",
            "description": "Toggle automatic room creation for a tournament."
        }, {
            "name": "/tour_info",
            "description": "Get information about the tournament."
        }, {
            "name": "/transcript",
            "description": "Generate a transcript of all messages viewable online."
        }, {
            "name": "/upload_score",
            "description": "Update a match score from a Challonge tournament."
        }
    ],
    "User": [
        {
            "name": "/profile",
            "description": "Manage your game profile."
        }, {
            "name": "/userinfo",
            "description": "Get public information about yourself or another user."
        }
    ]
};

const commandList = document.getElementById('command-list');
const commandSearch = document.getElementById('command-search');

function renderCommands(filter = '') {
    commandList.innerHTML = '';
    for (const category in commands) {
        const filteredCommands = commands[category].filter(cmd => cmd.name.toLowerCase().includes(filter.toLowerCase()));
        if (filteredCommands.length > 0) {
            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category;
            categoryTitle.classList.add('text-2xl', 'font-semibold', 'text-yellow-400', 'dark:text-yellow-400', 'mb-4', 'animate-fade-in-up');
            commandList.appendChild(categoryTitle);

            filteredCommands.forEach(cmd => {
                const commandItem = document.createElement('div');
                commandItem.classList.add('bg-gray-200', 'dark:bg-gray-200', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-2xl', 'hover:scale-110', 'hover:-translate-y-2', 'hover:opacity-90', 'transition-all', 'duration-300', 'animate-fade-in-up', 'group');
                commandItem.innerHTML = `<strong class="text-gray-900 dark:text-gray-900 block mb-2 font-semibold text-yellow-600 group-hover:animate-pulse">${
                    cmd.name
                }</strong><p class="text-gray-600 dark:text-gray-600 group-hover:text-gray-800 transition-colors">${
                    cmd.description
                }</p>`;
                commandList.appendChild(commandItem);
            });
        }
    }
}

commandSearch.addEventListener('input', (e) => {
    renderCommands(e.target.value);
});

renderCommands();

// Initialize reveals for static elements
document.addEventListener('DOMContentLoaded', () => { // Mark key sections as reveal
    document.querySelectorAll('.feature-card, h2, p').forEach(el => el.classList.add('reveal'));
    registerReveals();
});

// Mouse-follow spotlight on hero
const hero = document.querySelector('.hero');
const heroContainer = document.querySelector('.hero .container');
let lastX = 0.5,
    lastY = 0.5;

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function updateHeroBackground(x, y) {
    document.documentElement.style.setProperty('--mx', `${
        x * 100
    }%`);
    document.documentElement.style.setProperty('--my', `${
        y * 100
    }%`);
}

function handleHeroPointer(e) {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    lastX = lerp(lastX, x, 0.2);
    lastY = lerp(lastY, y, 0.2);
    updateHeroBackground(lastX, lastY);
    if (heroContainer) {
        const tiltX = (0.5 - lastY) * 6;
        const tiltY = (lastX - 0.5) * 6;
        heroContainer.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
}

if (hero) {
    hero.addEventListener('mousemove', handleHeroPointer);
    hero.addEventListener('mouseleave', () => {
        lastX = lerp(lastX, 0.5, 0.2);
        lastY = lerp(lastY, 0.5, 0.2);
        updateHeroBackground(0.5, 0.5);
        if (heroContainer) 
            heroContainer.style.transform = 'none';
        


    });
}
