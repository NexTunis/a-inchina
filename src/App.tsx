import { HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import SiteLayout from './site/SiteLayout'
import Landing from './site/Landing'
import Universities from './site/Universities'
import ScholarshipsPage from './site/ScholarshipsPage'
import Apply from './site/Apply'
import Login from './site/Login'
import PortalLayout from './portal/PortalLayout'
import Overview from './portal/Overview'
import Documents from './portal/Documents'
import Applications from './portal/Applications'
import Arrival from './portal/Arrival'
import Messages from './portal/Messages'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import Students from './admin/Students'
import StudentDetail from './admin/StudentDetail'
import Pipeline from './admin/Pipeline'
import AdminDocuments from './admin/AdminDocuments'
import Arrivals from './admin/Arrivals'
import AdminUniversities from './admin/Universities'
import Staff from './admin/Staff'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Landing />} />
            <Route path="universities" element={<Universities />} />
            <Route path="scholarships" element={<ScholarshipsPage />} />
            <Route path="apply" element={<Apply />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="portal" element={<PortalLayout />}>
            <Route index element={<Overview />} />
            <Route path="documents" element={<Documents />} />
            <Route path="applications" element={<Applications />} />
            <Route path="arrival" element={<Arrival />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="arrivals" element={<Arrivals />} />
            <Route path="universities" element={<AdminUniversities />} />
            <Route path="staff" element={<Staff />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
