(function() {
    // --- 1. CONFIGURATION ---
    const API_URL = "https://ai-support-bot-e-commerce.onrender.com/chat"; // Backend Address

    // --- 2. INJECT CSS (Styles) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- NEW: Floating Animation Keyframes --- */
        @keyframes floatBubble {
            0% {
                box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3), 0 4px 8px rgba(0,0,0,0.1);
                transform: translateY(0px);
            }
            50% {
                /* Jab button upar jaye, shadow door aur halki ho jaye */
                box-shadow: 0 15px 30px rgba(79, 70, 229, 0.2), 0 8px 15px rgba(0,0,0,0.05);
                transform: translateY(-8px);
            }
            100% {
                box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3), 0 4px 8px rgba(0,0,0,0.1);
                transform: translateY(0px);
            }
        }

        /* Main Container */
        #ai-widget-container {
            position: fixed; bottom: 25px; right: 25px; z-index: 99999;
            font-family: 'Segoe UI', sans-serif;
        }

        /* Toggle Button (UPDATED) */
        #ai-toggle-btn {
            width: 65px; height: 65px; border-radius: 50%;
            background: linear-gradient(135deg, #4F46E5, #3b82f6);
            color: white; border: none; cursor: pointer;
            
            /* NEW: Deep Bottom Shadow (Initial state) */
            box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3), 0 4px 8px rgba(0,0,0,0.1);
            
            /* NEW: Floating Animation applied here */
            animation: floatBubble 3s ease-in-out infinite;

            transition: all 0.3s ease; display: flex;
            align-items: center; justify-content: center; font-size: 30px;
        }
        
        /* Hover Effect (Hover par animation rok kar thoda bada karenge) */
        #ai-toggle-btn:hover { 
            animation-play-state: paused; /* Animation roko */
            transform: scale(1.1) translateY(-4px); /* Thoda bada aur upar uthao */
            box-shadow: 0 12px 25px rgba(79, 70, 229, 0.4); /* Shadow gehri karo */
        }

        /* Chat Box (Baaki sab same rahega) */
        #ai-chat-box {
            width: 350px; height: 450px; background: white;
            border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.2);
            display: none; flex-direction: column; overflow: hidden;
            margin-bottom: 20px; border: 1px solid #f3f4f6;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }

        /* Header */
        #ai-header {
            background: linear-gradient(135deg, #4F46E5, #3b82f6);
            color: white; padding: 18px; font-weight: 600; font-size: 16px;
            display: flex; justify-content: space-between; align-items: center;
        }

        /* Messages Area */
        #ai-messages {
            flex: 1; padding: 16px; overflow-y: auto; background: #ffffff;
            display: flex; flex-direction: column; gap: 12px;
            background-image: radial-gradient(#e5e7eb 1px, transparent 1px); background-size: 20px 20px; /* Subtle pattern */
        }
        .ai-msg { padding: 12px 16px; border-radius: 14px; max-width: 80%; font-size: 14px; line-height: 1.5; box-shadow: 0 2px 5px rgba(0,0,0,0.05);}
        .ai-bot { align-self: flex-start; background: white; color: #374151; border-bottom-left-radius: 2px; border: 1px solid #e5e7eb; }
        .ai-user { align-self: flex-end; background: #4F46E5; color: white; border-bottom-right-radius: 2px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2); }

        /* Input Area */
        #ai-input-area {
            padding: 15px; background: white; border-top: 1px solid #f3f4f6; display: flex; gap: 10px; align-items: center;
        }
        #ai-input {
            flex: 1; padding: 12px 18px; border: 2px solid #e5e7eb; border-radius: 25px; outline: none; transition: all 0.2s; font-size: 14px;
            background: #f9fafb;
        }
        #ai-input:focus { border-color: #4F46E5; background: white; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        #ai-send-btn {
            background: #4F46E5; color: white; border: none; width: 45px; height: 45px;
            border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
        }
        #ai-send-btn:hover { background: #4338ca; transform: scale(1.05); }
        #ai-send-btn svg { width: 20px; height: 20px; fill: white; margin-left: 2px; }
    `;
    document.head.appendChild(style);

    // --- 3. INJECT HTML (Structure) ---
    const container = document.createElement('div');
    container.id = 'ai-widget-container';
    container.innerHTML = `
        <div id="ai-chat-box">
            <div id="ai-header">
                <span>🤖 TechShop Support</span>
                <span id="ai-close-btn" style="cursor:pointer; font-size:18px;">✕</span>
            </div>
            <div id="ai-messages">
                <div class="ai-msg ai-bot">Hello! 👋<br>I can help you with Products & Policies.</div>
            </div>
            <div id="ai-input-area">
                <input type="text" id="ai-input" placeholder="Type a message...">
                <button id="ai-send-btn">➤</button>
            </div>
        </div>
        <button id="ai-toggle-btn">💬</button>
    `;
    document.body.appendChild(container);

    // --- 4. LOGIC (Functionality) ---
    const chatBox = document.getElementById('ai-chat-box');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    const closeBtn = document.getElementById('ai-close-btn');
    const sendBtn = document.getElementById('ai-send-btn');
    const inputField = document.getElementById('ai-input');
    const messagesDiv = document.getElementById('ai-messages');

    // Toggle Chat
    function toggleChat() {
        if (chatBox.style.display === 'flex') {
            chatBox.style.display = 'none';
        } else {
            chatBox.style.display = 'flex';
            inputField.focus();
        }
    }
    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Send Message
    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        // User Message UI
        addMessage(text, 'user');
        inputField.value = '';

        // Loading UI
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'ai-msg ai-bot';
        loadingDiv.innerText = 'typing...';
        messagesDiv.appendChild(loadingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        try {
            // API Call (Ab ye Policies + Products dono jaanta hai)
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            
            // Remove Loading & Show Reply
            document.getElementById(loadingId).remove();
            addMessage(data.reply, 'bot');

        } catch (error) {
            document.getElementById(loadingId).remove();
            addMessage("⚠️ Server error. Is backend running?", 'bot');
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ai-${sender}`;
        msgDiv.innerHTML = text; // innerHTML allows <br> and basic formatting
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Event Listeners for Send
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

})();