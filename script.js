
const jackFrostGuide = document.getElementById('jackfrost-guide');
const jackFrostImg = document.getElementById('jackfrost-img');
const chatHistoryDiv = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-btn');
const loadingIndicator = document.getElementById('loading-indicator');


let isGenerating = false;


const jackFrostSprites = [
    'img/jackfrostsprite2.webp',
    'img/jackfrostsprite1.webp', 
    'img/jackfrostsprite3.webp'  
];


const gameLinks = {
    "persona 3": "p3.html",
    "persona 4": "p4.html",
    "persona 5": "p5.html",
    "metaphor": "metaphor.html"
};


function changeJackFrostSprite(index) {
    if (index >= 0 && index < jackFrostSprites.length) {
        jackFrostImg.src = jackFrostSprites[index];
    }
}

function updateUIState(generating) {
    isGenerating = generating;
    sendButton.disabled = generating || chatInput.value.trim() === '';
    chatInput.disabled = generating;
    loadingIndicator.style.visibility = generating ? 'visible' : 'hidden';
    if (generating) changeJackFrostSprite(1); 
    else changeJackFrostSprite(0); 
}

async function appendMessage(role, text, typing = true, cps = 25) {
    return new Promise(async (resolve) => {
        const messageDiv = document.createElement('p');
        messageDiv.classList.add('chat-message', role.toLowerCase());
        chatHistoryDiv.appendChild(messageDiv);

        if (!typing) {
            messageDiv.innerHTML = role === 'user'
                ? `<strong>You:</strong> ${text}`
                : `<strong>Jack Frost:</strong> ${text}`;
            chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
            resolve();
            return;
        }

        if (role === 'model') {
            jackFrostImg.classList.add('jackfrost-bob');
        }

        const prefix = role === 'user' ? "???: " : "Jack Frost: ";
        let displayText = `<strong>${prefix}</strong>`;
        messageDiv.innerHTML = displayText;

        for (let i = 0; i < text.length; i++) {
            displayText += text[i];
            messageDiv.innerHTML = displayText;
            chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
            await new Promise(r => setTimeout(r, 1000 / cps));
        }

        if (role === 'model') {
            jackFrostImg.classList.remove('jackfrost-bob');
        }

        resolve();
    });
}

function generateJackFrostResponse(userInput) {
    const input = userInput.toLowerCase().trim();

    for (const game in gameLinks) {
        if (input.includes(game)) {
            return { text: `Hee-ho! Follow me to ${game.charAt(0).toUpperCase() + game.slice(1)}!`, link: gameLinks[game] };
        }
    }

    if (["hi", "hello", "hey", "hee-ho"].some(g => input.includes(g))) {
        const greetings = [
            "Hee-ho! Hello there, friend! Ready to explore some games, ho?",
            "Hey hey! Hee-ho! I’m Jack Frost, your chilly guide!",
            "Hee-ho! Good to see you, ho! Ask me about any Atlus game!"
        ];
        return { text: greetings[Math.floor(Math.random() * greetings.length)] };
    }

    if (input.includes("how are you") || input.includes("hows it going")) {
        const replies = [
            "Hee-ho! I'm feeling frosty and fantastic, ho!",
            "I’m bubbling with ice magic energy, hee-ho!",
            "Chill as always, ready to guide you through Atlus adventures, ho!"
        ];
        return { text: replies[Math.floor(Math.random() * replies.length)] };
    }

    if ((input.includes("what is this") || input.includes("site")) && input.includes("about"))  {
        const siteResponses = [
            "Hee-ho! Welcome, friend! This website is Jason's personal guide where he shares his reviews and rankings of his top 4 Atlus games, ho!",
            "Hee-ho! This site is where Jason shares his personal reviews and rankings of his top 4 Atlus games, ho!"
        ];
        return { text: siteResponses[Math.floor(Math.random() * siteResponses.length)] };
    }

    if (input.includes("who") && input.includes("you")) {
        const selfResponses = [
            "Hee-ho! I'm Jack Frost, your cheerful guide through all things Atlus, ho!",
            "Ho-ho! I’m your icy little friend here to tell you about games and fun facts, hee-ho!",
            "Hee-ho! Jack Frost at your service, guiding you through Atlus adventures!"
        ];
        return { text: selfResponses[Math.floor(Math.random() * selfResponses.length)] };
    }

    if (input.includes("joke")) {
        const jokes = [
            "Hee-ho! Why don’t skeletons fight each other? They don’t have the guts!",
            "Why did the ice cube go to school? To become cooler, ho!",
            "Hee-ho! Why do Personas love parties? Because they have a social link!"
            
        ];
        return { text: jokes[Math.floor(Math.random() * jokes.length)] };
    }

    if (input.includes("fact")) {
        const facts = [
            "Hee-ho! Persona 5 Royal adds new characters and events that weren’t in the original!",
            "In Persona 4 Golden, you can get extra Personas by fusing in unique ways!",
            "Ho-ho! Did you know Jack Frost has appeared in nearly every Shin Megami Tensei game?"
        ];
        return { text: facts[Math.floor(Math.random() * facts.length)] };
    }

    const randomResponses = [
        "Hee-ho! I'm still learning, but I can chat about Atlus games and Persona!",
        "Hmm… I don't know that one, ho! Try asking me about Persona games.",
        "Hee-ho! Ask me about any Persona game or Atlus title, and I’ll guide you!",
        "Ho-ho! I’m not sure about that, but I can tell you fun stuff about Atlus games!"
    ];
    return { text: randomResponses[Math.floor(Math.random() * randomResponses.length)] };
}

async function sendMessage() {
    const query = chatInput.value.trim();
    if (!query || isGenerating) return;

    updateUIState(true);
    chatInput.value = '';

    await appendMessage('user', query, true);

    const response = generateJackFrostResponse(query);

    if (response.link) {
        await appendMessage('model', response.text, true);
        updateUIState(false);
        window.location.href = response.link;
        return;
    }

    await appendMessage('model', response.text, true);
    updateUIState(false);
}

function toggleGuide() {
    jackFrostGuide.classList.toggle('active');
    if (jackFrostGuide.classList.contains('active')) {
        changeJackFrostSprite(0);
        updateUIState(false);
    } else {
        changeJackFrostSprite(0);
        updateUIState(false);
    }
}

jackFrostImg.addEventListener('click', toggleGuide);
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});
chatInput.addEventListener('input', () => {
    sendButton.disabled = isGenerating || chatInput.value.trim() === '';
});

document.addEventListener('DOMContentLoaded', () => {
    updateUIState(false);
});
