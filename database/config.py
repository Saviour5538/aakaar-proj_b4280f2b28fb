import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

# Read DATABASE_URL from environment variables
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set.")

# SQLAlchemy engine configuration
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

# Session factory
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Base class for models
Base: DeclarativeMeta = declarative_base()

def get_db():
    """
    Dependency for FastAPI to provide a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()