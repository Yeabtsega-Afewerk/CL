import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdmin';
import ClassAdminDashboard from './pages/ClassAdmin/ClassAdminDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
function App() {
  return (            
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/class-admin-dashboard" element={<ClassAdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;