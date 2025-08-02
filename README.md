Project Overview
This is a full-stack patient document portal that allows users to upload, view, and manage their medical documents (PDFs). It’s built using:
•	Frontend: React
•	Backend: Express.js (Node.js)
•	Database: PostgreSQL
•	Storage: Local folder (uploads/)
 Features
•	Upload PDF medical documents
•	View list of all uploaded files with size
•	Download any uploaded PDF
•	Delete files no longer needed
•	Simple and user-friendly interface
•	Stores metadata like original filename, file size, and upload date

 How to Run It Locally
Prerequisites:
•	Node.js & npm installed
•	PostgreSQL installed and running
•	Git installed
Step 1:  Clone the Repository
Step 2:  Set Up the Backend
Step 3:  Create PostgreSQL Database
1.	Open your PostgreSQL client (pgAdmin or terminal)
2.	Create a database (e.g., patient_docs)
3.	Run the following SQL to create the table:
 Create a .env file in backend/:
 Start the backend server:
Step 3: Set Up the Frontend
Project is Running!
You can now:
•	Upload PDFs
•	View them in the list
•	Download or delete any document
