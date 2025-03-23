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
    const [showPrompt, setShowPrompt] = useState(false);
    const [quizData, setQuizData] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);


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

        // Show the prompt modal
        setShowPrompt(true);
    };

    const confirmQuestionGeneration = async (hideSummary) => {
        setShowPrompt(false);
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
            
            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error("Invalid question format received from server");
            }

            setQuizData(data.questions);
            setUserAnswers({});
            setShowResults(false);
        } catch (err) {
            console.error(err);
            alert(`Failed to generate questions: ${err.message}`);
            if (err.message.includes("Failed to parse questions")) {
                console.log("Server response:", err.response);
            }
        } finally {
            setQuestionsLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex, selectedOption) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const calculateResults = () => {
        let correct = 0;
        let incorrect = 0;
        
        quizData.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                correct++;
            } else if (userAnswers[index]) {
                incorrect++;
            }
        });

        return { correct, incorrect };
    };

    const { correct, incorrect } = calculateResults();

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

                    {/* Prompt Modal */}
                    {showPrompt && (
                        <div className="prompt-overlay">
                            <div className="prompt-modal">
                                <h3>Would you like to hide the summary while viewing the questions?</h3>
                                <div className="prompt-buttons">
                                    <button 
                                        onClick={() => confirmQuestionGeneration(true)}
                                        className="prompt-button yes-button"
                                    >
                                        Yes, Hide Summary
                                    </button>
                                    <button 
                                        onClick={() => confirmQuestionGeneration(false)}
                                        className="prompt-button no-button"
                                    >
                                        No, Keep Summary Visible
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {quizData.length > 0 && (
                        <div className="quiz-section">
                            <h3 className="quiz-title">Generated Questions</h3>
                            {quizData.map((question, index) => (
                                <div key={index} className="question-container">
                                    <p className="question-text">{question.question}</p>
                                    <div className="options-container">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`option ${
                                                    userAnswers[index] === option
                                                        ? (option === question.answer ? 'correct' : 'incorrect')
                                                        : ''
                                                }`}
                                                onClick={() => handleAnswerSelect(index, option)}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            <div className="results-section">
                                <p>Correct: {correct}</p>
                                <p>Incorrect: {incorrect}</p>
                                <p>Unanswered: {quizData.length - (correct + incorrect)}</p>
                            </div>
                        </div>
                    )}

                    {/* Temporary debug section */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="debug-section">
                            <h4>Debug Information</h4>
                            <pre>{JSON.stringify({
                                quizData,
                                userAnswers,
                                showResults,
                                questionsLoading
                            }, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReadFile;