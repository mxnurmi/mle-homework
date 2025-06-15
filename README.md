## RUNNING THE PROJECT WITH DOCKER

#### REQUIREMENTS 

- Install Docker Desktop from https://docs.docker.com/desktop/ for the right OS

#### TO LAUNCH THE PROJECT

- Update you gemini API key into an .env file under this project. Key generation here: https://ai.google.dev/gemini-api/docs/api-key
- then run `docker-compose up --build` in the project root folder

#### TO ACCESS THE PLATFORM

- Go to http://localhost:5173/

## RUNNING FRONTEND & BACKEND SEPARATELY (WITHOUT DOCKER)

**Frontend**
1. Open a terminal and navigate to the `Frontend` directory.
2. Run `npm install` (first time only).
3. Start the dev server:
   ```
   npm run dev
   ```
   The app will be available at http://localhost:5173/

**Backend**

_Prerequisite: (You must have `GEMINI_API_KEY` set up as env variable)_
1. Open another terminal and navigate to the `Backend` directory.
2. Run `pip install -r requirements.txt` (first time only).
3. Start the FastAPI server:
   ```
   uvicorn run:app --reload
   ```
   The API will be available at http://localhost:8000/
