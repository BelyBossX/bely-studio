import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.jpeg";

function App() {

const [text, setText] = useState("");

const [messages, setMessages] =
useState([]);

const [translations, setTranslations] = useState([]);

const [rewrites, setRewrites] = useState([]);

const [summaries, setSummaries] = useState([]);

const [tiktokScripts, setTiktokScripts] = useState([]);

const [quizzes, setQuizzes] = useState([]);

  const [voice, setVoice] =
  useState("male");
  const [language, setLanguage] =
  useState("ht");
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
      "http://localhost:5000/generate",
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

    console.log("DATA:", data);

    if (data.success) {

      const audioLink =
        `http://localhost:5000/audio/${data.audio}?t=${Date.now()}`;

      setAudioUrl(audioLink);

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
          prompt: text
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
Tradui tèks sa a an kreyòl ayisyen.

Règ:
- Bay sèlman tradiksyon an.
- Pa ajoute eksplikasyon.
- Kenbe sans orijinal la.

Tèks la:

${text}
`
})
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {

      setTranslations((prev) => [

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
Re-ekri tèks sa a nan yon fason ki pi pwofesyonèl ak pi fasil pou konprann.

Règ:
- Kenbe menm sans lan.
- Korije fot si genyen.
- Amelyore estrikti fraz yo.

Tèks la:

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
Fè yon rezime kout ak klè sou tèks sa a.

Règ:
- Konsève lide prensipal yo.
- Itilize paragraf kout.
- Fè li fasil pou konprann.

Tèks la:

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
Kreye yon script TikTok pwofesyonèl sou sijè sa a:

${text}

Règ:

- Reponn tankou ChatGPT.
- Fè repons lan pwòp, byen estriktire, ak fasil pou li.
- Itilize tit ak emojis.
- Separe chak seksyon ak espas.
- Pa itilize senbòl tankou *** oswa ---.
- Bay sèlman pati ki nesesè yo.
- Fòmate l konsa:

🎣 Hook

🎬 Devlopman

📢 Call To Action

- Script la dwe dire apeprè 60 segonn.
- Itilize yon ton dinamik ak natirèl.
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

Ou se yon pwofesè ak ekspè nan kreye quiz.

Kreye 10 kestyon sou:

${text}

Fòma egzak pou chak kestyon:

━━━━━━━━━━━━━━

❓ Kesyon 1

A) ...
B) ...
C) ...
D) ...

✅ Bon Repons:
...

📖 Eksplikasyon:
...

━━━━━━━━━━━━━━

Kontinye menm fòma a pou 10 kestyon.

Règ:
- Ekri an kreyòl.
- Fè kestyon yo enteresan.
- Mete 4 chwa sèlman.
- Mete yon sèl bon repons.
- Mete eksplikasyon pou chak kestyon.

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
        ✍️ Re-ekri
      </h1>

      {rewrites.length === 0 && (

        <p className="welcome-text">

          Bonjou! 👋

          Ekri tèks ou vle amelyore a.

        </p>

      )}

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
      ⧉ Kopye
    </button>

  )}

</div>

))}

      </div>

      <textarea

        value={text}

        onChange={(e) =>
          setText(e.target.value)
        }

        placeholder="Ekri tèks pou re-ekri a..."

      />

      <button

        onClick={rewriteText}

        disabled={aiLoading}

      >

        {aiLoading

          ? "⏳ AI ap re-ekri tèks ou a..."

          : "✍️ Re-ekri"}

            </button>

    </div>

    </div>

  );

}

<textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Ekri tèks pou re-ekri a..."
/>

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
        📄 Rezime
      </h1>
      

      {summaries.length === 0 && (

        <p className="welcome-text">

          Kole yon tèks pou AI a fè yon rezime.

        </p>

      )}

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
      ⧉ Kopye
    </button>

  )}

</div>

))}

      </div>

      <textarea

        value={text}

        onChange={(e) =>
          setText(e.target.value)
        }

        placeholder="Kole tèks la isit..."

      />

      <button

        onClick={summarizeText}

        disabled={aiLoading}

      >

        {aiLoading

          ? "⏳ Rezime a ap fèt..."

          : "📄 Rezime"}

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

      <h1>🌍 Tradui</h1>

      <div className="chat-container">

        {translations.map((msg, index) => (

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
      ⧉ Kopye
    </button>

  )}

</div>

))}

      </div>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Ekri tèks pou tradui..."
      />

      <button
  onClick={translateText}
  disabled={aiLoading}
>

  {aiLoading
    ? "⏳ Tradiksyon an ap fèt..."
    : "🌍 Tradui"}

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
        🎬 Script TikTok
      </h1>

      {tiktokScripts.length === 0 && (

        <p className="welcome-text">

          Ekri yon sijè epi AI a ap kreye yon script TikTok.

        </p>

      )}

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
      ⧉ Kopye
    </button>

  )}

</div>

))}

      </div>

      <textarea

        value={text}

        onChange={(e) =>
          setText(e.target.value)
        }

        placeholder="Ekri sijè videyo a..."

      />

      <button

        onClick={generateTikTokScript}

        disabled={aiLoading}

      >

        {aiLoading

          ? "⏳ Script la ap kreye..."

          : "🎬 Kreye Script"}

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
        ❓ Kreye Quiz
      </h1>

      <p className="welcome-text">
         TEST QUIZ
      </p>

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
      ⧉ Kopye
    </button>

  )}

</div>

))}

      </div>

      <textarea

        value={text}

        onChange={(e) =>
          setText(e.target.value)
        }

        placeholder="Ekri sijè quiz la..."

      />

      <button

        onClick={generateQuiz}

        disabled={aiLoading}

      >

        {aiLoading

          ? "⏳ Quiz la ap kreye..."

          : "❓ Kreye Quiz"}

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
            🤖 Mande AI
          </h1>

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
      ⧉ Kopye
    </button>

  )}

</div>

          ))}

        </div>

        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Poze AI a kesyon..."
        />

        <button
          onClick={askAI}
          disabled={aiLoading}
        >

          {aiLoading
            ? "⏳ AI ap reflechi..."
            : "🤖 Voye"}

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

  {activePage !== "menu" && (

  <button
    className="menu-btn"
    onClick={() =>
      setActivePage("menu")
    }
  >
    ☰
  </button>

)}

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

    <select className="flag-select">

      <option>🇭🇹</option>
      <option>🇺🇸</option>
      <option>🇫🇷</option>
      <option>🇪🇸</option>

    </select>

    <button
  className="login-btn"
  onClick={() =>
    setShowLogin(true)
  }
>
  👤
</button>



  </div>

</div>

    {activePage === "menu" && (

<div className="menu-page">

  <h2>☰ Menu</h2>

  <button
  onClick={() =>
    setActivePage("home")
  }
>
  ❌ Fèmen
</button>

  <button
    onClick={() =>
      setActivePage("home")
    }
  >
    🏠 Home
  </button>

  <button
    onClick={() =>
      setActivePage("history")
    }
  >
    📜 Istorik
  </button>

  <button
    onClick={() =>
      setActivePage("stats")
    }
  >
    📊 Estatistik
  </button>

  <button
    onClick={() =>
      setActivePage("about")
    }
  >
    ℹ️ A Pwopo
  </button>

</div>

)}

{activePage === "history" && (

<div className="menu-content">

  <h2 className="dashboard-title">
    📜 Istorik Aktivite
  </h2>

  <p className="dashboard-subtitle">
    Tout aktivite ou yo anrejistre isit.
  </p>

  <div className="history-summary">

    <div className="stat-card">

      <h3>📂</h3>

      <h2>{history.length}</h2>

      <p>Total Aktivite</p>

    </div>

  </div>

  <input
    type="text"
    className="search-input"
    placeholder="🔍 Chèche nan istorik..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
  />

  {history.length === 0 ? (

    <div className="empty-history">

      <h3>📭 Pa gen istorik disponib</h3>

      <p>
        Jenere premye odyo ou oswa itilize AI a
        pou wè aktivite yo isit.
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

      🎙️ Odyo

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
    📊 Dashboard Bely AI
  </h2>

  <p className="dashboard-subtitle">
    Swiv tout aktivite w' yo nan tan reyèl
  </p>

  <div className="stats-grid">

  <div className="stat-card">
    <h3>🎙️</h3>
    <h2>{stats.totalAudios}</h2>
    <p>Odyo Kreye</p>
  </div>

  <div className="stat-card">
    <h3>🤖</h3>
    <h2>{stats.totalAI}</h2>
    <p>Itilizasyon AI</p>
  </div>

  <div className="stat-card">
    <h3>📂</h3>
    <h2>{history.length}</h2>
    <p>Total Aktivite</p>
  </div>

  <div className="stat-card">
    <h3>📝</h3>
    <h2>{stats.totalWords}</h2>
    <p>Mo Trete</p>
  </div>

  <div className="stat-card stat-card-wide">
    <h3>🕒</h3>
    <p>{stats.lastUsed || "Pa gen done"}</p>
    <span>Dènye Aktivite</span>
  </div>

</div>

</div>

)}

{activePage === "about" && (

<div className="menu-content">

  <h2>ℹ️ A Pwopo</h2>

  <p>
    Bely AI Studio se yon platfòm
    ki pèmèt itilizatè nou yo
    konvèti tèks an odyo.
  </p>

  <p>
    Powered by AI Technology.
  </p>

  <p>
    Version 1.0 Beta
  </p>

  <p>
    © 2026 Bely AI Studio
  </p>

</div>

)}

    {activePage === "home" && (
<>

      <div className="header">

</div>

      <div className="generator-card">

  <br />
  <br />

  <h3 style={{ color: "white" }}>
    🎙️ Chwazi Vwa AI
  </h3>

  <select
    value={voice}
    onChange={(e) =>
      setVoice(e.target.value)
    }
  >

    <option value="male">
      Haitian Male
    </option>

    <option value="female">
      Haitian Female
    </option>

    <option value="narrator">
      Narrator
    </option>

  </select>

  <br />
  <br />

  <br />
  <br />

  <div className={`tools-grid ${audioUrl ? "compact" : ""}`}>

  <div
    className="tool-card"
    onClick={() => setActivePage("ask-ai")}
  >
    <div className="tool-icon">🤖</div>

    {!audioUrl && <p>Mande AI</p>}
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("translate")}
  >
    <div className="tool-icon">🌍</div>

    {!audioUrl && <p>Tradui</p>}
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("rewrite")}
  >
    <div className="tool-icon">✍️</div>

    {!audioUrl && <p>Re-ekri</p>}
  </div>

  <div
  className="tool-card"
  onClick={() => setActivePage("summary")}
>
    <div className="tool-icon">📝</div>

    {!audioUrl && <p>Rezime</p>}
  </div>

  <div
    className="tool-card"
    onClick={() =>
  setActivePage("tiktok")
}
  >
    <div className="tool-icon">🎬</div>

    {!audioUrl && <p>Script TikTok</p>}
  </div>

  <div
    className="tool-card"
    onClick={() => setActivePage("quiz")}
  >
    <div className="tool-icon">❓</div>

    {!audioUrl && <p>Kreye Quiz</p>}
  </div>

</div>

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

    placeholder="Ekri la..."

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

</div>

<div className="text-stats">

  <span
  style={{
    color:
      text.length > 4500
      ? "#ef4444"
      : "#22c55e"
  }}
>

  {text.length}/5000 karaktè

</span>

  <span>
    📝 Mo: {wordCount}
  </span>

  <span>
    ⏱️ Tan estime:
    {estimatedSeconds} segonn
  </span>

</div>

</div>

      <br />
      <br />

      <div className="button-row">

<button
  onClick={generateAudio}
  disabled={loading}
>

  {loading

    ? language === "ht"
      ? "⏳ Odyo a ap jenere..."
      : "⏳ Generating audio..."

    : language === "ht"
      ? "🎙️ Jenere Odyo"
      : "🎙️ Generate Audio"}

</button>


</div>

      <br />
<br />

{audioUrl && (

  <div className="audio-container">

    <h3>🎵 Odyo w la fin' jenere</h3>

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
      ⬇️ Telechaje MP3
    </a>

  </div>

)}

{showAbout && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>
  🎙️ Bely AI Studio
</h2>

<p>

  Bely AI Studio se yon
  aplikasyon ki itilize
  entèlijans atifisyèl pou
  konvèti tèks an odyo.

</p>

<p>

  Fonksyon prensipal yo:

</p>

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
      placeholder="Email"
      value={email}
      onChange={(e)=>
        setEmail(e.target.value)
      }
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e)=>
        setPassword(e.target.value)
      }
    />

    <button className="auth-btn">
      Login
    </button>

    <p>

      Pa gen kont?

      <span
        className="signup-link"
        onClick={() => {

          setShowLogin(false);

          setShowSignup(true);

        }}
      >

        Kreye youn

      </span>

    </p>

    <button
      className="close-btn"
      onClick={() =>
        setShowLogin(false)
      }
    >
      Fèmen
    </button>

  </div>

</div>

)}

{showSignup && (

<div className="modal-overlay">

  <div className="auth-modal">

    <h2>
      Kreye Kont
    </h2>

    <input
      type="text"
      placeholder="Non"
    />

    <input
      type="email"
      placeholder="Email"
    />

    <input
      type="password"
      placeholder="Password"
    />

    <button className="auth-btn">
      Kreye Kont
    </button>

    <p>

      Ou deja gen kont?

      <span
        className="signup-link"
        onClick={() => {

          setShowSignup(false);

          setShowLogin(true);

        }}
      >

        Login

      </span>

    </p>

    <button
      className="close-btn"
      onClick={() =>
        setShowSignup(false)
      }
    >
      Fèmen
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
    © 2026 Bely AI Studio. Tout dwa rezève.
  </small>

</footer>

</>
)}

    </div>

  );

}

export default App;