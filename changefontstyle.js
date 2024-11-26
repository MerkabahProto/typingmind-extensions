// Plugin Metadata
const plugin = {
    name: "Font Changer",
    version: "1.3",
    description: "Allows users to change the font of the entire web app using Google Fonts, with dynamic font listings, persistent preferences, and enhanced error handling.",
};

// **IMPORTANT:** Ensure that GOOGLE_FONTS_API_KEY is securely provided.
// For client-side applications, consider fetching the font list from a secure backend.
const GOOGLE_FONTS_API_KEY = 'AIzaSyCVolAmi5A4Pc7YY3POqM-LV5eLg7P4V0s'; // 🔒 Replace this securely

// Base URL for Google Fonts API
const GOOGLE_FONTS_API_URL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`;

// Load Google Fonts with Error Handling
function loadGoogleFont(fontName) {
    return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`;
        link.rel = "stylesheet";

        link.onload = () => {
            console.log(`Font "${fontName}" loaded successfully.`);
            resolve();
        };

        link.onerror = () => {
            console.error(`Failed to load font "${fontName}".`);
            reject(new Error(`Failed to load font "${fontName}".`));
        };

        document.head.appendChild(link);
    });
}

// Apply Font to All Elements
function applyFont(fontName) {
    document.body.style.fontFamily = `'${fontName}', sans-serif`;
}

// Display Notification to User
function notifyUser(message, isError = false) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    notification.style.color = '#fff';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    notification.style.zIndex = 1001;
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';

    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);

    // Fade out after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        // Remove from DOM after transition
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Fetch and Populate Font List
async function fetchAndPopulateFonts() {
    try {
        const response = await fetch(GOOGLE_FONTS_API_URL);
        if (!response.ok) {
            throw new Error(`Google Fonts API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const fonts = data.items.map(font => font.family);

        const fontSelect = document.getElementById("font-select");
        fonts.forEach(font => {
            const option = document.createElement("option");
            option.value = font;
            option.textContent = font;
            fontSelect.appendChild(option);
        });

        console.log(`Loaded ${fonts.length} fonts from Google Fonts API.`);
    } catch (error) {
        console.error(error);
        notifyUser(error.message, true);
    }
}

// Plugin Settings Interface with Persistent Preferences
function createSettingsUI() {
    const settingsContainer = document.createElement("div");
    settingsContainer.style.position = 'fixed';
    settingsContainer.style.top = '10px';
    settingsContainer.style.right = '10px';
    settingsContainer.style.backgroundColor = '#fff';
    settingsContainer.style.border = '1px solid #ccc';
    settingsContainer.style.padding = '15px';
    settingsContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    settingsContainer.style.borderRadius = '8px';
    settingsContainer.style.zIndex = 1000; // Ensure it appears above other elements

    settingsContainer.innerHTML = `
        <h2 style="margin-top: 0;">Font Changer Settings</h2>
        <label for="font-select">Choose a font:</label>
        <select id="font-select" style="width: 100%; padding: 5px; margin: 10px 0;">
            <!-- Options will be populated dynamically -->
        </select>
        <button id="apply-font" style="width: 100%; padding: 8px; background-color: #4CAF50; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
            Apply Font
        </button>
        <button id="reset-font" style="width: 100%; padding: 8px; background-color: #f44336; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px;">
            Reset to Default
        </button>
    `;

    document.body.appendChild(settingsContainer);

    // Event Listener for Applying Font
    document.getElementById("apply-font").addEventListener("click", async () => {
        const selectedFont = document.getElementById("font-select").value;
        if (!selectedFont) {
            notifyUser("Please select a font before applying.", true);
            return;
        }
        try {
            await loadGoogleFont(selectedFont);
            applyFont(selectedFont);
            localStorage.setItem('selectedFont', selectedFont);
            notifyUser(`Font "${selectedFont}" applied successfully!`);
        } catch (error) {
            notifyUser(error.message, true);
        }
    });

    // Event Listener for Resetting Font to Default
    document.getElementById("reset-font").addEventListener("click", () => {
        document.body.style.fontFamily = `'sans-serif'`;
        localStorage.removeItem('selectedFont');
        notifyUser(`Font reset to default.`);
    });
}

// Initialize Plugin with Persistent Preferences and Dynamic Font Loading
async function init() {
    createSettingsUI();
    await fetchAndPopulateFonts();

    // Load saved font on init
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont) {
        try {
            await loadGoogleFont(savedFont);
            applyFont(savedFont);
            const fontSelect = document.getElementById("font-select");
            if (fontSelect) {
                fontSelect.value = savedFont;
            }
            console.log(`Loaded saved font "${savedFont}".`);
        } catch (error) {
            notifyUser(error.message, true);
            // Optionally, remove the invalid font from localStorage
            localStorage.removeItem('selectedFont');
        }
    }
}

// Run the Plugin
init();
