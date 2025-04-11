# main.py
import os
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import get_rhymes # add "from . " prefix for local development
from fastapi.staticfiles import StaticFiles

# Load environment variables
load_dotenv(find_dotenv())

app = FastAPI()

# serve static files
# app.mount("/static", StaticFiles(directory="frontend/public"), name="static")

ALLOWED_ORIGIN = os.getenv("REACT_APP_FRONTEND_URL", "*")

# Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # ALLOWED_ORIGIN / "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    wordlist_path = os.getenv("SANIT_FILE_PATH")
    # word list loaded once in app.state during startup, meaning it's
    # locked in, not floating around like a beta global var.
    # + built-in app lifecycle management
    try:
        app.state.word_list = load_wordlist(wordlist_path)  # Store word_list in state
    except Exception as e:
        print(e)
        return {"error": str(e)}
    
def load_wordlist(wordlist_path):
    try:
        with open(wordlist_path, "r") as file:
            word_list = file.readlines()
        return [word.strip() for word in word_list]
    except FileNotFoundError as e:
        print(e)
        raise Exception(f"Word list file not found at {wordlist_path}")

@app.get("/rhyme/{word}/{type}")
async def fetch_rhymes(word: str, type: str):
    try:
        # Access word_list from state
        if type == "vowel":
            rhymes = get_rhymes.find_vowel_rhymes(word, app.state.word_list)
        elif type == "consonant":
            rhymes = get_rhymes.find_consonance_rhymes(word, app.state.word_list)
        result = {"word": word, "rhymes": rhymes or {}}
        return result
    except Exception as e:
        error_response = {"error": str(e), "rhymes": {}}
        print("Error:", error_response)
        return error_response

