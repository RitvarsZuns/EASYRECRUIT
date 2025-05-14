# https://ai.google.dev/api/generate-content

import requests
import time
import json
import os

API_KEY = os.getenv('GEMINI_API_KEY')
URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}'



def extract_cv_text(cv_text: str, maxtries = 10) -> str:
    prompt = f"""
    You are a CV extraction AI. Your job is to extract the following information from the CV:
    - full_name
    - phone_number
    - email
    - location
    - about_me
    - experience (format: [year] | [position] | [company]\n[description])
    - education (format: [degree] | [institution] | [year])

    For experience and education, start each record with a '•', remove any multiple new lines within one record.
    For experience, split each record with 2 new lines. For education, split each record with a new line.
    If the provided text is not a CV, return "Not a CV" for all required fields.
    Remove any unnecessary spaces or new lines from raw text.

    Full CV text:
    {cv_text}
    """

    generationCofig = {
        "temperature": 0.0,
        "responseMimeType": "application/json",
        "responseSchema": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "full_name": { "type": "STRING" },
                    "phone_number": { "type": "STRING" },
                    "email": { "type": "STRING" },
                    "location": { "type": "STRING" },
                    "about_me": { "type": "STRING" },
                    "experience": { "type": "STRING" },
                    "education": { "type": "STRING" }
                },
                "propertyOrdering": ["full_name", "phone_number", "email", "location", "about_me", "experience", "education"]
            }
        }
    }

    return get_response(prompt, generationCofig, maxtries)


def get_cv_rankings(cvs_json_str: str, expectations: str, maxtries = 10) -> str:
    prompt = f"""
    You are a CV ranking AI. Your job is to rank the given CVs based on the recruiter's expectations.
    The lower the ranking, the better the CV matches the expectations.
    The rankings must be unique for every file.
    The stands_out_with field must be filled with a short text that describes what makes the CV stand out, based on recruiter's expectations.
    You must return:
    - file_id
    - stands_out_with
    - ranking

    Recruiter's expectations: {expectations}

    CVs JSON:
    {cvs_json_str}
    """

    generationCofig = {
        "temperature": 0.0,
        "responseMimeType": "application/json",
        "responseSchema": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "file_id": { "type": "STRING" },
                    "stands_out_with": { "type": "STRING" },
                    "ranking": { "type": "INTEGER" }
                },
                "propertyOrdering": ["file_id", "stands_out_with", "ranking"]
            }
        }
    }

    return get_response(prompt, generationCofig, maxtries)


def get_response(prompt: str, generationCofig: dict = {"temperature":0.2}, maxtries = 10) -> str:
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": generationCofig,
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "OFF"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "OFF"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "OFF"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "OFF"},
            {"category": "HARM_CATEGORY_CIVIC_INTEGRITY", "threshold": "OFF"}
        ],
    }

    tries = 0

    while True:
        response = requests.post(URL, headers={'Content-Type': 'application/json'}, json=data)

        if response.status_code == 200:
            response_text = response.json()['candidates'][0]['content']['parts'][0]['text']
            return response_text
        else:
            if response.status_code == 429 and tries < maxtries:
                tries += 1
                time.sleep(20)
            else:
                raise Exception(f"Tried getting Gemini API response for {tries} tries. Gemini API error {response.status_code}: {response.text}")