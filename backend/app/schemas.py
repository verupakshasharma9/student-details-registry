import re
from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

class StudentBase(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    date_of_birth: date
    enrollment_number: str
    course: str = Field(..., min_length=1, max_length=100)
    gpa: float

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v: str) -> str:
        if v is not None:
            if not v.endswith("@university.edu"):
                raise ValueError("Email must end with @university.edu")
        return v

    @field_validator("enrollment_number")
    @classmethod
    def validate_enrollment_number(cls, v: str) -> str:
        if v is not None:
            pattern = r"^[A-Z]{2,4}-\d{4}-\d{4}$"
            if not re.match(pattern, v):
                raise ValueError("Enrollment number must match format 'XX-YYYY-ZZZZ' (e.g. CS-2026-0042)")
        return v

    @field_validator("gpa")
    @classmethod
    def validate_gpa(cls, v: float) -> float:
        if v is not None:
            if not (0.0 <= v <= 4.0):
                raise ValueError("GPA must be between 0.0 and 4.0")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_age(cls, v: date) -> date:
        if v is not None:
            today = date.today()
            age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
            if age < 16:
                raise ValueError("Student must be at least 16 years old.")
        return v

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    enrollment_number: Optional[str] = None
    course: Optional[str] = Field(None, min_length=1, max_length=100)
    gpa: Optional[float] = None

    @field_validator("email")
    @classmethod
    def validate_email_domain(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v.endswith("@university.edu"):
                raise ValueError("Email must end with @university.edu")
        return v

    @field_validator("enrollment_number")
    @classmethod
    def validate_enrollment_number(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            pattern = r"^[A-Z]{2,4}-\d{4}-\d{4}$"
            if not re.match(pattern, v):
                raise ValueError("Enrollment number must match format 'XX-YYYY-ZZZZ' (e.g. CS-2026-0042)")
        return v

    @field_validator("gpa")
    @classmethod
    def validate_gpa(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if not (0.0 <= v <= 4.0):
                raise ValueError("GPA must be between 0.0 and 4.0")
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_age(cls, v: Optional[date]) -> Optional[date]:
        if v is not None:
            today = date.today()
            age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
            if age < 16:
                raise ValueError("Student must be at least 16 years old.")
        return v

class StudentResponse(StudentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PaginatedStudentResponse(BaseModel):
    items: List[StudentResponse]
    total: int
    skip: int
    limit: int
