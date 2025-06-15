from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai

import os

from pydantic import BaseModel, Field
from typing import List
from enum import Enum

from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY env variable is not set, please set it in .env file or "
                     "as GEMINI_API_KEY environment variable.")

client = genai.Client(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["content-type"],
)

class ContractType(str, Enum):
    employment = "employment"
    service_agreement = "service_agreement"
    nda = "nda"
    lease = "lease"
    purchase = "purchase"
    partnership = "partnership"


class ComplianceStatus(str, Enum):
    compliant = "compliant"
    minor_concerns = "minor_concerns"
    major_concerns = "major_concerns"
    non_compliant = "non_compliant"
    requires_review = "requires_review"


class ContractDocument(BaseModel):
    contract_text: str = Field(..., title="Contract Text")
    contract_type: ContractType = Field(..., title="Contract Type")
    jurisdiction: str = Field(..., title="Jurisdiction")


class ContractAssessment(BaseModel):
    risk_score: int = Field(..., ge=1, le=10, title="Risk Score")
    key_terms: List[str] = Field(..., title="Key Terms Identified")
    potential_issues: List[str] = Field(..., title="Potential Issues")
    compliance_status: ComplianceStatus = Field(..., title="Compliance Status")
    recommendations: List[str] = Field(..., title="Recommendations")
    contract_summary: str = Field(..., title="Contract Summary")


@app.post("/contract_analysis", response_model=ContractAssessment, summary="Contract Analysis")
def contract_analysis(contract: ContractDocument):

    model_prompt = """
    You are a legal expert specializing in contract analysis. Your task is to analyze a contract document 
    and provide a comprehensive assessment. You should reflect the risks and compliance status of the contract,
    identify key terms, potential issues, and provide recommendations for improvement. The analysis should be
    thorough and consider the jurisdiction specified in the contract. You will be required to give your risk assessment
    through various outputs including a risk score, compliance status, and a summary of the contract.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"{model_prompt}: {contract}",
        config={
            "response_mime_type": "application/json",
            "response_schema": ContractAssessment.model_json_schema(),
        },
    )

    return response.parsed
