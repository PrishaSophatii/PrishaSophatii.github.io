// All personal content lives here so the site can be updated without touching layout code.
window.PORTFOLIO = {
  name: "Prisha Sophat",
  role: "AI/ML Engineer",
  tagline: "I build LLM and agentic systems that turn messy information into answers people can trust, from fine-tuning and RAG to products that ship.",
  location: "India",
  email: "prishasophat@gmail.com",
  github: "https://github.com/PrishaSophatii",
  linkedin: "https://www.linkedin.com/in/prisha-sophat-808298257",
  resumeUrl: "#",

  // Headline numbers, shown as animated counters
  stats: [
    { from: 72, to: 95, suffix: "%", label: "Syntax accuracy after fine-tuning GPT-OSS-20B" },
    { from: 33.52, to: 12.29, suffix: "%", label: "Word error rate with adaptive audio chunking", decimals: 2 },
    { from: 0, to: 94, suffix: "%", label: "Shorter agent prompts (12,000 to 700 lines), with better relevance" },
    { from: 0, to: 70, suffix: "%", label: "Less manual effort with my LangChain data-extraction agent", prefix: "~" }
  ],

  // Each chapter becomes a spread in the 3D book.
  journey: [
    {
      year: "Chapter 1",
      title: "Curious beginnings",
      place: "Mount Carmel School, Una",
      text: "Where the habit of asking \"how does this work?\" started. Finished 10th with 94.8% and headed into engineering wanting to build things people actually use.",
      tags: ["CISCE", "10th: 94.8%"],
      icon: "spark"
    },
    {
      year: "Chapter 2",
      title: "Learning to build",
      place: "Chitkara University · B.E. Computer Science",
      text: "Studied computer science (CGPA 8.39) and coordinated content for Google Developer Student Clubs, working with developers and designers to bring tech events to campus.",
      tags: ["CS", "GDSC", "C++", "Java"],
      icon: "layers"
    },
    {
      year: "Chapter 3",
      title: "Teaching machines to see",
      place: "Computer vision projects",
      text: "Built a signature verification model with feature extraction and classification, and a liveness detection system that stops spoofing attacks on face recognition in real time.",
      tags: ["Computer vision", "Classification", "Security"],
      icon: "eye"
    },
    {
      year: "Chapter 4",
      title: "Builder of products",
      place: "ShopEase · AI data agent",
      text: "Shipped ShopEase, a MERN e-commerce platform whose seller-buyer feature improved retention and conversion. Then built a LangChain + Groq agent that cut manual data work by ~70%.",
      tags: ["MERN", "LangChain", "Groq", "Streamlit"],
      icon: "bag"
    },
    {
      year: "Chapter 5",
      title: "Samsung, AI Department",
      place: "Samsung Electro-Mechanics · ML Engineer",
      text: "Joined as an ML intern in June 2025 and was offered a full-time role. Fine-tuned GPT-OSS-20B, lifting syntax accuracy from 72% to 95% and type accuracy from 60% to 91%.",
      tags: ["LLM fine-tuning", "Evaluation", "C#/.NET"],
      icon: "rocket"
    },
    {
      year: "Chapter 6",
      title: "RAG, agents and voice",
      place: "Samsung Electro-Mechanics",
      text: "Led an HR document RAG assistant, cut agent prompts by 94%, wired n8n/MCP agents into live tools, and brought ASR word error rate from 33.5% down to 12.3%.",
      tags: ["RAG", "MCP", "n8n", "ASR"],
      icon: "brain"
    },
    {
      year: "Next chapter",
      title: "Apple Store Online",
      place: "Online Retail Decision Automation",
      text: "Bringing retrieval, ranking, LLM and e-commerce experience to the store millions of people use to choose their next Apple product, with privacy as the default.",
      tags: ["Search", "Recommendations", "GenAI", "Privacy"],
      icon: "star"
    }
  ],

  projects: [
    {
      name: "Fine-tuning GPT-OSS-20B",
      blurb: "Prompt optimization, evaluation and fine-tuning at Samsung. Syntax accuracy 72% → 95%, type accuracy 60% → 91%, semantic score 6.75 → 8.00.",
      tags: ["LLM", "Fine-tuning", "Evaluation"]
    },
    {
      name: "HR Document RAG Assistant",
      blurb: "Led an internal retrieval-augmented system that answers HR questions with context from company documents.",
      tags: ["RAG", "Retrieval", "LLM"]
    },
    {
      name: "Adaptive ASR Pipeline",
      blurb: "Transcription, summarization and keyword extraction. Adaptive chunking cut WER from 33.52% to 12.29% and CER from 22.17% to 1.65%.",
      tags: ["ASR", "Speech", "Load testing"]
    },
    {
      name: "AI Agent for Data Extraction",
      blurb: "LangChain + Groq agent that turns CSV and Google Sheets into structured insights: ~30% better retrieval accuracy, ~70% less manual effort.",
      tags: ["LangChain", "Groq API", "Streamlit"]
    },
    {
      name: "ShopEase",
      blurb: "Full-stack MERN e-commerce platform. Defined user journeys and shipped a seller-buyer feature that improved retention and conversion.",
      tags: ["MongoDB", "Express", "React", "Node.js"]
    },
    {
      name: "Liveness Detection for Face Recognition",
      blurb: "Real-time anti-spoofing system that keeps face authentication secure without adding friction for real users.",
      tags: ["Computer vision", "Security", "Real-time"]
    },
    {
      name: "Signature Verification",
      blurb: "Feature extraction and classification model for matching signatures, refined through a real-time prototype and user feedback.",
      tags: ["Classification", "Computer vision"]
    },
    {
      name: "Agentic SDLC Automation",
      blurb: "n8n and MCP workflows connected to a live site, automating multi-step tasks like Bitbucket and SDLC AI-usage reporting.",
      tags: ["n8n", "MCP", "Agents"]
    }
  ],

  skills: [
    "Python", "LLM fine-tuning", "Prompt engineering", "RAG", "LangChain", "Hugging Face",
    "MCP", "n8n", "ASR", "Groq API", "FastAPI", "Streamlit", "React", "Node.js", "Express",
    "C#/.NET", "Java", "C++", "JavaScript", "PostgreSQL", "MySQL", "MongoDB", "Pytest",
    "Git", "Linux", "Agile/Scrum", "Jira"
  ]
};
