# Codespace Setup Guide

Follow these steps to set up and run the backend in a new GitHub Codespace or any other environment.

## 1. Install Dependencies

This project uses `pipenv` to manage dependencies.

### Option A: Using Pipenv (Recommended)

If `pipenv` is not installed, install it first:

```bash
pip install pipenv
```

Then install the project dependencies:

```bash
pipenv install
```

### Option B: Using pip and requirements.txt

Alternatively, you can install directly from the generated requirements file:

```bash
pip install -r requirements.txt
```

## 2. Environment Configuration

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

**Edit the `.env` file** and set the following variables:

- `RAPIDAPI_KEY`: Your key from RapidAPI (for JSearch).
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
- `JWT_SECRET_KEY`: A secure random string.
- `DATABASE_URL`:
  - Leave it commented out to use **SQLite** (recommended for simple development).
  - Uncomment and set it if you want to connect to a **PostgreSQL** database.

## 3. Database Initialization

If you are using **SQLite** (default configuration in `src/app.py` for local dev):

```bash
# Initialize the database based on existing migrations
pipenv run upgrade
```

_Note: If you encounter issues with migrations from a different environment, you may need to delete the `migrations` folder and `instance/test.db` and run `pipenv run init`, `pipenv run migrate`, and `pipenv run upgrade` again._

## 4. Run the Server

Start the backend server on port 3001:

```bash
pipenv run start
```

## 5. Verify

Open the API URL (usually exposed by Codespaces) and check:

- `GET /api/search_jobs?query=developer` (Tests external API)
- `POST /api/signup` (Tests Database)
