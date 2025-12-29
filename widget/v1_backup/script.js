// Chat open/close karne ka logic
function toggleChat() {
    const chatBox = document.getElementById("chat-box");
    chatBox.classList.toggle("hidden");
}

function handleEnter(event) {
    if (event.key === "Enter") sendMessage();
}

// Message bhejne ka main function
async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();
    const chatMessages = document.getElementById("chat-messages");

    if (message === "") return;

    // 1. User ka message screen par dikhao
    chatMessages.innerHTML += `<div class="user-msg">${message}</div>`;
    inputField.value = ""; // Input clear karo
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll down

    // 2. "Typing..." indicator dikhao
    const loadingId = "loading-" + Date.now();
    chatMessages.innerHTML += `<div id="${loadingId}" class="bot-msg">...</div>`;

    try {
        // 3. API Call (Python Backend se baat karna)
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // 4. Loading hatao aur asli jawab dikhao
        document.getElementById(loadingId).remove();
        chatMessages.innerHTML += `<div class="bot-msg">${data.reply}</div>`;

    } catch (error) {
        document.getElementById(loadingId).remove();
        chatMessages.innerHTML += `<div class="bot-msg" style="color:red">Error: Server connect nahi hua!</div>`;
    }

    // Auto scroll down again
    chatMessages.scrollTop = chatMessages.scrollHeight;
}