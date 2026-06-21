import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import CustomerMenu from './pages/CustomerMenu'
import KitchenDisplay from './pages/KitchenDisplay'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/menu/:tableId" element={<CustomerMenu />} />
      {/* Convenience redirect if someone hits /menu without a table */}
      <Route path="/menu" element={<Navigate to="/menu/table-1" replace />} />
      <Route path="/kitchen" element={<KitchenDisplay />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
