// import { text } from "express";
import React from "react";
import { useState } from "react";
import './ReadFile.css';


function ReadFile() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(true);


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

    const handleGenerateQuestions = async () => {
        if (!text) {
            alert("Please generate a summary first");
            return;
        }

        // Ask user if they want to hide the summary
        const hideSummary = window.confirm("Would you like to hide the summary while viewing the questions?");
        setShowSummary(!hideSummary);

        setQuestionsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/question', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text }),
                mode: "cors"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error generating questions");
            }

            const data = await response.json();
            setQuestions(data.questions);
        } catch (err) {
            console.error(err);
            alert("Failed to generate questions");
        } finally {
            setQuestionsLoading(false);
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
                    {showSummary && (
                        <>
                            <h2 className="chapter-title">Summary</h2>
                            <div dangerouslySetInnerHTML={{ __html: text }} />
                        </>
                    )}
                    
                    {text && (
                        <button 
                            onClick={handleGenerateQuestions} 
                            className="question-button"
                            disabled={questionsLoading}
                        >
                            {questionsLoading ? 'Generating Questions...' : 'Generate Questions'}
                        </button>
                    )}

                    {questions && (
                        <div className="questions-section">
                            <h3 className="questions-title">Generated Questions</h3>
                            <pre className="questions-content">{questions}</pre>
                            
                            <button 
                                onClick={() => setShowSummary(!showSummary)} 
                                className="toggle-summary-button"
                            >
                                {showSummary ? 'Hide Summary' : 'Show Summary'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReadFile;