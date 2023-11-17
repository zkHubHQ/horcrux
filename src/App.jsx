// App.jsx
import { useState } from "react";
import "./App.css";
import horcrux from "../horcrux/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker.js";
import Footer from "./Footer.jsx";

const aleoWorker = AleoWorker();

function App() {
  const [secret, setSecret] = useState("");
  const [shares, setShares] = useState([]);
  const [reconstructedSecret, setReconstructedSecret] = useState("");
  const [inputShares, setInputShares] = useState([{}, {}, {}]); // Array of 3 empty objects for input shares

  const generateRandomCoefficient = () => {
    // Generate a large random integer for the coefficient
    const max = 1000000000000000;
    return (Math.floor(Math.random() * max) + max).toString() + "field";
  };

  const generateShares = async () => {
    const firstCoeff = generateRandomCoefficient();
    const secondCoeff = generateRandomCoefficient();
    const result = await aleoWorker.localProgramExecution(
      horcrux,
      "split_and_share",
      [secret, firstCoeff, secondCoeff]
    );
    setShares(result);
  };

  const handleShareInputChange = (index, field, value) => {
    const newInputShares = [...inputShares];
    newInputShares[index][field] = value;
    setInputShares(newInputShares);
  };

  const reconstructSecret = async () => {
    const result = await aleoWorker.localProgramExecution(
      horcrux,
      "reconstruct_from_shares",
      [inputShares]
    );
    setReconstructedSecret(result);
  };

  return (
    <div className="App">
      <h1>Shamir's Secret Sharing</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button onClick={generateShares}>Generate Shares</button>
      </div>
      <div className="shares-section">
        {shares.map((share, index) => (
          <div key={index} className="share">
            Share {index + 1}: {JSON.stringify(share)}
          </div>
        ))}
      </div>
      <div className="reconstruction-section">
        <h2>Reconstruct Secret</h2>
        {inputShares.map((share, index) => (
          <div key={index} className="input-share">
            <input
              type="text"
              placeholder={`Share ${index + 1} Value`}
              value={share.share_val || ""}
              onChange={(e) =>
                handleShareInputChange(index, "share_val", e.target.value)
              }
            />
            <input
              type="text"
              placeholder={`Share ${index + 1} Index`}
              value={share.index || ""}
              onChange={(e) =>
                handleShareInputChange(index, "index", e.target.value)
              }
            />
          </div>
        ))}
        <button onClick={reconstructSecret}>Reconstruct Secret</button>
        {reconstructedSecret && (
          <div>Reconstructed Secret: {reconstructedSecret}</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
