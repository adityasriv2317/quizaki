# Quizaki - Interactive Quiz Platform

Quizaki is a web-based application built with React and Vite that allows administrators to create quizzes and users to participate in them. It features an admin dashboard for quiz management and analytics, and a user interface for taking quizzes and viewing results.

## Features

*   **Admin Dashboard:** Manage quizzes (create, view status).
*   **Quiz Creation:** Interface for administrators to add new quizzes with questions and options.
*   **Quiz Taking:** Interface for users to join quiz rooms and answer questions with a timer.
*   **Results & Analytics:** View quiz results, scores, accuracy, and potentially more detailed analytics for admins.
*   **Responsive Design:** Adapts to different screen sizes using Tailwind CSS.

## Tech Stack

*   **Frontend:** React, Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios
*   **Icons:** FontAwesome, Lucide React
*   **State Management:** React Context API

## Backend API

This frontend application interacts with a backend API hosted at:
`https://ccc-quiz.onrender.com`

## Project Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd quizaki
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(Or `yarn install` or `pnpm install`)*

## Running the Development Server

To start the application locally in development mode:

```bash
npm run dev
```
This will typically start the server on http://localhost:5173 . The application utilizes Vite's Hot Module Replacement (HMR) for a fast development experience.

## Building for Production
To create an optimized production build:

```bash
npm run build
 ```

The output files will be generated in the dist directory.
