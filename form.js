/*
Name: Jude Spradlin
Course: CSE 134B
Homework 4 - Part 3
Repository: https://github.com/jspradlin5/CSE134B_HW4
*/

const form = document.querySelector("#contact-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const commentsInput = document.querySelector("#comments");

const feedback = document.querySelector("#js-feedback");
const errorMessages = document.querySelector("#error-messages");
const commentsInfo = document.querySelector("#comments-info");
const errorHistoryInput = document.querySelector("#form-errors");
const submitButton = form.querySelector('button[type="submit"]');

const fields = [nameInput, emailInput, commentsInput];

// Store errors from unsuccessful submission attempts.
const form_errors = [];

// Track fields the user has interacted with.
const editedFields = new Set();
const touchedFields = new Set();

let attemptedSubmit = false;

const characterLimit = commentsInput.maxLength;
const warningThreshold = 100;

// Show feedback only when JavaScript is available.
feedback.hidden = false;

// Return a specific message based on the field's validity.
function getErrorMessage(field) {
    const validity = field.validity;

    if (validity.valueMissing) {
        return "Please enter your " +
            (field.id === "comments" ? "comments." : field.id + ".");
    }

    if (validity.typeMismatch && field.id === "email") {
        return "Please enter a valid email address.";
    }

    if (validity.tooShort) {
        return "Please enter at least " +
            field.minLength + " characters.";
    }

    if (validity.tooLong) {
        return "Please use no more than " +
            field.maxLength + " characters.";
    }

    if (!validity.valid) {
        return "Please correct this field.";
    }

    return "";
}

// Find and update one field's validation message.
function validateField(field, showError = false) {
    // Remove any previous custom error before checking validity.
    field.setCustomValidity("");

    const message = getErrorMessage(field);
    const fieldError = document.querySelector("#" + field.id + "-error");

    if (message) {
        field.setCustomValidity(message);
    }

    if (message && showError) {
        fieldError.textContent = message;
        fieldError.hidden = false;
        field.setAttribute("aria-invalid", "true");
    } else {
        fieldError.textContent = "";
        fieldError.hidden = true;
        field.removeAttribute("aria-invalid");
    }

    return message;
}

// Show a summary of unresolved errors.
function updateErrorSummary() {
    errorMessages.replaceChildren();

    const errors = [];

    fields.forEach(function (field) {
        const message = validateField(
            field,
            attemptedSubmit || touchedFields.has(field)
        );

        if (message &&
            (attemptedSubmit || touchedFields.has(field))) {
            errors.push({
                field: field.id,
                message: message
            });
        }
    });

    if (errors.length === 0) {
        errorMessages.textContent = attemptedSubmit
            ? "All fields are valid."
            : "No errors to display.";
        return;
    }

    const list = document.createElement("ul");

    errors.forEach(function (error) {
        const item = document.createElement("li");
        item.className = "form-error-message";
        item.textContent =
            error.field + ": " + error.message;
        list.appendChild(item);
    });

    errorMessages.appendChild(list);
}

// Update the remaining-character counter.
function updateCharacterCount() {
    const remaining = characterLimit - commentsInput.value.length;

    commentsInfo.classList.remove(
        "form-info-warning",
        "form-info-limit"
    );

    if (remaining === 0) {
        commentsInfo.textContent =
            "Character limit reached. You have 0 characters remaining.";
        commentsInfo.classList.add("form-info-limit");
    } else if (remaining <= warningThreshold) {
        commentsInfo.textContent =
            "Warning: Only " + remaining +
            " characters remaining.";
        commentsInfo.classList.add("form-info-warning");
    } else {
        commentsInfo.textContent =
            remaining + " characters remaining.";
    }
}

// Update validation when a user edits a field.
fields.forEach(function (field) {
    field.addEventListener("input", function () {
        editedFields.add(field);
        validateField(
            field,
            attemptedSubmit || touchedFields.has(field)
        );
        updateErrorSummary();

        if (field === commentsInput) {
            updateCharacterCount();
        }
    });

    // Show errors when leaving a field that was edited.
    field.addEventListener("blur", function () {
        if (editedFields.has(field)) {
            touchedFields.add(field);
            validateField(field, true);
            updateErrorSummary();
        }
    });
});

// Record each invalid field once per failed submission attempt.
// Clicking the submit button also covers normal keyboard activation.
submitButton.addEventListener("click", function () {
    attemptedSubmit = true;

    const currentErrors = [];

    fields.forEach(function (field) {
        const message = validateField(field, true);

        if (message) {
            currentErrors.push({
                field: field.id,
                message: message
            });
        }
    });

    if (currentErrors.length > 0) {
        // Preserve previous failed attempts.
        currentErrors.forEach(function (error) {
            form_errors.push(error);
        });
    }

    updateErrorSummary();
});

// Native validation prevents the submit event when fields are invalid.
// This event runs only when the form can be submitted.
form.addEventListener("submit", function () {
    // Serialize the complete error history for HTTPBin.
    errorHistoryInput.value = JSON.stringify(form_errors);
});


/* Handle keyboard form submissions using Enter */
form.addEventListener("keydown", function (event) {
    // Only handle Enter in the name and email fields.
    // Enter in the comments textarea should create a new line.
    if (event.key !== "Enter" || event.isComposing || event.repeat) {
        return;
    }

    if (event.target === nameInput || event.target === emailInput) {
        // Prevent the browser's default implicit submission.
        event.preventDefault();

        // Trigger the existing submit button click handler.
        // This records errors and preserves native validation.
        submitButton.click();
    }
});

// Initialize the information area.
updateCharacterCount();
