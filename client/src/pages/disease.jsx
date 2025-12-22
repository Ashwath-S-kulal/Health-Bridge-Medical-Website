import { useState } from "react";
import Papa from "papaparse";
import Header from "../Components/Header";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [inputs, setInputs] = useState({
    Fever: "Yes",
    Cough: "Yes",
    Fatigue: "Yes",
    "Difficulty Breathing": "Yes",
    Age: 25,
    Gender: "Male",
    "Blood Pressure": "Normal",
    "Cholesterol Level": "Normal",
  });
  const [prediction, setPrediction] = useState(null);

  // Load CSV from local file (public folder)
  const loadCSV = () => {
    Papa.parse("../../public/dataset/Disease_symptom_and_patient_profile_dataset.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePredict = () => {
    const match = csvData.find((row) =>
      Object.keys(inputs).every((key) => {
        if (key === "Age") return Number(row[key]) === Number(inputs[key]);
        return row[key] === inputs[key];
      })
    );
    if (match) {
      setPrediction({ Disease: match.Disease, Outcome: match["Outcome Variable"] });
    } else {
      setPrediction({ Disease: "Not Found", Outcome: "Not Found" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <Header/>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 pt-16">
        Health Predictor
      </h1>

      {/* Load CSV button */}
      <div className="mb-6">
        <button
          onClick={loadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Load CSV from Local
        </button>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dropdown select fields */}
        {["Fever", "Cough", "Fatigue", "Difficulty Breathing"].map((key) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 font-medium">{key}</label>
            <select
              name={key}
              value={inputs[key]}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        ))}

        {/* Age */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Age</label>
          <input
            type="number"
            name="Age"
            value={inputs.Age}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Gender</label>
          <select
            name="Gender"
            value={inputs.Gender}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Blood Pressure */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Blood Pressure</label>
          <select
            name="Blood Pressure"
            value={inputs["Blood Pressure"]}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Cholesterol Level */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Cholesterol Level</label>
          <select
            name="Cholesterol Level"
            value={inputs["Cholesterol Level"]}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <button
        onClick={handlePredict}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Predict
      </button>

      {/* Prediction Result */}
      {prediction && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Prediction</h2>
          <p>
            <strong>Disease:</strong> {prediction.Disease}
          </p>
          <p>
            <strong>Outcome Variable:</strong> {prediction.Outcome}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
