"""
AI Resume Analyzer Service
Flask API that extracts text from PDFs and matches skills to job roles
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils import extract_text_from_pdf, analyze_resume

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js backend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "AI service is running"}), 200


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Main endpoint: receives PDF + job role, returns analysis
    Expected: multipart/form-data with 'resume' file and 'job_role' field
    """
    # Validate file presence
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files["resume"]
    job_role = request.form.get("job_role", "").strip().lower()

    if not job_role:
        return jsonify({"error": "No job role specified"}), 400

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save file temporarily
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        # Step 1: Extract text from PDF
        resume_text = extract_text_from_pdf(filepath)

        if not resume_text:
            return jsonify({"error": "Could not extract text from PDF"}), 422

        # Step 2: Analyze skills and compute match
        result = analyze_resume(resume_text, job_role)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
