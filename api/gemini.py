# https://ai.google.dev/api/generate-content

import requests
import time
import json
import os

API_KEY = os.getenv('GEMINI_API_KEY')
URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}'

headers = {
    'Content-Type': 'application/json'
}

def cv_extraction_prompt(cv_text: str, expectations: str) -> str:
    """Prompt for CV extraction"""
    return f"""
    You are a CV extraction AI. Your job is to extract the following information from the CV:
    - fullName
    - standsOutWith (based on the recruiter's expectations)
    - experience
    - education

    Recruiter's expectations: {expectations}

    Full CV text:
    {cv_text}
    """

def extract_cv_text_info(prompt: str, expectations: str, temp = 0.0, maxtries = 10) -> str:
    """Get a response from Gemini API (Gemini 2.0 Flash)
    Args:
        prompt (str): The prompt to send to the API.
        expectations (str): The expectations for the candidate.
        temp (float): The temperature for the response. Default is 0.0.
        tries (int): The number of tries to get a response. Default is 10.
    Returns:
        str: The response from the API.
    """
    data = {
        "contents": [
            {
                "parts": [
                    {"text": cv_extraction_prompt(prompt, expectations)}
                ]
            }
        ],
        "generationConfig": {
            "temperature": temp,
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "fullName": { "type": "STRING" },
                        "standsOutWith": { "type": "STRING" },
                        "experience": { "type": "STRING" },
                        "education": { "type": "STRING" }
                    },
                    "propertyOrdering": ["fullName", "standsOutWith", "experience", "education"]
                }
            }
        },
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
        response = requests.post(URL, headers=headers, json=data)

        if response.status_code == 200:
            response_text = response.json()['candidates'][0]['content']['parts'][0]['text']
            return response_text
        else:
            if response.status_code == 429 and tries < maxtries:
                tries += 1
                print("Gemini rate limit exceeded - retrying in 20 seconds")
                time.sleep(20)
            else:
                raise Exception(f"Tried getting Gemini API response for {tries} tries. Gemini API error {response.status_code}: {response.text}")