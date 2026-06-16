from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

def _normalize_database_url(database_url: str) -> str:
	url = make_url(database_url)

	if url.drivername == "postgresql":
		url = url.set(drivername="postgresql+psycopg")

	return str(url)


engine = create_engine(_normalize_database_url(settings.database_url), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
	database = SessionLocal()
	try:
		yield database
	finally:
		database.close()
