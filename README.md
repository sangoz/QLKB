# DoctorCare - Healthcare Management System

DoctorCare is a full-stack web application designed to streamline healthcare operations for clinics and hospitals. It provides tools for managing patients, appointments, medical records, prescriptions, invoicing, and staff roles, with a focus on efficiency and user-friendly interfaces.

## Features

- **User Authentication & Role-Based Access**: Secure login with JWT tokens. Supports roles like Admin, Doctor, Cashier, Receptionist, Inpatient Manager, and Support.
- **Patient Management**: Register and manage patient profiles, medical history, and records.
- **Appointment Scheduling**: Book, manage, and track appointments with doctors.
- **Medical Records & Prescriptions**: Create and manage electronic health records, prescriptions, and medication tracking.
- **Invoicing & Payments**: Generate invoices for services, medications, and inpatient stays. Integrates with MoMo payment gateway.
- **Staff & Department Management**: Admin tools for managing employees, departments, and services.
- **Dashboard Analytics**: Role-specific dashboards for monitoring operations and metrics.
- **Responsive UI**: Built with Material-UI for a modern, mobile-friendly experience.

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Other**: Axios for HTTP requests, Nodemailer for emails, Multer for file uploads, PDFKit for document generation

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM
- **Other**: Axios for API calls, React Toastify for notifications, NProgress for loading bars, XLSX for Excel exports

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Docker (optional, for containerized setup)

## Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd doctorcare
   ```

2. **Backend Setup**:
   - Navigate to the `be/` directory:
     ```bash
     cd be
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Set up environment variables: Copy `.env.example` to `.env` and configure (e.g., DATABASE_URL, JWT_SECRET, EMAIL settings).
   - Run database migrations:
     ```bash
     npx prisma migrate dev
     ```
   - Seed the database (optional):
     ```bash
     npx prisma db seed
     ```
   - Start the development server:
     ```bash
     npm run start:dev
     ```
     The backend will run on `http://localhost:3001` (or as configured).

3. **Frontend Setup**:
   - Navigate to the `fe/` directory:
     ```bash
     cd ../fe
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
     The frontend will run on `http://localhost:3000`.

4. **Access the Application**:
   - Open `http://localhost:3000` in your browser.
   - Default login credentials (if seeded): Check your seed file or database.

## Usage

- **Admin**: Manage employees, departments, medicines, and services via the admin dashboard.
- **Doctor**: View schedules, create medical forms, prescriptions, and records.
- **Cashier**: Handle invoicing and payments.
- **Receptionist**: Manage appointments and patient check-ins.
- **Patient**: Book appointments, view records, and pay invoices.
- **Public Users**: Browse doctors, departments, and services without logging in.

## API Documentation

The backend exposes RESTful APIs under the `/api/v1` prefix. Use tools like Postman to test endpoints. Key modules include:
- `/benhnhan` (Patients)
- `/lich` (Appointments)
- `/hoadon` (Invoices)
- `/thuoc` (Medicines)

## Development

- **Linting**: Run `npm run lint` in both `be/` and `fe/`.
- **Testing**: Use `npm run test` for unit tests (backend) and configure as needed for frontend.
- **Building for Production**:
  - Backend: `npm run build`
  - Frontend: `npm run build`

## Deployment

- Use Docker Compose for containerized deployment (see `docker-compose.yml` in `be/`).
- Deploy backend to services like Heroku or AWS, and frontend to Vercel/Netlify.
- Ensure environment variables are set securely.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is unlicensed (as per package.json). Update if needed.

## Contact

For questions or support, reach out to [your-email@example.com] or create an issue in the repository.
