/* ============================================================
   ALL SITE CONTENT LIVES HERE. Edit this file only.
   Sections on the page: hero · about · experience · skills · projects · recognition · contact
   ============================================================ */

window.ME = {
  name: "Umang Bagadi",
  greeting: "whoami",
  intro: "I design LLM agents and RAG systems where the model proposes and the code checks every claim against its source.",
  role: "GenAI Engineer",
  org: "TCS Research & Incubation",
  years: "2+ years",
  base: "Nagpur, India",
  status: "open to GenAI roles",
  email: "umangbagadi77@gmail.com",
  github: "https://github.com/umangbagadi03",
  linkedin: "https://www.linkedin.com/in/umang-bagadi",
  resume: ""   // optional: a link to your résumé (e.g. Google Drive). Empty = résumé buttons hidden
};

/* About: 2 or 3 short paragraphs. */
window.ABOUT = [
  "I'm a GenAI engineer who likes systems that can be trusted. Most of my work is LLM agents, retrieval and evaluation: making a model's answer traceable to a source, and testing it before it ships.",
  "At TCS Research & Incubation I build agentic workflows and RAG pipelines on domain data. Outside work I build open-source agents, small enough to run on a laptop.",
  "Before that: NLP research in Montreal on a Mitacs Globalink award, and a B.Tech in Artificial Intelligence."
];

/* Experience: newest first. `type` shows as a small badge. */
window.EXPERIENCE = [
  { role: "GenAI Developer", org: "TCS Research & Incubation", place: "Nagpur, India", when: "Aug 2024 – Present", type: "Full-time",
    line: "Agentic AI workflows and RAG pipelines that ground LLM answers in domain-specific data.",
    tags: ["LangGraph", "LangChain", "RAG", "Embeddings", "Python"] },
  { role: "Research Intern", org: "Maharashtra Remote Sensing Application Centre", place: "Nagpur, India", when: "Dec 2023 – Jun 2024", type: "Internship",
    line: "Built a convolutional neural network to classify satellite imagery.",
    tags: ["Deep learning", "CNN", "Python"] },
  { role: "Research Intern", org: "Concordia University · Mitacs Globalink", place: "Montreal, Canada", when: "Jun – Aug 2023", type: "Internship",
    line: "NLP research on sentiment analysis. Fully funded, CAD 12,000 award.",
    tags: ["NLP", "Sentiment analysis", "Python"] },
  { role: "B.Tech, Artificial Intelligence", org: "G.H. Raisoni College of Engineering", place: "Nagpur, India", when: "2020 – 2024", type: "Education",
    line: "CGPA 8.99.", tags: [] }
];

/* Skills: one row per group. Keep each row short (3 to 6 items). */
window.SKILLS = [
  { group: "Core",          items: ["Python", "Machine Learning", "Deep Learning", "NLP"] },
  { group: "Generative AI", items: ["LLMs", "RAG", "AI Agents", "Prompt Engineering", "Tool Calling", "MCP"] },
  { group: "Frameworks",    items: ["LangGraph", "LangChain", "Hugging Face"] },
  { group: "Vector DB",     items: ["Qdrant", "Embeddings", "Hybrid Search", "Reranking"] },
  { group: "Models",        items: ["Claude", "GPT", "Gemini", "Llama"] },
  { group: "Engineering",   items: ["FastAPI", "REST APIs", "LLM Evaluation", "Git"] }
];

/* ------------------------------------------------------------
   PROJECTS: copy this block to add one. Order = order on page.
   Only `name` and `line` are required.

   { name: "My Project",
     line: "One or two short sentences about what it does.",
     year: 2026,                                   // optional
     stack: ["LangGraph", "FastAPI"],              // optional
     code: "https://github.com/umangbagadi03/x",   // optional
     demo: "https://x.app"                         // optional
   },

   Hide one without deleting it: add  hide: true
   ------------------------------------------------------------ */
window.PROJECTS = [
  { name: "IncidentPilot", line: "An agent for production incidents that proves its root cause before it touches anything.",
    stack: ["LangGraph", "Qdrant", "FastAPI"], code: "https://github.com/umangbagadi03/incidentpilot" },
  { name: "Faultline", line: "Finds why an AI agent run failed, proves the fix and writes the regression test.",
    stack: ["LangGraph", "Claude", "pytest"], code: "https://github.com/umangbagadi03/faultline" },
  { name: "Underline", line: "Offline RAG for PDFs. Every sentence is cited; unsupported ones are removed.",
    stack: ["Ollama", "Hybrid search", "Node.js"], code: "https://github.com/umangbagadi03/underline" },
  { name: "Build Your Own Coding Agent", line: "Open course: build a coding agent from scratch, one notebook at a time.",
    stack: ["Python", "Ollama"], code: "https://github.com/umangbagadi03/build-your-own-coding-agent" },
  { name: "Clausemark", line: "Contract Q&A that highlights the exact words behind each answer.",
    stack: ["Qdrant", "Gemini", "FastAPI"], code: "https://github.com/umangbagadi03/clausemark" },
  { name: "Nexus", line: "Company knowledge assistant. Every answer cites its documents.",
    stack: ["RAG", "Reranking", "LangGraph"], code: "https://github.com/umangbagadi03/nexus" },
  { name: "Teller", line: "Bank support agent that can only use tools it has read about in policy docs.",
    stack: ["LangGraph", "FastAPI"], code: "https://github.com/umangbagadi03/teller" },
  { name: "Argus", line: "Multi-agent research assistant that critiques its own draft and loops back.",
    stack: ["LangGraph", "Gemini"], code: "https://github.com/umangbagadi03/argus" },
  { name: "Kasauti", line: "Scan a food label, get a verdict for your health. Rules decide, the LLM explains.",
    stack: ["LangGraph", "FastAPI"], code: "https://github.com/umangbagadi03/kasauti" }
];
window.PROJECTS_VISIBLE = 6;   // how many show before "show all"

/* Certifications and awards. */
window.RECOGNITION = [
  { what: "Claude Certified Developer", who: "Anthropic", when: "2026" },
  { what: "AWS Certified AI Practitioner", who: "Amazon Web Services", when: "2026" },
  { what: "Mitacs Globalink Research Award", who: "Govt. of Canada & AICTE · CAD 12,000", when: "2023" },
  { what: "Smart India Hackathon finalist", who: "among 150,000+ participants", when: "" }
];
