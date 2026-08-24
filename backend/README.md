# AI-Powered Revenue Recovery System

An AI-driven payment recovery platform that analyzes failed payments,
recommends recovery strategies, applies backend guardrails, and routes
high-risk or high-value cases for human approval.

## Problem Statement

Failed payments can lead to significant revenue leakage.
Manually identifying the reason for payment failures and deciding the
appropriate recovery action is time-consuming and difficult to scale.

This project automates the decision-making process using AI while keeping
financial actions under backend-controlled guardrails.

## Solution

The system analyzes failed payments using Gemini and LangGraph.

Based on payment and customer context, the AI recommends a recovery
strategy such as:

- Retry Payment
- Personalized Reminder
- Alternative Payment Method
- Personalized Recovery Offer
- Recovery Reminder

The AI recommendation is then validated by backend guardrails.

High-risk, low-confidence, or high-value transactions are routed for
human approval.

## Architecture

React
    |
    v
FastAPI
    |
    v
LangGraph
    |
    v
Gemini
    |
    v
AI Decision
    |
    v
Guardrails
    |
    +----------------------+
    |                      |
    v                      v
AUTO_EXECUTE        HUMAN_APPROVAL
    |                      |
    v                      v
Recovery Action       Admin Approval
    |                      |
    +----------+-----------+
               |
               v
          Recovery
               |
               v
           Dashboard

## Tech Stack

### Frontend
- React
- JavaScript
- Tailwind CSS
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### AI
- Google Gemini
- LangGraph
- LangChain

### Development
- uv
- Git
- REST APIs

## AI Decision Flow

1. Fetch failed payment information.
2. Fetch customer context.
3. Send relevant context to Gemini.
4. Gemini generates a structured recovery recommendation.
5. LangGraph passes the decision through guardrails.
6. Low-risk decisions can be automatically executed.
7. High-value, high-risk, or low-confidence decisions require approval.
8. A recovery record is created.
9. Recovery outcome is stored.
10. Dashboard metrics are updated.

## Guardrails

The backend does not blindly trust the AI output.

Current guardrails include:

- Confidence below 0.80 requires approval.
- HIGH risk requires approval.
- Transactions of ₹50,000 or more require approval.
- Invalid confidence values require approval.

This ensures that the AI recommends actions but does not have unrestricted
authority over the recovery workflow.

## Recovery Lifecycle

PENDING
    |
    v
AI_ANALYZED
    |
    v
APPROVAL_REQUIRED
    |
    v
APPROVED
    |
    v
MESSAGE_SENT
    |
    v
RECOVERED

Rejected cases follow:

APPROVAL_REQUIRED
    |
    v
REJECTED

## Project Features

- Failed payment analysis
- AI-powered recovery recommendation
- Structured Gemini output
- LangGraph workflow orchestration
- Backend guardrails
- Human approval workflow
- Recovery tracking
- Duplicate recovery protection
- Payment retry simulation
- Recovery result tracking
- Real-time dashboard metrics


## Running the Backend
cd backend

## Install dependencies:
uv sync

## If dependencies are not already present:
uv add fastapi
uv add uvicorn
uv add sqlalchemy
uv add psycopg2-binary
uv add python-dotenv
uv add pydantic
uv add langgraph
uv add langchain-google-genai

## Database Setup
Make sure PostgreSQL is running.

## CREATE DATABASE revenue_recovery;

Database URL:

postgresql://postgres:YOUR_PASSWORD@localhost:5432/revenue_recovery

## Backend Environment Variables

Create this file:
backend/.env

Add:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/revenue_recovery
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

Replace:
YOUR_PASSWORD
YOUR_GEMINI_API_KEY
with your actual values.


## Start Backend
uv run uvicorn main:app --reload

Backend:
http://127.0.0.1:8000

Swagger:
http://127.0.0.1:8000/docs

## Frontend Setup
npm install

## Frontend Environment Variables

Create:
frontend/.env

Add:
VITE_API_URL=http://127.0.0.1:8000

## Start Frontend
npm run dev

