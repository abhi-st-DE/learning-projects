# Simple Social

**Simple Social** is a straightforward, full-stack social platform that allows users to register, log in, and share image or video posts with captions. The project pairs a modern, asynchronous FastAPI backend with a lightweight Streamlit frontend.

## 🌟 Key Features

* **User Authentication**: Secure user registration and JWT-based authentication handled via `FastAPI Users`.
* **Media Uploads**: Users can upload images (e.g., PNG, JPG) or videos (e.g., MP4) along with text captions.
* **Global Feed**: A central feed displaying all user posts in reverse-chronological order.
* **Content Management**: Users can securely delete posts they own.
* **Cloud Storage**: Seamlessly integrates with `ImageKit` to upload, store, and serve media content efficiently.

## 🛠️ Technology Stack

### Backend
* **[FastAPI](https://fastapi.tiangolo.com/)**: A fast web framework for building the core REST API.
* **[SQLAlchemy (Async)](https://www.sqlalchemy.org/)**: Object-Relational Mapper for managing database interactions asynchronously.
* **[aiosqlite](https://aiosqlite.omnilib.dev/)**: Asynchronous SQLite driver for fast local database operations.
* **[FastAPI Users](https://fastapi-users.github.io/fastapi-users/)**: A pre-packaged library to add complete registration, login, and token generation endpoints.
* **[ImageKit](https://imagekit.io/)**: A third-party cloud service used to store media uploads and perform URL-based transformations.

### Frontend
* **[Streamlit](https://streamlit.io/)**: A fast application framework used here to build the entire user interface, utilizing standard components like `st.image`, `st.video`, and `st.file_uploader`.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Python installed. The project relies on the `uv` package manager for fast virtual environment management and package installation.

### 1. Environment Setup

The backend requires ImageKit API keys to handle media uploads. Create a `.env` file in the root directory and add the following:

```env
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_URL_ENDPOINT=your_url_endpoint_here
```

### 2. Run the Application

The project includes a `start.sh` script to concurrently launch both the API and the user interface.

Ensure the script is executable:
```bash
chmod +x start.sh
```

Launch the stack:
```bash
./start.sh
```

The script will:
1. Start the backend server on `http://localhost:8000`. (It automatically generates the `test.db` SQLite database with the required tables on its first run).
2. Start the Streamlit frontend on `http://localhost:8501`.

### 3. Usage

1. Open `http://localhost:8501` in your browser.
2. Under the **Welcome to Simple Social** page, enter an email and password, then click **Sign Up**.
3. Once registered, click **Login** using the same credentials.
4. Navigate using the sidebar to the **📸 Upload** page to share photos or videos.
5. Check out the **🏠 Feed** to see all recent uploads.

---

## 📁 Project Structure

```text
FastAPI_Project/
├── app/
│   ├── app.py         # Main FastAPI application; includes the Feed, Upload, and Post deletion endpoints
│   ├── db.py          # SQLAlchemy models (User, Post) and the async database engine configuration
│   ├── images.py      # ImageKit SDK initialization
│   ├── schemas.py     # Pydantic models for incoming/outgoing request validation
│   └── users.py       # FastAPI Users configuration, JWT strategy, and user manager
├── frontend.py        # Streamlit interface logic for authentication, feed rendering, and media uploading
├── start.sh           # Bash script wrapper to spin up uvicorn and streamlit simultaneously
├── pyproject.toml     # Project metadata and dependencies (FastAPI, Streamlit, SQLAlchemy, etc.)
└── .env               # Environment configuration file (API Keys)
```
