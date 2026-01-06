import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { FC } from "react";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Patient pages  
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";
import PatientInvoices from "./pages/patient/Invoices";
import PatientMedicalRecords from "./pages/patient/MedicalRecords";

// Role-specific employee dashboards
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorMedicalForms from "./pages/doctor/MedicalForms";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorSchedules from "./pages/doctor/Schedules";

import CashierDashboard from "./pages/cashier/Dashboard";
import CashierInvoices from "./pages/cashier/Invoices";

import ReceptionDashboard from "./pages/reception/Dashboard";
import DoctorMedicalRecords from "./pages/doctor/MedicalRecords";
// Additional employee role pages
import InpatientManagerDashboard from "./pages/inpatient/Dashboard";
import DirectorDashboard from "./pages/director/Dashboard";

// Admin pages
import AdminEmployees from "./pages/admin/Employees";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDepartments from "./pages/admin/Departments";
import AdminMedicines from "./pages/admin/Medicines";
import AdminServices from "./pages/admin/Services";

// Public pages
import PublicDoctors from "./pages/public/Doctors";
import PublicDepartments from "./pages/public/Departments";
import PublicServices from "./pages/public/Services";
import PublicInpatient from "./pages/public/Inpatient";
import Contact from "./pages/Contact";

// Layout
import Layout from "./components/layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard component (formerly Temp)
import Dashboard from "./pages/temp";
import SupportDashboard from "./pages/support/Dashboard";
import SupportAppointmentManagement from "./pages/support/AppointmentManagement";
import ServiceManage from "./pages/service/service-manage";
import RoomManagement from "./pages/inpatient/RoomManagement";
import TransferManagement from "./pages/inpatient/TransferManagement";



const App: FC = () => {
  // const dispatch = useDispatch();
  // const getAccount = async () => {
  //   const res = await callFetchAccount();
  //   if (res && res.data) {
  //     dispatch(doGetAccountAction(res.data))
  //   }
  // }

  // useEffect(() => {
  //   getAccount()
  // }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register", 
      element: <Register />,
    },
    // Patient Routes
    {
      path: "/patient/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['Patient']}>
          <Layout>
            <PatientDashboard/>
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/patient/appointments",
      element: (
        <ProtectedRoute allowedRoles={['Patient']}>
          <Layout>
            <PatientAppointments />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/patient/invoices",
      element: (
        <ProtectedRoute allowedRoles={['Patient']}>
          <Layout>
            <PatientInvoices />
          </Layout>
        </ProtectedRoute>
      ),
    },
    // Role-specific Employee Routes
    {
      path: "/doctor/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['BacSi']}>
          <Layout>
            <DoctorDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/medical-forms",
      element: (
        <ProtectedRoute allowedRoles={['BacSi']}>
          <Layout>
            <DoctorMedicalForms />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/prescriptions",
      element: (
        <ProtectedRoute allowedRoles={['BacSi']}>
          <Layout>
            <DoctorPrescriptions />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/schedules",
      element: (
        <ProtectedRoute allowedRoles={['BacSi']}>
          <Layout>
            <DoctorSchedules />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/cashier/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['ThuNgan']}>
          <Layout>
            <CashierDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/cashier/invoices",
      element: (
        <ProtectedRoute allowedRoles={['ThuNgan']}>
          <Layout>
            <CashierInvoices />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/reception/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['TiepNhan']}>
          <Layout>
            <ReceptionDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/medical-records",
      element: (
        <ProtectedRoute allowedRoles={['BacSi']}>
          <Layout>
            <DoctorMedicalRecords />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/inpatient/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['QuanLyNoiTru']}>
          <Layout>
            <InpatientManagerDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/inpatient/rooms",
      element: (
        <ProtectedRoute allowedRoles={['QuanLyNoiTru']}>
          <Layout>
            <RoomManagement />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/inpatient/patients",
      element: (
        <ProtectedRoute allowedRoles={['QuanLyNoiTru']}>
          <Layout>
            <TransferManagement />
          </Layout>
        </ProtectedRoute>
      ),
    },

    {
      path: "/director/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['BanGiamDoc']}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    // Admin Routes
    {
      path: "/admin/employees",
      element: (
        <ProtectedRoute allowedRoles={['BanGiamDoc']}>
          <Layout>
            <AdminEmployees />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['BanGiamDoc']}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/departments",
      element: (
        <ProtectedRoute allowedRoles={['BanGiamDoc']}>
          <Layout> 
            <AdminDepartments />
          </Layout>
        </ProtectedRoute>
      ),
    },

    // {
    //   path: "/admin/rooms",
    //   element: (
    //     <Layout userType="admin">
    //       <AdminRooms />
    //     </Layout>
    //   ),
    // },
    {
      path: "/admin/medicines",
      element: (
        <ProtectedRoute allowedRoles={['BanGiamDoc']}>
          <Layout>
            <AdminMedicines />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/services",
      element: (
        <ProtectedRoute allowedRoles={['BanGiamDoc']}>
          <Layout>
            <AdminServices />
          </Layout>
        </ProtectedRoute>
      ),
    },

    // Support Routes
    {
      path: "/support/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['HoTro']}>
          <Layout>
            <SupportDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/support/appointment-management",
      element: (
        <ProtectedRoute allowedRoles={['HoTro']}>
          <Layout>
            <SupportAppointmentManagement />
          </Layout>
        </ProtectedRoute>
      ),
    },

    //Service Routes
    {
      path: "/service/dashboard",
      element: (
        <ProtectedRoute allowedRoles={['DichVu']}>
          <Layout>
            <ServiceManage />
          </Layout>
        </ProtectedRoute>
      ),
    },

    // Public Routes
    {
      path: "/public/doctors",
      element: <PublicDoctors />,
    },
    {
      path: "/public/departments",
      element: <PublicDepartments />,
    },
    {
      path: "/public/services",
      element: <PublicServices />,
    },
    {
      path: "/public/inpatient",
      element: <PublicInpatient />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    // Patient medical records
    {
      path: "/patient/medical-records",
      element: (
        <ProtectedRoute allowedRoles={['Patient']}>
          <Layout>
            <PatientMedicalRecords />
          </Layout>
        </ProtectedRoute>
      ),
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
