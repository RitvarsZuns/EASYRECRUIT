import React, { useRef, useState } from "react";
import "./CVDocumentsView.css"; // Importē pielāgoto CSS scrollbar paslēpšanai

const initialCVs = [
  { id: 1, filename: "john.doe.pdf" },
  { id: 2, filename: "alice.smith.pdf" },
  { id: 3, filename: "robert.james.pdf" },
  { id: 4, filename: "emily.jones.pdf" },
  { id: 5, filename: "michael.brown.pdf" },
  { id: 6, filename: "sophia.wilson.pdf" },
  { id: 7, filename: "liam.davis.pdf" },
  { id: 8, filename: "olivia.martin.pdf" },
  { id: 9, filename: "noah.thomas.pdf" },
  { id: 10, filename: "ava.jackson.pdf" },
  { id: 11, filename: "elijah.white.pdf" },
  { id: 12, filename: "elbert.hanson.pdf" },
  { id: 13, filename: "Jenifer.edison.pdf" },
  { id: 14, filename: "Alexa.Nixon.pdf" },
  { id: 15, filename: "Albert.Einstein.pdf" },
  { id: 16, filename: "Andris.Biezais.pdf" },
  { id: 17, filename: "Andrejs.Lielais.pdf" },
  { id: 18, filename: "Janis.Kalejs.pdf" },
  { id: 19, filename: "Gunta.Laimone.pdf" },
  { id: 20, filename: "Hermane.Valinska.pdf" },
  { id: 21, filename: "Guntis.Felzenbahers.pdf" },
  { id: 22, filename: "Hanna.Vilcane.pdf" },
  { id: 23, filename: "Harijs.Fenihs.pdf" },
];

const CVDocumentsView = () => {
  const [cvList, setCvList] = useState(initialCVs);
  const [selectedCV, setSelectedCV] = useState(initialCVs[0]);
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const removeCV = (id) => {
    const updatedList = cvList.filter((cv) => cv.id !== id);
    setCvList(updatedList);

    if (selectedCV?.id === id && updatedList.length > 0) {
      setSelectedCV(updatedList[0]);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">CV Documents</h1>

      {/* Slider sekcija ar pelēko fonu un ārējām bultām */}
      <div className="relative mb-6 flex justify-center items-center">
        <div className="bg-[#1e1e2f] rounded px-12 py-4 flex items-center w-[90%] relative">
          {/* Kreisā bulta ārpus pelēkā fona */}
          <button
            onClick={scrollLeft}
            className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-20 text-white text-3xl hover:text-purple-400 bg-transparent border-none shadow-none outline-none"
          >
            ◀
          </button>

          {/* PDF saraksts */}
          <div
            ref={scrollRef}
            className="flex items-center space-x-4 overflow-x-auto hide-scrollbar w-full mx-auto"
          >
            {cvList.map((cv) => (
              <div key={cv.id} className="relative flex flex-col items-center space-y-2">
                {/* ❌ Noņemšanas poga */}
                <button
                  onClick={() => removeCV(cv.id)}
                  className="absolute -top-0 -right-0 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-300 z-30"
                  title="Remove CV"
                >
                  ×
                </button>

                {/* PDF ikona */}
                <div
                  onClick={() => setSelectedCV(cv)}
                  className={`w-20 h-24 flex items-center justify-center rounded cursor-pointer ${
                    selectedCV.id === cv.id ? "bg-purple-700" : "bg-gray-800"
                  } hover:bg-purple-600`}
                >
                  <img
                    src="/pdf-logo.png"
                    alt="PDF preview"
                    className="w-15 h-15"
                  />
                </div>

                {/* Failsa nosaukums */}
                <span className="text-xs text-center max-w-[80px] truncate">
                  {cv.filename}
                </span>
              </div>
            ))}
          </div>

          {/* Labā bulta ārpus pelēkā fona */}
          <button
            onClick={scrollRight}
            className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-20 text-white text-3xl hover:text-purple-400 bg-transparent border-none shadow-none outline-none"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Prompt ievade + rezultāts */}
      <div className="bg-[#1e1e2f] p-4 rounded space-y-4">
        <div className="min-h-[80px]">
          <p className="text-sm">{prompt || "No prompt submitted yet."}</p>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            placeholder="Input what you expect from a candidate"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-gray-800 text-white p-2 rounded mr-4"
          />
          <button className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVDocumentsView;
