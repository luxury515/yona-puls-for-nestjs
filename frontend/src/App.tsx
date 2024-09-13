import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import ProjectList from './components/ProjectList';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProjectForm from './components/ProjectForm';
import IssueList from './components/IssueList';
import UserList from './components/UserList';
import { AuthProvider } from './context/AuthContext';
import ResetPassword from './pages/ResetPassword';
import IssueForm from './components/IssueForm';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Profile from './components/Profile'; 
import LabelList from './components/LabelList';
import LabelForm from './components/LabelForm';
import SystemSettings from './components/SystemSettings';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
    <Header />
    <div className="flex flex-1">
      <SideMenu />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<PageLayout><Home /></PageLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
            <Route path="/users" element={<PageLayout><UserList /></PageLayout>} />
            <Route path="/users/user-list" element={<PageLayout><UserList /></PageLayout>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/projectform" element={<PageLayout><ProjectForm /></PageLayout>} />
            <Route path="/projects" element={<PageLayout><ProjectList /></PageLayout>} />
            <Route path="/projects/:projectId/issues" element={<PageLayout><IssueList /></PageLayout>} />
            <Route path="/projects/:projectId/issues/:issueId" element={<PageLayout><IssueForm /></PageLayout>} />
            <Route path="*" element={<Navigate to="/projects" replace />} />
            <Route path="/label-list" element={<PageLayout><LabelList /></PageLayout>} />
            <Route path="/label-form" element={<PageLayout><LabelForm /></PageLayout>} />
            <Route path="/system-settings" element={<PageLayout><SystemSettings /></PageLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;