import json

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from dotenv import load_dotenv

from api.text_extractor import get_text_from_file
from api.gemini import extract_cv_text_info

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

@app.post("/process_cv")
async def process_cv(file: UploadFile, expectations: str):
    """Process a CV file and return the extracted text."""
    
    # Check file type
    if file.content_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']:
        return {"error": "Unsupported file type. Please upload a .txt, .pdf, or .docx file."}

    # Read file content
    file_bytes = await file.read()
    try:
        cv_text = get_text_from_file(file_bytes, file.content_type)
    except ValueError as e:
        return Response(content=json.dumps({"error": "Encountered error in text extraction from CV, full error: " + str(e)}), status_code=500, media_type="application/json")

    # Generate response from Gemini API
    try:
        response = extract_cv_text_info(cv_text, expectations, temp=0.0, maxtries=10)
        extracted_content_json = json.loads(response.strip("'"))[0]
    except Exception as e:
        return Response(content=json.dumps({"error": "Encountered error in CV info extraction, full error: " + str(e)}), status_code=500, media_type="application/json")

    response_data = {
        "file_name": file.filename,
        "file_type": file.content_type,
        "expectations": expectations,
        "full_name": extracted_content_json.get("fullName", "n/a"),
        "stands_out_with": extracted_content_json.get("standsOutWith", "n/a"),
        "experience": extracted_content_json.get("experience", "n/a"),
        "education": extracted_content_json.get("education", "n/a"),
    }

    return Response(content=json.dumps(response_data), status_code=200, media_type="application/json")