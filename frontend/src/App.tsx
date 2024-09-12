import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProjectForm from './components/ProjectForm';
import IssueList from './components/IssueList';
import UserList from './components/UserList';  // UserList 컴포넌트 import
import { AuthProvider } from './context/AuthContext';
import ResetPassword from './pages/ResetPassword';
import IssueForm from './components/IssueForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/projectform" element={<ProjectForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/projects/:projectId/issues" element={<IssueList />} />
          <Route path="/projects/:projectId/issues/:issueId" element={<IssueForm />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/user-list" element={<UserList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;