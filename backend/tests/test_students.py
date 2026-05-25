import pytest

VALID_STUDENT_1 = {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@university.edu",
    "date_of_birth": "2000-01-01",
    "enrollment_number": "CS-2026-0001",
    "course": "Computer Science",
    "gpa": 3.8
}

VALID_STUDENT_2 = {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@university.edu",
    "date_of_birth": "2002-05-20",
    "enrollment_number": "EE-2026-0002",
    "course": "Electrical Engineering",
    "gpa": 3.2
}

def test_create_student_success(client):
    response = client.post("/api/v1/students/", json=VALID_STUDENT_1)
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "John"
    assert data["last_name"] == "Doe"
    assert data["email"] == "john.doe@university.edu"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_create_student_gpa_out_of_bounds(client):
    # GPA > 4.0
    payload = VALID_STUDENT_1.copy()
    payload["gpa"] = 4.5
    response = client.post("/api/v1/students/", json=payload)
    assert response.status_code == 422

    # GPA < 0.0
    payload = VALID_STUDENT_1.copy()
    payload["gpa"] = -0.5
    response = client.post("/api/v1/students/", json=payload)
    assert response.status_code == 422

def test_create_student_invalid_email_domain(client):
    payload = VALID_STUDENT_1.copy()
    payload["email"] = "john.doe@gmail.com"
    response = client.post("/api/v1/students/", json=payload)
    assert response.status_code == 422

def test_create_student_underage(client):
    payload = VALID_STUDENT_1.copy()
    payload["date_of_birth"] = "2015-05-25"
    response = client.post("/api/v1/students/", json=payload)
    assert response.status_code == 422

def test_create_student_invalid_enrollment(client):
    invalid_enrolls = ["CS-26-42", "CS-2026-42", "cs-2026-0042", "C-2026-0042", "CS-2026-00421"]
    for invalid_enroll in invalid_enrolls:
        payload = VALID_STUDENT_1.copy()
        payload["enrollment_number"] = invalid_enroll
        response = client.post("/api/v1/students/", json=payload)
        assert response.status_code == 422

def test_create_student_conflict(client):
    # Create the first student
    res1 = client.post("/api/v1/students/", json=VALID_STUDENT_1)
    assert res1.status_code == 201
    
    # Try to create another student with the same email
    payload_email = VALID_STUDENT_2.copy()
    payload_email["email"] = VALID_STUDENT_1["email"]
    res_email = client.post("/api/v1/students/", json=payload_email)
    assert res_email.status_code == 409
    assert "email" in res_email.json()["detail"].lower()

    # Try to create another student with the same enrollment number
    payload_enroll = VALID_STUDENT_2.copy()
    payload_enroll["enrollment_number"] = VALID_STUDENT_1["enrollment_number"]
    res_enroll = client.post("/api/v1/students/", json=payload_enroll)
    assert res_enroll.status_code == 409
    assert "enrollment number" in res_enroll.json()["detail"].lower()

def test_read_student(client):
    # Test read non-existent student
    response = client.get("/api/v1/students/999")
    assert response.status_code == 404
    
    # Create student
    res_create = client.post("/api/v1/students/", json=VALID_STUDENT_1)
    student_id = res_create.json()["id"]
    
    # Get student
    res_get = client.get(f"/api/v1/students/{student_id}")
    assert res_get.status_code == 200
    assert res_get.json()["first_name"] == "John"

def test_update_student_put_and_patch(client):
    # Test update non-existent student
    response = client.put("/api/v1/students/999", json=VALID_STUDENT_1)
    assert response.status_code == 404
    response = client.patch("/api/v1/students/999", json=VALID_STUDENT_1)
    assert response.status_code == 404

    # Create 2 students
    s1 = client.post("/api/v1/students/", json=VALID_STUDENT_1).json()
    s2 = client.post("/api/v1/students/", json=VALID_STUDENT_2).json()
    
    # 1. Successful PUT (full update)
    put_payload = {
        "first_name": "Johnny",
        "last_name": "Does",
        "email": "johnny.does@university.edu",
        "date_of_birth": "2000-01-01",
        "enrollment_number": "CS-2026-0003",
        "course": "Computer Engineering",
        "gpa": 3.9
    }
    res_put = client.put(f"/api/v1/students/{s1['id']}", json=put_payload)
    assert res_put.status_code == 200
    assert res_put.json()["first_name"] == "Johnny"
    assert res_put.json()["email"] == "johnny.does@university.edu"

    # 2. Successful PATCH (partial update)
    patch_payload = {
        "gpa": 3.5,
        "first_name": "Jonathan"
    }
    res_patch = client.patch(f"/api/v1/students/{s1['id']}", json=patch_payload)
    assert res_patch.status_code == 200
    assert res_patch.json()["first_name"] == "Jonathan"
    assert res_patch.json()["gpa"] == 3.5
    # email should remain unchanged
    assert res_patch.json()["email"] == "johnny.does@university.edu"

    # 3. Update with validation failure
    res_invalid = client.patch(f"/api/v1/students/{s1['id']}", json={"gpa": 5.0})
    assert res_invalid.status_code == 422

    # 4. Update causing conflict with other student
    res_conflict = client.patch(f"/api/v1/students/{s1['id']}", json={"email": s2["email"]})
    assert res_conflict.status_code == 409

def test_delete_student(client):
    # Test delete non-existent
    response = client.delete("/api/v1/students/999")
    assert response.status_code == 404
    
    # Create student
    student = client.post("/api/v1/students/", json=VALID_STUDENT_1).json()
    student_id = student["id"]
    
    # Delete student
    response = client.delete(f"/api/v1/students/{student_id}")
    assert response.status_code == 200
    assert response.json()["success"] is True
    
    # Verify student is gone
    response = client.get(f"/api/v1/students/{student_id}")
    assert response.status_code == 404

def test_list_students_filtering_pagination_sorting(client):
    # Create a batch of students
    students_data = [
        {"first_name": "Alice", "last_name": "Brown", "email": "alice.brown@university.edu", "date_of_birth": "2001-02-15", "enrollment_number": "CS-2026-0101", "course": "Computer Science", "gpa": 3.9},
        {"first_name": "Bob", "last_name": "Green", "email": "bob.green@university.edu", "date_of_birth": "2002-04-12", "enrollment_number": "CS-2026-0102", "course": "Computer Science", "gpa": 3.5},
        {"first_name": "Charlie", "last_name": "White", "email": "charlie.white@university.edu", "date_of_birth": "2000-08-20", "enrollment_number": "EE-2026-0103", "course": "Electrical Engineering", "gpa": 2.8},
        {"first_name": "Diana", "last_name": "Black", "email": "diana.black@university.edu", "date_of_birth": "2003-11-05", "enrollment_number": "ME-2026-0104", "course": "Mechanical Engineering", "gpa": 3.1},
        {"first_name": "Ethan", "last_name": "Grey", "email": "ethan.grey@university.edu", "date_of_birth": "2001-09-30", "enrollment_number": "CS-2026-0105", "course": "Computer Science", "gpa": 3.7}
    ]
    
    for s in students_data:
        client.post("/api/v1/students/", json=s)
        
    # Check default fetching
    response = client.get("/api/v1/students/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 5
    
    # Check Pagination (limit and skip)
    response = client.get("/api/v1/students/?skip=2&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 2
    assert data["skip"] == 2
    assert data["limit"] == 2
    
    # Check Course Filter
    response = client.get("/api/v1/students/?course=Computer Science")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    for s in data["items"]:
        assert s["course"] == "Computer Science"
        
    # Check GPA Range Filters
    response = client.get("/api/v1/students/?min_gpa=3.0&max_gpa=3.6")
    assert response.status_code == 200
    data = response.json()
    # Should include Bob (3.5) and Diana (3.1)
    assert data["total"] == 2
    gpas = [s["gpa"] for s in data["items"]]
    assert 3.5 in gpas
    assert 3.1 in gpas

    # Check Wildcard Search Query
    # Search for 'green' in name/email
    response = client.get("/api/v1/students/?search=green")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["first_name"] == "Bob"
    
    # Search for 'EE-2026' in enrollment number
    response = client.get("/api/v1/students/?search=EE-2026")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["first_name"] == "Charlie"

    # Check Sorting (ASC / DESC)
    # Sort by gpa asc
    response = client.get("/api/v1/students/?sort_by=gpa&sort_order=asc")
    assert response.status_code == 200
    data = response.json()
    gpas_asc = [s["gpa"] for s in data["items"]]
    assert gpas_asc == sorted(gpas_asc)
    
    # Sort by gpa desc
    response = client.get("/api/v1/students/?sort_by=gpa&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    gpas_desc = [s["gpa"] for s in data["items"]]
    assert gpas_desc == sorted(gpas_desc, reverse=True)

    # Sort by first_name desc
    response = client.get("/api/v1/students/?sort_by=first_name&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    names_desc = [s["first_name"] for s in data["items"]]
    assert names_desc == sorted(names_desc, reverse=True)
