// import { text } from "express";
import React from "react";
import { useState } from "react";
import './ReadFile.css';


function ReadFile() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setLoading(true);
        if (!file) {
            alert("Please select a file first");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            // First upload the file
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
                mode: "cors"
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error uploading file");
            }

            const extractedText = await response.json();

            // Then get the summary
            const summaryRes = await fetch('http://localhost:5000/summary', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: extractedText.text }),
                mode: "cors"
            });

            if (!summaryRes.ok) {
                const errorData = await summaryRes.json();
                throw new Error(errorData.error || "Error getting summary");
            }

            const summaryData = await summaryRes.json();
            if (summaryData.Summary) {
                const formattedText = summaryData.Summary.replaceAll("\n", "<br/>");
                setText(formattedText);
            } else {
                throw new Error("No summary available");
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="chapter-container">
            <div className="upload-section">
                <h2 className="chapter-title">Upload Your PDF</h2>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="file-input"
                    accept="application/pdf"
                />
                <button 
                    onClick={handleUpload} 
                    className="upload-button"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Upload & Summarize'}
                </button>
            </div>
            {loading ? (
                <p className="loading-text">Generating summary... Please wait</p>
            ) : (
                <div className="chapter-content">
                    <h2 className="chapter-title">Summary</h2>
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                </div>
            )}
        </div>
    );
};

export default ReadFile;