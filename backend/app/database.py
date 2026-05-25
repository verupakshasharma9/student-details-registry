from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# SQLite requires 'connect_args={"check_same_thread": False}' for multithreaded FastAPI apps
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Dependency generator function that yields a database session
    and guarantees it is closed after request processing finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
