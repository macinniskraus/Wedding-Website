const scriptURL = "https://script.google.com/macros/s/AKfycbyMlP5oaBtAy9fveayql9_yLnP5Wa42gUFFnZqCUMReT8jsKHJPECRCX78dJCSzf6ms/exec";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("rsvp-form");
    const guestList = document.getElementById("guest-list");
    const addGuestButton = document.getElementById("add-guest");
    const submitButton = form.querySelector('button[type="submit"]');

    function updateAddButton() {

        const inputs = guestList.querySelectorAll('input[name="guest"]');

        const allFilled = [...inputs].every(input =>
            input.value.trim() !== ""
        );

        addGuestButton.style.display = allFilled ? "inline-block" : "none";
    }

    function createGuestField() {

        const wrapper = document.createElement("div");
        wrapper.className = "guest-entry";

        const input = document.createElement("input");
        input.type = "text";
        input.name = "guest";
        input.placeholder = "Name";
        input.required = true;
        input.autocomplete = "off";

        input.addEventListener("input", updateAddButton);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-guest";
        removeButton.textContent = "REMOVE";

        removeButton.addEventListener("click", () => {
            wrapper.remove();
            updateAddButton();
        });

        wrapper.appendChild(input);
        wrapper.appendChild(removeButton);

        guestList.appendChild(wrapper);

        input.focus();

        updateAddButton();
    }

    addGuestButton.addEventListener("click", createGuestField);

    guestList.addEventListener("input", updateAddButton);

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Enter" &&
            event.target.tagName === "INPUT"
        ) {
            event.preventDefault();
        }
    });

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = "SUBMITTING...";

        const attendance = document.querySelector(
            'input[name="attendance"]:checked'
        ).value;

        const guests = [...document.querySelectorAll('input[name="guest"]')]
            .map(input => input.value.trim());

        try {

            const response = await fetch(scriptURL, {
                method: "POST",
                body: JSON.stringify({
                    attending: attendance,
                    guests: guests
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            window.location.href = "thanks.html";

        } catch (error) {

            console.error(error);

            submitButton.disabled = false;
            submitButton.textContent = "SUBMIT";

            alert("Something went wrong. Please try again.");

        }

    });

    updateAddButton();

});