# Student Details Registry - Documentation

This directory contains documentation, architectural details, and designs for the Student Details Registry CRUD application.

## Directory Layout
* `/backend` - FastAPI server and SQLAlchemy database integrations.
* `/frontend` - React + Vite + Tailwind CSS user interface client.
* `/docs` - System documentation and architectural details.
* `/.github` - GitHub CI/CD workflow configuration files.

## Database Schema
The SQLite database stores student information inside a table named `students`.

### Student Table Schema
| Field Name | Data Type | Constraints / Attributes | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto-increment | Unique identifier for each student record. |
| `first_name` | String(50) | Not Null | First name of the student. |
| `last_name` | String(50) | Not Null | Last name of the student. |
| `email` | String(100) | Unique, Index, Not Null | Email address, used for unique identification. |
| `date_of_birth` | Date | Not Null | Date of birth. |
| `enrollment_number` | String(50) | Unique, Index, Not Null | Unique academic registration identifier. |
| `course` | String(100) | Not Null | Currently enrolled academic program/course. |
| `gpa` | Float | Not Null | Grade Point Average. |
| `created_at` | DateTime | Default: `now()`, Not Null | Time when the record was created. |
| `updated_at` | DateTime | Default: `now()`, Auto-update, Not Null | Time when the record was last modified. |
