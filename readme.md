## Endpoints
All requests to the Users API must include the `x-api-key` header with a valid API key. And here are example how to use it


### 1. Register User
Create a New Account for Users.

#### `POST /register`

##### Request

- Method: POST
- Headers:
  - `x-api-key`: Your API Key

##### Response

- Status Code: 200 OK
- Body:
  - `username` as String: Name of the user
  - `email` as String: Email of the user
  - `phone` as String: Phone number of the user
  - `password` as String: Password for the user

##### Example Response

```json
{
    "status": "success"
    "message": "Account Created Successfully"
}
```

### 2. Login User

#### `POST /login`

Log into the App with the created Account.

##### Request

- Method: POST
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id` as String: The ID of the user

##### Response

- Status Code: 200 OK
- Body: User object

##### Example Response

```json
{
    "status": "Login Success",
    "loginResult": {
        "userId": "MSrpx7axLIZnk7SnADxD",
        "name": "dhiandikaAP",
        "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcwMjMxMzIzMiwiZXhwIjoxNzAyMzE2ODMyLCJpc3MiOiJzb25na2V0LWZhYkBzb25na2V0LWZhYi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6InNvbmdrZXQtZmFiQHNvbmdrZXQtZmFiLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiaUxYdFEyNklUeU9Ga0ZITUhjTEt3UEVIYjlwMSJ9.Q7FgZQUKrL-btFHoMjvp_9QmWoApO8AxkifIOCjMImfK6CF9NwNMjSUvQ2wFsDh1FJLwL_YtVbRrbGHmGa3ZK8mYimYMylm7DrBLbw4ErxxL7_o38h8HQgYVsbYNUqC_t15wb-d7lhj8yAShfTJSLJTqNTO6Nn-g7EPwAMnLrLjz9LXoAuo6CaSKu5GeHorRlxfjTqC-avqUGxB-inv17OtDxfdgzawCfWJsKdmU6J2Cb09yCV4XtIboRbD8FpOj4S0MnOgIk3tsUfAIDLvngtI6i8mv3sYIZCS-px4GzaZDREEA79LjPkB2xOzFd8QZXiq7BU-6udXTWbG2R1atlg"
    }
}
```

### 3. Get All Users

#### `GET /users`

Retrieve information about all users.

##### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key

##### Response

- Status Code: 200 OK
- Body:
  - `users`: An array of user objects.

##### Example Response

```json
{
    "users": [
        {
            "password": "$2b$05$33woVT4FDV8ArlTXpjs7buE2wekFvzejGZjHPkuFbzwABdUxdKWyG",
            "user_id": "MSrpx7axLIZnk7SnADxD",
            "phone": "081273473478",
            "firebase_uid": "iLXtQ26ITyOFkFHMHcLKwPEHb9p1",
            "email": "dikadiki55@gmail.com",
            "username": "dhiandikaAP"
        },
        {
            "password": "$2b$05$eKpHRDaqYLhCZTZpI6Wb/.BoMfeIfp83V5PD35pcMvMW6em1hrHtC",
            "user_id": "lgVRqL8CTD3bC0ZKcA62",
            "phone": "089679389728",
            "firebase_uid": "Zz2hwGLFj7cucX1iRTDtrc9EAPm1",
            "email": "madedika1523@gmail.com",
            "username": "mddk2003"
        },
        {
            "password": "$2b$05$Ep6r.FnLM.Mut1torIy3l.rQxWugHxgbbNL.HwXHtY7ek41Az.coq",
            "user_id": "rbWLYgaUXXNoyK8JLleY",
            "phone": "085156120819",
            "firebase_uid": "QJiPzRHryHc8ff4qY2yCJKyZoYD2",
            "email": "komang.ireno@gmail.com",
            "username": "reno123"
        }
    ]
}
```


### 4. Get User by ID

#### `GET /users/{id}`

Create a new user.

##### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the user

##### Response

- Status Code: 200 OK
- Body: User object
 
##### Example Response

```json
{
    "password": "$2b$05$eKpHRDaqYLhCZTZpI6Wb/.BoMfeIfp83V5PD35pcMvMW6em1hrHtC",
    "user_id": "lgVRqL8CTD3bC0ZKcA62",
    "phone": "089679389728",
    "firebase_uid": "Zz2hwGLFj7cucX1iRTDtrc9EAPm1",
    "email": "madedika1523@gmail.com",
    "username": "mddk2003"
}
```

### 5. Delete User by ID

#### `DELETE /users/{id}`

Delete a specific user identified by their ID.

#### Request

- Method: DELETE
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the user

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"
