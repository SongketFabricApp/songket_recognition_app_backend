## Endpoints USER
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


## Endpoints DATASET
All requests to the Users API must include the `x-api-key` header with a valid API key. And here are example how to use it


### 1. Create Dataset
Create a New Account for Users.

#### `POST /dataset`

##### Request

- Method: POST
- Headers:
  - `x-api-key`: Your API Key

##### Response

- Status Code: 200 OK
- Body:
  - `img_url` as String: image url from Cloud Storage of the Dataset
  - `fabricname` as String: Fabric Name of the Dataset
  - `origin` as String: Origin or Region of the Dataset
  - `pattern` as String: Pattern of the Dataset
  - `description` as String: General description of the Dataset

##### Example Response

```json
{
    "error": false,
    "message": "Dataset Created"
}
```

### 2. Get All Datasets

#### `GET /dataset`

Retrieve information about all users.

##### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key

##### Response

- Status Code: 200 OK
- Body:
  - `dataset`: An array of dataset objects.

##### Example Response

```json
{
    "dataset": [
        {
            "pattern": "Pucuk Rebung",
            "description": "Motif Subahnale pertama kali muncul pada pemerintahan Raja Panji Sukarara dan Dinde Terong Kuning. Motif ini berkembang dari motif wayang dan dikenal karena tingkat kerumitan proses pembuatannya. Nama \"Subahnale\" sendiri mencerminkan dimensi spiritual. Songket subahnale ini memiliki makna Yang Maha Esa atau Yang Maha Kuasa. Hal ini dikarenakan selama proses pembuatannya, penenun selalu mengingat tentang keberadaan Tuhan Yang Maha Kuasa. Dalam proses tersebut, masyarakat menggunakannya sebagai salah satu wirid yang diucapkan untuk selalu dekat dengan Yang Maha Kuasa. Setelah proses pembuatan selesai, penenun menyampaikan ungkapan syukur, seperti kata \"subhanallah\" atau dalam dialek Sasak disebut \"subahnale.\"",
            "idfabric": "GLDDN750lLp1wdAC7sEf",
            "fabricname": "Songket Sukarara",
            "img_url": "https://storage.googleapis.com/songket-fab/fabric/fabric1702368645708.png",
            "origin": "Lombok"
        },
        {
            "img_url": "https://storage.googleapis.com/songket-fab/fabric/fabric1702022443089.webp",
            "origin": "Riau",
            "pattern": "Pucuk Rebung",
            "description": "Masyarakat Melayu Riau meyakini dengan kuat akan signifikansi alam, di mana unsur alam dan flora memiliki makna sebagai simbol. Salah satu motif yang umum ditemukan pada Songket Melayu Riau adalah motif pucuk rebung. Pucuk rebung dalam motif ini melambangkan tekad untuk mencapai tujuan, keberuntungan, dan harapan. Selain itu, motif ini juga mencerminkan semangat persatuan dan hati yang terbuka di kalangan masyarakat Riau. Dalam klasifikasi motif Melayu, pucuk rebung diinterpretasikan sebagai simbol pohon bambu yang kokoh dan tidak mudah roboh, bahkan saat dihadapkan dengan angin kencang.",
            "idfabric": "NCWApvWBMp5OWYh2O9oX",
            "fabricname": "Songket Melayu Riau"
        }
    ]
}
```

### 3. Get Dataset by ID

#### `GET /dataset/{id}`

Create a new user.

##### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the dataset

##### Response

- Status Code: 200 OK
- Body: Dataset object
 
##### Example Response

```json
{
    "img_url": "https://storage.googleapis.com/songket-fab/fabric/fabric1702022443089.webp",
    "origin": "Riau",
    "pattern": "Pucuk Rebung",
    "description": "Masyarakat Melayu Riau meyakini dengan kuat akan signifikansi alam, di mana unsur alam dan flora memiliki makna sebagai simbol. Salah satu motif yang umum ditemukan pada Songket Melayu Riau adalah motif pucuk rebung. Pucuk rebung dalam motif ini melambangkan tekad untuk mencapai tujuan, keberuntungan, dan harapan. Selain itu, motif ini juga mencerminkan semangat persatuan dan hati yang terbuka di kalangan masyarakat Riau. Dalam klasifikasi motif Melayu, pucuk rebung diinterpretasikan sebagai simbol pohon bambu yang kokoh dan tidak mudah roboh, bahkan saat dihadapkan dengan angin kencang.",
    "idfabric": "NCWApvWBMp5OWYh2O9oX",
    "fabricname": "Songket Melayu Riau"
}
```

### 4. Update Dataset by ID

#### `PUT /dataset/{id}`

Update information for a specific user identified by their ID.

##### Request

- Method: PUT
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the dataset
- Body:
  - `img_url` as String: image url from Cloud Storage of the Dataset
  - `fabricname` as String: Fabric Name of the Dataset
  - `origin` as String: Origin or Region of the Dataset
  - `pattern` as String: Pattern of the Dataset
  - `description` as String: General description of the Dataset

##### Response

- Status Code: 200 OK
- Body:

```json
 {
    "error": false,
    "message": "Dataset Edited"
}
```

### 5. Delete Dataset by ID

#### `DELETE /dataset/{id}`

Delete a specific user identified by their ID.

#### Request

- Method: DELETE
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the dataset

#### Response

- Status Code: 200 OK
- Body: User object

##### Example Response

```json
{
    "error": false,
    "message": "Dataset Deleted"
}
```
