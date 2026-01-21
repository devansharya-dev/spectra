# Spectera

Spectera is a comprehensive software platform designed for next-generation smart glasses. It orchestrates real-time visual analysis, speech transcription, and multi-language translation through a unified interface, bridging the gap between physical perception and digital intelligence.

## Architecture

The system operates on a streamlined client-server model:

1.  **Frontend (React + Vite)**: Handles media capture (camera/microphone), user interaction, and real-time data visualization.
2.  **Backend (Node.js + Express)**: Serves as the central processing gateway. It manages API authentication, audio transcoding, and orchestrates requests to Azure AI Services for computer vision and speech processing.

## Getting Started

### Backend Setup

1.  Navigate to the `backend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in a `.env` file (refer to administrator documentation for keys).
4.  Start the server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be accessible at `http://localhost:5173`.

## Deployment

-   **Frontend**: Execute `npm run build` to generate static assets in the `dist` folder. These can be hosted on any static web hosting service.
-   **Backend**: Deploy the application to a Node.js runtime environment (e.g., Azure App Service). Ensure all environment variables are correctly set in the production configuration.

## License

Copyright (c) 2026. All Rights Reserved.