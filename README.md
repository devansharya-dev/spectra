# Spectera: AI-Powered Smart Glasses Platform

Spectera is a full-stack web application designed to demonstrate the capabilities of next-generation smart glasses. It integrates real-time visual analysis, speech transcription, and language translation into a unified interface, bridging the gap between physical perception and digital intelligence.

## System Architecture

```mermaid
graph TD
    User[User / Smart Glasses]
    FE[Frontend (React + Vite)]
    BE[Backend (Node.js + Express)]
    
    subgraph Azure_Cloud [Azure AI Services]
        Vision[Computer Vision]
        Speech[Speech Service]
        Trans[Translator]
    end

    User -->|Interacts| FE
    FE -->|HTTP/REST| BE
    
    BE -->|Image Data| Vision
    BE -->|Audio Data| Speech
    BE -->|Text Data| Trans
    
    Vision -->|Scene Description| BE
    Speech -->|Transcript| BE
    Trans -->|Translation| BE
    
    BE -->|JSON Response| FE
    FE -->|Visual Feedback| User
```

## Project Overview

The solution is divided into two main components:

1.  **Frontend**: A responsive React application providing the user interface for camera and microphone interaction. It handles media capture and displays real-time AI insights.
2.  **Backend**: A robust Node.js service acting as the gateway to Azure AI. It handles API authentication, audio transcoding (using FFmpeg), and data orchestration.

## Prerequisites

Refer to `requirements.txt` for specific version numbers and service dependencies.

## Installation & Setup

### 1. Backend Configuration

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your Azure credentials:

```env
PORT=5000
AZURE_VISION_ENDPOINT=<your_endpoint>
AZURE_VISION_KEY=<your_key>
AZURE_SPEECH_KEY=<your_key>
AZURE_SPEECH_REGION=<your_region>
AZURE_TRANSLATOR_KEY=<your_key>
AZURE_TRANSLATOR_REGION=<your_region>
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
```

Start the backend server:

```bash
npm run dev
```

### 2. Frontend Configuration

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Access the application at `http://localhost:5173`.

## Deployment

### Frontend
Build the optimized static assets:
```bash
npm run build
```
Deploy the `dist` folder to any static hosting provider (e.g., Azure Static Web Apps, Netlify, Vercel).

### Backend
Deploy the Node.js application to Azure App Service or any compatible container/server environment. Ensure environment variables are correctly configured in the production environment.

## License

Private and Proprietary.
