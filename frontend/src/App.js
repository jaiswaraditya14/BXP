import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddBook from './pages/AddBook';
import MyBooks from './pages/MyBooks';
import Requests from './pages/Requests';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (!isAdmin) return <Navigate to="/" />;

    return children;
};

// Guest Route Component (for login/register pages)
const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />

                    {/* Guest Routes */}
                    <Route path="/login" element={
                        <GuestRoute><Login /></GuestRoute>
                    } />
                    <Route path="/register" element={
                        <GuestRoute><Register /></GuestRoute>
                    } />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                    } />
                    <Route path="/add-book" element={
                        <ProtectedRoute><AddBook /></ProtectedRoute>
                    } />
                    <Route path="/my-books" element={
                        <ProtectedRoute><MyBooks /></ProtectedRoute>
                    } />
                    <Route path="/requests" element={
                        <ProtectedRoute><Requests /></ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute><Admin /></AdminRoute>
                    } />

                    {/* 404 Redirect */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
