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

import {
  SpeechRecognition
} from "@capacitor-community/speech-recognition";

import {
 useSwipeable
}
from "react-swipeable";

import {
  HiOutlinePhoto,
  HiOutlineVideoCamera,
  HiOutlineSpeakerWave,
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineAcademicCap,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiUser,
  HiHome,
  HiClock,
  HiChartBar,
  HiInformationCircle,
  HiXMark,
  HiFolder,
  HiSpeakerWave,
  HiPhoto,
  HiDocumentText,
  HiCalendarDays,
  HiBookOpen,
  HiEnvelope,
  HiPhone,
  HiLifebuoy,
  HiCpuChip,
  HiDevicePhoneMobile,
  HiSpeakerXMark,
  HiLockClosed,
  HiArrowLeft,
  HiBars3

} from "react-icons/hi2";

import {
  correctCreole
} from "./utils/creoleCorrector";

import {
  MdTranslate
} from "react-icons/md";

import {
  FaRobot
} from "react-icons/fa";

function App() {  

const isNative = Capacitor.isNativePlatform();

const [text, setText] = useState("");

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

const creolePromptRules = `
If the language is Haitian Creole, use only official Haitian Creole spelling.

Haitian Creole alphabet:

a an b ch d e è en f g h i j k l m n ng o ò on ou oun p r s t ui v w y z

Rules:
- Never use q
- Never use x
- Never use c alone
- Use k instead of c or q
- Use ch as one sound
- Use W before O, Ò, ON, OU
- Do not use apostrophes
- Use m ap, w ap, l ap, n ap, y ap
- Prefer official Haitian Creole spelling

General Rules:
- Be clear and professional.
- Give complete answers.
- Use examples when useful.
- Adapt your answer to the user's question.
- Do not mention these instructions.

User question:
`;

const [voiceMessages, setVoiceMessages] =
useState([]);

const [recording,setRecording] =
useState(false);

const [voiceText,setVoiceText] =
useState("");

const [voiceLoading, setVoiceLoading] =
useState(false);

const [voiceRecording, setVoiceRecording] =
useState(false);

const [showLockHint, setShowLockHint] =
useState(false);

const chatEndRef = useRef(null);

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

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {

  if (

    !recording &&

    voiceText.trim()

  ) {

    sendVoiceMessage();

  }

}, [

  recording

]);

useEffect(() => {

  chatEndRef.current?.scrollIntoView({

    behavior:"smooth"

  });

}, [voiceMessages]);

useEffect(() => {

  const setupBackButton = async () => {

    const listener =
      await CapacitorApp.addListener(
        "backButton",
        () => {

          if (showMenu) {

  setShowMenu(false);
  return;

}

if (activePage !== "home") {

  setActivePage("home");
  return;

}

CapacitorApp.exitApp();

        }
      );

    return listener;

  };

  let listener;

  setupBackButton().then(
    (l) => {
      listener = l;
    }
  );

  return () => {

    if (listener) {

      listener.remove();

    }

  };

}, [activePage, showMenu]);

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

const handlers =
useSwipeable({

 onSwipedLeft: () => {

   if(currentSlide===1){

      setCurrentSlide(2);

   }

 },

 onSwipedRight: () => {

   if(currentSlide===2){

      setCurrentSlide(1);

   }

 }

});

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

  SpeechRecognition.addListener(
    "partialResults",
    (data) => {

      if (
        data.matches &&
        data.matches.length > 0
      ) {

        setVoiceText(
          data.matches[0]
        );

      }

    }
  );

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

const speakText = (text) => {

  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang =
    language === "ht"
      ? "fr-FR"
      : language === "en"
      ? "en-US"
      : language === "es"
      ? "es-ES"
      : "fr-FR";

  utterance.rate = 1;

  utterance.pitch = 1;

  speechSynthesis.speak(
    utterance
  );

};

const startVoiceInputWeb = () => {

  const SpeechRecognitionWeb =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognitionWeb) {

    alert(
      "Voice recognition pa sipòte sou navigatè sa."
    );

    return;

  }

  const recognition =
    new SpeechRecognitionWeb();

  recognition.lang =
    language === "en"
      ? "en-US"
      : language === "es"
      ? "es-ES"
      : "fr-FR";

  recognition.continuous = false;

  recognition.interimResults = false;

  setIsListening(true);

  recognition.start();

  recognition.onresult = (event) => {

    setText(
      event.results[0][0].transcript
    );

  };

  recognition.onerror = () => {

    setIsListening(false);

  };

  recognition.onend = () => {

    setIsListening(false);

  };

};

const startVoiceInput = async () => {

  if (
    !Capacitor.isNativePlatform()
  ) {

    startVoiceInputWeb();

    return;

  }

  try {

    const permission =
      await SpeechRecognition.requestPermissions();

    if (
      !permission.speechRecognition
    ) {

      alert(
        language === "ht"
          ? "Tanpri bay aksè ak mikwo a"
          : language === "en"
          ? "Please allow microphone access"
          : language === "fr"
          ? "Veuillez autoriser l'accès au microphone"
          : "Permita acceso al micrófono"
      );

      return;

    }

    setIsListening(true);

    const result =
      await SpeechRecognition.start({

        language:
          language === "en"
            ? "en-US"
            : language === "es"
            ? "es-ES"
            : "fr-FR",

        maxResults: 5,

        partialResults: false,

        popup: true

      });

    if (
      result &&
      result.matches &&
      result.matches.length > 0
    ) {

      setText(
        result.matches[0]
      );

    }

  } catch (err) {

    console.log(err);

  } finally {

    setIsListening(false);

  }

};

const startVoiceRecordWeb = () => {

  const SpeechRecognitionWeb =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognitionWeb) {

    alert(
      "Voice recognition pa sipòte sou navigatè sa."
    );

    return;

  }

  const recognition =
    new SpeechRecognitionWeb();

  recognition.lang =
    language === "en"
      ? "en-US"
      : language === "es"
      ? "es-ES"
      : "fr-FR";

  recognition.continuous = false;

  recognition.interimResults = true;

  recognition.start();

  recognition.onresult = (event) => {

    const transcript = Array.from(
      event.results
    )
      .map(result => result[0].transcript)
      .join("");

    setVoiceText(transcript);

  };

  recognition.onend = () => {

    setRecording(false);

  };

  window.voiceRecognitionRef =
    recognition;

};

const startVoiceRecord = async () => {

  setRecording(true);

  setShowLockHint(true);

  if (
    !Capacitor.isNativePlatform()
  ) {

    startVoiceRecordWeb();

    return;

  }

  try {

    await SpeechRecognition.start({

      language:
        language === "ht"
          ? "fr-FR"
          : language === "en"
          ? "en-US"
          : language === "es"
          ? "es-ES"
          : "fr-FR",

      maxResults: 1,

      partialResults: true,

      popup: false

    });

  } catch(err) {

    console.log(err);

    setRecording(false);

    setShowLockHint(false);

  }

};

const stopVoiceRecord = async () => {

  setShowLockHint(false);

  if (
    !Capacitor.isNativePlatform()
  ) {

    if (
      window.voiceRecognitionRef
    ) {

      window.voiceRecognitionRef.stop();

    }

    setRecording(false);

    return;

  }

  try {

    await SpeechRecognition.stop();

  } catch(err) {

    console.log(err);

  }

  setRecording(false);

};

const sendVoiceMessage = async () => {

  if (!voiceText.trim()) return;

  const userMessage = voiceText;

  setVoiceMessages((prev) => [

    ...prev,

    {
      type:"user",
      text:userMessage
    }

  ]);

  setVoiceText("");

  try {

    setVoiceLoading(true);

    const response =
      await fetch(

        "https://bely-studio-backend.onrender.com/ask-ai",

        {

          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({

            prompt:`

You are Bely AI.

${language === "ht" ? creolePromptRules : ""}

Always answer in ${langMap[language]}.

User:

${userMessage}

            `

          })

        }

      );

    const data =
      await response.json();

    if(data.success){

      const cleanAnswer =

  data.answer

    .replace(/#+/g,"")

    .replace(/\*+/g,"")

    .replace(/=+/g,"")

    .replace(/_{2,}/g,"")

    .replace(/-{3,}/g,"")

    .trim();

  setVoiceMessages((prev)=>([

    ...prev,

    {
  type:"ai",
  text:cleanAnswer

  .replace(/#/g,"")

  .replace(/\*/g,"")

  .replace(/=/g,"")

  .replace(/_/g,"")

  .replace(/-{3,}/g,"")

  .trim()
}

  ]));

  const cleanSpeech =

  data.answer

    .replace(/#+/g,"")

    .replace(/\*+/g,"")

    .replace(/=+/g,"")

    .replace(/_{2,}/g,"")

    .replace(/-{3,}/g,"")

    .trim();

speakText(
  cleanSpeech
);

}

  } catch(err){

    console.log(err);

  } finally {

    setVoiceLoading(false);

  }

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
    alert(t.microphonePermission);
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

${language === "ht" ? creolePromptRules : ""}

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

      const finalAnswer =
  language === "ht"
    ? correctCreole(data.answer)
    : data.answer;

  setAiResponse(
  finalAnswer
);
  setMessages((prev) => [

  ...prev,

  {
    type:"user",
    text:text
  },

  {
    type:"ai",
    text:finalAnswer

  .replace(/#/g,"")

  .replace(/\*/g,"")

  .replace(/=/g,"")

  .replace(/_/g,"")

  .replace(/-{3,}/g,"")

  .trim()
  }

]);

setStats((prev) => ({

  ...prev,

  totalAI: prev.totalAI + 1,

  lastUsed:
    new Date().toLocaleString()

}));

  setText("");

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
${language === "ht" ? creolePromptRules : ""}
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

      const finalAnswer =
        language === "ht"
          ? correctCreole(data.answer)
          : data.answer;

      setTranslationMessages((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: finalAnswer
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

${language === "ht" ? creolePromptRules : ""}

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

      const finalAnswer =
        language === "ht"
          ? correctCreole(data.answer)
          : data.answer;

      setRewrites((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: finalAnswer
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

${language === "ht" ? creolePromptRules : ""}

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

      const finalAnswer =
        language === "ht"
          ? correctCreole(data.answer)
          : data.answer;

      setSummaries((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: finalAnswer
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

${language === "ht" ? creolePromptRules : ""}

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

      const finalAnswer =
        language === "ht"
          ? correctCreole(data.answer)
          : data.answer;

      setTiktokScripts((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: finalAnswer
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

${language === "ht" ? creolePromptRules : ""}

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

      const finalAnswer =
        language === "ht"
          ? correctCreole(data.answer)
          : data.answer;

      setQuizzes((prev) => [

        ...prev,

        {
          type: "user",
          text: text
        },

        {
          type: "ai",
          text: finalAnswer
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

        <div className="page-header">

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <HiOutlinePencilSquare /> {t.rewriteTitle}
</h1>

          {rewrites.length === 0 && (

            <p className="welcome-text">

              {t.rewriteDescription}

            </p>

          )}

          <div className="section-divider"></div>

        </div>

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

        <div className="bottom-area">

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
              rows={1}
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height = "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
                  ) + "px";

              }}
              placeholder={
                t.rewritePlaceholder
              }
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
  : (
      <>
        <HiOutlinePencilSquare />
        {t.rewriteButton}
      </>
    )
}

          </button>

        </div>

      </div>

    </div>

  );

}


if (activePage === "summary") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="page-header">

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <HiOutlineDocumentText /> {t.summaryTitle}
</h1>

          {summaries.length === 0 && (

            <p className="welcome-text">

              {t.summaryDescription}

            </p>

          )}

          <div className="section-divider"></div>

        </div>

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

        <div className="bottom-area">

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
              rows={1}
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height = "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
                  ) + "px";

              }}
              placeholder={
                t.summaryPlaceholder
              }
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
  : (
      <>
        <HiOutlineDocumentText />
        {t.summaryButton}
      </>
    )
}

          </button>

        </div>

      </div>

    </div>

  );

}

if (activePage === "translate") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="page-header">

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <MdTranslate /> {t.translateTitle}
</h1>

          <p className="welcome-text">

            {t.translateDescription}

          </p>

          <div className="section-divider"></div>

        </div>

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

        <div className="bottom-area">

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
              rows={1}
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height = "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
                  ) + "px";

              }}
              placeholder={
                t.translatePlaceholder
              }
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
  : (
      <>
        <MdTranslate />
        {t.translateButton}
      </>
    )
}

          </button>

        </div>

      </div>

    </div>

  );

}

if (activePage === "tiktok") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="page-header">

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <HiOutlineVideoCamera /> {t.tiktokTitle}
</h1>

          {tiktokScripts.length === 0 && (

            <p className="welcome-text">

              {t.tiktokDescription}

            </p>

          )}

          <div className="section-divider"></div>

        </div>

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

        <div className="bottom-area">

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
              rows={1}
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height = "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
                  ) + "px";

              }}
              placeholder={
                t.tiktokPlaceholder
              }
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

            onClick={
              generateTikTokScript
            }

            disabled={aiLoading}

          >

            {aiLoading
  ? `⏳ ${t.tiktokLoading}`
  : (
      <>
        <HiOutlineVideoCamera />
        {t.tiktokButton}
      </>
    )
}

          </button>

        </div>

      </div>

    </div>

  );

}

if (activePage === "quiz") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="page-header">

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <HiOutlineAcademicCap /> {t.quizTitle}
</h1>

          <p className="welcome-text">

            {t.quizDescription}

          </p>

          <div className="section-divider"></div>

        </div>

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

        <div className="bottom-area">

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
              rows={1}
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height = "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
                  ) + "px";

              }}
              placeholder={
                t.quizPlaceholder
              }
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
  : (
      <>
        <HiOutlineAcademicCap />
        {t.quizButton}
      </>
    )
}

          </button>

        </div>

      </div>

    </div>

  );

}

if (activePage === "audio") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="page-header">

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <HiOutlineSpeakerWave /> {t.audioTitle}
</h1>

          <p className="welcome-text">

            {t.audioDescription}

          </p>

          <div className="section-divider"></div>

          <h3 style={{ color: "white" }}>
  <HiOutlineSpeakerWave />
  {t.selectVoice}
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

        </div>

        <div className="chat-container">

          {audioUrl && (

            <div className="audio-container">

              <h3>
  <HiSpeakerWave />
  {t.audioReady}
</h3>

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
  <HiDevicePhoneMobile />
  {t.downloadAudio}
</a>

            </div>

          )}

        </div>

        <div className="bottom-area">

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
              rows={1}
              maxLength={5000}
              value={text}
              placeholder={
                t.audioPlaceholder
              }

              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height =
                  "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
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
  : (
      <>
        <HiOutlineSpeakerWave />
        {t.audioButton}
      </>
    )
}

          </button>

        </div>

      </div>

    </div>

  );

}

if (activePage === "ask-ai") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div
          className="page-header"
          {...handlers}
        >

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <FaRobot /> {t.askAI}
</h1>

          <p className="welcome-text">
            {t.askDescription}
          </p>

          <div className="section-divider"></div>

        </div>

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

        <div className="bottom-area">

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
              rows={1}
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height = "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
                  ) + "px";

              }}
              placeholder={
                t.askPlaceholder
              }
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
  : (
      <>
        <HiOutlineSparkles />
        {t.send}
      </>
    )
}

          </button>

        </div>

      </div>

    </div>

  );

}

if (activePage === "voice-ai") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div className="page-header">

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <button
  className="voice-stop-btn"
  onClick={() =>
    speechSynthesis.cancel()
  }
>
  <HiSpeakerXMark />
</button>

          <h1 className="ai-title">
            <HiOutlineChatBubbleLeftRight />
            {t.voiceAITitle}
          </h1>

          <p className="welcome-text">
            {t.voiceAIDescription}
          </p>

          <div className="section-divider"></div>

        </div>

        <div className="voice-chat-container">

          {recording && (

            <div className="voice-listening">

  <HiOutlineSpeakerWave />
  {t.listening}

</div>

          )}

          {voiceMessages.map((msg,index)=>(

            <div
              key={index}
              className={
                msg.type === "user"
                ? "voice-user-message"
                : "voice-ai-message"
              }
            >

              {msg.text}

            </div>

          ))}

          {voiceLoading && (

            <div className="voice-ai-message">

  <HiOutlineSparkles />
  {t.voiceThinking}

</div>

          )}

          <div ref={chatEndRef}></div>

        </div>

        <div className="bottom-area">

          {showLockHint && (

            <div className="lock-hint">

  <HiLockClosed />
  {t.lockHint}

</div>

          )}

          <div className="voice-bottom-bar">

            <button

              className={
                recording
                  ? "voice-record-btn recording"
                  : "voice-record-btn"
              }

              onMouseDown={startVoiceRecord}
              onMouseUp={stopVoiceRecord}
              onTouchStart={startVoiceRecord}
              onTouchEnd={stopVoiceRecord}

            >

              {recording ? "🛑" : "🎙️"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

if (activePage === "image") {

  return (

    <div className="ai-page">

      <div className="ai-card">

        <div
          className="page-header"
          {...handlers}
        >

          <button
  className="back-btn"
  onClick={() =>
    setActivePage("home")
  }
>
  <HiArrowLeft />
</button>

          <h1 className="ai-title">
  <HiOutlinePhoto /> {t.imageTitle}
</h1>

          <p className="welcome-text">
            {t.imageDescription}
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
  <HiOutlinePhoto />
  {t.downloadImage}
</a>

            </div>

          )}

        </div>

        <div className="bottom-area">

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
              rows={1}
              value={text}
              onChange={(e) => {

                setText(e.target.value);

                e.target.style.height =
                  "22px";

                e.target.style.height =
                  Math.min(
                    e.target.scrollHeight,
                    150
                  ) + "px";

              }}
              placeholder={
                t.imagePlaceholder
              }
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
  : (
      <>
        <HiOutlinePhoto />
        {t.imageButton}
      </>
    )
}

          </button>

        </div>

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
  <HiBars3 />
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
  <HiUser />
</button>

)}



  </div>

</div>

    {showMenu && (

<div className="menu-page">

  <h2 className="menu-title">
    <HiBars3 />
    {t.menu}
  </h2>

  <button
  onClick={() =>
    setShowMenu(false)
  }
>
  <>
  <HiXMark />
  {t.close}
</>
</button>

  <button
  onClick={() => {
    setActivePage("home");
    setShowMenu(false);
  }}
>
  <>
  <HiHome />
  {t.home}
</>
</button>

  <button
  onClick={() => {
    setActivePage("history");
    setShowMenu(false);
  }}
>
  <>
  <HiClock />
  {t.history}
</>
</button>

  <button
  onClick={() => {
    setActivePage("stats");
    setShowMenu(false);
  }}
>
  <>
  <HiChartBar />
  {t.statistics}
</>
</button>

  <button
  onClick={() => {
    setActivePage("about");
    setShowMenu(false);
  }}
>
  <>
  <HiInformationCircle />
  {t.about}
</> 
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
  <HiClock />
{t.historyTitle}
</h2>

  <p className="dashboard-subtitle">
  {t.historyDescription}
</p>

  <div className="history-summary">

    <div className="stat-card">

      <h3><HiFolder /></h3>

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
    <HiFolder />
    {t.noHistory}
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

      <>
  <HiSpeakerWave />
  {t.audioType}
</>

    </div>

    <div className="history-time">

      <>
  <HiCalendarDays />
  {item.date}
</>

    </div>

  </div>

  <div className="history-content">

    {item.text}

  </div>

  <div className="history-footer">

    <button
      className="history-icon-btn"
      onClick={() => {

        const languageMap = {
  ht: "ht-HT",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES"
};

const utterance =
  new SpeechSynthesisUtterance(
    item.text
  );

utterance.lang =
  languageMap[language] ||
  "en-US";

speechSynthesis.speak(
  utterance
);

      }}
    >

      <HiSpeakerWave />

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
    <HiChartBar />
{t.dashboard} Bely AI
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
    <h3><HiSpeakerWave /></h3>
    <h2>{stats.totalAudios}</h2>
    <p>{t.audioCreated}</p>
  </div>

  <div className="stat-card">
    <h3><FaRobot /></h3>
    <h2>{stats.totalAI}</h2>
    <p>{t.aiUsage}</p>
  </div>

  <div className="stat-card">
   <h3><HiPhoto /></h3>
   <h2>{stats.totalImages}</h2>
   <p>{t.imageCreated}</p>
   </div>

  <div className="stat-card">
    <h3><HiFolder /></h3>
    <h2>{history.length}</h2>
    <p>{t.totalActivity}</p>
  </div>

  <div className="stat-card">
    <h3><HiDocumentText /></h3>
    <h2>{stats.totalWords}</h2>
    <p>{t.wordsProcessed}</p>
  </div>

  <div className="stat-card stat-card-wide">
    <h3><HiCalendarDays /></h3>
    <p>{stats.lastUsed || t.noData}</p>
    <span>{t.lastActivity}</span>
  </div>

</div>

</div>

)}

{activePage === "guide" && (

<div className="menu-content">

  <div className="guide-header">

    <button
      className="page-close-btn"
      onClick={() => setActivePage("home")}
    >
      <HiXMark />
    </button>

    <h2 className="dashboard-title">
      <HiBookOpen />
      {t.guideTitle}
    </h2>

  </div>

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

  <div>
    <FaRobot />
    {t.askAIFeature}
  </div>

  <div>
    <MdTranslate />
    {t.translationFeature}
  </div>

  <div>
    <HiOutlinePencilSquare />
    {t.rewriteFeature}
  </div>

  <div>
    <HiOutlineDocumentText />
    {t.summaryFeature}
  </div>

  <div>
    <HiOutlineAcademicCap />
    {t.quizFeature}
  </div>

  <div>
    <HiOutlineVideoCamera />
    {t.tiktokFeature}
  </div>

  <div>
    <HiOutlineSpeakerWave />
    {t.audioFeature}
  </div>

  <div>
    <HiOutlinePhoto />
    {t.imageFeature}
  </div>

  <div>
    <HiOutlineChatBubbleLeftRight />
    {t.voiceAIFeature}
  </div>

</div>

  <div className="section-divider"></div>

  <h3 className="about-contact-title">
  <HiPhone />
  {t.contactTitle}
</h3>

<div className="about-contact">

  <p>
  <HiEnvelope />
  Email:
  support@belyaistudio.com
</p>

  <p>
  <HiPhone />
  WhatsApp:
  +1 829 982 7016
</p>

  <p className="about-support">
  <HiLifebuoy />
  {t.supportText}
</p>

</div>

  <p className="about-powered">
  <HiCpuChip />
  {t.poweredBy}
</p>

  <p className="about-footer">

    © 2026 Bely AI Studio

  </p>

</div>

)}

    {activePage === "home" && (
<>

      <div
 className="header"
 {...handlers}
>

      {!isNative && (
  <a
  href="/bely-ai.apk"
  className="apk-btn"
>
  <HiDevicePhoneMobile />
  {t.downloadApk}
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
  className="tool-card home-ask-card"
  onClick={() => setActivePage("ask-ai")}
>
    <div className="tool-icon">
      <FaRobot />
    </div>
    <p>{t.askAI}</p>
  </div>

  <div
  className="tool-card home-translate-card"
  onClick={() => setActivePage("translate")}
>
    <div className="tool-icon">
      <MdTranslate />
    </div>
    <p>{t.translate}</p>
  </div>

  <div
  className="tool-card home-audio-card"
  onClick={() => setActivePage("audio")}
>
    <div className="tool-icon">
      <HiOutlineSpeakerWave />
    </div>
    <p>{t.audio}</p>
  </div>

  <div
  className="tool-card home-voice-card"
  onClick={() => setActivePage("voice-ai")}
>
    <div className="tool-icon">
      <HiOutlineChatBubbleLeftRight />
    </div>
    <p>{t.voiceAI}</p>
  </div>

</div>

)}

{currentSlide === 2 && (

<div className="tools-grid">

  <div
  className="tool-card home-rewrite-card"
  onClick={() => setActivePage("rewrite")}
>
    <div className="tool-icon">
      <HiOutlinePencilSquare />
    </div>
    <p>{t.rewrite}</p>
  </div>

  <div
  className="tool-card home-summary-card"
  onClick={() => setActivePage("summary")}
>
    <div className="tool-icon">
      <HiOutlineDocumentText />
    </div>
    <p>{t.summary}</p>
  </div>

  <div
  className="tool-card home-tiktok-card"
  onClick={() => setActivePage("tiktok")}
>
    <div className="tool-icon">
      <HiOutlineVideoCamera />
    </div>
    <p>{t.tiktok}</p>
  </div>

  <div
  className="tool-card home-quiz-card"
  onClick={() => setActivePage("quiz")}
>
    <div className="tool-icon">
      <HiOutlineAcademicCap />
    </div>
    <p>{t.quiz}</p>
  </div>

  <div
  className="tool-card home-image-card"
  onClick={() => setActivePage("image")}
>
    <div className="tool-icon">
      <HiOutlinePhoto />
    </div>
    <p>{t.image}</p>
  </div>

</div>

)}

<div className="guide-link-container">

  <span className="new-user-text">
  <HiBookOpen />
  {t.guideQuestion}
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
  <HiSpeakerWave />
  Bely AI Studio
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
    <HiOutlineSpeakerWave />
    Text To Speech
  </li>

  <li>
    <FaRobot />
    AI Assistant
  </li>

  <li>
    <HiOutlineDocumentText />
    Upload TXT
  </li>

  <li>
    <HiClock />
    Istorik
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
className="modal-close-btn"
onClick={() => setShowLogin(false)}
>
✕
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
className="modal-close-btn"
onClick={() => setShowSignup(false)}
>
✕
</button>

  </div>

</div>

)}

<footer>

  <h3>
  Bely AI Studio
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