# Sertfit Gym Management System

## Description
This gym management project was developed for Sertfit Athletics Gym and Sports Hub to improve their daily operations. The system replaces manual and semi‑digital processes with an organized and centralized platform.

The software allows the gym to easily manage customer and employee information, record workout sessions, and handle membership subscriptions. Overall, the system makes work faster, reduces errors, and helps the gym provide better service to its customers.

## Check it out!
The project's frontend is currently deployed in GitHub pages. Access it using this link:
```
https://gabbrealz.github.io/GymSoftwareSystem/
```
You can also interact with the backend API directly using this base URL:
```
https://sertfitgym.onrender.com
```

## Tech Stack
- Frontend: Vite React and Tailwind CSS. Deployed using GitHub Pages
- Backend: PHP Laravel. Deployed using Render
- Database: PostgreSQL. Deployed using Supabase

## API Endpoint Documentation
All endpoints, aside from the `/api/login` endpoint, require a `Bearer` token in the `Authorization` header of requests. You can get a valid Bearer token by authenticating via a login request.

### Authentication

- `[POST] /api/login` - Handles login requests
    - Expected request body:
        ```
        {
            "email": <valid email>,
            "password": <password>
        }
        ```
    - Upon success, returns:
        ```
        {
            "employee": <employee data>,
            "token": <auth token>,
            "token_expiration": <token expiration timestamp>
        }
        ```

- `[POST] /api/logout` - Handles logout requests

### Employee model
Endpoints for the employee model require authenticating as an account recognized as a 'Manager' to use.

- `[GET] /api/employees` - Returns a list of all employees

- `[POST] /api/employees` - Creates a new employee
    - Expected request body:
        ```
        {
            "username": < name >,
            "email": < valid email >,
            "password": < password >,
            "password_confirmation": < password >,
            "contact_number": < 09XXXXXXXXX >,
            "address": < address >,
            "hire_date": < date >,
            "monthly_salary": < any number greater than 0 >
        }
        ```

- `[PUT] /api/employees/{employee ID}` - Updates the employee record associated with the given employee ID
    - Expected request body:
        ```
        {
            "username": < name >,
            "email": < valid email >,
            "password": < password >,
            "password_confirmation": < password >,
            "contact_number": < 09XXXXXXXXX >,
            "address": < address >,
            "hire_date": < date >,
            "monthly_salary": < any number greater than 0 >
        }
        ```

- `[DELETE] /api/employees/{employee ID}` - Deletes the employee record associated with the given employee ID

### Member Model

- `[GET] /api/members` - Returns a list of all members

- `[POST] /api/members` - Creates a new member
    - Expected request body:
        ```
        {
            "name": < name >,
            "email": < email >,
            "address": < address >,
            "contact_number": < 09XXXXXXXXX >,
            "plan_type": < value must either be 'VIP' or 'Regular' >,
            "payment_amount": < value must be greater than 0 >,
            "mode_of_payment": < value must either be 'Cash' or 'GCash' >,
            "payment_status": < value must either be 'Paid', 'Pending', or 'Failed >
        }
        ```

- `[PUT] /api/members/{member ID}` - Updates a member's information based on the given member ID
    - Expected request body:
        ```
        {
            "name": < name >,
            "email": < email >,
            "address": < address >,
            "contact_number": < 09XXXXXXXXX >,
            "plan_type": < value must either be 'VIP' or 'Regular' >,
            "payment_amount": < value must be greater than 0 >,
            "mode_of_payment": < value must either be 'Cash' or 'GCash' >,
            "payment_status": < value must either be 'Paid', 'Pending', or 'Failed >
        }
        ```

- `[DELETE] /api/members/{member}` - Deletes the member associated with the given member ID

### Workout Session Model

- `[GET] /api/workout-sessions` - Returns a list of all workout sessions

- `[POST] /api/workout-sessions` - Creates a new workout session log
    - Creating a new workout session also creates a new transaction record
    - Expected request body:
        ```
        {
            "name": < customer name >,
            "email": < (optional) only required if the customer is a gym member >,
            "payment_amount": < amount paid by the customer >,
            "mode_of_payment": < value must be 'Cash' or 'GCash' >,
            "payment_status": < value must be 'Paid', 'Pending' or 'Failed' >
        }
        ```

- `[DELETE] /api/workout-sessions/{workoutSession}` - Deletes the workout session log associated with the given session ID

### Transaction Model

- `[GET] /api/transactions` - Returns a list of all transactions

- `[PUT] /api/transactions/{transaction ID}` - Updates the status of the transaction associated with the given transaction ID
    - Expected request body:
        ```
        {
            "status": < value must either be 'Paid', 'Pending', 'Failed' >
        }
        ```

## How to run locally

### First, get the following if you haven't already:
- PHP
- npm
- Docker

### Second, set up the `.env` files of the backend and frontend
1. Find the `.env.example` file inside the `backend` directory. Copy and paste the file inside the same directory and rename it to `.env.local`.
2. Find the `.env.example` file inside the `frontend` directory. Copy and paste the file inside the same directory and rename it to `.env`.

### Third, start running the backend and database
1. Start a terminal session with the project's root folder as the current working directory.
2. Run this command: `docker compose up`
3. Wait for the containers to finish initialization

### Next, seed the database with dummy data
1. Start a terminal session with the `backend` folder as the current working directory.
2. Run these commands:
    ```
    php artisan db:seed --class=MembershipPlanSeeder
    php artisan db:seed --class=ManagerSeeder
    php artisan db:seed --class=EmployeeSeeder
    php artisan db:seed --class=CustomerSeeder
    ```

### Now, run the frontend
1. Start a terminal session with the `frontend` folder as the current working directory.
2. Run these commands:
    ```
    npm install
    npm run dev
    ```

### You can now visit the website to interact with the system
Open a browser and paste this URL:
```
http://localhost:5173/GymSoftwareSystem/
```