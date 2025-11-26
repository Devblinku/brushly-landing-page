import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactUs from './components/ContactUs';
import DataDeletion from './components/DataDeletion';
import DemoLeadPage from './components/DemoLeadPage';
import BlogListPage from './components/blog/BlogListPage';
import BlogPostPage from './components/blog/BlogPostPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import BlogList from './components/dashboard/BlogList';
import BlogEditor from './components/dashboard/BlogEditor';
import CategoryManager from './components/dashboard/CategoryManager';
import TagManager from './components/dashboard/TagManager';
import LoginPage from './components/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route path="/demo" element={<DemoLeadPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      
      {/* Auth Routes */}
      <Route path="/dashboard/login" element={<LoginPage />} />
      
      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/posts"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BlogList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/posts/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BlogEditor />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/posts/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BlogEditor />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/categories"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CategoryManager />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tags"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TagManager />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route for blog posts - must be last to allow other routes to match first */}
      <Route path="/:slug" element={<BlogPostPage />} />
    </Routes>
  );
};

export default App;
