import json

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile
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
    file_id: str
    full_name: str
    experience: str
    education: str
    phone_number: str
    email: str
    location: str
    about_me: str
    stands_out_with: str = "n/a"
    ranking: int = 0


@app.post("/process_cv")
async def process_cv(
    files: List[UploadFile],
    file_ids: List[str],
    expectations: str
):
    """Process a CV files and return the extracted text."""
    
    # Split file id string by ',' if passed as a string not array
    if len(file_ids) == 1:
        file_ids = file_ids[0].split(",")

    if len(files) != len(file_ids):
        return Response(content=json.dumps({"error": "Mismatch between number of files and file_ids"}), status_code=500, media_type="application/json")
    
    processed_cvs = []

    # Extract CV content
    for file, file_id in zip(files, file_ids):
        # Check file type
        if file.content_type not in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']:
            return Response(content=json.dumps({"error": f"Unsupported file type for file {file.filename}. Please upload .txt, .pdf, or .docx files"}), status_code=500, media_type="application/json")
    
        try:
            extracted_cv = await process_cv_document(file, file_id, expectations)
            if (extracted_cv.full_name != "Not a CV" and
                extracted_cv.experience != "Not a CV" and
                extracted_cv.education != "Not a CV"):
                processed_cvs.append(extracted_cv)
        except (Exception, ValueError) as e:
            return Response(content=json.dumps({"error": "Encountered error in CV processing, full error: " + str(e)}), status_code=500, media_type="application/json")

    # Rank CVs
    cv_list_ranked = await rank_cvs(processed_cvs, expectations)

    return Response(content=json.dumps(cv_list_ranked), status_code=200, media_type="application/json")


async def process_cv_document(file: UploadFile, file_id: str, expectations: str) -> CV:
    """Extract text from a CV document
    
    Args:
        file (UploadFile): The CV file to process.
        file_id (str): The ID of the CV file.
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
            file_id = file_id,
            full_name = extracted_content_json.get("full_name", "n/a"),
            phone_number = extracted_content_json.get("phone_number", "n/a"),
            email = extracted_content_json.get("email", "n/a"),
            location = extracted_content_json.get("location", "n/a"),
            about_me = extracted_content_json.get("about_me", "n/a"),
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

    for ranked_cv in json.loads(ranked_cvs):
        for cv in cvs:
            if cv.file_id == ranked_cv["file_id"]:
                cv.stands_out_with = ranked_cv["stands_out_with"]
                cv.ranking = ranked_cv["ranking"]

    ranked_cv_dicts = [asdict(cv) for cv in cvs]

    return ranked_cv_dicts