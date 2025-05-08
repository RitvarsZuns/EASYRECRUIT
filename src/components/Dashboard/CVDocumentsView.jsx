import React, { useRef, useState } from "react";
import "./CVDocumentsView.css"; // Importē pielāgoto CSS scrollbar paslēpšanai

const CVDocumentsView = () => {
  const [cvList, setCvList] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [previewURL, setPreviewURL] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const smoothScroll = (direction = "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const step = 10;
    const distance = 200;
    const delay = 5;
    let scrolled = 0;

    const scrollStep = () => {
      const amount = direction === "left" ? -step : step;
      container.scrollBy({ left: amount, behavior: "auto" });
      scrolled += step;
      if (scrolled < distance) {
        setTimeout(scrollStep, delay);
      }
    };

    scrollStep();
  };

  const scrollLeft = () => smoothScroll("left");
  const scrollRight = () => smoothScroll("right");

  const removeCV = (id) => {
    const updatedList = cvList.filter((cv) => cv.id !== id);
    setCvList(updatedList);
    if (selectedCV?.id === id) {
      setSelectedCV(updatedList.length > 0 ? updatedList[0] : null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PDF, DOC, DOCX, and ODT are allowed.");
      return;
    }

    const newCV = {
      id: Date.now(),
      filename: file.name,
      file: URL.createObjectURL(file)
    };

    setCvList((prev) => [...prev, newCV]);
    event.target.value = null; // reset input
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">CV Documents</h1>


      {/* Slider sekcija */}
      <div className="relative mb-6 flex justify-center items-center">
        <div className="bg-[#1e1e2f] rounded px-12 py-4 flex items-center w-[90%] relative">
          <button
            onClick={scrollLeft}
            className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-20 text-white text-3xl hover:text-purple-400 bg-transparent border-none shadow-none outline-none"
          >
            <img src="/left-arrow.png" alt="Scroll left" className="w-10 h-10" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center space-x-4 overflow-x-auto hide-scrollbar w-full mx-auto"
          >
            {cvList.length === 0 ? (
              <div className="w-full text-center text-gray-400">No CVs to show</div>
            ) : (
              cvList.map((cv) => (
                <div key={cv.id} className="relative flex flex-col items-center space-y-2">
                  <button
                    onClick={() => removeCV(cv.id)}
                    className="absolute -top-0 -right-0 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-300 z-30"
                    title="Remove CV"
                  >
                    ×
                  </button>

                  <div
                    onClick={() => setPreviewURL(cv.file)}
                    className={`w-20 h-24 flex items-center justify-center rounded cursor-pointer ${
                      selectedCV?.id === cv.id ? "bg-purple-700" : "bg-gray-800"
                    } hover:bg-purple-600`}
                  >
                    <img src="/pdf-logo.png" alt="PDF preview" className="w-15 h-15" />
                  </div>

                  <span className="text-xs text-center max-w-[80px] truncate">
                    {cv.filename}
                  </span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-20 text-white text-3xl hover:text-purple-400 bg-transparent border-none shadow-none outline-none"
          >
            <img src="/right-arrow.png" alt="Scroll right" className="w-10 h-10" />
          </button>
        </div>
      </div>

      {/* Add un Remove All pogas */}
      <div className="flex justify-center space-x-4 mb-6">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.odt"
          onChange={handleFileChange}
          ref={fileInputRef}
          hidden
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
        <button
          onClick={() => setCvList([])}
          className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Remove all
        </button>
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

      {/* Preview Modal */}
      {previewURL && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white w-[80%] h-[80%] p-4 rounded relative">
            <button
              onClick={() => setPreviewURL(null)}
              className="absolute top-2 right-2 bg-black text-white w-6 h-6 rounded-full"
            >
              ×
            </button>
            <iframe
              src={previewURL}
              title="CV Preview"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVDocumentsView;
