from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250), index=True)
    description = Column(String(500))
    completed = Column(Boolean, default=False)
