let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
let isListening = true;
let recognitionActive=false;
function speak(text) {
    const responseBox = document.getElementById("ai-response");
    responseBox.classList.add("typing");
    responseBox.textContent = "";

    let i = 0;
    let typingInterval = setInterval(() => {
        responseBox.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typingInterval);
            responseBox.classList.remove("typing");
        }
    }, 50);

    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-US";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else {
        speak("Good Evening Sir");
    }
}

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.lang = "en-US";

recognition.onresult = (event) => {
    let transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    content.innerText = transcript;

    if (transcript.includes("stop listening")) {
        speak("Okay, I will stop listening now. Call me again if you need help.");
        isListening = false;
        wakeRecognition.stop();
        return;
    }

    if (transcript.includes("start listening")) {
        speak("I'm back online, sir.");
        isListening = true;
        wakeRecognition.start();
        return;
    }

    takeCommand(transcript);
};

let wakeRecognition = new SpeechRecognition();
wakeRecognition.continuous = true;
wakeRecognition.lang = "en-US";
recognition.onend=()=>{
    recognitionActive=false;
}

wakeRecognition.onresult = (event) => {
    let transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("Wake Word Check:", transcript);
    if (!isListening) return;

    if (transcript.includes("alexa")) {
        speak("Yes sir, I am listening.");
        startMainRecognition();
    }
};

wakeRecognition.onerror = (e) => {
    console.error("Wake recognition error:", e.error);
    //if (isListening) wakeRecognition.start();
};

wakeRecognition.onend = () => {
    if (isListening) wakeRecognition.start();
};

window.addEventListener("load", () => {
    wishMe();
    wakeRecognition.start();
});

btn.addEventListener("click", () => {
    startMainRecognition();
});

function startMainRecognition() {
    if(recognitionActive) return;
    recognitionActive=true;
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
}

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, what can I help you with?");
    } else if (message.includes("who are you")) {
        speak("I am your virtual assistant, created by Ayush sir.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("whatsapp://");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The time is " + time);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak("Today's date is " + date);
    } else {
        let finalText = "This is what I found on the internet regarding " + message.replace("shifra", "");
        speak(finalText);
        window.open(`https://www.google.com/search?q=${message.replace("shifra", "")}`, "_blank");
    }
}
