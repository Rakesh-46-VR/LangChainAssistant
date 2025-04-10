# 🧠 Agentic AI Research Assistant

A lightweight, modular, and agent-powered AI research assistant built with **FastAPI**, **LangChain**, and **Next.js**. It supports multi-tool reasoning using LLMs, web search (via SerpAPI), math evaluation, and custom logic tools — making it ideal for research, information retrieval, and interactive reasoning tasks.

---

## 🚀 Features

- 🤖 **LLM Agent (LangChain)** with multi-tool capabilities
- 🌐 **Web search** using SerpAPI
- 🧹 **Custom logic tools** for reasoning tasks
- 💡 **Memory-enabled conversation flow**
- ⚡ FastAPI backend + Next.js frontend
- 🧹 Easily customizable and extendable

---

## 📦 Tech Stack

- Backend: [FastAPI](https://fastapi.tiangolo.com/), [LangChain](https://www.langchain.com/), [DeepInfra](https://deepinfra.com/) / [Ollama](https://ollama.ai/)
- Frontend: [Next.js](https://nextjs.org/) (in `research_agent/` directory)
- LLMs: Mistral, LLaMA 2, or any Ollama/DeepInfra-supported model
- Tools: SerpAPI, LLMMathChain, custom logic tools

---

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rakesh-46-VR/AutoResearchAgent.git
cd AutoResearchAgent
```

### 2. Create Your Environment File

Copy the `.env.example` file and fill in the necessary values:

```bash
cp .env.example .env
```

**Edit `.env`:**

```env
SERP_API_KEY="your-serpapi-key"
MODEL_ID="mistral"
OLLAMA_BASE_URL="http://127.0.0.1:11434"
ALLOWED_ORIGIN="http://localhost:3000"
```

---

### 3. Install Backend Dependencies

```bash
cd fastapi
pip install -r req.txt
```

---

### 4. Start the FastAPI Backend

```bash
uvicorn app:app --reload
```

By default, it runs at `http://localhost:8000`.

---

### 5. Start the Frontend (Next.js)

The frontend is located in the `research_agent/` directory:

```bash
cd ../research_agent
pnpm install
pnpm dev
```

Frontend runs at `http://localhost:3000`

Make sure the `ALLOWED_ORIGIN` in your `.env` matches this URL.

---

## 🧪 Example Usage

### 🧠 Ask a Question

Send a POST request to `/ask` endpoint:

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "Evaluate the expression 2+6-9*3+6?"}'
```

Response:

```json
{
  "content": "The result of the expression 2 + 6 - 9 * 3 + 6 is -13."
}
```

Or use the chat interface in the `research_agent` frontend to interact via a sleek UI.

---

## 🧰 Custom Tools

This project supports easily pluggable custom tools. You can create your own logic tools like this:

```python
def frequency_count(word: str, char: str):
    return word.count(char)
```

And register it in the tools list via LangChain's `Tool` interface.

## 📚 Resources

- [LangChain Agents Documentation](https://python.langchain.com/docs/modules/agents/)
- [SerpAPI Docs](https://serpapi.com/)
- [Ollama Setup Guide](https://ollama.com/library)
