from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from .. import crud, schemas

router = APIRouter()

@router.post("/", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    # 1. Check for existing email conflict
    db_email = crud.get_student_by_email(db, email=student.email)
    if db_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A student record already exists with email '{student.email}'."
        )

    # 2. Check for existing enrollment number conflict
    db_enrollment = crud.get_student_by_enrollment(db, enrollment_number=student.enrollment_number)
    if db_enrollment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A student record already exists with enrollment number '{student.enrollment_number}'."
        )

    return crud.create_student(db=db, student=student)

@router.get("/", response_model=schemas.PaginatedStudentResponse)
def read_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    min_gpa: Optional[float] = Query(None, ge=0.0, le=4.0),
    max_gpa: Optional[float] = Query(None, ge=0.0, le=4.0),
    sort_by: str = Query("id"),
    sort_order: str = Query("asc"),
    db: Session = Depends(get_db)
):
    items, total = crud.get_students(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        course=course,
        min_gpa=min_gpa,
        max_gpa=max_gpa,
        sort_by=sort_by,
        sort_order=sort_order
    )
    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{student_id}", response_model=schemas.StudentResponse)
def read_student(student_id: int, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student record with ID {student_id} does not exist."
        )
    return db_student

@router.put("/{student_id}", response_model=schemas.StudentResponse)
def update_student_put(student_id: int, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student record with ID {student_id} does not exist."
        )

    # Check email conflict
    if student.email is not None and student.email != db_student.email:
        db_email = crud.get_student_by_email(db, email=student.email)
        if db_email and db_email.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A student record already exists with email '{student.email}'."
            )

    # Check enrollment number conflict
    if student.enrollment_number is not None and student.enrollment_number != db_student.enrollment_number:
        db_enroll = crud.get_student_by_enrollment(db, enrollment_number=student.enrollment_number)
        if db_enroll and db_enroll.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A student record already exists with enrollment number '{student.enrollment_number}'."
            )

    updated = crud.update_student(db=db, student_id=student_id, student=student)
    return updated

@router.patch("/{student_id}", response_model=schemas.StudentResponse)
def update_student_patch(student_id: int, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student record with ID {student_id} does not exist."
        )

    # Check email conflict
    if student.email is not None and student.email != db_student.email:
        db_email = crud.get_student_by_email(db, email=student.email)
        if db_email and db_email.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A student record already exists with email '{student.email}'."
            )

    # Check enrollment number conflict
    if student.enrollment_number is not None and student.enrollment_number != db_student.enrollment_number:
        db_enroll = crud.get_student_by_enrollment(db, enrollment_number=student.enrollment_number)
        if db_enroll and db_enroll.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A student record already exists with enrollment number '{student.enrollment_number}'."
            )

    updated = crud.update_student(db=db, student_id=student_id, student=student)
    return updated

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student record with ID {student_id} does not exist."
        )
    crud.delete_student(db=db, student_id=student_id)
    return {
        "success": True,
        "message": f"Student record with ID {student_id} has been deleted permanently."
    }
