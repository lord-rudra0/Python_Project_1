// import { text } from "express";
import React from "react";
import { useState } from "react";


function ReadFile() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setLoading(true);
        if (!file) return alert("Please select a file first");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            const extractedText = await response.json();

            if (response.ok) {
                console.log("File uploaded successfully!");
                // setText(data.text)
            } else {
                console.error("Error uploading file");
            }

            // const extractedText = await response.json();
            const summaryRes = await fetch('http://localhost:5000/summary', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: extractedText.text })
            })
            const summaryData = await summaryRes.json();
            if (summaryRes.ok) {
                setText(summaryData.summary || "No summary available");
            }
            else {
                console.error("Error uploading file");
            }

            if (summaryRes.ok && summaryData.Summary) {
                // ✅ Convert newlines to <br> for HTML rendering
                const formattedText = summaryData.Summary.replaceAll("\n", "<br/>");
                setText(formattedText);
            } else {
                console.error("Error fetching summary:", summaryData);
            }

        }



        catch (err) {
            console.error(err)
        }
        finally {
            setLoading(false);
        }

    };



    return (
        <div>


            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload File</button>
            </div>
            <div>
                {loading ? <p>Loading...</p> : <p dangerouslySetInnerHTML={{ __html: text }}></p>}
            </div>

        </div>


    );
};

export default ReadFile;