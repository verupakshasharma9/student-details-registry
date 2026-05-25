from sqlalchemy.orm import Session
from . import models, schemas

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()

def get_student_by_enrollment(db: Session, enrollment_number: str):
    return db.query(models.Student).filter(models.Student.enrollment_number == enrollment_number).first()

def get_students(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: str = None,
    course: str = None,
    min_gpa: float = None,
    max_gpa: float = None,
    sort_by: str = "id",
    sort_order: str = "asc"
):
    query = db.query(models.Student)

    # 1. Course filter
    if course:
        query = query.filter(models.Student.course == course)

    # 2. GPA range filters
    if min_gpa is not None:
        query = query.filter(models.Student.gpa >= min_gpa)
    if max_gpa is not None:
        query = query.filter(models.Student.gpa <= max_gpa)

    # 3. Wildcard search
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Student.first_name.ilike(search_filter)) |
            (models.Student.last_name.ilike(search_filter)) |
            (models.Student.email.ilike(search_filter)) |
            (models.Student.enrollment_number.ilike(search_filter))
        )

    # 4. Sorting
    valid_sort_fields = [
        "id", "first_name", "last_name", "email", "date_of_birth",
        "enrollment_number", "course", "gpa", "created_at", "updated_at"
    ]
    if sort_by not in valid_sort_fields:
        sort_by = "id"

    col = getattr(models.Student, sort_by)
    if sort_order == "desc":
        query = query.order_by(col.desc())
    else:
        query = query.order_by(col.asc())

    # 5. Get total count before pagination limits
    total = query.count()

    # 6. Apply pagination
    items = query.offset(skip).limit(limit).all()

    return items, total

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(
        first_name=student.first_name,
        last_name=student.last_name,
        email=student.email,
        date_of_birth=student.date_of_birth,
        enrollment_number=student.enrollment_number,
        course=student.course,
        gpa=student.gpa
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student(db: Session, student_id: int, student: schemas.StudentUpdate):
    db_student = get_student(db, student_id)
    if not db_student:
        return None

    update_data = student.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)

    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: int):
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    db.delete(db_student)
    db.commit()
    return db_student
