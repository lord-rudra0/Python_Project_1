from flask import Flask
from google import genai
from dotenv import load_dotenv
import os
from pypdf import PdfReader

load_dotenv()


GOOGLE_GEMINI_API=os.getenv('GOOGLE_API')
# print(GOPGLE_GEMINI_API)

reader = PdfReader('CST303 M1 Ktunotes.in.pdf')

# printing number of pages in pdf file
n=len(reader.pages)
print(n)

# creating a page object
# page = reader.pages[4]

# extracting text from page
for page in range(n):
    page = reader.pages[page]
    # print(page.extract_text())
    abc=page.extract_text()
    # print(abc)
    
    
def summrize(abc):
    client = genai.Client(api_key=GOOGLE_GEMINI_API)
    response = client.models.generate_content(
    model="gemini-2.0-flash", contents=f"Read all the pages of :{abc} and Summrize the content of: {abc} and generate 5 question based on pdf"
    )
    print(response.text)


summrize(abc)

