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
    "error": false,
    "message": "User Created"
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
    "error": false,
    "message": "Login Success",
    "loginResult": {
        "userId": "aOdjqtq0l2VD02Cxe9bP",
        "name": "kwhy03",
        "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcwMjM2NjE3OCwiZXhwIjoxNzAyMzY5Nzc4LCJpc3MiOiJzb25na2V0LWZhYkBzb25na2V0LWZhYi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6InNvbmdrZXQtZmFiQHNvbmdrZXQtZmFiLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoieGNZUEp2YlYyZWI2WmMydUtlbGpiUTdGaklLMiJ9.rU5dQbJePYRK56p_ksZ_d_Z7UMei1TpMJI2wnHGg1_S_s22niB_glLA3qvu2SMqHND7w6zzWpiMyz8lRupJn4KzZ_yRcNOikGIdx-cwouNaVNYiN7HggUOS1J1xH21gfPDjdypm2K8nOCE3_LccHdu1dIinJ0_cfElwhuSOzK4hQ8fmVsXMYzUXP8hRuZisusoJXKrMVa77PPTqGwK3GE4ZR0uwpSrje9npPxWv2lVVHFgb8mQA-n_0jifTHhfLPmipqHpEegUgekUvK6xaAuR8kbCeZF9cEqwHXEiDuEpF05G6OhXC8kBRA28OTJ5CqzZt87x1W3WN3s4K8RiGaPA"
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
- Body: User object

##### Example Response

```json
{
    "error": false,
    "message": "User Deleted"
}
```
