const form = document.querySelector("#registrationForm");
const message = document.querySelector("#message");
const participantList = document.querySelector("#participantList");
const participantCount = document.querySelector("#participantCount");
const search = document.querySelector("#search");
const filterTechnology = document.querySelector("#filterTechnology");

let participants = JSON.parse(localStorage.getItem("participants")) || [];

renderParticipants();

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.querySelector("#fullName").value.trim();
    const email = document.querySelector("#email").value.trim();
    const age = Number(document.querySelector("#age").value);
    const technology = document.querySelector("#technology").value;
    const terms = document.querySelector("#terms").checked;

    if (fullName === "") {
        showMessage("Full name is required.", "error");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        showMessage("Email is invalid.", "error");
        return;
    }

    if (age <= 0) {
        showMessage("Age must be greater than 0.", "error");
        return;
    }

    if (age < 18) {
        showMessage("Age must be at least 18.", "error");
        return;
    }

    if (technology === "") {
        showMessage("Please select an area of interest.", "error");
        return;
    }

    if (!terms) {
        showMessage("You must accept the terms.", "error");
        return;
    }

    const participant = {
        fullName: fullName,
        email: email,
        age: age,
        technology: technology
    };

    participants.push(participant);
    saveParticipants();

    showMessage(
        `✅ Registration Successful! ${fullName} has been registered for ${technology}.`,
        "success"
    );

    form.reset();
    renderParticipants();
});

search.addEventListener("input", renderParticipants);
filterTechnology.addEventListener("change", renderParticipants);

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

function saveParticipants() {
    localStorage.setItem("participants", JSON.stringify(participants));
}

function deleteParticipant(index) {
    participants.splice(index, 1);
    saveParticipants();
    renderParticipants();
}

function renderParticipants() {
    participantList.innerHTML = "";

    const searchValue = search.value.toLowerCase();
    const selectedTechnology = filterTechnology.value;

    const filteredParticipants = participants.filter(function (participant) {
        const matchesSearch =
            participant.fullName.toLowerCase().includes(searchValue) ||
            participant.email.toLowerCase().includes(searchValue);

        const matchesTechnology =
            selectedTechnology === "All" ||
            participant.technology === selectedTechnology;

        return matchesSearch && matchesTechnology;
    });

    filteredParticipants.forEach(function (participant) {
        const originalIndex = participants.indexOf(participant);

        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="participant-card">
                <h3>${participant.fullName}</h3>
                <p><strong>Email:</strong> ${participant.email}</p>
                <p><strong>Area of Interest:</strong> ${participant.technology}</p>
                <p><strong>Age:</strong> ${participant.age}</p>

                <button onclick="deleteParticipant(${originalIndex})">
                    🗑 Delete
                </button>
            </div>
        `;

        participantList.appendChild(listItem);
    });

    participantCount.textContent = participants.length;
}