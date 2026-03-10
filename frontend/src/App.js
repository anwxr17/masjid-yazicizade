import React, { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import LocationPage from "./pages/LocationPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import JoinPage from "./pages/JoinPage";
import DonatePage from "./pages/DonatePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!admin) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

// Main App Layout
const AppLayout = ({ children, content, darkMode, setDarkMode }) => {
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1">
          {children}
        </main>
        <Footer content={content} />
      </div>
    </div>
  );
};

function AppContent() {
  const [content, setContent] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('rtj-dark-mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('rtj-dark-mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchContent = async () => {
    try {
      const [contentRes, announcementsRes] = await Promise.all([
        axios.get(`${API}/content`),
        axios.get(`${API}/announcements`)
      ]);
      setContent(contentRes.data);
      setAnnouncements(announcementsRes.data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-primary-foreground font-heading text-2xl">ر</span>
          </div>
          <p className="text-muted-foreground">Loading roadtojannah...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <AppLayout content={content} darkMode={darkMode} setDarkMode={setDarkMode}>
            <HomePage content={content} announcements={announcements} />
          </AppLayout>
        } />
        <Route path="/schedule" element={
          <AppLayout content={content} darkMode={darkMode} setDarkMode={setDarkMode}>
            <SchedulePage content={content} />
          </AppLayout>
        } />
        <Route path="/location" element={
          <AppLayout content={content} darkMode={darkMode} setDarkMode={setDarkMode}>
            <LocationPage content={content} />
          </AppLayout>
        } />
        <Route path="/activities" element={
          <AppLayout content={content} darkMode={darkMode} setDarkMode={setDarkMode}>
            <ActivitiesPage content={content} />
          </AppLayout>
        } />
        <Route path="/join" element={
          <AppLayout content={content} darkMode={darkMode} setDarkMode={setDarkMode}>
            <JoinPage content={content} />
          </AppLayout>
        } />
        <Route path="/donate" element={
          <AppLayout content={content} darkMode={darkMode} setDarkMode={setDarkMode}>
            <DonatePage content={content} />
          </AppLayout>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <div className={darkMode ? 'dark' : ''}>
              <AdminDashboard 
                content={content} 
                setContent={setContent}
                announcements={announcements}
                setAnnouncements={setAnnouncements}
                refreshContent={fetchContent}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
