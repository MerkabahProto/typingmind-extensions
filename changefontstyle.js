// TypingMind Extension: Apply Open Sans Font to All Elements

(function() {
    // Create a new style element
    const style = document.createElement('style');
    style.type = 'text/css';
    
    // Define the CSS to set the font-family to Open Sans for all elements
    style.innerHTML = `
        * {
            font-family: 'Open Sans', sans-serif !important;
        }
    `;
    
    // Append the style to the document head
    document.head.appendChild(style);
})();
