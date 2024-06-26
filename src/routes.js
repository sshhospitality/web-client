import axios from 'axios';
import { Navigate, useRoutes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import VendorDashboardLayout from './layouts/vendor';
import AdminDashboardLayout from './layouts/admin';
import DepartmentDashboardLayout from './layouts/department';
import ContactUs from './pages/StudentPages/ContactUs';
import Profile from './pages/StudentPages/Profile';
// import Payment from './pages/StudentPages/Payment';
import TransactionHistory from './pages/StudentPages/DTransactionHistory';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/StudentPages/ProductsPage';
import DashboardAppPage from './pages/StudentPages/DashboardAppPage';

import VDashboard from './pages/VendorPages/VDashboard';
import VHistory from './pages/VendorPages/VHistory';
import VMenu from './pages/VendorPages/VMenu';
import VDepartmentRegister from './pages/VendorPages/VDepartmentRegister';
import VDepartmentList from './pages/VendorPages/VDepartmentList';
import VFeedback from './pages/VendorPages/VFeedback';
import VendorMessDetails from './pages/VendorPages/VMessDetails';
import VStudentList from './pages/VendorPages/VStudentList';
import VProfile from './pages/VendorPages/VProfile';
import VStuHistory from './pages/VendorPages/VStuHistory';
import VPoll from './pages/VendorPages/VPoll';


import DDashboard from './pages/Department/DDashboard';
import DProfile from './pages/Department/DProfile';
import DTransactionHistory from './pages/Department/TransactionHistory';


import StudentRegister from './pages/VendorPages/StudentRegister';
import AdminDashboard from './pages/AdminPages/AdminDashboard';
import AdminStudentDetails from './pages/AdminPages/AdminStudentDetails';
import AdminTransactionDetails from './pages/AdminPages/AdminTransactionDetails';
import AdminMessDetails from './pages/AdminPages/AdminMessDetails';
import AdminMenuDetails from './pages/AdminPages/AdminMenuDetails';
import VerificationPortal from './pages/AdminPages/VerificationPortal';
import CollegeList from './pages/AdminPages/CollegeList';
import VerifyIndiForm from './pages/AdminPages/VerifyIndiForm';
import VerifyIndividualUser from './pages/AdminPages/VerifyIndividualUser';
import CollegeRegister from './pages/AdminPages/CollegeRegister';
import MessVerificationPortal from './components/MessVerificationPortal';
import Upload from './components/Upload';
import SaiTransaction from './pages/AdminPages/SaiTransaction';
import GalavTransaction from './pages/AdminPages/GalavTransaction';
import KumarTransaction from './pages/AdminPages/KumarTransaction';
import GalavStudents from './pages/AdminPages/CollegeList';
import KumarStudents from './pages/AdminPages/KumarStudents';
import SaiStudents from './pages/AdminPages/SaiStudents';
// import { useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // if (!token) {
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   navigate('/login', { replace: true });
    // }
    async function validation() {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API}/api/verify/person`, {
          withCredentials: true,
        });
        const { person } = response.data;
        // if(!response.status==200)
        // navigate('/login', { replace: true });
        if (person === 'Student' && (location.pathname.startsWith('/vendor') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/department')))
          window.location.pathname = '/dashboard';
        if (
          person === 'Vendor' &&
          (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/department'))
        )
          window.location.pathname = '/vendor';
        if (
          person === 'Department' &&
          (location.pathname.startsWith('/vendor') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') ))
          window.location.pathname = '/department';
        if (
          person === 'Admin' &&
          (location.pathname.startsWith('/vendor') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/department'))
        )

          window.location.pathname = '/admin';
      } catch (error) {
        if (error.status(401)) {
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login', { replace: true });
        } else if (error.response && error.response.data && error.response.data.msg) {
          const errorMessage = error.response.data.msg;
          // Display the error message to the user (e.g., using an alert or on the UI)
          alert(errorMessage);
        } else {
          // Handle unexpected errors
          console.error(error);
          // If token validation fails or there's an error, navigate the user to the login page
        }
        navigate('/login', { replace: true });
      }
    }
    if (!window.location.pathname === '/login') validation();
  }, [navigate, location.pathname]);
  const routes = useRoutes([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <Navigate to="/dashboard/app" /> },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'history', element: <TransactionHistory /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'contactUs', element: <ContactUs /> },
        // { path: 'payment', element: <Payment /> },
        { path: 'profile', element: <Profile /> },
      ],
    },

    {
      path: '/vendor/',
      element: <VendorDashboardLayout />,
      children: [
        { path: '', element: <Navigate to="/vendor/dashboard" /> },
        { path: 'dashboard', element: <VDashboard /> },
        { path: 'poll', element: <VPoll /> },
        { path: 'departmentRegister', element: <VDepartmentRegister /> },
        { path: 'departmentList', element: <VDepartmentList /> },
        { path: 'feedback', element: <VFeedback /> },
        { path: 'messdetails', element: <VendorMessDetails /> },
        { path: 'history', element: <VHistory /> },
        { path: 'studentHistory', element: <VStuHistory /> },
        { path: 'menu', element: <VMenu /> },
        { path: 'studentList', element: <VStudentList /> },
        { path: 'profile', element: <VProfile /> },
        {path:'studentRegister',element:<StudentRegister/>}
      ],
    },
    {
      path: '/department/',
      element: <DepartmentDashboardLayout />,
      children: [
        { path: '', element: <Navigate to="/department/dashboard" /> },
        { path: 'dashboard', element: <DDashboard /> },
        { path: 'profile', element: <DProfile /> },
        { path: 'history', element: <DTransactionHistory /> },
      ],
    },
    {
      path: '/admin',
      element: <AdminDashboardLayout />,
      children: [
        { path: '', element: <Navigate to="/admin/dashboard" /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'studentDetails', element: <AdminStudentDetails /> },
        { path: 'collegeList', element: <CollegeList /> },
        { path: 'kumarStudents', element: <KumarStudents /> },
        { path: 'saiStudents', element: <SaiStudents /> },
        { path: 'transactionDetails', element: <AdminTransactionDetails /> },
        { path: 'kumarTransaction', element: <KumarTransaction /> },
        { path: 'galavTransaction', element: <GalavTransaction /> },
        { path: 'saiTransaction', element: <SaiTransaction /> },
        { path: 'messDetails', element: <AdminMessDetails /> },
        { path: 'menuDetails', element: <AdminMenuDetails /> },
        { path: 'verificationPortal', element: <VerificationPortal /> },
        { path: 'verifyIndiForm', element: <VerifyIndiForm /> },
        { path: 'verifyIndividualUser', element: <VerifyIndividualUser /> },
        { path: 'messVerificationPortal', element: <MessVerificationPortal /> },
        { path: 'CollegeRegister', element: <CollegeRegister /> },
        { path: 'upload', element: <Upload /> },
      ],
    },
    {
      children: [
        { element: <Navigate to="/" /> },
        { path: '', element: <LoginPage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
