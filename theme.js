/*
Name: Jude Spradlin
Course: CSE 134B
Homework 4 - Part 4
*/

const themeButton = document.querySelector("#theme-toggle");
const root = document.documentElement;

// Read saved preference, falling back to light mode.
let currentTheme = "light";

try {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        currentTheme = savedTheme;
    }
} catch (error) {
    console.warn("Could not read saved theme preference.");
}

// Update the page theme and button label.
function applyTheme(theme) {
    currentTheme = theme;
    root.setAttribute("data-theme", theme);

    if (themeButton) {
        themeButton.textContent =
            theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";

        themeButton.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );
    }
}

// Apply the saved theme when the page loads.
applyTheme(currentTheme);

// Switch theme when the button is clicked.
if (themeButton) {
    themeButton.hidden = false;
    themeButton.addEventListener("click", function () {
        const newTheme =
            currentTheme === "light" ? "dark" : "light";

        applyTheme(newTheme);

        // Save preference, but keep working if storage fails.
        try {
            localStorage.setItem("theme", newTheme);
        } catch (error) {
            console.warn("Could not save theme preference.");
        }
    });
}
