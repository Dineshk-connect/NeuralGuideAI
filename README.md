# 🧠 NeuralGuide AI  
An AI-driven developer assistant that helps with code analysis, debugging support, learning roadmaps, and task-oriented guidance. NeuralGuide AI combines MERN stack functionality with LLM-powered intelligence to create a personalized assistant for developers.

---

## 🚀 Features

### 🔍 AI Code Analyzer  
- Understands code snippets and gives explanations.  
- Detects potential issues and suggests improvements.  

### 🛠 Interactive Debugger  
- Helps interpret errors and suggests fixes.  
- Provides step-by-step reasoning for debugging.  

### 🎯 Roadmap Generator  
- Generates personalized developer learning paths.  
- Tailored recommendations based on user goals.

### 💬 AI Chat Assistant  
- Context-aware responses.  
- Developer-friendly prompts and structured answers.

### 🔐 Authentication (Firebase)  
- Secure login and signup.  
- Protects user-specific chat history and saved items.

### 💾 Persistent Storage  
- Saves conversations, roadmaps, and user progress via MongoDB.  
- Users can return and continue where they left off.

### 🎨 Clean & Responsive UI  
- Built with React + Tailwind CSS.  
- Reusable components and smooth user experience.

---

## 🏗 Tech Stack

### **Frontend**
- React.js  
- Tailwind CSS  
- Axios  
- React Router  

### **Backend**
- Node.js  
- Express.js  
- Firebase Auth  
- Gemini API integration  

### **Database**
- MongoDB (Atlas)  

---

## 📂 Project Structure

NeuralGuideAI/
│── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── utils/
│── server/ # Express backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── middleware/
│── .env
│── package.json
│── README.md


---

## ⚙️ Installation & Setup

### **1. Clone the repository**
```bash
git clone https://github.com/your-username/NeuralGuideAI.git
cd NeuralGuideAI


## Frontend
cd client
npm install

## Backend
cd server
npm install

## 🔧 Environment Variables

MONGO_URI=your_mongodb_connection_string
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_domain
GEMINI_API_KEY=your_gemini_key
PORT=5000

