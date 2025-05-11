import os
import re
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain.memory import ConversationBufferMemory
from langchain_community.utilities import SerpAPIWrapper
from langchain.agents import initialize_agent, Tool
from langchain.chains import LLMMathChain, LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama

load_dotenv()
os.environ["SERPAPI_API_KEY"] = os.getenv("SERP_API_KEY")

llm = Ollama(model=os.getenv("MODEL_ID"), base_url = os.getenv("OLLAMA_BASE_URL"))

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

word_problem_template = """
    You are a reasoning agent tasked with solving 
    the user's logic-based questions. Logically arrive at the solution, and be 
    factual. In your answers, clearly detail the steps involved and give the 
    final answer. Provide the response in bullet points. 
    Question  {question} Answer
"""

math_assistant_prompt = PromptTemplate(input_variables=["question"],
                                       template=word_problem_template
                                       )
word_problem_chain = LLMChain(llm=llm, prompt=math_assistant_prompt)

search = SerpAPIWrapper()
problem_chain = LLMMathChain.from_llm(llm=llm)

def extract_math_expression(text):
    match = re.search(r'([\d\+\-\*/\.\(\)\s]+)', text)
    return match.group(1).strip() if match else text

def safe_math_tool(input_text):
    try:
        expression = extract_math_expression(input_text)
        return problem_chain.run(expression)
    except Exception as e:
        return f"Error: {e}"

def frequency_count(input:str, character:str):
    count = 0
    for letter in input:
        if(letter == character):
            count += 1
    return count

def frequency_tool(input_str: str):
    try:
        # Expecting format: "strawberry", "r"
        parts = [s.strip().strip('"') for s in input_str.split(",")]
        if len(parts) != 2:
            return "Invalid input format. Use: \"string\", \"character\""
        result = frequency_count(parts[0], parts[1])
        return str(result)
    except Exception as e:
        return f"Error: {e}"

# Custom calculator function (we have use pre built MathLLMChains to avoid security concerns)
def safe_calculator(expression: str) -> str:
    """Safely evaluate mathematical expressions using eval() with restricted globals/locals"""

    try:
        # Evaluate with restricted access
        result = eval(
            expression
        )

        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="Search the web for current information"
    ),
    Tool(
        name="Calculator",
        func=safe_calculator,
        description=(
            "Useful for numerical calculations. "
            "You should use double quotes to wrap the input."
            "Input must be a valid math expression like \"2 + 2\" or \"5+6-9*8\""
            "Supports +, -, *, /, ^, %, and math module functions."
        )
    ),
    Tool(
        name="Reasoning Tool",
        func=word_problem_chain.run,
        description="Useful for when you need to answer logic-based/reasoning questions."
    ),
    Tool(
        name="Frequency tool",
        func=frequency_tool,
        description="Counts how many times a character appears in a string. Input format: \"string\", \"character\""
    )
]

agent = initialize_agent(tools, 
            llm, 
            agent="zero-shot-react-description",
            verbose=False,  
            handle_parsing_errors=True, 
            max_iterations = 2,
            early_stopping_method="generate",
            memory=memory,
            return_intermediate_steps=True
        )

app = FastAPI()

allowed_origin = os.getenv("ALLOWED_ORIGIN")

origins = [allowed_origin]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
async def ask_agent(req: QueryRequest):
    response = agent.invoke({"input": req.query})
    return {"content": response.get("output")}

@app.get("/info")
async def get_server_info():
    """
    Get basic server information.

    TODO: Return system status, environment info, uptime, or other useful metadata.
    """
    return {}
