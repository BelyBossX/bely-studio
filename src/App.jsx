import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [text, setText] = useState("");


  const [voice, setVoice] =
  useState("male");
  const [language, setLanguage] =
  useState("ht");
  const [search, setSearch] =
useState("");

  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

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

    <nav className="navbar">

      <div className="nav-logo">
        🎙️ Bely Studio
      </div>

      <div className="nav-links">

        <button
          onClick={() =>
            window.scrollTo({
              top:0,
              behavior:"smooth"
            })
          }
        >
          Home
        </button>

        <button
  onClick={() => {

    console.log(
      "About klike"
    );

    setShowAbout(true);

  }}
>
  About
</button>

      </div>

    </nav>

      <div className="header">

  <div className="logo-box">
  🎙️
</div>

<h1 className="title">
  Bely <span>AI Studio</span>
</h1>

<p className="subtitle">
  Haitian AI Voice Generator
</p>

<div className="version-badge">

  Version 1.0 Beta

</div>

<p className="tagline">

  {language === "ht"

    ? "🎵 Konvèti tèks kreyòl an odyo 🎵"

    : "🎵 Convert text into speech 🎵"}

</p>

<select
  className="language-select"
  value={language}
  onChange={(e) =>
    setLanguage(
      e.target.value
    )
  }
>

  <option value="ht">
    🇭🇹 Kreyòl
  </option>

  <option value="en">
    🇺🇸 English
  </option>

</select>

<br />

<div className="top-stats">

  <div className="mini-stat">

    <span>🎙️</span>

    <h3>
      {stats.totalAudios}
    </h3>

    <p>
      Odyo Kreye
    </p>

  </div>

  <div className="mini-stat">

    <span>📝</span>

    <h3>
      {stats.totalWords}
    </h3>

    <p>
      Mo Konvèti
    </p>

  </div>

  <div className="mini-stat">

    <span>🤖</span>

    <h3>
      {aiResponse ? 1 : 0}
    </h3>

    <p>
      Repons AI
    </p>

  </div>

</div>

</div>

      <p>
        Konvèti tèks kreyòl an odyo
      </p>

      <div className="generator-card">

  <h3 style={{ color: "white" }}>
    🌎 Chwazi Lang
  </h3>

  <select
    value={language}
    onChange={(e) =>
      setLanguage(e.target.value)
    }
  >

    <option value="ht">
      🇭🇹 Kreyòl Ayisyen
    </option>

    <option value="en">
      🇺🇸 English
    </option>

  </select>

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

  <h3 style={{ color: "white" }}>
    📄 Chwazi yon fichye TXT
  </h3>

  <input
    type="file"
    accept=".txt"
    onChange={handleFileUpload}
  />

  <br />
  <br />

  <textarea
    maxLength={5000}
    placeholder={
      language === "ht"
        ? "Ekri tèks ou a la..."
        : "Write your text here..."
    }
    value={text}
    onChange={(e) =>
      setText(e.target.value)
    }
  />

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

{!audioUrl && (

  <div className="empty-state">

    <div className="status-card">

  <h3>
    🚀 Estati
  </h3>

  {text.length === 0 ? (

    <p>
      Ekri yon tèks oswa upload yon TXT pou kòmanse.
    </p>

  ) : (

    <p>
      ✅ Pare pou jenere odyo.
    </p>

  )}

</div>

    <p>

      Ekri yon tèks
      oswa upload yon TXT
      pou kreye premye odyo ou.

    </p>

  </div>

)}

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

{history.length > 0 && (

  <>

  <button
  className="delete-history"
  onClick={() => {

    setHistory([]);

    localStorage.removeItem(
      "belyHistory"
    );

  }}
>
  🗑️ Efase Istorik
</button>

<br />
<br />

    <div className="section-title">

  <h2>
    📜 Dènye Odyo w yo
  </h2>

  <input
  type="text"
  placeholder="🔍 Chèche nan istorik..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="search-input"
/>

</div>

<input
  type="text"
  placeholder="🔍 Chèche nan istorik..."
/>

    {history
.filter((item) =>
  item.text
    .toLowerCase()
    .includes(
      search.toLowerCase()
    )
)
.map(
  (item, index) => (

    <div
      key={index}
      className="history-card"
    >

      <div className="history-left">

        <button
  className="play-btn"
  onClick={() => {

    setAudioUrl(item.audio);

  }}
>
  ▶
</button>

      </div>

      <div className="history-right">

        <strong>
          {item.date}
        </strong>

        <p>
          <a
  href={item.audio}
  download
  className="history-download"
>
  ⬇️ Telechaje
</a>
          {item.text.substring(0,60)}
          ...
        </p>

      </div>

    </div>

  )
)}

  </>

)}

<h2 className="section-title">
  📊 Estatistik
</h2>

<div className="stats-grid">

  <div className="stat-box">

    <h3>🎙️</h3>

    <h2>{stats.totalAudios}</h2>

    <p>Total Odyo</p>

  </div>

  <div className="stat-box">

    <h3>📝</h3>

    <h2>{stats.totalWords}</h2>

    <p>Total Mo</p>

  </div>

  <div className="stat-box">

    <h3>🕒</h3>

    <h2>
      {stats.lastUsed || "--"}
    </h2>

    <p>
  🕒 Dènye Itilizasyon:
  {stats.lastUsed}
</p>

    <p>
  🤖 Total kestyon AI:
  {stats.totalAI}
</p>

  </div>

</div>

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
  {aiResponse}
</div>

<button
  className="copy-btn"
  onClick={() => {

    navigator.clipboard
      .writeText(aiResponse);

    alert(
      "Repons lan kopye."
    );

  }}
>

  📋 Kopye Repons

</button>

  </>

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

<footer>

  <h3>
    🎙️ Bely AI Studio
  </h3>

  <p>
    Haitian AI Voice Generator
  </p>

  <small>
    © 2026 Bely Studio. Tout dwa rezève.
  </small>

</footer>

<h3 style={{ color: "white" }}>
  Tèks la:
</h3>

<p style={{ color: "white" }}>
  {text}
</p>

    </div>

  );

}

export default App;