import os
from pathlib import Path
from dotenv import load_dotenv

backend_root = Path(__file__).resolve().parent
env_path = backend_root / '.env'
load_dotenv(dotenv_path=env_path)

import logging
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, EmailStr

# Initialize Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("backend.log", encoding="utf-8")
    ]
)
logger = logging.getLogger("portfolio-backend")

# Initialize FastAPI app
app = FastAPI(
    title="Chimata Sai Nihal Portfolio API",
    description="Backend API for message ingestion and resume download service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
DB_FILE = "submissions.db"

def init_db():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                submitted_at TEXT NOT NULL
            )
        """)
        conn.commit()
        conn.close()
        logger.info("SQLite Database initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize SQLite Database: {e}")

init_db()

# Pydantic schema for contact payload validation
class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    message: str

# Message Ingestion Endpoint
@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
async def submit_contact_form(payload: ContactPayload):
    logger.info(f"Incoming contact form submission from {payload.name} ({payload.email})")
    
    try:
        # Save submission securely to SQLite Database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO contact_submissions (name, email, message, submitted_at) VALUES (?, ?, ?, ?)",
            (payload.name, payload.email, payload.message, datetime.utcnow().isoformat())
        )
        conn.commit()
        conn.close()
        
        logger.info(f"Submission from {payload.email} successfully stored in database.")
        
        # SMTP email dispatch routing
        email_user = os.environ.get("EMAIL_HOST_USER")
        email_password = os.environ.get("EMAIL_HOST_PASSWORD")
        
        if email_user and email_password:
            try:
                # Construct MIME structures
                msg = MIMEMultipart()
                msg['From'] = email_user
                msg['To'] = 'sainihal.chimata@gmail.com'
                msg['Subject'] = f"[Portfolio Contact Form] Message from {payload.name}"
                
                body = f"Name: {payload.name}\nEmail: {payload.email}\n\nMessage:\n{payload.message}"
                msg.attach(MIMEText(body, 'plain', 'utf-8'))
                
                # Connect to Gmail SMTP server
                server = smtplib.SMTP("smtp.gmail.com", 587)
                server.starttls()
                server.login(email_user, email_password)
                server.sendmail(email_user, ['sainihal.chimata@gmail.com'], msg.as_string())
                server.quit()
                
                logger.info(f"Email successfully dispatched to sainihal.chimata@gmail.com via TLS.")
            except Exception as smtp_err:
                logger.error(f"Failed to dispatch contact notification email: {smtp_err}")
                return JSONResponse(
                    status_code=500,
                    content={"status": "error", "message": f"SMTP Fail: {str(smtp_err)}"}
                )
        else:
            logger.warning("SMTP credentials not configured in environment. Skipping email forwarding.")
            
        return {
            "status": "success",
            "message": "Message successfully dispatched."
        }
        
    except sqlite3.Error as db_err:
        logger.error(f"Database error during submission ingestion: {db_err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error. Database insertion failed."
        )
    except Exception as exc:
        logger.error(f"Unexpected error during submission ingestion: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected system error occurred."
        )

# Resume delivery asset path
RESUME_FILE = "resume.pdf"
logger.info(f"SMTP & Resume configuration: Expecting official PDF asset at: {os.path.abspath(RESUME_FILE)}")

# Establish a helper to generate a placeholder PDF if none exists
def create_dummy_resume():
    if not os.path.exists(RESUME_FILE):
        try:
            logger.info("Resume file not found. Generating a placeholder PDF asset.")
            # Standard minimal PDF structure bytes
            pdf_bytes = (
                b"%PDF-1.4\n"
                b"1 0 obj <</Type/Catalog/Pages 2 0 R>> endobj\n"
                b"2 0 obj <</Type/Pages/Kids[3 0 R]/Count 1>> endobj\n"
                b"3 0 obj <</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R>> endobj\n"
                b"4 0 obj <</Length 62>> stream\n"
                b"BT /F1 24 Tf 100 700 Td (Chimata Sai Nihal - Curriculum Vitae) Tj ET\n"
                b"endstream endobj\n"
                b"xref\n"
                b"0 5\n"
                b"0000000000 65535 f\n"
                b"0000000009 00000 n\n"
                b"0000000056 00000 n\n"
                b"0000000111 00000 n\n"
                b"0000000201 00000 n\n"
                b"trailer <</Size 5/Root 1 0 R>>\n"
                b"startxref\n"
                b"0000000312\n"
                b"%%EOF\n"
            )
            with open(RESUME_FILE, "wb") as f:
                f.write(pdf_bytes)
            logger.info("Placeholder resume.pdf successfully created.")
        except Exception as e:
            logger.error(f"Failed to create dummy resume.pdf: {e}")

create_dummy_resume()

# Static File Resume Stream Route
@app.get("/api/resume/download")
async def download_resume():
    # Make sure resume file is available
    create_dummy_resume()
    
    if not os.path.exists(RESUME_FILE):
        logger.error("Requested resume document file could not be found or generated.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume document file is currently unavailable."
        )
        
    logger.info("Streaming resume download file to requester.")
    return FileResponse(
        path=RESUME_FILE,
        media_type="application/pdf",
        filename="Chimata_Sai_Nihal_Resume.pdf"
    )
