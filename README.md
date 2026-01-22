# -Contact-Form-Management-System
## Project Overview

This project is a Contact Form Management System developed using React.js for the frontend. The backend of the project was provided as a ready-made implementation and was not developed by the author. The main purpose of the project is to allow users to submit contact messages and enable authorized users to manage, read, and analyze these messages through a secure and role-based system.

The project focuses on frontend development, while the backend is provided as a ready-to-use server and included in the frontend repository file for convenience.

<img width="1915" height="872" alt="Ekran görüntüsü 2026-01-22 194630" src="https://github.com/user-attachments/assets/64fae904-63a6-4825-8944-7b163407d5cb" />

## Project Purpose

The goal of this project is to:

* Create a user-friendly contact form

* Implement authentication and authorization using JWT

* Manage messages with role-based access (admin / reader)

* Demonstrate backend–frontend integration

* Visualize message data with basic charts

This project was developed as an educational assignment to practice modern web application development concepts.

 ## Technologies Used
### Frontend

* React.js (Vite)

* JavaScript / TypeScript

* React Router DOM (routing)

* Axios (HTTP requests)

* UI framework (MUI)


⚠️ Note: The backend source code was provided as part of the assignment. Backend development is not authored by me; it is only used to integrate and demonstrate frontend functionality.


## Backend Setup
```
cd contact-form-management-server
npm install
npm run start
```
Open http://localhost:5165/

## Frontend Setup
```
npm install
npm run dev
```
Open http://localhost:5173

<img width="1259" height="399" alt="Ekran görüntüsü 2026-01-22 211020" src="https://github.com/user-attachments/assets/03f04d2b-cf75-42a2-8510-259b7c8eaba1" />

<img width="1875" height="419" alt="Ekran görüntüsü 2026-01-22 211055" src="https://github.com/user-attachments/assets/c06a013b-26eb-4472-8aba-ff9b8fc82e12" />


## Authentication & Roles

* Users log in with a username and password

* JWT token is stored on the client side

* Role-based access control:

* * Reader: View and read messages

* * Admin: Manage messages, users, and reports

 <img width="1873" height="539" alt="Ekran görüntüsü 2026-01-22 211132" src="https://github.com/user-attachments/assets/27364ed6-4dc8-46a8-9ef2-978a52995968" />


## Features Summary

* Contact form with validation

* Country list fetched from backend

* Secure login & logout

* Protected routes

* Role-based navigation

* Message management

* Basic reporting with charts

## 👩‍💻 Author

Elif Aslan
