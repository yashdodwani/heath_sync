import os
import json
import csv
import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)


def load_doctors_from_csv():
    """
    Load doctor information from CSV file.

    Returns:
        pandas.DataFrame: DataFrame containing doctor information
    """
    try:
        # Try different possible paths for the CSV file
        possible_paths = [
            os.path.join(os.path.dirname(__file__), "../data/doc_csv.csv"),
            os.path.join(os.path.dirname(__file__), "data/doc_csv.csv"),
            os.path.join(os.getcwd(), "data/doc_csv.csv"),
            "data/doc_csv.csv",
            "doc_csv.csv"
        ]

        for path in possible_paths:
            if os.path.exists(path):
                doctors_df = pd.read_csv(path)
                print(f"Successfully loaded doctor CSV from {path}")
                return doctors_df

        # If we haven't found the file, fallback to creating a DataFrame from hardcoded data
        print("CSV file not found in expected locations, creating sample data")
        return pd.DataFrame([
            {"name": "Dr. Jane Smith", "specialty": "General Practitioner", "contact": "555-1234",
             "location": "Central Medical Center"},
            {"name": "Dr. John Johnson", "specialty": "Cardiologist", "contact": "555-5678",
             "location": "Heart Health Clinic"},
            {"name": "Dr. Sarah Williams", "specialty": "Dermatologist", "contact": "555-9012",
             "location": "Skin Care Center"},
            {"name": "Dr. Michael Brown", "specialty": "Neurologist", "contact": "555-3456",
             "location": "Brain & Nerve Center"},
            {"name": "Dr. Emily Davis", "specialty": "Pulmonologist", "contact": "555-7890",
             "location": "Respiratory Care Institute"},
            {"name": "Dr. Robert Wilson", "specialty": "Gastroenterologist", "contact": "555-2345",
             "location": "Digestive Health Center"},
            {"name": "Dr. Lisa Martinez", "specialty": "Orthopedist", "contact": "555-6789",
             "location": "Joint & Bone Specialists"},
            {"name": "Dr. Amanda Harris", "specialty": "Neurologist", "contact": "555-2345",
             "location": "Neurology Associates"},
            {"name": "Dr. Thomas White", "specialty": "ENT Specialist", "contact": "555-8901", "location": "ENT Clinic"}
        ])
    except Exception as e:
        print(f"Error loading doctor CSV: {str(e)}")
        # Return empty DataFrame if file can't be loaded
        return pd.DataFrame(columns=["name", "specialty", "contact", "location"])


def find_matching_doctors(conditions, doctor_referrals, doctors_df):
    """
    Find doctors that match the given conditions and referrals based on their specialties.

    Args:
        conditions (list): List of potential medical conditions
        doctor_referrals (list): List of doctor specialty referrals
        doctors_df (pandas.DataFrame): DataFrame of doctors

    Returns:
        list: List of matching doctor dictionaries
    """
    print(f"Finding doctors for conditions: {conditions}")
    print(f"Doctor referrals: {doctor_referrals}")

    # Define condition-to-specialty mapping with more variations
    condition_specialty_map = {
        # Cardiovascular
        "hypertension": "Cardiologist",
        "high blood pressure": "Cardiologist",
        "heart attack": "Cardiologist",
        "arrhythmia": "Cardiologist",
        "cardiovascular": "Cardiologist",
        "cardiovascular disease": "Cardiologist",
        "heart": "Cardiologist",
        "chest pain": "Cardiologist",

        # Respiratory
        "asthma": "Pulmonologist",
        "bronchitis": "Pulmonologist",
        "pneumonia": "Pulmonologist",
        "copd": "Pulmonologist",
        "difficulty breathing": "Pulmonologist",

        # Dermatology
        "eczema": "Dermatologist",
        "rash": "Dermatologist",
        "acne": "Dermatologist",
        "psoriasis": "Dermatologist",
        "skin infection": "Dermatologist",

        # Neurology
        "headache": "Neurologist",
        "migraine": "Neurologist",
        "seizure": "Neurologist",
        "stroke": "Neurologist",
        "multiple sclerosis": "Neurologist",

        # ENT
        "nasal": "ENT Specialist",
        "nasal trauma": "ENT Specialist",
        "nose": "ENT Specialist",
        "nosebleed": "ENT Specialist",
        "ear": "ENT Specialist",
        "throat": "ENT Specialist",
        "sinus": "ENT Specialist",

        # Gastroenterology
        "gastritis": "Gastroenterologist",
        "ulcer": "Gastroenterologist",
        "ibs": "Gastroenterologist",
        "stomach pain": "Gastroenterologist",
        "nausea": "Gastroenterologist",

        # Orthopedics
        "fracture": "Orthopedist",
        "joint pain": "Orthopedist",
        "arthritis": "Orthopedist",
        "back pain": "Orthopedist",
        "sprain": "Orthopedist",

        # Hematology
        "anemia": "Hematologist",
        "blood disorder": "Hematologist",
        "bleeding": "Hematologist",

        # General
        "fever": "General Practitioner",
        "cold": "General Practitioner",
        "flu": "General Practitioner",
        "fatigue": "General Practitioner",
        "general": "General Practitioner"
    }

    # Direct mapping for doctor referrals
    specialty_mapping = {
        "general practitioner": "General Practitioner",
        "cardiologist": "Cardiologist",
        "neurologist": "Neurologist",
        "dermatologist": "Dermatologist",
        "pulmonologist": "Pulmonologist",
        "gastroenterologist": "Gastroenterologist",
        "orthopedist": "Orthopedist",
        "hematologist": "Hematologist",
        "otolaryngologist": "ENT Specialist",
        "ent": "ENT Specialist"
    }

    # Find relevant specialties based on conditions and referrals
    relevant_specialties = set()

    # From conditions
    for condition in conditions:
        condition_lower = condition.lower()
        for key, specialty in condition_specialty_map.items():
            if key in condition_lower:
                relevant_specialties.add(specialty)

    # From doctor referrals
    for referral in doctor_referrals:
        referral_lower = referral.lower()
        if referral_lower in specialty_mapping:
            relevant_specialties.add(specialty_mapping[referral_lower])
        else:
            # Try partial matching for referrals
            for key, specialty in specialty_mapping.items():
                if key in referral_lower or referral_lower in key:
                    relevant_specialties.add(specialty)

    print(f"Identified relevant specialties: {relevant_specialties}")

    # Default to GP if no matches found
    if not relevant_specialties:
        relevant_specialties.add("General Practitioner")

    # Find matching doctors from the DataFrame
    matching_doctors = []

    # Print the first few rows of the doctors DataFrame for debugging
    print(f"Doctors DataFrame sample: {doctors_df.head().to_dict('records')}")

    for specialty in relevant_specialties:
        # Use broader matching to improve chances of finding doctors
        specialty_doctors = doctors_df[
            doctors_df["specialty"].str.contains(specialty.split()[0], case=False, na=False)
        ]

        print(f"Found {len(specialty_doctors)} doctors for specialty '{specialty}'")

        # Convert to list of dictionaries
        for _, doctor in specialty_doctors.iterrows():
            doctor_dict = {
                "name": doctor["name"],
                "specialty": doctor["specialty"],
                "contact": doctor["contact"]
            }

            # Add location if available
            if "location" in doctor and not pd.isna(doctor["location"]):
                doctor_dict["location"] = doctor["location"]

            matching_doctors.append(doctor_dict)

    # If we still don't have matches, get general practitioners
    if not matching_doctors:
        print("No matching specialists found, defaulting to General Practitioners")
        gp_doctors = doctors_df[
            doctors_df["specialty"].str.contains("General", case=False, na=False)
        ]

        for _, doctor in gp_doctors.iterrows():
            doctor_dict = {
                "name": doctor["name"],
                "specialty": doctor["specialty"],
                "contact": doctor["contact"]
            }

            if "location" in doctor and not pd.isna(doctor["location"]):
                doctor_dict["location"] = doctor["location"]

            matching_doctors.append(doctor_dict)

    # Return top 3 matching doctors to avoid overwhelming response
    unique_doctors = []
    seen_names = set()

    for doctor in matching_doctors:
        if doctor["name"] not in seen_names:
            seen_names.add(doctor["name"])
            unique_doctors.append(doctor)

    print(f"Returning {len(unique_doctors[:3])} suggested doctors")
    return unique_doctors[:3]


async def process_medical_query(user_id, query, conversation_history=None):
    """
    Process a medical query using OpenAI's GPT-4o and provide personalized answers.

    Args:
        user_id: The ID of the user
        query: The medical query text
        conversation_history: Previous conversation for context

    Returns:
        dict: Medical advice, potential diagnoses, and doctor recommendations
    """
    try:
        # Prepare messages for the API
        messages = [
            {"role": "system", "content": """
            You are an AI medical assistant. Provide helpful information about medical conditions and symptoms.
            Always include appropriate disclaimers that you are not a replacement for professional medical advice.
            Format your response as a structured JSON with the following fields:
            - answer: Your informative response to the query
            - possible_conditions: An array of potential conditions related to the described symptoms
            - recommendations: General advice and suggestion to consult with a healthcare provider
            - doctor_referrals: An array of specialist types that would be appropriate to consult
            - precautions: Immediate steps or precautions the person should take
            - disclaimer: A clear medical disclaimer
            """}
        ]

        # Add conversation history if available
        if conversation_history:
            for message in conversation_history:
                if isinstance(message, dict) and "role" in message and "content" in message:
                    messages.append({
                        "role": message["role"],
                        "content": message["content"]
                    })

        # Add the current query
        messages.append({"role": "user", "content": query})

        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            response_format={"type": "json_object"}
        )

        # Extract and parse the JSON response
        medical_response = json.loads(response.choices[0].message.content)

        # Ensure all expected fields exist
        if "possible_conditions" not in medical_response:
            medical_response["possible_conditions"] = []

        if "doctor_referrals" not in medical_response:
            medical_response["doctor_referrals"] = []

        # Format doctor referrals if not in expected format
        if not isinstance(medical_response["doctor_referrals"], list):
            medical_response["doctor_referrals"] = [medical_response["doctor_referrals"]]

        # Extract just the specialty names if referrals are in object format
        doctor_referrals = []
        for referral in medical_response["doctor_referrals"]:
            if isinstance(referral, dict) and "specialty" in referral:
                doctor_referrals.append(referral["specialty"])
            elif isinstance(referral, str):
                doctor_referrals.append(referral)

        # Load doctor data from CSV
        doctors_df = load_doctors_from_csv()

        # Find matching doctors based on conditions and referrals
        conditions = medical_response["possible_conditions"]
        suggested_doctors = find_matching_doctors(conditions, doctor_referrals, doctors_df)

        # Add suggested doctors to the response
        medical_response["suggested_doctors"] = suggested_doctors

        return {
            "status": "success",
            "data": medical_response
        }
    except Exception as e:
        print(f"Error in process_medical_query: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to process medical query: {str(e)}"
        }


async def save_medical_query(user_id, query, response):
    """
    Save the medical query and response to the database.

    Args:
        user_id: The ID of the user
        query: The original query
        response: The response provided

    Returns:
        str: The ID of the saved record
    """
    # In a real implementation, this would save to MongoDB
    # For now, we'll return a placeholder
    return "medical_query_id_placeholder"


async def get_doctor_list():
    """
    Retrieve a list of doctors with their specialties and contact information.

    Returns:
        list: List of doctors with their details
    """
    try:
        # Load doctors from CSV instead of generating with OpenAI
        doctors_df = load_doctors_from_csv()

        # Convert DataFrame to list of dictionaries
        doctors_list = doctors_df.to_dict("records")

        # Return the list of doctors
        return doctors_list
    except Exception as e:
        # Fallback to sample data if CSV loading fails
        print(f"Error in get_doctor_list: {str(e)}")
        return [
            {
                "name": "Dr. Jane Smith",
                "specialty": "General Practitioner",
                "contact": "555-1234",
                "location": "Central Medical Center"
            },
            {
                "name": "Dr. John Johnson",
                "specialty": "Cardiologist",
                "contact": "555-5678",
                "location": "Heart Health Clinic"
            },
            {
                "name": "Dr. Sarah Williams",
                "specialty": "Dermatologist",
                "contact": "555-9012",
                "location": "Skin Care Center"
            }
        ]