// --- SCROLL ANIMATION LOGIC ---
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

canvas.width = 1158;
canvas.height = 770;

const frameCount = 240;
const currentFrame = index => (
  `./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const imageSeq = { frame: 0 };

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Draw first frame
images[0].onload = () => {
    context.drawImage(images[0], 0, 0);
};

window.addEventListener('scroll', () => {  
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex + 1));
});

const updateImage = index => {
  context.drawImage(images[index - 1], 0, 0);
}

const html = document.documentElement;

// --- CHATBOT LOGIC ---
const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your key
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const resumeContext = `You are an AI assistant for Sanjay B. 
    Strictly answer only using this info:
    - [cite_start]Name: Sanjay B [cite: 1]
    - [cite_start]Education: 3rd year B.E in ECE at Government College of Engineering, Tirunelveli [cite: 8, 9]
    - [cite_start]Skills: Embedded Systems, C, IoT, Proteus, Keil [cite: 11, 13, 14, 15, 16]
    - [cite_start]Project: Rolling Rover - remote navigation and hardware integration [cite: 19, 21]
    - [cite_start]Interests: Robotics and Automation [cite: 24]
    If asked something outside this, say "I only have information regarding Sanjay's professional background."`;

async function getGeminiResponse(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${resumeContext}\nUser Question: ${prompt}` }] }]
        })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

sendBtn.addEventListener('click', async () => {
    const text = userInput.value;
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    const botReply = await getGeminiResponse(text);
    appendMessage('bot', botReply);
});

function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
