try:
    from app import app
    from api.models import db
    print("Backend imports successful!")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"An error occurred: {e}")
