import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.jpeg";

function App() {

  const [text, setText] = useState("");
  const [showLogin,
setShowLogin] =
useState(false);
const [messages, setMessages] =
useState([]);

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

    if (text.trim() === "") {
      alert("Tanpri antre yon tèks");
      return;
    }

    try {

      setLoading(true);

      const response =
        await fetch(
  "https://bely-studio-backend.onrender.com/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
  text: text,
  voice: voice
})
          }
        );

      const data =
        await response.json();

      console.log(data);

      setAudioUrl(
  `https://bely-studio-backend.onrender.com/audio/${data.audio}?t=${Date.now()}`
);

const audioLink =
`https://bely-studio-backend.onrender.com/audio/${data.audio}?t=${Date.now()}`;

setAudioUrl(audioLink);

setHistory((prev) => [

  {
    text: text,
    date: new Date()
      .toLocaleTimeString(),
    audio: audioLink
  },

  ...prev

].slice(0, 10));

setStats((prev) => ({

  totalAudios:
    prev.totalAudios + 1,

  totalWords:
    prev.totalWords + wordCount,

  lastUsed:
    new Date()
      .toLocaleTimeString()

}));

setLoading(false);

    }

    catch (error) {

      setLoading(false);

      console.error(error);

      alert(
        "Erè koneksyon ak backend la"
      );

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
    onClick={() =>
      setActivePage("menu")
    }
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

  Login

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

  <h2>📜 Istorik</h2>

{history.length === 0 ? (

<p>
  Pa gen istorik disponib.
</p>

) : (

<>

<input
  type="text"
  className="search-input"
  placeholder="🔍 Chèche nan istorik..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
/>

{history
  .filter((item) =>
    item.text
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )
  .map((item,index)=>(

<div
  key={index}
  className="history-card"
>

  <strong>
    {item.date}
  </strong>

  <br/>

  {item.text.substring(0,80)}

</div>

))}

</>

)}

</div>

)}

{activePage === "stats" && (

<div className="menu-content">

  <h2>📊 Estatistik</h2>

<p>
  🎙️ Total Odyo:
  {stats.totalAudios}
</p>

<p>
  📝 Total Mo:
  {stats.totalWords}
</p>

<p>
  🤖 Total kesyon AI:
  {stats.totalAI || 0}
</p>

<p>
  🕒 Dènye Itilizasyon:
  {stats.lastUsed}
</p>

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

  {aiResponse && (

  <>

    <br />

    <h2
      style={{
        color: "white"
      }}
    >
      🤖 Repons AI
    </h2>

    <div className="ai-response">

  <button
    className="copy-icon"
    onClick={() => {

      navigator.clipboard.writeText(
        aiResponse
      );

    }}
  >

    📋

  </button>

  {aiResponse}

</div>

  </>

)}

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

<button
  onClick={askAI}
  disabled={aiLoading}
>
  {aiLoading
    ? "⏳ AI ap reflechi..."
    : "🤖 Mande AI"}
</button>

</div>

      <br />
<br />

{audioUrl && (

  <div className="audio-card">

    <h2>
      🎵 Odyo a Pare
    </h2>

    <p>
      Odyo w' la fin' jenere avèk siksè.
    </p>

    <audio
      controls
      autoPlay
      src={audioUrl}
    />

  </div>

)}

<br />
<br />

{audioUrl && (

  <div className="download-wrapper">

    <a
      className="download-btn"
      href={audioUrl}
      download="bely-audio.mp3"
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

    <div className="modal">

      <h2>

        👤 Login

      </h2>

      <input
        type="email"
        placeholder="Email"
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
      />

      <br />
      <br />

      <button>

        Login

      </button>

      <br />
      <br />

      <button
        onClick={() =>
          setShowLogin(false)
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