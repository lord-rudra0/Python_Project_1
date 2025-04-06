from flask import Flask,request,jsonify
import google.generativeai as genai  
from dotenv import load_dotenv
import os
from pypdf import PdfReader
from werkzeug.utils import secure_filename
from flask_cors import CORS 
import logging
import json


load_dotenv()
app=Flask(__name__)
CORS(app, resources={
    r"/upload": {"origins": ["https://rudra-ps-summer-ai.vercel.app/"]},
    r"/summary": {"origins": ["https://rudra-ps-summer-ai.vercel.app/"]},
    r"/question": {"origins": [""]}
})
# CORS(app)

GOOGLE_GEMINI_API=os.getenv('GOOGLE_API')
# print(GOPGLE_GEMINI_API)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=['GET', 'POST'])
def Home():
    return "This is the Home page"


@app.route("/upload",methods=['GET', 'POST'])
def upload(): 
    if 'file' not in request.files:  
        return jsonify({"error": "No file part"}), 400  

    f = request.files['file']  
    if f.filename == '':  
        return jsonify({"error": "No selected file"}), 400  

    try:
        
        f.save(f.filename)
        
        try:
            reader = PdfReader(f.filename)
        except Exception as e:
            return jsonify({"error": f"Failed to read PDF: {str(e)}"}), 400

       
        if reader.is_encrypted:
            try:
                
                if reader.decrypt(""):
                    
                    pass
                else:
                    return jsonify({"error": "PDF is encrypted and cannot be decrypted"}), 400
            except Exception as e:
                return jsonify({"error": f"Failed to decrypt PDF: {str(e)}"}), 400

        n = len(reader.pages)  
        full_text = ""  

        for page in range(n):  
            current_page = reader.pages[page]  
            page_text = current_page.extract_text()  
            if page_text:  
                full_text += page_text + "\n\n"  
        
        response = jsonify({"text": full_text})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


    # return jsonify({"text": full_text},200, {"Access-Control-Allow-Origin": "http://localhost:5173"})  
    # return {"message": "File uploaded successfully!"} 



    
@app.route("/summary", methods=['POST'])
def summarize_ai():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing text in request"}), 400
            
        full_text = data.get("text", "")
        if not full_text:
            return jsonify({"error": "Empty text provided"}), 400
            
        genai.configure(api_key=GOOGLE_GEMINI_API)
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Updated prompt with clear formatting instructions
        response = model.generate_content(
            f"""
            Read all the pages of: {full_text} and summarize the content in different chapters.
            Format each chapter as follows:
            
            Chapter :[Number]
            Chapter Name: [Name]
            Summary: [Summary text]
            
            Rules:
            1. Use plain text only, no HTML tags
            2. Separate chapters with a single newline
            3. Do not include any <br/> tags
            4. Keep summaries concise but informative
            """
        )
        
        summary_text = response.text if response else "No response"
        
        # Remove any remaining HTML tags just in case
        clean_summary = summary_text.replace('<br/>', '\n').replace('<br>', '\n')
        
        response = jsonify({"Summary": clean_summary})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/question", methods=['POST'])
def question():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing text in request"}), 400
            
        full_text = data.get("text", "")
        if not full_text:
            return jsonify({"error": "Empty text provided"}), 400
            
        genai.configure(api_key=GOOGLE_GEMINI_API)
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Modified prompt to generate all relevant questions
        prompt = f"""
        Read the following text and generate multiple choice questions in JSON format:
        {full_text}
        
        Return a JSON array where each element is an object with:
        - question: string
        - options: array of 4 strings
        - answer: string (must be one of the options)
        
        Generate as many relevant questions as possible based on the content.
        Return only the JSON array, nothing else.
        """
        
        response = model.generate_content(prompt)
        
        # Extract and clean the response
        response_text = response.candidates[0].content.parts[0].text if response.candidates else "[]"
        response_text = response_text.replace("```json", "").replace("```", "").strip()
        
        try:
            questions = json.loads(response_text)
            if not isinstance(questions, list):
                return jsonify({"error": "Invalid question format"}), 500
                
            return jsonify({
                "questions": questions,
                "total_questions": len(questions)
            }), 200
        except json.JSONDecodeError as e:
            return jsonify({
                "error": "Failed to parse questions",
                "response": response_text
            }), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

  

# pdf_text = summarize() 
# summarize_ai(pdf_text)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

