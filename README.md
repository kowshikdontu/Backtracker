# Backtracker

Backtracker is a custom DSA‑sheet sharing and management platform built for college programmers to create, share, and collaborate on curated problem sets. It is meant mainly for saving problems of different platforms in a sheet and use it while revising. The frontend is a modern React app (built with Vite) and the backend is a high‑performance FastAPI service with SQLAlchemy ORM.

**Live Demo**: https://backtracker1.onrender.com  
*(Access restricted to college email addresses, you’ll need your `@vitapstudent.ac.in` ID to log in.)*

---

## Table of Contents

- [Features](#features)  
- [Screenshots](#screenshots)  
- [Tech Stack](#tech-stack)  
- [Architecture](#architecture)  
- [My Role](#my-role)  
- [Installation](#installation)  
  - [Prerequisites](#prerequisites)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)  
- [Usage](#usage)  
- [API Documentation](#api-documentation)  
- [Contributing](#contributing)  
- [Contact](#contact)  
- [Acknowledgements](#acknowledgements)  

---

## Features

- **User Authentication** via institutional email (Note: this website is made for VIT-AP Students only) 
- **Create & Manage Sheets**: group problems by topic, difficulty, status  
- **Share & Collaborate**: share read‑only/public links with peers , with options to add (+) desired to your sheet  
- **Filtering & Search**: find problems by tag, difficulty, or title  
- **Responsive UI**: built with React and Vite for snappy client‑side performance and visualized meteric using bar graphs
- **Robust API**: FastAPI backend with SQLAlchemy models, Pydantic validation, and automated docs  

---

## Screenshots ( for others, as only vitap students can login)

<!-- Add your deployed screenshots into a `screenshots/` folder and update these paths -->
### login page
<img width="993" height="874" alt="image" src="https://github.com/user-attachments/assets/14aa0d8d-e219-4858-97a0-a1b451077c0f" />

### Home / Dashboard  
<img width="1919" height="884" alt="image" src="https://github.com/user-attachments/assets/976740ff-990d-4deb-ad35-edbd2611214b" />

### to add problems to sheet
<img width="1889" height="895" alt="image" src="https://github.com/user-attachments/assets/9f6c615e-69f5-408a-b38f-651ed9a64fbf" />

### after adding problems
<img width="1873" height="753" alt="image" src="https://github.com/user-attachments/assets/5e97757b-3127-411e-a1fa-b7593eafbc84" />

### to view other sheet
<img width="1847" height="870" alt="image" src="https://github.com/user-attachments/assets/620b1412-9b30-40ca-88ba-718703fb2726" />


---

## Tech Stack

- **Backend**  
  - Python 3.10, FastAPI  
  - SQLAlchemy ORM, PostgreSQL  
  - Uvicorn ASGI server  
  - Pydantic for data validation  
- **Frontend**  
  - React 18+, Vite  
  - React Router, Axios  
  - CSS Modules / your preferred styling  
- **Dev & Deployment**  
  - GitHub Actions CI (optional)  
  - Docker Compose (optional)  
  - Deployed on Render with seeded data
  - Currently AWS Architecture designing is going on!

---

## Architecture

```
┌────────────┐       ┌──────────────┐       ┌────────────┐
│            │  HTTP │              │  SQL  │            │
│   React    │──────▶│  FastAPI     │──────▶│ PostgreSQL │
│ (frontend) │       │  (backend)   │       │ (database) │
│            │◀──────│              │◀──────│            │
└────────────┘  JSON └──────────────┘  ORM  └────────────┘
```

---

## My Role

- **Backend Development**  
  - Designed and implemented the RESTful API with FastAPI  
  - Defined SQLAlchemy models, migrations, and relational schemas  
  - Secured endpoints with JWT‑based authentication tied to college email domain  
  - Wrote Pydantic schemas for request/response validation  
- **Collaboration**  
  - Worked alongside a junior teammate who built out the React/Vite frontend  
  - Integrated API endpoints with frontend components via Axios  
  - Coordinated on teams meet in summer vacation holidays  

---

## Installation

### Prerequisites
- no much version specific installations
- Python 3.11+  
- Node.js 16+ & npm or Yarn  
- PostgreSQL 12+ (or any SQL‑compatible DB)  

### Backend Setup

```bash
# 1. Clone this repo
git clone https://github.com/kowshikdontu/Backtracker.git
cd Backtracker/app

# 2. Create & activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
pip install --upgrade pip
pip install -r ../requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Edit DATABASE_URL, SECRET_KEY, etc. in .env

# 5. Run database migrations (if using Alembic)
# alembic upgrade head

# 6. Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# In a new terminal:
cd Backtracker/frontend
npm install
npm run dev
```

By default, the frontend will proxy API requests at `/api` to `localhost:8000`.

---

## Usage

1. Register or log in with your college email.  
2. DSA Corner has a dedicated sheet, where you can save your problem links with desired tags.  
3. Add or import problems (LeetCode IDs, custom entries).  
4. Share your sheet via access code.  
5. Exam Corner under construction for easy paper sharing during semester exams

---

## API Documentation

FastAPI provides interactive docs:
<img width="1047" height="728" alt="image" src="https://github.com/user-attachments/assets/827bf5de-93b3-4d45-834b-13e75d5fa88e" />

- **Swagger UI**: `http://localhost:8000/docs`  
- **Redoc**:       `http://localhost:8000/redoc`  

---


## Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/foo`)  
3. Commit your changes (`git commit -am "Add foo"`)  
4. Push to the branch (`git push origin feature/foo`)  
5. Open a Pull Request for review  

Please follow the existing code style and write tests where applicable.

---

## Contact

Developed by **Dontu Kowshik**  
- GitHub: [@kowshikdontu](https://github.com/kowshikdontu)  
- Email: kowshik.22bce9556@vitapstudent.ac.in 

---

## Acknowledgements

- Thanks to my frontend collaborator for building the React/Vite UI  
- Inspired by the full‑stack FastAPI + React templates  
