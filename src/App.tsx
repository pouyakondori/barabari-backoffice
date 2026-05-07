import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import faIR from 'antd/locale/fa_IR';
import { AuthProvider } from '@/auth/AuthProvider';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserList = lazy(() => import('@/pages/users/UserList'));
const UserDetail = lazy(() => import('@/pages/users/UserDetail'));
const CountryList = lazy(() => import('@/pages/countries/CountryList'));
const CountryForm = lazy(() => import('@/pages/countries/CountryForm'));
const ConstitutionList = lazy(() => import('@/pages/constitutions/ConstitutionList'));
const ConstitutionDetail = lazy(() => import('@/pages/constitutions/ConstitutionDetail'));
const TopicList = lazy(() => import('@/pages/topics/TopicList'));
const TopicForm = lazy(() => import('@/pages/topics/TopicForm'));
const CommentModeration = lazy(() => import('@/pages/comments/CommentModeration'));
const VoteAnalytics = lazy(() => import('@/pages/votes/VoteAnalytics'));
const PodcastList = lazy(() => import('@/pages/podcasts/PodcastList'));
const PodcastForm = lazy(() => import('@/pages/podcasts/PodcastForm'));
const TimelineList = lazy(() => import('@/pages/timeline/TimelineList'));
const TimelineForm = lazy(() => import('@/pages/timeline/TimelineForm'));
const SandboxList = lazy(() => import('@/pages/sandboxes/SandboxList'));
const GeneralSettings = lazy(() => import('@/pages/settings/GeneralSettings'));
const FeaturedContent = lazy(() => import('@/pages/settings/FeaturedContent'));
const AuditLog = lazy(() => import('@/pages/audit/AuditLog'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Spin size="large" />
    </div>
  );
}

export function App() {
  return (
    <ConfigProvider direction="rtl" locale={faIR}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="users/:id" element={<UserDetail />} />
                    <Route path="countries" element={<CountryList />} />
                    <Route path="countries/new" element={<CountryForm />} />
                    <Route path="countries/:id/edit" element={<CountryForm />} />
                    <Route path="constitutions" element={<ConstitutionList />} />
                    <Route path="constitutions/:id" element={<ConstitutionDetail />} />
                    <Route path="topics" element={<TopicList />} />
                    <Route path="topics/new" element={<TopicForm />} />
                    <Route path="topics/:id/edit" element={<TopicForm />} />
                    <Route path="comments" element={<CommentModeration />} />
                    <Route path="votes" element={<VoteAnalytics />} />
                    <Route path="podcasts" element={<PodcastList />} />
                    <Route path="podcasts/new" element={<PodcastForm />} />
                    <Route path="podcasts/:id/edit" element={<PodcastForm />} />
                    <Route path="timeline" element={<TimelineList />} />
                    <Route path="timeline/new" element={<TimelineForm />} />
                    <Route path="timeline/:id/edit" element={<TimelineForm />} />
                    <Route path="sandboxes" element={<SandboxList />} />
                    <Route path="settings" element={<GeneralSettings />} />
                    <Route path="settings/featured" element={<FeaturedContent />} />
                    <Route path="audit" element={<AuditLog />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
