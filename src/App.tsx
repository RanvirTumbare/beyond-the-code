import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Public Pages (Lazy Loaded)
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));
const Journey = lazy(() => import('@/pages/Journey').then((m) => ({ default: m.Journey })));
const Projects = lazy(() => import('@/pages/Projects').then((m) => ({ default: m.Projects })));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail').then((m) => ({ default: m.ProjectDetail })));
const Certificates = lazy(() => import('@/pages/Certificates').then((m) => ({ default: m.Certificates })));
const Diary = lazy(() => import('@/pages/Diary').then((m) => ({ default: m.Diary })));
const DiaryDetail = lazy(() => import('@/pages/DiaryDetail').then((m) => ({ default: m.DiaryDetail })));
const Gallery = lazy(() => import('@/pages/Gallery').then((m) => ({ default: m.Gallery })));
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })));
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

// Admin Pages (Lazy Loaded)
const AdminLayout = lazy(() => import('@/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import('@/admin/AdminOverview').then((m) => ({ default: m.AdminOverview })));
const AdminHomepage = lazy(() => import('@/admin/AdminHomepage').then((m) => ({ default: m.AdminHomepage })));
const AdminAbout = lazy(() => import('@/admin/AdminAbout').then((m) => ({ default: m.AdminAbout })));
const AdminJourney = lazy(() => import('@/admin/AdminJourney').then((m) => ({ default: m.AdminJourney })));
const AdminProjects = lazy(() => import('@/admin/AdminProjects').then((m) => ({ default: m.AdminProjects })));
const AdminCertificates = lazy(() => import('@/admin/AdminCertificates').then((m) => ({ default: m.AdminCertificates })));
const AdminDiary = lazy(() => import('@/admin/AdminDiary').then((m) => ({ default: m.AdminDiary })));
const AdminGallery = lazy(() => import('@/admin/AdminGallery').then((m) => ({ default: m.AdminGallery })));
const AdminMessages = lazy(() => import('@/admin/AdminMessages').then((m) => ({ default: m.AdminMessages })));
const AdminProfile = lazy(() => import('@/admin/AdminProfile').then((m) => ({ default: m.AdminProfile })));
const AdminSettings = lazy(() => import('@/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

// Editorial Page Loader
const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 text-[#777F79]">
    <Loader2 className="w-6 h-6 animate-spin text-[#43866A] mb-3" />
    <span className="font-serif text-xs italic tracking-wider">Beyond the Code...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Website Routes wrapped in main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="journey" element={<Journey />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="diary" element={<Diary />} />
          <Route path="diary/:slug" element={<DiaryDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/home" replace />} />
            <Route path="home" element={<AdminHomepage />} />
            <Route path="homepage" element={<Navigate to="/admin/home" replace />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="articles" element={<AdminDiary />} />
            <Route path="diary" element={<Navigate to="/admin/articles" replace />} />
            <Route path="contact" element={<AdminMessages />} />
            <Route path="messages" element={<Navigate to="/admin/contact" replace />} />
            <Route path="journey" element={<AdminJourney />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

