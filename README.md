# mern-notes-app
 
# Notes App (Frontend and Backend)

This is a full-stack Notes Application built using React for the frontend, Node.js and Express for the backend, and MongoDB as the database. The application allows users to create, read, update, delete, and search notes. The backend is secured with JWT authentication.

## Features
- Display a list of all notes.
- Create new notes.
- Edit existing notes.
- Delete notes with confirmation.
- Search notes by title.
- Pagination of notes.
- User authentication (login, logout).
- Secure API with JWT authentication.

## Requirements

### Frontend
- React
- Tailwind CSS (for styling)
- Axios (for making HTTP requests)

### Backend
- Node.js
- Express
- MongoDB
- JWT (for authentication)

## Setup and Installation

### 1. Clone the Repository

Clone the repository from GitHub and navigate to the project directory:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
2. Backend Setup (API)
2.1. Install Dependencies
In the backend directory, install the necessary dependencies:

bash
Copy code
cd backend
npm install
2.2. Create .env file
In the backend directory, create a .env file and add the following environment variables:

env
Copy code
PORT=5000
MONGO_URI=mongodb+srv://<your_mongodb_username>:<your_mongodb_password>@cluster0.mongodb.net/notesdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
Replace <your_mongodb_username> and <your_mongodb_password> with your MongoDB Atlas credentials.
Replace your_jwt_secret with a secret key for JWT encoding.
2.3. Start the Backend Server
Start the backend server using the following command:

bash
Copy code
npm run dev
The backend server should now be running at http://localhost:5000.

3. Frontend Setup (React)
3.1. Install Dependencies
In the frontend directory, install the necessary dependencies:

bash
Copy code
cd frontend
npm install
3.2. Configure the API URL
In the src folder of your frontend, find the file that handles API calls (e.g., api.js or axios.js) and configure the base URL for the API:

js
Copy code
const API_URL = 'http://localhost:5000/api'; // Replace with your backend API URL if hosted elsewhere
3.3. Start the Frontend Server
Start the frontend React server using the following command:

bash
Copy code
npm start
The frontend should now be running at http://localhost:3000.

4. MongoDB Setup
4.1. Create a MongoDB Cluster
Go to MongoDB Atlas and sign in or create an account.
Create a new cluster, then select the free tier.
Once the cluster is created, go to the Database Access tab and add a new database user with appropriate permissions (read and write).
Go to the Network Access tab and whitelist your IP address to allow connections from your machine.
In the Clusters tab, click on Connect to get the connection string for your cluster. Copy the connection string and update it in your .env file.
4.2. Replace MongoDB URI
In your backend .env file, replace the MONGO_URI with the MongoDB connection string you copied from Atlas.

Example:

env
Copy code
MONGO_URI=mongodb+srv://<your_mongodb_username>:<your_mongodb_password>@cluster0.mongodb.net/notesdb?retryWrites=true&w=majority
5. Frontend and Backend Interaction
Once both frontend and backend are set up and running, they should communicate as follows:

Login: The frontend will send login credentials to the backend.
JWT Token: Upon successful login, the backend will return a JWT token, which the frontend will store in localStorage.
Secure Routes: All subsequent API requests to the backend will include the JWT token in the Authorization header to verify the user's identity.
6. Testing the Application
Create Note: Once logged in, you should be able to create a note.
View Notes: All notes will be displayed in a list view.
Edit Note: You can edit existing notes by clicking on them.
Delete Note: Notes can be deleted with a confirmation prompt.
Search: The notes can be filtered by title.
7. Deployment (Optional)
7.1. Frontend Deployment
You can deploy the frontend using services like Vercel or Netlify.

7.2. Backend Deployment
For the backend, you can use services like Heroku or Render.

Once deployed, make sure to update the frontend's API URL to the deployed backend URL.
