import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(0);

  const [voice, setVoice] =
  useState("male");

  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

const [stats, setStats] = useState({

  totalAudios: 0,

  totalWords: 0,

  lastUsed: ""

});

  const wordCount =
  text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

const estimatedSeconds =
  Math.ceil(wordCount / 2.5);

  useEffect(() => {

    const loadVoices = () => {

      const available =
        speechSynthesis.getVoices();

      setVoices(available);

    };


    loadVoices();

    speechSynthesis.onvoiceschanged =
      loadVoices;

  }, []);

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

setHistory((prev) => [

  {
    text: text,
    date: new Date()
      .toLocaleTimeString()
  },

  ...prev

].slice(0, 5));

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

      setAiResponse(data.answer);

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

      <div className="header">

  <h1 className="title">
    🎙️ Bely AI Studio
  </h1>

  <p className="subtitle">
    Haitian AI Voice Generator
  </p>

</div>

      <p>
        Konvèti tèks kreyòl an odyo
      </p>

      <h3 style={{ color: "white" }}>
  Chwazi Vwa AI
</h3>

<select
  value={voice}
  onChange={(e) =>
    setVoice(e.target.value)
  }
>

  <option value="male">
    🎙️ Haitian Male
  </option>

  <option value="female">
    🎙️ Haitian Female
  </option>

  <option value="narrator">
    🎙️ Narrator
  </option>

</select>

<br />
<br />

      <select
        value={selectedVoice}
        onChange={(e) =>
          setSelectedVoice(
            e.target.value
          )
        }
      >

        {voices.map((voice, index) => (

          <option
            key={index}
            value={index}
          >

            {voice.name}

          </option>

        ))}

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
        placeholder="Ekri tèks ou a la..."
        value={text}
        onChange={(e) =>
          setText(
            e.target.value
          )
        }
      />

      <p style={{ color: "white" }}>
  {text.length}/5000 karaktè
</p>

<p style={{ color: "white" }}>
  📝 Mo: {wordCount}
</p>

<p style={{ color: "white" }}>
  ⏱️ Tan estime:
  {estimatedSeconds} segonn
</p>

      <br />
      <br />

      <button
  onClick={generateAudio}
  disabled={loading}
>
  {loading
    ? "⏳ Odyo w' la ap jenere, Pasyante..."
    : "🎙️ Jenere Odyo"}
</button>

<br />
<br />

<button
  onClick={askAI}
  disabled={aiLoading}
>
  {aiLoading
    ? "⏳ AI ap reflechi..."
    : "🤖 Mande AI"}
</button>

      <br />
<br />

{audioUrl && (

  <>

    <p
      style={{
        color: "lightgreen"
      }}
    >
      ✅ Odyo w' la pare!
    </p>

    <h3
      style={{
        color: "white"
      }}
    >
      🎵 Odyo w' la fin' Jenere!
    </h3>

    <audio
      controls
      autoPlay
      src={audioUrl}
    />

  </>

)}

<br />
<br />

{audioUrl && (

  <a
  className="download-btn"
  href={audioUrl}
  download="bely-audio.mp3"
>
    <button>
      ⬇️ Telechaje Odyo
    </button>
  </a>

)}

{history.length > 0 && (

  <>

  <button
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

    <h2
      style={{
        color: "white"
      }}
    >
      📜 Dènye Odyo w' yo
    </h2>

    {history.map(
      (item, index) => (

        <div
  key={index}
  className="history-card"
>
          <strong>
            {item.date}
          </strong>

          <br />

          {item.text
            .substring(0,60)}

          ...

        </div>

      )
    )}

  </>

)}

<h2
  style={{
    color: "white"
  }}
>
  📊 Estatistik
</h2>

<div className="stats-card">

  <p>
    🎙️ Total Odyo:
    {stats.totalAudios}
  </p>

  <p>
    📝 Total Mo:
    {stats.totalWords}
  </p>

  <p>
    🕒 Dènye Itilizasyon:
    {stats.lastUsed}
  </p>

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

    <div
      className="history-card"
    >
      {aiResponse}
    </div>

  </>

)}

<footer>

  Bely Studio © 2026

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