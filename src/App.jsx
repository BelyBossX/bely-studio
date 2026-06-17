import {
  useState,
  useEffect,
  useRef
} from "react";import "./App.css";

import logo from "./assets/logo.jpeg";

import { App as CapacitorApp } from "@capacitor/app";

import { Capacitor } from "@capacitor/core";

import { HiMiniMicrophone } from "react-icons/hi2";

import translations from "./translations.js";

import guides from "./guides";

import ReactMarkdown from "react-markdown";

function App() {

useEffect(() => {

  CapacitorApp.addListener(
    "backButton",
    () => {

      console.log("BACK PEZE");

    }
  );

}, []);  

const isNative = Capacitor.isNativePlatform();

const [showMenu, setShowMenu] = useState(false);

const [text, setText] = useState("");

const recognitionRef = useRef(null);

const [currentSlide, setCurrentSlide] = useState(1);

const [messages, setMessages] =
useState([]);

const [translationMessages, setTranslationMessages] = useState([]);

const [rewrites, setRewrites] = useState([]);

const [summaries, setSummaries] = useState([]);

const [tiktokScripts, setTiktokScripts] = useState([]);

const [quizzes, setQuizzes] = useState([]);

const [imagePrompt, setImagePrompt] = useState("");

const [generatedImage, setGeneratedImage] = useState("");

const [imageLoading, setImageLoading] = useState(false);

const [selectedImage, setSelectedImage] = useState(null);

const [previewImage, setPreviewImage] = useState("");

const [isListening, setIsListening] = useState(false);

  const [voice, setVoice] =
  useState("male");
  const [language, setLanguage] =
  useState("ht");
  console.log("LANG =", language);
  const t = translations?.[language] || translations?.ht || {};
  const langMap = {

  ht: "Kreyòl Ayisyen",

  en: "English",

  fr: "Français",

  es: "Español"

};

const tiktokLabels = {

  ht: {
    hook: "Hook",
    development: "Devlopman",
    cta: "Apèl pou Aksyon"
  },

  en: {
    hook: "Hook",
    development: "Main Content",
    cta: "Call To Action"
  },

  fr: {
    hook: "Accroche",
    development: "Développement",
    cta: "Appel à l'Action"
  },

  es: {
    hook: "Gancho",
    development: "Desarrollo",
    cta: "Llamado a la Acción"
  }

};
  console.log("T COMPLET =", t);
  console.log("PLACEHOLDER =", t.askPlaceholder);
  const [search, setSearch] =
useState("");

  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const [activePage, setActivePage] = useState("home");

  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [showAbout, setShowAbout] =
  useState(false);

  const [showLogin, setShowLogin] =
useState(false);

const [showSignup, setShowSignup] =
useState(false);

const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");

const [stats, setStats] =
useState({

  totalAudios: 0,

  totalImages: 0,

  totalWords: 0,

  totalAI: 0,

  lastUsed: ""

});

  const wordCount =
  text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

const estimatedSeconds =
  Math.ceil(wordCount / 2.5);

  

useEffect(() => {

  const savedHistory =
    localStorage.getItem(
      "belyHistory"
    );

  if (savedHistory) {

    setHistory(
      JSON.parse(savedHistory)
    );

  }

}, []);

useEffect(() => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition =
    new SpeechRecognition();

  recognition.lang = "fr-FR";

  recognition.continuous = false;

  recognition.interimResults = false;

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    setText(transcript);

  };

  recognitionRef.current =
    recognition;

}, []);

useEffect(() => {

  const savedStats =
    localStorage.getItem(
      "belyStats"
    );

  if (savedStats) {

    setStats(
      JSON.parse(savedStats)
    );

  }

}, []);

useEffect(() => {

  localStorage.setItem(
    "belyHistory",
    JSON.stringify(history)
  );

}, [history]);

useEffect(() => {

  localStorage.setItem(
    "belyStats",
    JSON.stringify(stats)
  );

}, [stats]);

const startVoiceInput = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert("Voice Input pa sipòte sou navigatè sa");

    return;

  }

  const recognition = new SpeechRecognition();

  recognition.lang = "fr-FR";

  recognition.continuous = false;

  recognition.interimResults = false;

  setIsListening(true);

  recognition.start();

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    setText(transcript);

  };

  recognition.onerror = () => {

    setIsListening(false);

  };

  recognition.onend = () => {

    setIsListening(false);

  };

};

const handleFileUpload = (event) => {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {

    setText(e.target.result);

  };

  reader.readAsText(file);

};

const generateAudio = async () => {

  console.log("BOUTON AN KLIKE");

  if (text.trim() === "") {
    alert("Tanpri antre yon tèks");
    return;
  }

  try {

    setLoading(true);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice,
        }),
      }
    );

    const data = await response.json();

console.log("STATUS:", response.status);
console.log("DATA:", data);

    if (data.success) {

      const audioLink =
        `https://bely-studio-backend.onrender.com/audio/${data.audio}?t=${Date.now()}`;

      setAudioUrl(audioLink);

      console.log("audioUrl mete:", audioLink);

setTimeout(() => {
  console.log("audioUrl apre 1 segonn:", audioLink);
}, 1000);

      const newItem = {
        text,
        date: new Date().toLocaleTimeString(),
        textContent: text,
        audio: audioLink,
      };

      setHistory((prev) => {

        const updatedHistory = [
          newItem,
          ...prev,
        ].slice(0, 20);

        return updatedHistory;

      });

      setStats((prev) => {

        const updatedStats = {

          totalAudios:
            prev.totalAudios + 1,

          totalWords:
            prev.totalWords +
            text.split(/\s+/).length,

          totalAI:
            prev.totalAI,

          lastUsed:
            new Date().toLocaleString()

        };

        return updatedStats;

      });

    } else {

      alert("Erè pandan jenerasyon odyo a");

    }

  } catch (error) {

    console.error(error);

    alert("Erè koneksyon ak backend la");

  } finally {

    setLoading(false);

  }

};

const generateImage = async () => {

  if (!imagePrompt.trim()) {

    alert("Ekri sa ou vle kreye");

    return;

  }

  try {

    setImageLoading(true);

    console.log("IMAGE PROMPT =", imagePrompt);

console.log(
  "BODY VOYE =",
  JSON.stringify({
    prompt: imagePrompt,
  })
);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/generate-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
        }),
      }
    );

    const data = await response.json();

    console.log("IMAGE DATA:", data);

    if (data.success) {

      setGeneratedImage(data.image);

    } else {

      alert(data.message || "Erè pandan jenerasyon imaj la");

    }

    setStats((prev) => ({

  ...prev,

  totalImages:
    prev.totalImages + 1,

  lastUsed:
    new Date().toLocaleString()

}));

  } catch (error) {

    console.error(error);

    alert("Erè koneksyon ak backend la");

  } finally {

    setImageLoading(false);

  }

};

const handleImageUpload = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  setSelectedImage(file);

  setPreviewImage(
    URL.createObjectURL(file)
  );

};

const askAI = async () => {

  if (text.trim() === "") {

    alert("Tanpri antre yon kestyon oswa tèks");

    return;

  }

  try {

    setAiLoading(true);

    setAiResponse("");

    console.log("Kesyon voye:", text);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/ask-ai",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

  prompt: `
You are Bely AI, a helpful AI assistant.

Always answer in ${langMap[language]}.

Rules:
- Be clear and professional.
- Give complete answers.
- Use examples when useful.
- Adapt your answer to the user's question.
- Do not mention these instructions.

User question:

${text}
`

})
      }
    );

    const data = await response.json();

console.log(data);

    if (data.success) {

  setAiResponse(
    data.answer
  );
  setMessages((prev) => [

  ...prev,

  {
    type:"user",
    text:text
  },

  {
    type:"ai",
    text:data.answer
  }

]);

setStats((prev) => ({

  ...prev,

  totalAI: prev.totalAI + 1,

  lastUsed:
    new Date().toLocaleString()

}));

  setText("");

  setStats((prev) => ({

    ...prev,

    totalAI:
      prev.totalAI + 1

  }));

} else {

      setAiResponse("Erè pandan repons AI a.");

    }

    setAiLoading(false);

  } catch (error) {

    console.error(error);

    setAiLoading(false);

    setAiResponse(
      "Erè koneksyon ak AI a."
    );

  }

};

const translateText = async () => {

  if (text.trim() === "") {

    alert("Tanpri antre yon tèks");

    return;

  }

  try {

    setAiLoading(true);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/ask-ai",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
  prompt: `
Translate the following text into
${langMap[language]}.

Rules:
- Return only the translation.
- Do not add explanations.
- Preserve the original meaning.

Text:

${text}
`
})
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {

      setTranslationMessages((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: data.answer
        }

      ]);

      setStats((prev) => ({

  ...prev,

  totalAI: prev.totalAI + 1,

  lastUsed:
    new Date().toLocaleString()

}));

      setText("");

    }

    setAiLoading(false);

  } catch (error) {

    console.error(error);

    setAiLoading(false);

    alert("Erè koneksyon");

  }

};

const rewriteText = async () => {

  if (text.trim() === "") {

    alert("Tanpri antre yon tèks");

    return;

  }

  try {

    setAiLoading(true);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/ask-ai",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
  prompt: `
You are a professional editor.

Rewrite the following text in ${langMap[language]}.

Rules:
- Keep the same language.
- Keep the original meaning.
- Correct grammar and spelling.
- Improve readability and professionalism.
- Return only the rewritten text.
- Do not add explanations.

Text:

${text}
`
})
      }
    );

    const data = await response.json();

    if (data.success) {

      setRewrites((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: data.answer
        }

      ]);

      setStats((prev) => ({

  ...prev,

  totalAI: prev.totalAI + 1,

  lastUsed:
    new Date().toLocaleString()

}));

      setText("");

    }

    setAiLoading(false);

  } catch (error) {

    console.error(error);

    setAiLoading(false);

    alert("Erè koneksyon");

  }

};

const summarizeText = async () => {

  if (text.trim() === "") {

    alert("Tanpri antre yon tèks");

    return;

  }

  try {

    setAiLoading(true);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/ask-ai",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          prompt: `
You are a professional summarizer.

Summarize the following text in ${langMap[language]}.

Rules:
- Keep the main ideas.
- Use short and clear paragraphs.
- Make it easy to understand.
- Return only the summary.
- Do not add explanations.

Text:

${text}
`
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      setSummaries((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: data.answer
        }

      ]);

      setStats((prev) => ({

  ...prev,

  totalAI: prev.totalAI + 1,

  lastUsed:
    new Date().toLocaleString()

}));

      setText("");

    }

    setAiLoading(false);

  } catch (error) {

    console.error(error);

    setAiLoading(false);

    alert("Erè koneksyon");

  }

};

const generateTikTokScript = async () => {

  if (text.trim() === "") {

    alert("Tanpri antre yon sijè");

    return;

  }

  try {

    setAiLoading(true);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/ask-ai",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
  prompt: `
You are a professional TikTok content creator.

Create a TikTok script in
${langMap[language]}
about:

${text}

Rules:

- Return only the script.
- Use a dynamic and natural tone.
- Make it engaging and easy to read.
- Use emojis.
- Do not use symbols such as *** or ---.
- The script should be around 60 seconds long.

Format exactly like this:

🎣 ${tiktokLabels[language].hook}

🎬 ${tiktokLabels[language].development}

📢 ${tiktokLabels[language].cta}

`
})
      }
    );

    const data = await response.json();

    if (data.success) {

      setTiktokScripts((prev) => [
        ...prev,
        {
          type: "user",
          text: text
        },
        {
         type: "ai",
         text: data.answer
        }
      ]);

      setStats((prev) => ({

  ...prev,

  totalAI: prev.totalAI + 1,

  lastUsed:
    new Date().toLocaleString()

}));

      setText("");
    }

    setAiLoading(false);

    } catch (error) {

      console.error(error);

      setAiLoading(false);

      alert("Erè koneksyon");

    }

    }; 
    
const generateQuiz = async () => {

  if (text.trim() === "") {

    alert("Tanpri antre yon sijè");

    return;

  }

  try {

    setAiLoading(true);

    const response = await fetch(
      "https://bely-studio-backend.onrender.com/ask-ai",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
  prompt: `

You are a professional teacher and quiz creator.

Create 10 quiz questions in
${langMap[language]}
about:

${text}

Use exactly this format:

━━━━━━━━━━━━━━

❓ Question 1

A) ...
B) ...
C) ...
D) ...

✅ Correct Answer:
...

📖 Explanation:
...

━━━━━━━━━━━━━━

Continue with the same format until Question 10.

Rules:

- Use ${langMap[language]} only.
- Make the questions engaging.
- Provide exactly 4 answer choices.
- Only one correct answer.
- Include an explanation for each answer.
- Return only the quiz.

`
})
      }
    );

    const data = await response.json();

    if (data.success) {

      setQuizzes((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: data.answer
        }

      ]);

      setStats((prev) => ({

  ...prev,

  totalAI: prev.totalAI + 1,

  lastUsed:
    new Date().toLocaleString()

}));

      setText("");

    }

  } catch (error) {

    console.error(error);

    alert("Erè koneksyon");

  }

    setAiLoading(false);

};



if (activePage === "rewrite") {

  return (

    <div className="ai-page">

    <div className="ai-card">

      <button
  className="back-btn"
  onClick={() => setActivePage("home")}
>
  ←
</button>


      <h1>
        ✍️ {t.rewriteTitle}
      </h1>

      {rewrites.length === 0 && (

        <p className="welcome-text">

          ♻️{t.rewriteDescription}♻️

        </p>

      )}

      <div className="section-divider"></div>

      <div className="chat-container">

        {rewrites.map((msg, index) => (

  <div
  key={index}
  className={
    msg.type === "user"
      ? "user-message"
      : "ai-message"
  }
>

 <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8"
  }}
>
  {msg.text}
</div>

  {msg.type === "ai" && (

    <button
      className="message-copy-btn"
      onClick={() =>
        navigator.clipboard.writeText(
          msg.text
        )
      }
    >
      ⧉ {t.copy}
    </button>

  )}

</div>

))}

      </div>

      <div className="input-wrapper">

  <label className="upload-inside">

    +

    <input
      type="file"
      accept=".txt"
      onChange={handleFileUpload}
      hidden
    />

  </label>

  <textarea
    value={text}
    onChange={(e) =>
      setText(e.target.value)
    }
    placeholder={t.rewritePlaceholder}
  />

  <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

</div>

      <button

        onClick={rewriteText}

        disabled={aiLoading}

      >

        {aiLoading
 ? `⏳ ${t.rewriteLoading}`
 : `✍️ ${t.rewriteButton}`}

            </button>

    </div>

    </div>

  );

}


if (activePage === "summary") {

  return (

    <div className="ai-page">

    <div className="ai-card">

      <button
        className="back-btn"
        onClick={() =>
          setActivePage("home")
        }
      >
        ←
      </button>

      <h1>
        📝 {t.summaryTitle}
      </h1>
      

      {summaries.length === 0 && (

        <p className="welcome-text">

          📚{t.summaryDescription}📚

        </p>

      )}

      <div className="section-divider"></div>

      <div className="chat-container">

        {summaries.map((msg, index) => (

          <div
  key={index}
  className={
    msg.type === "user"
      ? "user-message"
      : "ai-message"
  }
>

  <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8"
  }}
>
  {msg.text}
</div>

  {msg.type === "ai" && (

    <button
      className="message-copy-btn"
      onClick={() =>
        navigator.clipboard.writeText(
          msg.text
        )
      }
    >
      ⧉ {t.copy}
    </button>

  )}

</div>

))}

      </div>

      <div className="input-wrapper">

  <label className="upload-inside">

    +

    <input
      type="file"
      accept=".txt"
      onChange={handleFileUpload}
      hidden
    />

  </label>

  <textarea
    value={text}
    onChange={(e) =>
      setText(e.target.value)
    }
    placeholder={t.summaryPlaceholder}
  />

  <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

</div>

      <button

        onClick={summarizeText}

        disabled={aiLoading}

      >

        {aiLoading
 ? `⏳ ${t.summaryLoading}`
 : `📝 ${t.summaryButton}`}

      </button>

    </div>

    </div>

  );

}

if (activePage === "translate") {

  return (

    <div className="ai-page">

    <div className="ai-card">

      <button
        className="back-btn"
        onClick={() => setActivePage("home")}
      >
        ←
      </button>

      <h1>🌍 {t.translateTitle}</h1>

      <p className="welcome-text">
         🌐{t.translateDescription}🌐
      </p>

      <div className="section-divider"></div>

      <div className="chat-container">

        {translationMessages.map((msg, index) => (

          <div
  key={index}
  className={
    msg.type === "user"
      ? "user-message"
      : "ai-message"
  }
>

  <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8"
  }}
>
  {msg.text}
</div>

  {msg.type === "ai" && (

    <button
      className="message-copy-btn"
      onClick={() =>
        navigator.clipboard.writeText(
          msg.text
        )
      }
    >
      ⧉ {t.copy}
    </button>

  )}

</div>

))}

      </div>

      <div className="input-wrapper">

  <label className="upload-inside">

    +

    <input
      type="file"
      accept=".txt"
      onChange={handleFileUpload}
      hidden
    />

  </label>

  <textarea
    value={text}
    onChange={(e) =>
      setText(e.target.value)
    }
    placeholder={t.translatePlaceholder}
  />

  <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

</div>

      <button
  onClick={translateText}
  disabled={aiLoading}
>

  {aiLoading
 ? `⏳ ${t.translateLoading}`
 : `🌍 ${t.translateButton}`}

</button>

    </div>

    </div>

  );

}

if (activePage === "tiktok") {

  return (

    <div className="ai-page">

    <div className="ai-card">

      <button
        className="back-btn"
        onClick={() =>
          setActivePage("home")
        }
      >
        ←
      </button>

      <h1>
        🎬 {t.tiktokTitle}
      </h1>

      {tiktokScripts.length === 0 && (

        <p className="welcome-text">

          🔥{t.tiktokDescription}🔥

        </p>

      )}

      

      <div className="section-divider"></div>

      <div className="chat-container">

        {tiktokScripts.map((msg, index) => (

          <div
  key={index}
  className={
    msg.type === "user"
      ? "user-message"
      : "ai-message"
  }
>

  <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8"
  }}
>
  {msg.text}
</div>

  {msg.type === "ai" && (

    <button
      className="message-copy-btn"
      onClick={() =>
        navigator.clipboard.writeText(
          msg.text
        )
      }
    >
      ⧉ {t.copy}
    </button>

  )}

</div>

))}

      </div>

      <div className="input-wrapper">

  <label className="upload-inside">

    +

    <input
      type="file"
      accept=".txt"
      onChange={handleFileUpload}
      hidden
    />

  </label>

  <textarea
    value={text}
    onChange={(e) =>
      setText(e.target.value)
    }
    placeholder={t.tiktokPlaceholder}
  />

  <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

</div>

      <button

        onClick={generateTikTokScript}

        disabled={aiLoading}

      >

        {aiLoading
 ? `⏳ ${t.tiktokLoading}`
 : `🎬 ${t.tiktokButton}`}

      </button>

    </div>

    </div>

  );

}

if (activePage === "quiz") {

  return (

    <div className="ai-page">

    <div className="ai-card">

      <button
        className="back-btn"
        onClick={() =>
          setActivePage("home")
        }
      >
        ←
      </button>

      <h1>
        ❓ {t.quizTitle}
      </h1>

      <p className="welcome-text">
          🎓{t.quizDescription}🎓
      </p>

      <div className="section-divider"></div>

      <div className="chat-container">

        {quizzes.map((msg, index) => (

          <div
  key={index}
  className={
    msg.type === "user"
      ? "user-message"
      : "ai-message"
  }
>

  <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8"
  }}
>
  {msg.text}
</div>

  {msg.type === "ai" && (

    <button
      className="message-copy-btn"
      onClick={() =>
        navigator.clipboard.writeText(
          msg.text
        )
      }
    >
      ⧉ {t.copy}
    </button>

  )}

</div>

))}

      </div>

      <div className="input-wrapper">

  <label className="upload-inside">

    +

    <input
      type="file"
      accept=".txt"
      onChange={handleFileUpload}
      hidden
    />

  </label>

  <textarea
    value={text}
    onChange={(e) =>
      setText(e.target.value)
    }
    placeholder={t.quizPlaceholder}
  />

  <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

</div>

      <button

        onClick={generateQuiz}

        disabled={aiLoading}

      >

        {aiLoading
 ? `⏳ ${t.quizLoading}`
 : `❓ ${t.quizButton}`}

      </button>

    </div>

    </div>

  );

}

if (activePage === "audio") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <button
          className="back-btn"
          onClick={() =>
            setActivePage("home")
          }
        >
          ←
        </button>

        <h1>
          🎙️{t.audioTitle}
        </h1>

        <p className="welcome-text">

          🔊{t.audioDescription}🔊

        </p>

        <div className="section-divider"></div>

        <h3 style={{ color: "white" }}>
          🎙️{t.selectVoice}
        </h3>

        <select
          value={voice}
          onChange={(e) =>
            setVoice(e.target.value)
          }
        >

          <option value="male">
  {t.maleVoice}
</option>

<option value="female">
  {t.femaleVoice}
</option>

<option value="narrator">
  {t.narratorVoice}
</option>

        </select>

        {audioUrl && (

  <div className="audio-container">

    <h3>🎵 {t.audioReady}</h3>

    <audio
      controls
      src={audioUrl}
      className="audio-player"
    />

    <br /><br />

    <a
      href={audioUrl}
      download="bely-audio.mp3"
      className="download-btn"
    >
      📥 {t.downloadAudio}
    </a>

  </div>

)}

        <div style={{ flex: 1 }}></div>

        <div className="input-wrapper">

          <label
            className="upload-inside"
          >

            +

            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              hidden
            />

          </label>


          <textarea

            rows={1}

            maxLength={5000}

            placeholder={t.audioPlaceholder}

            value={text}

            onChange={(e) => {

              setText(
                e.target.value
              );

              e.target.style.height =
                "auto";

              e.target.style.height =
                Math.min(
                  e.target.scrollHeight,
                  250
                ) + "px";

            }}

          />

          <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

        </div>

        <button

          onClick={generateAudio}

          disabled={loading}

        >

          {loading
 ? `⏳ ${t.audioLoading}`
 : `🎙️ ${t.audioButton}`}

        </button>

      </div>

    </div>

  );

}

if (activePage === "ask-ai") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="ai-header">

          <button
            className="back-btn"
            onClick={() => setActivePage("home")}
          >
            ←
          </button>

          <h1 className="ai-title">
  🤖 {t.askAI}
</h1>

          <p className="welcome-text">
         ⚜️{t.askDescription}⚜️
      </p>

        </div>

        <div className="section-divider"></div>

        <div className="chat-container">

          {messages.map((msg, index) => (

            <div
  key={index}
  className={
    msg.type === "user"
      ? "user-message"
      : "ai-message"
  }
>

  <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8"
  }}
>
  {msg.text}
</div>

  {msg.type === "ai" && (

    <button
      className="message-copy-btn"
      onClick={() =>
        navigator.clipboard.writeText(
          msg.text
        )
      }
    >
      ⧉ {t.copy}
    </button>

  )}

</div>

          ))}

        </div>

        <div className="input-wrapper">

  <label className="upload-inside">

    +

    <input
      type="file"
      accept=".txt"
      onChange={handleFileUpload}
      hidden
    />

  </label>

  <textarea
  value={text}
  onChange={(e) =>
    setText(e.target.value)
  }
  placeholder={t.askPlaceholder}
/>

  <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

</div>

        <button
          onClick={askAI}
          disabled={aiLoading}
        >

          {aiLoading
  ? `⏳ ${t.thinking}`
  : `🤖 ${t.send}`}

        </button>

      </div>

    </div>

  );

}

if (activePage === "image") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="ai-header">

          <button
            className="back-btn"
            onClick={() => setActivePage("home")}
          >
            ←
          </button>

          <h1 className="ai-title">
            🖼️ {t.imageTitle}
          </h1>

          <p className="welcome-text">
  🎨{t.imageDescription}🎨
</p>

<div className="section-divider"></div>

        </div>

        <div className="chat-container">

          {previewImage && (

  <div className="image-result">

    <img
      src={previewImage}
      alt="Preview"
      className="generated-image"
    />

  </div>

)}

  {generatedImage && (

    <div className="image-result">

      <img
        src={generatedImage}
        alt="AI Generated"
        className="generated-image"
      />

      <a
        href={generatedImage}
        download="bely-image.png"
        className="download-btn"
      >
        📥 {t.downloadImage}
      </a>

    </div>

  )}

</div>

<div className="input-wrapper">

  <label className="upload-inside">

    +

    <input
      type="file"
      accept=".txt"
      onChange={handleFileUpload}
      hidden
    />

  </label>

  <textarea
    value={text}
    onChange={(e) =>
      setText(e.target.value)
    }
    placeholder={t.imagePlaceholder}
  />

  <button
  type="button"
  className={
    isListening
      ? "voice-btn listening"
      : "voice-btn"
  }
  onClick={startVoiceInput}
>
  <HiMiniMicrophone />

  {isListening && (
    <span className="mic-dot"></span>
  )}
</button>

</div>

<button
  onClick={generateImage}
  disabled={imageLoading}
>
  {imageLoading
 ? `⏳ ${t.imageLoading}`
 : `🖼️ ${t.imageButton}`}
</button>

      </div>

    </div>

  );

}

  return (
    

  <div className="container">

    <div className="hero-section">

  <img
    src={logo}
    alt="Bely AI Studio"
    className="hero-logo"
  />

  <p className="hero-subtitle">
    Haitian AI Voice Generator
  </p>

</div>

    <div className="topbar">

  <div className="logo-area">

  <button
  className="menu-btn"
  onClick={() => setShowMenu(true)}
>
  ☰
</button>

  <div
    className="logo-wrapper"
    onClick={() =>
      setActivePage("home")
    }
  >

    <img
      src={logo}
      alt="Bely AI Studio"
      className="site-logo"
    />

    <span className="logo-text">
      Bely AI Studio
    </span>

  </div>

</div>

  <div className="right-menu">

    <select
  className="flag-select"
  value={language}
  onChange={(e) =>
    setLanguage(e.target.value)
  }
>

  <option value="ht">
    🇭🇹
  </option>

  <option value="en">
    🇺🇸
  </option>

  <option value="fr">
    🇫🇷
  </option>

  <option value="es">
    🇪🇸
  </option>

</select>



    {activePage !== "menu" && (

<button
  className="login-btn"
  onClick={() =>
    setShowLogin(true)
  }
>
  👤
</button>

)}



  </div>

</div>

    {showMenu && (

<div className="menu-page">

  <h2>☰ {t.menu}</h2>

  <button
  onClick={() =>
    setShowMenu(false)
  }
>
  ❌ {t.close}
</button>

  <button
  onClick={() => {
    setActivePage("home");
    setShowMenu(false);
  }}
>
  🏠 {t.home}
</button>

  <button
  onClick={() => {
    setActivePage("history");
    setShowMenu(false);
  }}
>
  📜 {t.history}
</button>

  <button
  onClick={() => {
    setActivePage("stats");
    setShowMenu(false);
  }}
>
  📊 {t.statistics}
</button>

  <button
  onClick={() => {
    setActivePage("about");
    setShowMenu(false);
  }}
>
  ℹ️ {t.about} 
</button>

</div>

)}

{activePage === "history" && (

<div className="menu-content">

  <button
  className="page-close-btn"
  onClick={() => setActivePage("home")}
>
  ✕
</button>

  <h2 className="dashboard-title">
  📜 {t.historyTitle}
</h2>

  <p className="dashboard-subtitle">
  {t.historyDescription}
</p>

  <div className="history-summary">

    <div className="stat-card">

      <h3>📂</h3>

      <h2>{history.length}</h2>

      <p>{t.totalActivities}</p>

    </div>

  </div>

  <input
    type="text"
    className="search-input"
    placeholder={t.searchHistory}
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
  />

  {history.length === 0 ? (

    <div className="empty-history">

      <h3>
  📭 {t.noHistory}
</h3>

      <p>
  {t.noHistoryDescription}
</p>

    </div>

  ) : (

    history
.filter((item) =>
  item.text
    .toLowerCase()
    .includes(
      search.toLowerCase()
    )
)
.map((item, index) => (

<div
  key={index}
  className="history-card"
>

  <div className="history-top">

    <div className="history-type">

      🎙️ {t.audioType}

    </div>

    <div className="history-time">

      🕒 {item.date}

    </div>

  </div>

  <div className="history-content">

    {item.text}

  </div>

  <div className="history-footer">

    <button
      className="history-icon-btn"
      onClick={() => {

        const utterance =
          new SpeechSynthesisUtterance(
            item.textContent
          );

        utterance.lang = "fr-FR";

        speechSynthesis.speak(
          utterance
        );

      }}
    >

      ▶️

    </button>

  </div>

</div>

))

  )}

</div>

)}

{activePage === "stats" && (

<div className="menu-content">

  <h2 className="dashboard-title">
    📊 {t.dashboard} Bely AI
  </h2>

  <p className="dashboard-subtitle">
    {t.dashboardDescription}
  </p>

  <div className="stats-grid">

    <button
  className="page-close-btn"
  onClick={() => setActivePage("home")}
>
  ✕
</button>

  <div className="stat-card">
    <h3>🎙️</h3>
    <h2>{stats.totalAudios}</h2>
    <p>{t.audioCreated}</p>
  </div>

  <div className="stat-card">
    <h3>🤖</h3>
    <h2>{stats.totalAI}</h2>
    <p>{t.aiUsage}</p>
  </div>

  <div className="stat-card">
   <h3>🖼️</h3>
   <h2>{stats.totalImages}</h2>
   <p>{t.imageCreated}</p>
   </div>

  <div className="stat-card">
    <h3>📂</h3>
    <h2>{history.length}</h2>
    <p>{t.totalActivity}</p>
  </div>

  <div className="stat-card">
    <h3>📝</h3>
    <h2>{stats.totalWords}</h2>
    <p>{t.wordsProcessed}</p>
  </div>

  <div className="stat-card stat-card-wide">
    <h3>🕒</h3>
    <p>{stats.lastUsed || t.noData}</p>
    <span>{t.lastActivity}</span>
  </div>

</div>

</div>

)}

{activePage === "guide" && (

<div className="menu-content">

  <button
    className="page-close-btn"
    onClick={() => setActivePage("home")}
  >
    ✕
  </button>

  <h2 className="dashboard-title">
    📘 {t.guideTitle}
  </h2>

  <div className="guide-content">

  <ReactMarkdown
    components={{
      p: ({ children }) => <p>{children}</p>
    }}
  >
    {guides[language]}
  </ReactMarkdown>

</div>

</div>

)}

{activePage === "about" && (

<div className="menu-content">

  <p className="about-version">
    Version 1.0 Beta
  </p>

  <button
  className="page-close-btn"
  onClick={() => setActivePage("home")}
>
  ✕
</button>

  <div className="section-divider"></div>

  <p className="about-text">
  {t.aboutDescription}
</p>

  <div className="section-divider"></div>

  <h3 className="about-features-title">
  ✨ {t.featuresTitle}
</h3>

  <div className="about-features">

<div>🎙️ {t.audioFeature}</div>

<div>🌍 {t.translationFeature}</div>

<div>✍️ {t.rewriteFeature}</div>

<div>📄 {t.summaryFeature}</div>

<div>🎬 {t.tiktokFeature}</div>

<div>❓ {t.quizFeature}</div>

<div>🤖 {t.askAIFeature}</div>

<div>🖼️ {t.imageFeature}</div>

  </div>

  <div className="section-divider"></div>

  <h3 className="about-contact-title">
  📞 {t.contactTitle}
</h3>

<div className="about-contact">

  <p>
    📧 Email:
    support@belyaistudio.com
  </p>

  <p>
    📱 WhatsApp:
    +1 829 982 7016
  </p>

  <p className="about-support">
  {t.supportText}
</p>

</div>

  <p className="about-powered">
  {t.poweredBy}
</p>

  <p className="about-footer">

    © 2026 Bely AI Studio

  </p>

</div>

)}

    {activePage === "home" && (
<>

      <div className="header">

      {!isNative && (
  <a
  href="/bely-ai.apk"
  className="apk-btn"
>
  📱 {t.downloadApk}
</a>
)}

<div className="slider-dots">

  <span
    className={
      currentSlide === 1
        ? "dot active-dot"
        : "dot"
    }
    onClick={() => setCurrentSlide(1)}
  />

  <span
    className={
      currentSlide === 2
        ? "dot active-dot"
        : "dot"
    }
    onClick={() => setCurrentSlide(2)}
  />

</div>

{currentSlide === 1 && (

<div className="tools-grid">

  <div
    className="tool-card"
    onClick={() => setActivePage("ask-ai")}
  >
    <div className="tool-icon">🤖</div>
    <p>{t.askAI}</p>
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("translate")}
  >
    <div className="tool-icon">🌍</div>
    <p>{t.translate}</p>
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("audio")}
  >
    <div className="tool-icon">🎙️</div>
    <p>{t.audio}</p>
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("image")}
  >
    <div className="tool-icon">🖼️</div>
    <p>{t.image}</p>
  </div>

</div>

)}

{currentSlide === 2 && (

<div className="tools-grid">

  <div
    className="tool-card"
    onClick={() => setActivePage("rewrite")}
  >
    <div className="tool-icon">✍️</div>
    <p>{t.rewrite}</p>
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("summary")}
  >
    <div className="tool-icon">📝</div>
    <p>{t.summary}</p>
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("tiktok")}
  >
    <div className="tool-icon">🎬</div>
    <p>{t.tiktok}</p>
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("quiz")}
  >
    <div className="tool-icon">❓</div>
    <p>{t.quiz}</p>
  </div>

</div>

)}

<div className="guide-link-container">

  <span className="new-user-text">
    📘 {t.guideQuestion}
  </span>

  <span
    className="guide-link"
    onClick={() => setActivePage("guide")}
  >
    {t.guideText}
  </span>

</div>

</div>

{showAbout && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>
  🎙️ Bely AI Studio
</h2>

<p>{t.aboutModalDescription}</p>

<p>{t.mainFeatures}</p>

<button
  onClick={() =>
    setShowAbout(false)
  }
>
  {t.close}
</button>

<ul>

  <li>
    🎙️ Text To Speech
  </li>

  <li>
    🤖 AI Assistant
  </li>

  <li>
    📄 Upload TXT
  </li>

  <li>
    📜 Istorik
  </li>

</ul>

<p>

  Version 1.0 Beta

</p>

      <button
        onClick={() =>
          setShowAbout(false)
        }
      >

        Fèmen

      </button>

    </div>

  </div>

)}

{showLogin && (

<div className="modal-overlay">

  <div className="auth-modal">

    <h2>
  Bely AI Studio
</h2>

<input
  type="email"
  placeholder={t.email}
/>

<input
  type="password"
  placeholder={t.password}
/>

<button className="auth-btn">
  {t.login}
</button>

<p>
  {t.noAccount}

  <span
    className="signup-link"
    onClick={() => {
      setShowLogin(false);
      setShowSignup(true);
    }}
  >
    {t.createOne}
  </span>
</p>

<button
  className="close-btn"
  onClick={() => setShowLogin(false)}
>
  {t.close}
</button>

  </div>

</div>

)}

{showSignup && (

<div className="modal-overlay">

  <div className="auth-modal">

    <h2>
  {t.signup}
</h2>

<input
  type="text"
  placeholder={t.name}
/>

<input
  type="email"
  placeholder={t.email}
/>

<input
  type="password"
  placeholder={t.password}
/>

<button className="auth-btn">
  {t.signup}
</button>

<p>
  {t.alreadyAccount}

  <span
    className="signup-link"
    onClick={() => {
      setShowSignup(false);
      setShowLogin(true);
    }}
  >
    {t.login}
  </span>
</p>

<button
  className="close-btn"
  onClick={() => setShowSignup(false)}
>
  {t.close}
</button>

  </div>

</div>

)}

<footer>

  <h3>
    🎙️ Bely AI Studio
  </h3>

  <p>
    Haitian AI Voice Generator
  </p>

  <small>
  © 2026 Bely AI Studio. {t.copyright}
</small>

</footer>

</>
)}

    </div>

  );

}

export default App;