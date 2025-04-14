import io
import csv
import re
import uuid
import pandas as pd
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.auth import AuthorizedUser

router = APIRouter(prefix="/prospects")

# Prospect models
class ProspectCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    company: str
    position: str
    location: Optional[str] = None
    linkedin: Optional[str] = None
    notes: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    
    @validator('email')
    def validate_email(cls, v):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, v):
            raise ValueError('Invalid email format')
        return v

class Prospect(ProspectCreate):
    id: str
    userId: str
    status: str = "new"
    createdAt: int
    updatedAt: int

class CSVUploadResponse(BaseModel):
    success: bool
    total: int
    imported: int
    errors: List[Dict[str, Any]] = Field(default_factory=list)
    
# Function to parse CSV data
def parse_csv(file_content, user_id):
    try:
        # Read CSV content
        df = pd.read_csv(io.StringIO(file_content))
        
        # Check if required columns exist
        required_columns = ['firstName', 'lastName', 'email', 'company', 'position']
        lowercase_columns = [col.lower() for col in df.columns]
        
        # Map column names (case insensitive)
        column_mapping = {}
        for required in required_columns:
            for i, col in enumerate(lowercase_columns):
                if required.lower() == col:
                    column_mapping[required] = df.columns[i]
                    break
                # Try common variations
                elif (required == 'firstName' and col in ['first name', 'first_name', 'firstname']) or \
                     (required == 'lastName' and col in ['last name', 'last_name', 'lastname']) or \
                     (required == 'email' and col in ['email address', 'email_address', 'emailaddress']) or \
                     (required == 'company' and col in ['company name', 'company_name', 'companyname', 'organization']) or \
                     (required == 'position' and col in ['job title', 'job_title', 'jobtitle', 'title', 'role']):
                    column_mapping[required] = df.columns[i]
                    break
        
        # Check if all required columns were found
        missing_columns = [col for col in required_columns if col not in column_mapping]
        if missing_columns:
            return {
                'success': False,
                'error': f"Missing required columns: {', '.join(missing_columns)}"
            }
        
        # Rename columns
        df_renamed = df.rename(columns=column_mapping)
        
        # Map optional columns if they exist
        optional_columns = {
            'location': ['location', 'city', 'state', 'country', 'address'],
            'linkedin': ['linkedin', 'linkedin url', 'linkedin_url', 'linkedinurl'],
            'notes': ['notes', 'comments', 'description']
        }
        
        for optional, variations in optional_columns.items():
            for variation in variations:
                for i, col in enumerate(lowercase_columns):
                    if variation == col:
                        df_renamed[optional] = df[df.columns[i]]
                        break
                if optional in df_renamed.columns:
                    break
        
        # Extract prospect data
        prospects = []
        errors = []
        imported = 0
        
        for index, row in df_renamed.iterrows():
            try:
                # Check if required fields are not empty
                if any(pd.isna(row[col]) for col in required_columns if col in df_renamed.columns):
                    errors.append({
                        'row': index + 2,  # +2 because index is 0-based and we skip header row
                        'error': "Missing required fields",
                        'data': row.to_dict()
                    })
                    continue
                
                # Validate email format
                email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
                if not re.match(email_regex, str(row['email'])):
                    errors.append({
                        'row': index + 2,
                        'error': "Invalid email format",
                        'data': row.to_dict()
                    })
                    continue
                
                prospect = {
                    'id': str(uuid.uuid4()),
                    'userId': user_id,
                    'firstName': row['firstName'],
                    'lastName': row['lastName'],
                    'email': row['email'],
                    'company': row['company'],
                    'position': row['position'],
                    'status': 'new',
                    'tags': [],
                    'createdAt': pd.Timestamp.now().timestamp() * 1000,
                    'updatedAt': pd.Timestamp.now().timestamp() * 1000
                }
                
                # Add optional fields if they exist
                for optional in optional_columns.keys():
                    if optional in df_renamed.columns and not pd.isna(row[optional]):
                        prospect[optional] = row[optional]
                
                # Check for tags column or custom column
                if 'tags' in df_renamed.columns and not pd.isna(row['tags']):
                    prospect['tags'] = [tag.strip() for tag in str(row['tags']).split(',')]
                
                prospects.append(prospect)
                imported += 1
                
            except Exception as e:
                errors.append({
                    'row': index + 2,
                    'error': str(e),
                    'data': row.to_dict() if hasattr(row, 'to_dict') else {}
                })
        
        return {
            'success': True,
            'total': len(df),
            'imported': imported,
            'errors': errors,
            'prospects': prospects
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@router.post("/upload-csv", response_model=CSVUploadResponse)
async def upload_csv(user: AuthorizedUser, file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
    contents = await file.read()
    content_decoded = contents.decode('utf-8')
    
    result = parse_csv(content_decoded, user.sub)
    
    if not result.get('success'):
        raise HTTPException(status_code=400, detail=result.get('error'))
    
    return {
        'success': True,
        'total': result['total'],
        'imported': result['imported'],
        'errors': result['errors']
    }

@router.post("/generate-sample-data")
async def generate_sample_data(user: AuthorizedUser) -> dict:
    """Generate sample prospect data for testing"""
    # Sample company names
    companies = [
        "TechNova Solutions", "GlobalVista Marketing", "Quantum Dynamics", "Stellar Systems",
        "Emerald Innovations", "Horizon Analytics", "Pulse Enterprises", "Velocity Partners",
        "Axiom Technologies", "Zenith Corp", "Sapphire Software", "Pinnacle Solutions"
    ]
    
    # Sample positions
    positions = [
        "Chief Executive Officer", "Chief Technology Officer", "VP of Sales", "VP of Marketing",
        "Director of Operations", "Marketing Manager", "Sales Director", "Product Manager",
        "Head of Business Development", "Customer Success Manager", "IT Director", "Financial Controller"
    ]
    
    # Sample locations
    locations = [
        "San Francisco, CA", "New York, NY", "Boston, MA", "Austin, TX", "Seattle, WA",
        "Chicago, IL", "Denver, CO", "Los Angeles, CA", "Miami, FL", "Atlanta, GA"
    ]
    
    # Sample tags
    tag_options = [
        "enterprise", "startup", "decision-maker", "influencer", "technical", "business",
        "finance", "marketing", "sales", "high-priority", "qualified", "new-contact"
    ]
    
    # Generate 20 sample prospects
    sample_prospects = []
    for i in range(20):
        # Generate a random first name and last name
        first_name = f"First{i+1}"
        last_name = f"Last{i+1}"
        
        # Random selections
        company = companies[i % len(companies)]
        position = positions[i % len(positions)]
        location = locations[i % len(locations)]
        
        # Generate 1-3 random tags
        import random
        num_tags = random.randint(1, 3)
        tags = random.sample(tag_options, num_tags)
        
        # Generate prospect object
        prospect = {
            'id': str(uuid.uuid4()),
            'userId': user.sub,
            'firstName': first_name,
            'lastName': last_name,
            'email': f"{first_name.lower()}.{last_name.lower()}@{company.lower().replace(' ', '')}.com",
            'company': company,
            'position': position,
            'location': location,
            'linkedin': f"https://linkedin.com/in/{first_name.lower()}-{last_name.lower()}-{random.randint(1000, 9999)}",
            'notes': f"Met at the {random.choice(['SaaS', 'Tech', 'Marketing', 'Sales', 'Finance'])} conference in {random.choice(['January', 'March', 'June', 'September', 'November'])}",
            'status': random.choice(['new', 'contacted', 'responded', 'qualified']),
            'tags': tags,
            'createdAt': pd.Timestamp.now().timestamp() * 1000,
            'updatedAt': pd.Timestamp.now().timestamp() * 1000
        }
        
        sample_prospects.append(prospect)
    
    return {
        'success': True,
        'count': len(sample_prospects),
        'prospects': sample_prospects
    }

@router.post("/validate-csv")
async def validate_csv(user: AuthorizedUser, file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
    contents = await file.read()
    content_decoded = contents.decode('utf-8')
    
    result = parse_csv(content_decoded, user.sub)
    
    if not result.get('success'):
        raise HTTPException(status_code=400, detail=result.get('error'))
    
    # Replace prospects data with sample to avoid large response
    sample_prospects = result['prospects'][:5] if len(result['prospects']) > 5 else result['prospects']
    
    return {
        'success': True,
        'total': result['total'],
        'importable': result['imported'],
        'errors': result['errors'],
        'sampleProspects': sample_prospects
    }
