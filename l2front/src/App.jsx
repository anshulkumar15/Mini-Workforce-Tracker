import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import WorkLogs from "./pages/WorkLogs";
import { Toaster } from "react-hot-toast";



function App() {
  return (
    <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
  path="/attendance"
  element={
    <ProtectedRoute>
      <Attendance />
    </ProtectedRoute>
  }
/>
<Route
  path="/worklogs"
  element={
    <ProtectedRoute>
      <WorkLogs />
    </ProtectedRoute>
  }
/>


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;