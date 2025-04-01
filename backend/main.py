# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import rhyme_script
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# serve static files
app.mount("/static", StaticFiles(directory="frontend/public"), name="static")

# Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # word list loaded once in app.state during startup, meaning it's
    # locked in, not floating around like a beta global var.
    # + built-in app lifecycle management
    try:
        app.state.word_list = load_wordlist()  # Store word_list in state
    except Exception as e:
        return {"error": str(e)}
    
def load_wordlist():
    wordlist_path = "mat/sanit.txt"
    try:
        with open(wordlist_path, "r") as file:
            word_list = file.readlines()
        return [word.strip() for word in word_list]
    except FileNotFoundError:
        raise Exception(f"Word list file not found at {wordlist_path}")

@app.get("/rhyme/{word}")
async def get_rhyme(word: str):
    try:
        rhymes = rhyme_script.find_rhymesss(word, app.state.word_list)  # Access word_list from state
        return {"word": word, "rhymes": rhymes}
    except Exception as e:
        return {"error": str(e)}

