import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from './components/Layout';
// Clinic components hidden
// import { ProtectedRoute } from './components/ProtectedRoute';
// import { Login } from './pages/Login';
// import { AdminDashboard } from './pages/admin/Dashboard';
// import { AdminDoctors } from './pages/admin/Doctors';
// import { AdminCashiers } from './pages/admin/Cashiers';
// import { AdminAppointments } from './pages/admin/Appointments';
// import { CashierDashboard } from './pages/cashier/Dashboard';
// import { CashierPatients } from './pages/cashier/Patients';
// import { CreateAppointment } from './pages/cashier/CreateAppointment';
// import { CashierPayments } from './pages/cashier/Payments';
// import { DoctorDashboard } from './pages/doctor/Dashboard';
// import { DoctorAppointments } from './pages/doctor/MyAppointments';
// import { Home } from './pages/Home';
import { CrmLogin } from './crm/pages/CrmLogin';
import { CrmLayout } from './crm/components/CrmLayout';
import { CrmProtectedRoute } from './crm/components/CrmProtectedRoute';
import { DashboardPage } from './crm/pages/DashboardPage';
import { ProductsPage } from './crm/pages/ProductsPage';
import { SuppliersPage } from './crm/pages/SuppliersPage';
import { CustomersPage } from './crm/pages/CustomersPage';
import { OrdersPage } from './crm/pages/OrdersPage';

export function App() {
  return (
    <Router>
      <Routes>
        {/* Clinic routes are temporarily hidden as requested */}


        {/* CRM Routes */}
        <Route path="/crm/login" element={<CrmLogin />} />
        <Route path="/crm" element={<Navigate to="/crm/dashboard" replace />} />
        <Route path="/crm/dashboard" element={<CrmProtectedRoute><CrmLayout><DashboardPage /></CrmLayout></CrmProtectedRoute>} />
        <Route path="/crm/products" element={<CrmProtectedRoute><CrmLayout><ProductsPage /></CrmLayout></CrmProtectedRoute>} />
        <Route path="/crm/suppliers" element={<CrmProtectedRoute><CrmLayout><SuppliersPage /></CrmLayout></CrmProtectedRoute>} />
        <Route path="/crm/customers" element={<CrmProtectedRoute><CrmLayout><CustomersPage /></CrmLayout></CrmProtectedRoute>} />
        <Route path="/crm/orders" element={<CrmProtectedRoute><CrmLayout><OrdersPage /></CrmLayout></CrmProtectedRoute>} />

        {/* Default Route - Redirected to CRM Login */}
        <Route path="/" element={<Navigate to="/crm/login" replace />} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}