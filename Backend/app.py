from flask import Flask,request,jsonify
import google.generativeai as genai  
from dotenv import load_dotenv
import os
from pypdf import PdfReader
from werkzeug.utils import secure_filename
from flask_cors import CORS 
import logging


load_dotenv()
app=Flask(__name__)
CORS(app, resources={
    r"/upload": {"origins": ["http://localhost:5174"]},
    r"/summary": {"origins": ["http://localhost:5174"]},
    r"/question": {"origins": ["http://localhost:5174"]}
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
        # Save uploaded file
        f.save(f.filename)
        
        # Try to read the PDF
        try:
            reader = PdfReader(f.filename)
        except Exception as e:
            return jsonify({"error": f"Failed to read PDF: {str(e)}"}), 400

        # Check if PDF is encrypted
        if reader.is_encrypted:
            try:
                # Try to decrypt with empty password
                if reader.decrypt(""):
                    # If decryption succeeds, proceed
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
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5174")
        return response, 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


    # return jsonify({"text": full_text},200, {"Access-Control-Allow-Origin": "http://localhost:5173"})  
    # return {"message": "File uploaded successfully!"} 



    
@app.route("/summary",methods=['POST'])   
def summarize_ai():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing text in request"}), 400
            
        full_text = data.get("text", "")
        if not full_text:
            return jsonify({"error": "Empty text provided"}), 400
            
        # Initialize the Generative AI client
        genai.configure(api_key=GOOGLE_GEMINI_API)
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # Generate content
        response = model.generate_content(
            f"""
            Read all the pages of :{full_text} and Summarize the content of: {full_text} in different chapters in format of 
            Chapter :1
            Chapter Name:
            Summary:
            """
        )
        
        summary_text = response.text if response else "No response"
        
        response = jsonify({"Summary": summary_text})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5174")
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/question", methods=['POST'])
def question():
    try:
        logging.info("Received request for /question")
        data = request.get_json()
        logging.info(f"Request data: {data}")
        
        if not data or 'text' not in data:
            logging.error("Missing text in request")
            return jsonify({"error": "Missing text in request"}), 400
            
        full_text = data.get("text", "")
        if not full_text:
            logging.error("Empty text provided")
            return jsonify({"error": "Empty text provided"}), 400
            
        logging.info("Initializing Generative AI client")
        genai.configure(api_key=GOOGLE_GEMINI_API)
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        logging.info("Generating content")
        response = model.generate_content(
            f"""
            Read all the pages of :{full_text} and 
            generate 15 questions based on pdf in the format of 
            Question:
            option 1
            option 2
            option 3
            option 4
            answer:
            """
        )
        
        questions = response.candidates[0].content.parts[0].text if response.candidates else "No response"
        
        response = jsonify({"questions": questions})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5174")
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

  

# pdf_text = summarize() 
# summarize_ai(pdf_text)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

