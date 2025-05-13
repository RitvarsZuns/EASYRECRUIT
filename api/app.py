import json

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response

from dataclasses import dataclass, asdict
from dotenv import load_dotenv
from typing import List

from api.text_extractor import get_text_from_file
from api.gemini import extract_cv_text, get_cv_rankings

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

@dataclass
class CV:
    full_name: str
    experience: str
    education: str
    stands_out_with: str = "n/a"
    ranking: int = 0


@app.post("/process_cv")
async def process_cv(files: List[UploadFile], expectations: str):
    """Process a CV files and return the extracted text."""
    
    processed_cvs = []

    # Extract CV content
    for file in files:
        # Check file type
        if file.content_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']:
            return {"error": "Unsupported file type. Please upload a .txt, .pdf, or .docx file."}
    
        try:
            extracted_cv = await process_cv_document(file, expectations)
            if (extracted_cv.full_name != "Not a CV" and
                extracted_cv.experience != "Not a CV" and
                extracted_cv.education != "Not a CV"):
                processed_cvs.append(extracted_cv)
        except (Exception, ValueError) as e:
            return Response(content=json.dumps({"error": "Encountered error in CV processing, full error: " + str(e)}), status_code=500, media_type="application/json")

    # Rank CVs
    cv_list_ranked = await rank_cvs(processed_cvs, expectations)

    return Response(content=json.dumps(cv_list_ranked), status_code=200, media_type="application/json")


async def process_cv_document(file: UploadFile, expectations: str) -> CV:
    """Extract text from a CV document
    
    Args:
        file (UploadFile): The CV file to process.
        expectations (str): The expectations for the CV.
    Returns:
        dict: The extracted content from the CV."""
    # Read file content
    file_bytes = await file.read()
    cv_text = get_text_from_file(file_bytes, file.content_type)

    # Generate response from Gemini API
    extracted_content = extract_cv_text(cv_text, maxtries=10)
    extracted_content_json = json.loads(extracted_content.strip("'"))[0]

    return CV(
            full_name = extracted_content_json.get("full_name", "n/a"),
            experience = extracted_content_json.get("experience", "n/a"),
            education = extracted_content_json.get("education", "n/a")
        )


async def rank_cvs(cvs: dict[CV], expectations: str) -> dict:
    """Rank CVs based on the extracted information and recruiter's expectations.
    
    Args:
        cvs (dict): The CVs to rank.
        expectations (str): The expectations for the candidate.
    Returns:
        dict: The ranked CVs."""
    
    # Convert list of CV objects to list of dictionaries
    cv_dicts = [asdict(cv) for cv in cvs]

    # Convert to JSON string
    cvs_json_str = json.dumps(cv_dicts, ensure_ascii=False)

    ranked_cvs = get_cv_rankings(cvs_json_str, expectations, maxtries=10)

    return json.loads(ranked_cvs)