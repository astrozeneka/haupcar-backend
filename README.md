# Car Management System API Documentation

## Overview
This API provides functionalities for managing cars, including retrieving, adding, updating, and deleting car records. Authentication using JWT is required for accessing the resources, except for the root and login endpoints.

## Endpoints

### Test Route

#### `GET /`
- **Description**: Checks if the server is running.
- **Response**:
    - `200 OK`: Returns a message indicating the server is running.

### Authentication

#### `POST /login`
- **Description**: Authenticates the user and returns a JWT token.
- **Request**:
    - **Body**:
      ```json
      {
        "username": "your-username",
        "password": "your-password"
      }
      ```
- **Response**:
    - `200 OK`: Returns a JWT token.
      ```json
      {
        "token": "your-jwt-token"
      }
      ```
    - `403 Forbidden`: Invalid credentials.

### Car Resources

#### `GET /api/cars`
- **Description**: Retrieves a list of cars. Requires JWT authentication.
- **Query Parameters**:
    - `offset` (optional): Number of records to skip (default is 0).
    - `limit` (optional): Maximum number of records to return (default is 10).
    - `q` (optional): Search query to filter cars by brand.
- **Response**:
    - `200 OK`: Returns a list of cars and the total count.
      ```json
      {
        "data": [
          {
            "id": 1,
            "brand": "Toyota",
            "model": "Corolla",
            "registrationNumber": "ABC123",
            "notes": "Some notes",
            "hasDocument": 1,
            "hasImage": 1
          }
        ],
        "count": 1
      }
      ```

#### `GET /api/cars/:id`
- **Description**: Retrieves a single car by ID. Requires JWT authentication.
- **Response**:
    - `200 OK`: Returns the car details.
      ```json
      {
        "id": 1,
        "brand": "Toyota",
        "model": "Corolla",
        "registrationNumber": "ABC123",
        "notes": "Some notes",
        "document": "document-content",
        "image": "image-content"
      }
      ```

#### `POST /api/cars`
- **Description**: Adds a new car. Requires JWT authentication.
- **Request**:
    - **Body**:
      ```json
      {
        "brand": "Toyota",
        "model": "Corolla",
        "registrationNumber": "ABC123",
        "notes": "Some notes",
        "document": "document-content",
        "image": "image-content"
      }
      ```
- **Response**:
    - `200 OK`: Car added successfully.
    - `422 Unprocessable Entity`: Form validation errors.

#### `PUT /api/cars/:id`
- **Description**: Updates an existing car by ID. Requires JWT authentication.
- **Request**:
    - **Body**:
      ```json
      {
        "brand": "Toyota",
        "model": "Corolla",
        "registrationNumber": "ABC123",
        "notes": "Some notes",
        "document": "document-content",
        "image": "image-content"
      }
      ```
- **Response**:
    - `200 OK`: Car updated successfully.
    - `422 Unprocessable Entity`: Form validation errors.

#### `DELETE /api/cars/:id`
- **Description**: Deletes a car by ID. Requires JWT authentication.
- **Response**:
    - `200 OK`: Car deleted successfully.