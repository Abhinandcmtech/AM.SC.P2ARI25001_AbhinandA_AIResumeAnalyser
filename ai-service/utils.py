"""
Utility functions for resume text extraction and skill analysis
"""

import re

try:
    import PyPDF2
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

# ─────────────────────────────────────────────
# JOB ROLE → REQUIRED SKILLS DICTIONARY
# Add more roles and skills as needed
# ─────────────────────────────────────────────
JOB_ROLES = {
    "data scientist": [
        "python", "machine learning", "ml", "pandas", "numpy", "statistics",
        "tensorflow", "scikit-learn", "deep learning", "sql", "data analysis",
        "matplotlib", "jupyter", "r", "keras", "nlp"
    ],
    "web developer": [
        "html", "css", "javascript", "js", "react", "node", "nodejs",
        "express", "rest api", "git", "responsive design", "typescript",
        "webpack", "mongodb", "sql"
    ],
    "frontend developer": [
        "html", "css", "javascript", "react", "vue", "angular", "typescript",
        "webpack", "sass", "git", "responsive design", "figma", "redux"
    ],
    "backend developer": [
        "node", "nodejs", "python", "java", "express", "django", "flask",
        "sql", "mongodb", "postgresql", "rest api", "docker", "git",
        "microservices", "redis"
    ],
    "devops engineer": [
        "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins",
        "terraform", "ansible", "linux", "bash", "git", "monitoring",
        "networking", "python"
    ],
    "data analyst": [
        "sql", "excel", "python", "pandas", "tableau", "power bi",
        "statistics", "data visualization", "r", "google analytics",
        "numpy", "matplotlib"
    ],
    "machine learning engineer": [
        "python", "tensorflow", "pytorch", "scikit-learn", "deep learning",
        "ml", "docker", "sql", "numpy", "pandas", "mlops", "kubernetes",
        "flask", "rest api"
    ],
    "full stack developer": [
        "html", "css", "javascript", "react", "node", "express",
        "mongodb", "sql", "git", "rest api", "docker", "typescript"
    ],
    "software engineer": [
        "python", "java", "javascript", "git", "data structures",
        "algorithms", "sql", "oop", "rest api", "testing", "docker"
    ],
    "cybersecurity analyst": [
        "networking", "linux", "python", "security", "firewall", "siem",
        "penetration testing", "encryption", "risk assessment", "compliance"
    ]
}

# Suggestion messages for missing skills
SKILL_SUGGESTIONS = {
    "python": "Learn Python via Python.org or freeCodeCamp",
    "react": "Learn React at react.dev (official docs)",
    "sql": "Practice SQL on SQLZoo or LeetCode",
    "docker": "Follow Docker's official Getting Started guide",
    "machine learning": "Take Andrew Ng's ML course on Coursera",
    "ml": "Take Andrew Ng's ML course on Coursera",
    "tensorflow": "Complete TensorFlow tutorials at tensorflow.org",
    "kubernetes": "Try Kubernetes' interactive tutorials at kubernetes.io",
    "aws": "Start with AWS Free Tier and Cloud Practitioner certification",
    "git": "Learn Git at learngitbranching.js.org",
    "javascript": "Study JavaScript at javascript.info",
    "typescript": "Read TypeScript Handbook at typescriptlang.org",
    "node": "Learn Node.js at nodejs.org/en/learn",
    "nodejs": "Learn Node.js at nodejs.org/en/learn",
    "pandas": "Practice Pandas via Kaggle's free Python course",
    "statistics": "Take Statistics course on Khan Academy",
    "linux": "Learn Linux on Linux Journey (linuxjourney.com)",
    "default": "Search for online courses on Coursera, Udemy, or YouTube"
}


def extract_text_from_pdf(filepath: str) -> str:
    """
    Extract all text from a PDF file using PyPDF2.
    Returns empty string if extraction fails.
    """
    if not PDF_AVAILABLE:
        # Fallback: read as plain text if not PDF
        try:
            with open(filepath, "r", errors="ignore") as f:
                return f.read()
        except Exception:
            return ""

    text = ""
    try:
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

    return text.lower()  # Normalize to lowercase for matching


def extract_skills_from_text(text: str, skill_list: list) -> list:
    """
    Check which skills from skill_list appear in the resume text.
    Uses word-boundary matching to avoid false positives.
    """
    found_skills = []
    text_lower = text.lower()

    for skill in skill_list:
        # Escape special regex characters in skill name
        pattern = re.escape(skill.lower())
        # Match whole word or phrase
        if re.search(r'\b' + pattern + r'\b', text_lower):
            found_skills.append(skill)

    return found_skills


def generate_suggestions(missing_skills: list) -> list:
    """
    Generate actionable suggestions for each missing skill.
    """
    suggestions = []
    for skill in missing_skills:
        skill_lower = skill.lower()
        tip = SKILL_SUGGESTIONS.get(skill_lower, SKILL_SUGGESTIONS["default"])
        suggestions.append(f"Learn {skill.title()}: {tip}")
    return suggestions


def normalize_job_role(job_role: str) -> str:
    """
    Try to match user input to a known job role.
    Returns the matched role or the original input.
    """
    job_role = job_role.strip().lower()

    # Direct match
    if job_role in JOB_ROLES:
        return job_role

    # Partial match (e.g. "data sci" → "data scientist")
    for role in JOB_ROLES:
        if job_role in role or role in job_role:
            return role

    return job_role  # Return as-is even if unknown


def analyze_resume(resume_text: str, job_role: str) -> dict:
    """
    Core analysis function:
    1. Find required skills for the job role
    2. Check which skills exist in the resume
    3. Compute match score
    4. Return structured result
    """
    # Normalize job role input
    normalized_role = normalize_job_role(job_role)

    # Get required skills (fallback to generic tech skills)
    required_skills = JOB_ROLES.get(normalized_role, [
        "communication", "teamwork", "problem solving", "git", "sql"
    ])

    # Find matching skills in resume
    matched_skills = extract_skills_from_text(resume_text, required_skills)

    # Find missing skills
    missing_skills = [s for s in required_skills if s not in matched_skills]

    # Calculate match score as percentage
    if len(required_skills) == 0:
        match_score = 0
    else:
        match_score = round((len(matched_skills) / len(required_skills)) * 100)

    # Generate improvement suggestions
    suggestions = generate_suggestions(missing_skills[:5])  # Top 5 missing

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "job_role": normalized_role,
        "total_required": len(required_skills),
        "total_matched": len(matched_skills)
    }
