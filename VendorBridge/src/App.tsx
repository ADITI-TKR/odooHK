import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import Activity from './pages/Activity'
import AdminUsers from './pages/AdminUsers'
import Approvals from './pages/Approvals'
import BrowseProducts from './pages/BrowseProducts'
import CompareQuotations from './pages/CompareQuotations'
import CreateRFQ from './pages/CreateRFQ'
import Dashboard from './pages/Dashboard'
import Invoices from './pages/Invoices'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Marketplace from './pages/Marketplace'
import MyProducts from './pages/MyProducts'
import Quotations from './pages/Quotations'
import Register from './pages/Register'
import Reports from './pages/Reports'
import RFQs from './pages/RFQs'
import Settings from './pages/Settings'
import VendorRegister from './pages/VendorRegister'
import Vendors from './pages/Vendors'
import OrderDashboard from './pages/dashboards/OrderDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/vendor" element={<VendorRegister />} />
      <Route path="/app" element={<MainLayout />}>
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="vendors" element={<ProtectedRoute roles={['admin', 'procurement_officer']}><Vendors /></ProtectedRoute>} />
        <Route path="products" element={<ProtectedRoute roles={['admin', 'procurement_officer']}><BrowseProducts /></ProtectedRoute>} />
        <Route path="marketplace" element={<ProtectedRoute roles={['admin', 'procurement_officer']}><Marketplace /></ProtectedRoute>} />
        <Route path="my-products" element={<ProtectedRoute roles={['vendor', 'admin']}><MyProducts /></ProtectedRoute>} />
        <Route path="rfqs" element={<ProtectedRoute><RFQs /></ProtectedRoute>} />
        <Route path="rfqs/create" element={<ProtectedRoute roles={['admin', 'procurement_officer']}><CreateRFQ /></ProtectedRoute>} />
        <Route path="quotations" element={<ProtectedRoute><Quotations /></ProtectedRoute>} />
        <Route path="quotations/compare" element={<ProtectedRoute roles={['admin', 'procurement_officer']}><CompareQuotations /></ProtectedRoute>} />
        <Route path="approvals" element={<ProtectedRoute roles={['admin', 'manager']}><Approvals /></ProtectedRoute>} />
        <Route path="dashboard/orders" element={<ProtectedRoute><OrderDashboard /></ProtectedRoute>} />
        <Route path="invoices" element={<ProtectedRoute roles={['admin', 'procurement_officer']}><Invoices /></ProtectedRoute>} />
        <Route path="activity" element={<ProtectedRoute roles={['admin']}><Activity /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute roles={['admin', 'manager', 'procurement_officer']}><Reports /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>
  )
}
