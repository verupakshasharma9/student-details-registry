# REST API Reference Manual

This document provides a technical specification of the RESTful API endpoints available in the **Student Details Registry**.

---

## 🌐 API Overview

- **Base Endpoint URL**: `http://localhost:8000/api/v1` (Local Dev) or `/api` (Docker Production Proxy)
- **Payload Format**: `application/json` (Request & Response)
- **Interactive Documentation**: 
  - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
  - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Standard Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```

---

## 🚫 Error Responses Format

FastAPI utilizes **Pydantic** validation models. If request data does not conform to schemas, the server rejects the request with an **HTTP 422 Unprocessable Entity** code. Conflicts on unique constraints return an **HTTP 409 Conflict** error, and invalid resource lookups return an **HTTP 404 Not Found**.

### 1. 422 Unprocessable Entity (FastAPI / Pydantic Validation Error)
Returned when payload rules are violated (e.g., underage student, invalid email domain, or out-of-bounds GPA).
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "Value error, Email must end with @university.edu",
      "type": "value_error"
    },
    {
      "loc": ["body", "gpa"],
      "msg": "Value error, GPA must be between 0.0 and 4.0",
      "type": "value_error"
    }
  ]
}
```

### 2. 404 Not Found (Missing Record)
```json
{
  "detail": "Student record with ID 999 does not exist."
}
```

### 3. 409 Conflict (Duplicate Records)
Returned if the `email` or `enrollment_number` is already assigned to another student profile in the database.
```json
{
  "detail": "A student record already exists with email 'john.doe@university.edu'."
}
```

---

## 📂 Endpoint Directory

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/students/` | Retrieve a paginated, sorted, and filtered list of students |
| **GET** | `/students/{student_id}` | Retrieve details of a single student by Integer ID |
| **POST** | `/students/` | Create a new student record (enforces Pydantic validations) |
| **PUT** | `/students/{student_id}` | Update all fields of an existing student record completely |
| **PATCH** | `/students/{student_id}`| Update specific fields of a student record partially |
| **DELETE** | `/students/{student_id}`| Permanently delete a student record by Integer ID |

---

## 📡 Endpoint Technical Specifications

### 1. Retrieve Paginated Students List

- **HTTP Method**: `GET`
- **Endpoint**: `/students/`
- **Query Parameters**:

| Name | Type | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `skip` | Integer | `0` | `>= 0` | Offset count (number of records to skip) |
| `limit` | Integer | `10` | `1` to `100` | Maximum number of records to return per page |
| `search` | String | *None* | *None* | Wildcard matches `first_name`, `last_name`, `email`, and `enrollment_number` |
| `course` | String | *None* | *None* | Filters by exact course major (e.g. `Computer Science`) |
| `min_gpa` | Float | *None* | `0.0` to `4.0` | Filters for students with a GPA greater than or equal to this |
| `max_gpa` | Float | *None* | `0.0` to `4.0` | Filters for students with a GPA less than or equal to this |
| `sort_by` | String | `id` | Valid fields* | Column used for sorting. Defaults to `id` |
| `sort_order`| String | `asc` | `asc` / `desc` | Specifies sorting order direction |

> \* **Valid sorting fields**: `id`, `first_name`, `last_name`, `email`, `date_of_birth`, `enrollment_number`, `course`, `gpa`, `created_at`, `updated_at`

#### Example Request
```bash
curl -G "http://localhost:8000/api/v1/students/" \
  --data-urlencode "skip=0" \
  --data-urlencode "limit=2" \
  --data-urlencode "search=brown" \
  --data-urlencode "min_gpa=3.5" \
  --data-urlencode "sort_by=gpa" \
  --data-urlencode "sort_order=desc"
```

#### Example Response (HTTP 200 OK)
```json
{
  "items": [
    {
      "id": 1,
      "first_name": "Alice",
      "last_name": "Brown",
      "email": "alice.brown@university.edu",
      "date_of_birth": "2001-02-15",
      "enrollment_number": "CS-2026-0101",
      "course": "Computer Science",
      "gpa": 3.9,
      "created_at": "2026-05-25T15:24:00.124562Z",
      "updated_at": "2026-05-25T15:24:00.124562Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 2
}
```

---

### 2. Retrieve Specific Student

- **HTTP Method**: `GET`
- **Endpoint**: `/students/{student_id}`
- **Path Parameter**: `student_id` (Integer)

#### Example Request
```bash
curl -X GET "http://localhost:8000/api/v1/students/1"
```

#### Example Response (HTTP 200 OK)
```json
{
  "id": 1,
  "first_name": "Alice",
  "last_name": "Brown",
  "email": "alice.brown@university.edu",
  "date_of_birth": "2001-02-15",
  "enrollment_number": "CS-2026-0101",
  "course": "Computer Science",
  "gpa": 3.9,
  "created_at": "2026-05-25T15:24:00.124562Z",
  "updated_at": "2026-05-25T15:24:00.124562Z"
}
```

---

### 3. Create Student Record

- **HTTP Method**: `POST`
- **Endpoint**: `/students/`
- **Validation Constraints (Pydantic schemas)**:

| Field Name | Type | Presence | Validation Constraints |
| :--- | :--- | :--- | :--- |
| `first_name` | String | Required | Minimum 2 characters, maximum 50 characters. |
| `last_name` | String | Required | Minimum 2 characters, maximum 50 characters. |
| `email` | String | Required | Valid email string. Domain **MUST** end with `@university.edu`. |
| `date_of_birth`| Date | Required | Format `YYYY-MM-DD`. Student must be at least **16 years old**. |
| `enrollment_number`| String | Required | Enforces regex `^[A-Z]{2,4}-\d{4}-\d{4}$` (e.g. `CS-2026-0042`). |
| `course` | String | Required | Minimum 1 character, maximum 100 characters. |
| `gpa` | Float | Required | Must be between `0.0` and `4.0` (inclusive). |

#### Example Request
```bash
curl -X POST "http://localhost:8000/api/v1/students/" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@university.edu",
    "date_of_birth": "2000-01-01",
    "enrollment_number": "CS-2026-0001",
    "course": "Computer Science",
    "gpa": 3.8
  }'
```

#### Example Response (HTTP 201 Created)
```json
{
  "id": 2,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@university.edu",
  "date_of_birth": "2000-01-01",
  "enrollment_number": "CS-2026-0001",
  "course": "Computer Science",
  "gpa": 3.8,
  "created_at": "2026-05-25T15:24:10.512683Z",
  "updated_at": "2026-05-25T15:24:10.512683Z"
}
```

---

### 4. Update Student Record (Full Update)

- **HTTP Method**: `PUT`
- **Endpoint**: `/students/{student_id}`
- **Path Parameter**: `student_id` (Integer)
- **Validation Constraints**: Same constraints as the `POST` payload schema. Fields left out will be defaulted or must match schema bounds if passed. Enforces email and enrollment unique conflicts.

#### Example Request
```bash
curl -X PUT "http://localhost:8000/api/v1/students/2" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Johnny",
    "last_name": "Doe",
    "email": "johnny.doe@university.edu",
    "date_of_birth": "2000-01-01",
    "enrollment_number": "CS-2026-0003",
    "course": "Computer Engineering",
    "gpa": 3.9
  }'
```

#### Example Response (HTTP 200 OK)
```json
{
  "id": 2,
  "first_name": "Johnny",
  "last_name": "Doe",
  "email": "johnny.doe@university.edu",
  "date_of_birth": "2000-01-01",
  "enrollment_number": "CS-2026-0003",
  "course": "Computer Engineering",
  "gpa": 3.9,
  "created_at": "2026-05-25T15:24:10.512683Z",
  "updated_at": "2026-05-25T15:24:30.892014Z"
}
```

---

### 5. Update Student Record Partially

- **HTTP Method**: `PATCH`
- **Endpoint**: `/students/{student_id}`
- **Path Parameter**: `student_id` (Integer)
- **Validation Constraints**: Allows any subset of fields in the validation schema. Validates only the fields provided.

#### Example Request
```bash
curl -X PATCH "http://localhost:8000/api/v1/students/2" \
  -H "Content-Type: application/json" \
  -d '{
    "gpa": 3.5,
    "first_name": "Jonathan"
  }'
```

#### Example Response (HTTP 200 OK)
```json
{
  "id": 2,
  "first_name": "Jonathan",
  "last_name": "Doe",
  "email": "johnny.doe@university.edu",
  "date_of_birth": "2000-01-01",
  "enrollment_number": "CS-2026-0003",
  "course": "Computer Engineering",
  "gpa": 3.5,
  "created_at": "2026-05-25T15:24:10.512683Z",
  "updated_at": "2026-05-25T15:24:55.342125Z"
}
```

---

### 6. Remove Student Record

- **HTTP Method**: `DELETE`
- **Endpoint**: `/students/{student_id}`
- **Path Parameter**: `student_id` (Integer)

#### Example Request
```bash
curl -X DELETE "http://localhost:8000/api/v1/students/2"
```

#### Example Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Student record with ID 2 has been deleted permanently."
}
```
