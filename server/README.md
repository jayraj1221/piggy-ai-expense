# 🚀 Piggy.ai API Documentation

## 📌 API Endpoints

### Authentication Endpoints

#### 1. Register Parent
* **URL**: `http://localhost:5000/auth/register/parent`
* **Method**: `POST`
* **Headers**: 
  * `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "123456"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Parent registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "68186e0e1a8d4dece618aba7",
      "name": "Test User",
      "email": "testuser@example.com",
      "role": "parent"
    }
  }
  ```

#### 2. Register Child
* **URL**: `http://localhost:5000/auth/register/child`
* **Method**: `POST`
* **Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <parent_token>`
* **Request Body**:
  ```json
  {
    "name": "Charlie John",
    "email": "John@example.com",
    "password": "ChildPass123"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Child registered successfully",
    "user": {
      "id": "68186e551a8d4dece618abab",
      "name": "Charlie John",
      "email": "John@example.com",
      "role": "child",
      "parent": "68186e0e1a8d4dece618aba7"
    }
  }
  ```

#### 3. User Login
* **URL**: `http://localhost:5000/auth/login`
* **Method**: `POST`
* **Headers**: 
  * `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "alice@example.com",
    "password": "SecurePass123"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123456789",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "parent"
    }
  }
  ```

#### 4. Get User
* **URL**: `http://localhost:5000/auth/get-user`
* **Method**: `POST`
* **Headers**: 
  * `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "userId": "68186e551a8d4dece618abab"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "68186e551a8d4dece618abab",
      "name": "Charlie John",
      "email": "John@example.com",
      "role": "child",
      "balance": 80
    }
  }
  ```

#### 5. Get Children
* **URL**: `http://localhost:5000/auth/get-children`
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <parent_token>`
* **Response**:
  ```json
  {
    "success": true,
    "children": [
      {
        "id": "68186e551a8d4dece618abab",
        "name": "Charlie John",
        "email": "John@example.com",
        "role": "child",
        "balance": 80
      }
    ]
  }
  ```

### Money & Transaction Endpoints

#### 6. Test Endpoint
* **URL**: `http://localhost:5000/ml/test`
* **Method**: `GET`
* **Response**:
  ```json
  {
    "message": "ML API is working!"
  }
  ```

#### 7. Assign Pocket Money
* **URL**: `http://localhost:5000/ml/assign`
* **Method**: `POST`
* **Headers**: 
  * `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "childId": "68186e551a8d4dece618abab",
    "amount": 100,
    "parentId": "68186e0e1a8d4dece618aba7"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Pocket money assigned successfully",
    "transaction": {
      "id": "transaction_id",
      "childId": "68186e551a8d4dece618abab",
      "amount": 100,
      "type": "income",
      "category": "allowance",
      "description": "Weekly allowance",
      "timestamp": "2025-05-05T07:53:41.598Z"
    },
    "newBalance": 100
  }
  ```

#### 8. Record Transaction (Spend)
* **URL**: `http://localhost:5000/ml/spend`
* **Method**: `POST`
* **Headers**: 
  * `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "childId": "68186e551a8d4dece618abab",
    "amount": "20",
    "type": "expense",
    "category": "other",
    "description": "Buy Toy"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Transaction recorded successfully",
    "transaction": {
      "id": "transaction_id",
      "childId": "68186e551a8d4dece618abab",
      "amount": 20,
      "type": "expense",
      "category": "other",
      "description": "Buy Toy",
      "timestamp": "2025-05-05T08:06:51.639Z"
    },
    "newBalance": 80
  }
  ```

#### 9. Get Transaction History
* **URL**: `http://localhost:5000/ml/getTransactionHistory`
* **Method**: `GET`
* **Headers**: 
  * `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "userId": "68186e551a8d4dece618abab"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "transactions": [
      {
        "id": "transaction_id_1",
        "childId": "68186e551a8d4dece618abab",
        "amount": 100,
        "type": "income",
        "category": "allowance",
        "description": "Weekly allowance",
        "timestamp": "2025-05-05T07:53:41.598Z"
      },
      {
        "id": "transaction_id_2",
        "childId": "68186e551a8d4dece618abab",
        "amount": 20,
        "type": "expense",
        "category": "other",
        "description": "Buy Toy",
        "timestamp": "2025-05-05T08:06:51.639Z"
      }
    ]
  }
  ```


