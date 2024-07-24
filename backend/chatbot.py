from fastapi import FastAPI, Request, HTTPException, Query
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from pydantic import BaseModel
from typing import Optional, List
# Load API key from .env file
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Load the Excel file
excel_file = 'eamcet_data.xlsx'
df = pd.read_excel(excel_file)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to be more restrictive in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class FilterRequest(BaseModel):
    caste: str
    rank: int
    place: Optional[str] = 'All'
    dist: Optional[str] = 'All'
    coed: Optional[str] = 'All'
    type_: Optional[str] = 'All'
    year_of_estb: Optional[str] = 'All'
    branch: Optional[str] = 'All'
    tuition_fee_max: Optional[int] = 0
    affiliated: Optional[str] = 'All'

def get_pdf_text(pdf_file):
    text = ""
    pdf_reader = PdfReader(pdf_file)
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks, api_key):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, use the context, understand
    and give output\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=1, google_api_key=api_key)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def user_input(user_question, api_key):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
    new_db = FAISS.load_local("faiss_index", embeddings)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response["output_text"]

def process_document(pdf_file, api_key):
    raw_text = get_pdf_text(pdf_file)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks, api_key)

# Process the PDF document directly
pdf_file = "txt_file_2.pdf"  # Path to the single PDF file
process_document(pdf_file, api_key)

@app.post("/ask-question")
async def ask_question(request: Request):
    data = await request.json()
    user_question = data.get("question")
    if user_question:
        reply = user_input(user_question, api_key)
        return {"reply": reply}
    return {"error": "Question not provided"}

@app.post("/filter_colleges/")
async def filter_colleges(filters: FilterRequest):
    try:
        # Filter by caste and rank
        if filters.caste not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{filters.caste}' not found in the dataframe.")

        filtered_df = df[df[filters.caste] >= filters.rank]

        # Apply additional filters
        if filters.place != 'All':
            filtered_df = filtered_df[filtered_df['PLACE'] == filters.place]
        if filters.dist != 'All':
            filtered_df = filtered_df[filtered_df['DIST'] == filters.dist]
        if filters.coed != 'All':
            filtered_df = filtered_df[filtered_df['COED'] == filters.coed]
        if filters.type_ != 'All':
            filtered_df = filtered_df[filtered_df['TYPE'] == filters.type_]
        if filters.year_of_estb != 'All':
            filtered_df = filtered_df[filtered_df['YEAR OF ESTB'] == filters.year_of_estb]
        if filters.branch != 'All':
            filtered_df = filtered_df[filtered_df['BRANCH'] == filters.branch]
        if filters.tuition_fee_max > 0:
            filtered_df = filtered_df[filtered_df['TUITION FEE'] <= filters.tuition_fee_max]
        if filters.affiliated != 'All':
            filtered_df = filtered_df[filtered_df['AFFILIATED'] == filters.affiliated]

        # Sort the dataframe in ascending order by the selected caste column
        sorted_df = filtered_df.sort_values(by=filters.caste)

        # Convert to JSON
        result = sorted_df.to_dict(orient='records')
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/filter_options/")
async def filter_options():
    # Get unique values for each filterable column
    options = {
        "PLACE": df["PLACE"].unique().tolist(),
        "DIST": df["DIST"].unique().tolist(),
        "COED": df["COED"].unique().tolist(),
        "TYPE": df["TYPE"].unique().tolist(),
        "YEAR OF ESTB": df["YEAR OF ESTB"].unique().tolist(),
        "BRANCH": df["BRANCH"].unique().tolist(),
        "AFFILIATED": df["AFFILIATED"].unique().tolist(),
    }
    return options