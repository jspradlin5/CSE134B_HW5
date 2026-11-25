/*
Name: Jude Spradlin
Course: CSE 134B
Homework 5 - Parts 1 and 2
Repository: https://github.com/jspradlin5/CSE134B_HW5
*/

class FactPanel extends HTMLElement {
    constructor() {
        super();

        this.apiURL =
            "https://uselessfacts.jsph.pl/api/v2/facts/random";
    }

    // Watch for changes to the compact attribute.
    static get observedAttributes() {
        return ["compact"];
    }

    // Build the component interface.
    connectedCallback() {
        if (this.panel) {
            return;
        }

        this.panel = document.createElement("div");
        this.panel.className = "fact-card";

        this.heading = document.createElement("h2");
        this.heading.textContent = "Discover a Random Fact";

        this.description = document.createElement("p");
        this.description.textContent =
            "Click the button below to retrieve a random fact from a live API.";

        this.factText = document.createElement("p");
        this.factText.className = "fact-text";
        this.factText.textContent =
            "Octopuses have three hearts.";

        this.nextButton = document.createElement("button");
        this.nextButton.type = "button";
        this.nextButton.textContent = "Get Another Fact";

        this.status = document.createElement("p");
        this.status.className = "fact-status";
        this.status.setAttribute("role", "status");
        this.status.textContent = "Ready to load a live fact.";

        this.source = document.createElement("p");
        this.source.className = "fact-source";
        this.source.textContent = "Source: Local sample data";

        // Add elements to the component.
        this.panel.appendChild(this.heading);
        this.panel.appendChild(this.description);
        this.panel.appendChild(this.factText);
        this.panel.appendChild(this.nextButton);
        this.panel.appendChild(this.status);
        this.panel.appendChild(this.source);

        this.appendChild(this.panel);

        // Request a live fact when the button is clicked.
        this.nextButton.addEventListener("click", () => {
            this.loadFact();
        });

        this.updateMode();
    }

    // Retrieve a random fact from the API.
    async loadFact() {
        if (this.nextButton.disabled) {
            return;
        }

        // Display the loading state.
        this.status.textContent = "Loading a random fact...";
        this.status.classList.remove("fact-error", "fact-success");

        this.nextButton.disabled = true;
        this.nextButton.textContent = "Loading...";

        try {
            // Send an HTTP GET request.
            const response = await fetch(this.apiURL, {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Accept": "application/json"
                }
            });

            // Check the HTTP response status.
            if (!response.ok) {
                throw new Error(
                    "HTTP status " + response.status
                );
            }

            // Parse the JSON response.
            const data = await response.json();

            // Validate the response field.
            if (
                typeof data?.text !== "string" ||
                data.text.trim() === ""
            ) {
                throw new Error("Invalid fact data received.");
            }

            // Safely update the displayed text.
            this.factText.textContent = data.text;
            this.source.textContent = "Source: Useless Facts API";

            // Display successful request feedback.
            this.status.textContent =
                "Successfully loaded a new fact.";

            this.status.classList.add("fact-success");

        } catch (error) {
            // Keep the previous fact visible if the request fails.
            this.status.textContent =
                "Could not load a new fact. Please try again.";

            this.status.classList.add("fact-error");

            console.error("Fact request failed:", error);

        } finally {
            // Restore the button after success or failure.
            this.nextButton.disabled = false;
            this.nextButton.textContent = "Get Another Fact";
        }
    }

    // Respond to changes in the observed attribute.
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "compact" && oldValue !== newValue) {
            this.updateMode();
        }
    }

    // Update compact or expanded appearance.
    updateMode() {
        if (!this.panel) {
            return;
        }

        const compact = this.hasAttribute("compact");

        this.description.hidden = compact;
        this.source.hidden = compact;

        this.panel.classList.toggle("compact-mode", compact);
    }
}

// Register the custom element.
customElements.define("fact-panel", FactPanel);

// External compact/expanded mode control.
const factPanel = document.querySelector("#random-facts");
const modeToggle = document.querySelector("#mode-toggle");

if (factPanel && modeToggle) {
    modeToggle.hidden = false;

    modeToggle.addEventListener("click", () => {
        factPanel.toggleAttribute("compact");

        modeToggle.textContent =
            factPanel.hasAttribute("compact")
                ? "Switch to Expanded Mode"
                : "Switch to Compact Mode";
    });
}
