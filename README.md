Nora AI - AI Interview Practice Platform
Nora AI is a web application that helps users practice for job interviews with an AI interviewer. Users can upload their resume and a job description, then conduct a Q&A interview with an AI that generates personalized questions. After the interview, the AI provides detailed feedback on the user's performance.

Features
Resume and Job Description Upload: Upload PDF or DOCX files to personalize the interview
AI-Powered Interview: Chat with an AI interviewer that asks tailored questions
Real-Time Transcript: Keep track of all questions and answers
Detailed Feedback: Receive comprehensive feedback on your interview performance
User Authentication: Secure login and registration system
Interview History: Access past interviews and feedback


Tech Stack

Frontend
React with Vite
React Router for navigation
Tailwind CSS for styling
Axios for API requests

Backend
Node.js with Express
MongoDB with Mongoose for data storage
JWT for authentication
Multer for file uploads
Mammoth and pdf-parse for document processing


AI Integration

Claude API for generating interview questions and feedback

Project Structure

nora-ai/
├── backend/           # Express server
│   ├── config/        # Server configuration
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Express middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── utils/         # Utilities
├── frontend/          # React application
│   ├── public/        # Static assets
│   └── src/           # Source code
│       ├── components/  # React components
│       ├── context/     # React context providers
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Page components
│       └── services/    # API services


Getting Started

Prerequisites

Node.js (v16 or higher)
MongoDB
Claude API key


Installation

Clone the repository:

git clone https://github.com/sayamjn/nora-ai.git

cd nora-ai

Install dependencies:

npm run install

Set up environment variables

.env in both the backend and frontend directories

Update the .env for claude api key

Update the environment variables with your own values

Start the development servers:

npm run dev

This will run both the backend server and the frontend development server concurrently.

API Endpoints
Authentication
POST /api/users/register - Register a new user
POST /api/users/login - Login user
Interviews
GET /api/interviews - Get all interviews for current user
GET /api/interviews/:id - Get a specific interview
POST /api/interviews - Create a new interview
POST /api/interviews/:id/start - Start an interview
POST /api/interviews/:id/answer - Submit answer and get next question
POST /api/interviews/:id/end - End an interview
GET /api/interviews/:id/transcript - Get transcript for an interview
Feedback
GET /api/feedback - Get all feedback for current user
GET /api/feedback/:interviewId - Get feedback for a specific interview
POST /api/feedback/:interviewId - Generate feedback for an interview

AI Integration
The application uses the Claude API to generate interview questions and feedback. The following API calls are made:

Question Generation: When a user starts an interview or submits an answer, the application calls the Claude API to generate the next relevant question based on the resume, job description, and previous Q&A.
Feedback Generation: When an interview is completed, the application calls the Claude API to analyze the entire interview transcript and generate comprehensive feedback.

Future Enhancements
Text-to-speech and speech-to-text for a more natural interview experience
Adaptive question logic based on user performance
Interview recording and playback
Mock video interviews

License

This project is licensed under the MIT License - see the LICENSE file for details.

