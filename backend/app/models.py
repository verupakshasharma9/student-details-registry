from sqlalchemy import Column, Integer, String, Date, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    enrollment_number = Column(String(50), unique=True, index=True, nullable=False)
    course = Column(String(100), nullable=False)
    gpa = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    def __repr__(self):
        return f"<Student(id={self.id}, name='{self.first_name} {self.last_name}', email='{self.email}', enrollment='{self.enrollment_number}')>"
