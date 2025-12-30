import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Setup: Load Environment Variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# AI Model Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('models/gemini-2.5-flash')

# 2. FastAPI App Start
app = FastAPI()

# CORS Setup (Taaki frontend isse connect kar sake)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Data Loading Function (JSON padhne ke liye)
def load_knowledge_base():
    knowledge = {}
    
    # 1. Products Load karo
    try:
        with open("data/products.json", "r") as f:
            knowledge["products"] = json.load(f)
    except:
        knowledge["products"] = []

    # 2. Policies Load karo
    try:
        with open("data/policies.json", "r") as f:
            knowledge["policies"] = json.load(f)
    except:
        knowledge["policies"] = {}
        
    return knowledge

# 4. Data Structure (Request Body)
class UserRequest(BaseModel):
    message: str

# 5. The Main Chat Logic
@app.post("/chat")
async def chat_endpoint(request: UserRequest):
    user_message = request.message
    
    # Naya function call karein
    knowledge_data = load_knowledge_base()
    
    system_prompt = f"""
    You are a smart Customer Support Agent for 'TechShop'.
    
    HERE IS YOUR KNOWLEDGE BASE:
    1. PRODUCTS INVENTORY:
    {json.dumps(knowledge_data.get('products', []))}
    
    2. STORE POLICIES:
    {json.dumps(knowledge_data.get('policies', {}))}

    RULES:
    - If user asks about a PRODUCT, check the Inventory list.
    - If user asks about RETURNS/SHIPPING, check the Policies.
    - If info is missing, say "I don't have that information."
    - Be polite and concise.
    
    User Question: {user_message}
    """
    
    try:
        response = model.generate_content(system_prompt)
        return {"reply": response.text}
    except Exception as e:
        print(f"Error: {e}")
        return {"reply": "Internal Server Error"}
    
    try:
        # AI ko data bhejna
        response = model.generate_content(system_prompt)
        return {"reply": response.text}
    except Exception as e:
        # Ye error Terminal mein print karega
        print(f" ASLI ERROR YE HAI: {e}") 
        # Ye error Browser mein dikhayega
        return {"reply": f"Error details: {str(e)}"}

# Server Test Route
@app.get("/")
def home():
    return {"status": "Bot is Online "}
