import databutton as db
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from openai import OpenAI
from app.auth import AuthorizedUser
import re

router = APIRouter(prefix="/messages")

# Initialize OpenAI client
OPENAI_API_KEY = db.secrets.get("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

# Define message types
class MessageTemplate(BaseModel):
    id: str
    name: str
    content: str
    templateType: str  # 'email' or 'linkedin'
    variables: List[str] = Field(default_factory=list)
    userId: str
    isDefault: bool = False
    createdAt: int
    updatedAt: int

class MessageTemplateCreate(BaseModel):
    name: str
    content: str
    templateType: str
    isDefault: Optional[bool] = False

class MessageGenerate(BaseModel):
    prospectId: str
    templateId: Optional[str] = None
    messageType: str  # 'email' or 'linkedin'
    customPrompt: Optional[str] = None
    prospectData: Optional[Dict[str, Any]] = None
    userData: Optional[Dict[str, Any]] = None
    
class MessageResponse(BaseModel):
    message: str
    variables: Dict[str, str] = Field(default_factory=dict)

# Default templates
DEFAULT_EMAIL_TEMPLATE = """
Subject: Let's explore how {{company_name}} can improve {{prospect_pain_point}}

Hi {{first_name}},

I hope this email finds you well. I was exploring {{prospect_company}} and was impressed by your work on {{prospect_company_achievement}}.

At {{company_name}}, we've been helping companies like {{similar_company}} to {{value_proposition}}. I'd love to share some ideas on how we could potentially help {{prospect_company}} with {{prospect_pain_point}}.

Would you be open to a 15-minute call next week to discuss this further?

Best regards,
{{sender_name}}
{{sender_position}}
{{company_name}}
{{sender_phone}}
"""

DEFAULT_LINKEDIN_TEMPLATE = """
Hi {{first_name}},

I noticed your work at {{prospect_company}} particularly your focus on {{prospect_role_focus}}. I'm reaching out because we've helped similar {{prospect_industry}} professionals achieve {{value_proposition}}.

Would you be open to connecting to explore potential synergies?

Best,
{{sender_name}} from {{company_name}}
"""

# Extract variables from template
def extract_variables(content: str) -> List[str]:
    pattern = r'\{\{([\w_]+)\}\}'
    matches = re.findall(pattern, content)
    return list(set(matches))  # Return unique variables

# Generate AI-powered message
def generate_ai_message(prospect_data: Dict[str, Any], user_data: Dict[str, Any], 
                     message_type: str, custom_prompt: Optional[str] = None) -> str:
    # Create system prompt
    system_prompt = f"""You are an expert sales copywriter who creates personalized {message_type} outreach messages. 
    Write in a professional, friendly tone that's concise and persuasive without being pushy.
    
    Craft a message that connects the sender's value proposition with the prospect's needs.
    The message should be personalized based on the prospect's information.
    Do not use placeholder text like {{prospect_company}}. Use the actual values provided.
    
    Keep email messages under 150 words and LinkedIn messages under 100 words."""
    
    # Construct user message with prospect and user data
    user_message = """Create a personalized sales outreach message with the following information:
    
    PROSPECT INFORMATION:
    """
    
    # Add prospect data
    for key, value in prospect_data.items():
        if value:  # Only include non-empty values
            user_message += f"\n{key}: {value}"
    
    user_message += "\n\nSENDER INFORMATION:"
    
    # Add user data
    for key, value in user_data.items():
        if value:  # Only include non-empty values
            user_message += f"\n{key}: {value}"
    
    # Add custom prompt if provided
    if custom_prompt:
        user_message += f"\n\nADDITIONAL INSTRUCTIONS:\n{custom_prompt}"
    
    # Add message type specific instructions
    if message_type == "email":
        user_message += "\n\nFormat the message as a complete email with subject line and signature."
    elif message_type == "linkedin":
        user_message += "\n\nFormat the message as a concise LinkedIn connection request or InMail."
    
    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using a cost-effective model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        # Extract and return the generated message
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating message: {str(e)}")

@router.post("/generate", response_model=MessageResponse)
async def generate_message(request: MessageGenerate, user: AuthorizedUser) -> MessageResponse:
    """Generate a personalized message for a prospect"""
    # Use provided prospect data or fetch from database
    prospect_data = request.prospectData or {}
    user_data = request.userData or {}
    
    # Generate message
    message = generate_ai_message(
        prospect_data=prospect_data,
        user_data=user_data,
        message_type=request.messageType,
        custom_prompt=request.customPrompt
    )
    
    # Extract variables used in the message for highlighting
    variables = {}
    for key in list(prospect_data.keys()) + list(user_data.keys()):
        if key in message.lower():
            variables[key] = True
    
    return MessageResponse(
        message=message,
        variables=variables
    )

@router.get("/templates")
async def get_default_templates(user: AuthorizedUser) -> Dict[str, str]:
    """Get default message templates"""
    return {
        "email": DEFAULT_EMAIL_TEMPLATE,
        "linkedin": DEFAULT_LINKEDIN_TEMPLATE
    }
