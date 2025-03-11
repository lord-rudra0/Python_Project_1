// import { text } from "express";
import React from "react";
import { useState } from "react";


function ReadFile() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("")

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
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
            const data = await summaryRes.json();
            if (summaryRes.ok) {
                setText(data.summary)
            }
            else {
                console.error("Error uploading file");
            }

        }

        catch (err) {
            console.error(err)
        }
    };



    return (
        <div>


            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload File</button>
            </div>
            <div>
                {text}
            </div>
        </div>


    );
};

export default ReadFile;