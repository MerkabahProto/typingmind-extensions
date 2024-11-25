// Function to load Open Sans font and change font styles
function changeFontStyles() {
    // Create a link element for Google Fonts
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap";
    link.rel = "stylesheet";

    // Append the link to the document head to load the font
    document.head.appendChild(link);

    // Select the main content area where messages are likely displayed
    const mainContentArea = document.querySelector('[data-element-id="main-content-area"]');

    if (mainContentArea) {
        // Apply the Open Sans font styles
        mainContentArea.style.fontFamily = 'Open Sans, sans-serif'; // Use 'Open Sans' font
        mainContentArea.style.fontSize = '16px'; // Adjust font size if needed
        mainContentArea.style.fontStyle = 'normal'; // Set font style if desired
        mainContentArea.style.fontWeight = '400'; // Adjust font weight as needed
    }
}

// Call the function to apply the font changes
changeFontStyles();
