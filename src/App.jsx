// App.jsx
import { useState } from "react";
import "./App.css";
import horcrux from "../horcrux/build/main.aleo?raw";
import { AleoWorker } from "./workers/AleoWorker.js";
import Footer from "./Footer.jsx";

const aleoWorker = AleoWorker();

function App() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState([]);
  const [reconstructedSecret, setReconstructedSecret] = useState("");
  const [inputShares, setInputShares] = useState([
    { share_val: "", index: "" },
    { share_val: "", index: "" },
    { share_val: "", index: "" },
  ]);

  const generateRandomCoefficient = () => {
    const max = 1000000000000000;
    return (Math.floor(Math.random() * max) + max).toString() + "field";
  };

  function parseAleoResponse(response) {
    // Replace 'field' with '"field"' and add double quotes around keys and their values
    const formattedJson = response
      .replace(/(\b\w+): (\d+)field/g, '"$1": "$2field"')
      .replace(/, /g, ","); // Remove extra spaces after commas if any

    // Parse the formatted string as JSON
    return JSON.parse(formattedJson);
  }

  const generateShares = async () => {
    setLoading(true);
    const firstCoeff = generateRandomCoefficient();
    const secondCoeff = generateRandomCoefficient();
    const result = await aleoWorker.localProgramExecution(
      horcrux,
      "split_and_share",
      [secret + "field", firstCoeff, secondCoeff]
    );
    const parsedShares = parseAleoResponse(result.toString());
    setShares(parsedShares);
    setLoading(false);
  };

  const handleShareInputChange = (index, field, value) => {
    const newInputShares = inputShares.map((share, shareIndex) => {
      if (shareIndex === index) {
        return { ...share, [field]: value };
      }
      return share;
    });
    setInputShares(newInputShares);
  };

  const reconstructSecret = async () => {
    setLoading(true);
    const inputSharesFormatted = inputShares.map((share) => ({
      share_val: share.share_val + "field",
      index: share.index + "field",
    }));
    // remove double quotes from input shares formatted
    const inputSharesFormattedString = JSON.stringify(inputSharesFormatted);
    const inputSharesFormattedStringNoQuotes =
      inputSharesFormattedString.replace(/"/g, "");
    console.log(inputSharesFormattedStringNoQuotes);
    const result = await aleoWorker.localProgramExecution(
      horcrux,
      "reconstruct_secret",
      [inputSharesFormattedStringNoQuotes]
    );
    // Remove 'field' suffix from the result
    const resultWithoutField = result.replace(/field/g, "");
    setReconstructedSecret(resultWithoutField);
    setLoading(false);
  };

  return (
    <div className="App">
      {loading && (
        <div className="loader">
          Generating zk proof, this may take a couple of minutes...
        </div>
      )}
      <h1>Shamir's Secret Sharing</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          disabled={loading}
        />
        <button onClick={generateShares} disabled={loading}>
          Generate Shares
        </button>
      </div>
      <div className="shares-section">
        {shares.map((share, index) => (
          <div key={index} className="share">
            Share {index + 1}: Value: {share.share_val} Index: {share.index}
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
              value={share.share_val}
              onChange={(e) =>
                handleShareInputChange(index, "share_val", e.target.value)
              }
              disabled={loading}
            />
            <input
              type="text"
              placeholder={`Share ${index + 1} Index`}
              value={share.index}
              onChange={(e) =>
                handleShareInputChange(index, "index", e.target.value)
              }
              disabled={loading}
            />
          </div>
        ))}

        <button onClick={reconstructSecret} disabled={loading}>
          Reconstruct Secret
        </button>
        {reconstructedSecret && (
          <div>Reconstructed Secret: {reconstructedSecret}</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
