from flask import Flask,request,jsonify
from google import genai
from dotenv import load_dotenv
import os
from pypdf import PdfReader
from werkzeug.utils import secure_filename

load_dotenv()
app=Flask(__name__)

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
        return "No file part", 400  

    f = request.files['file']  
    if f.filename == '':  
        return "No selected file", 400  

    f.save(f.filename)  # Save uploaded file
    reader = PdfReader(f.filename)  

    n = len(reader.pages)  
    full_text = ""  

    for page in range(n):  
        current_page = reader.pages[page]  
        page_text = current_page.extract_text()  
        if page_text:  
            full_text += page_text + "\n\n"  

    return jsonify({"text": full_text})  # Returning extracted text  



    
@app.route("/summary",methods=['POST'])   
def summarize_ai():
    data = request.get_json()  # ✅ Extracting JSON data
    full_text = data.get("text", "")
    client = genai.Client(api_key=GOOGLE_GEMINI_API)
    response = client.models.generate_content(
    model="gemini-2.0-flash", contents=f"""
    Read all the pages of :{full_text} and Summrize the content of: {full_text}
  
    
    
    """
    )
    summary_text = response.candidates[0].content.parts[0].text if response.candidates else "No response"

    return jsonify({"summary": summary_text})


# # summrize_ai(abc)
#   generate 5 question based on pdf in the format of 
#      Question:
#     option 1
#     option2
#     option3
#     option4
#     answer:

# pdf_text = summarize() 
# summarize_ai(pdf_text)

if __name__ == '__main__':
    app.run(debug=True)

