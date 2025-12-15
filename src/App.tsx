import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { LayananPage } from "@/pages/LayananPage"
import { KegiatanDetailPage } from "@/pages/KegiatanDetailPage"
import { EventsPage } from "@/pages/EventsPage"
import { AgendaPage } from "@/pages/AgendaPage"
import { NotAuthorizedPage } from "@/pages/NotAuthorizedPage"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { AdminDashboard } from "@/pages/admin/AdminDashboard"
import { CitizenManagement } from "@/pages/admin/CitizenManagement"
import { ActivityManagement } from "@/pages/admin/ActivityManagement"
import { ServiceManagement } from "@/pages/admin/ServiceManagement"
import { IPLManagement } from "@/pages/admin/IPLManagement"
import { AdminSettings } from "@/pages/admin/AdminSettings"

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout><HomePage /></Layout>} />
                    <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                    <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
                    <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
                    <Route path="/layanan" element={<Layout><LayananPage /></Layout>} />
                    <Route path="/kegiatan/:id" element={<Layout><KegiatanDetailPage /></Layout>} />
                    <Route path="/events" element={<Layout><EventsPage /></Layout>} />
                    <Route path="/agenda" element={<Layout><AgendaPage /></Layout>} />
                    <Route path="/not-authorized" element={<Layout><NotAuthorizedPage /></Layout>} />

                    {/* User Protected Route */}
                    <Route
                        path="/dashboard"
                        element={
                            <Layout>
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            </Layout>
                        }
                    />

                    {/* Admin Protected Routes */}
                    <Route
                        path="/admin"
                        element={
                            <AdminProtectedRoute>
                                <AdminLayout>
                                    <AdminDashboard />
                                </AdminLayout>
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/warga"
                        element={
                            <AdminProtectedRoute>
                                <AdminLayout>
                                    <CitizenManagement />
                                </AdminLayout>
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/kegiatan"
                        element={
                            <AdminProtectedRoute>
                                <AdminLayout>
                                    <ActivityManagement />
                                </AdminLayout>
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/layanan"
                        element={
                            <AdminProtectedRoute>
                                <AdminLayout>
                                    <ServiceManagement />
                                </AdminLayout>
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/ipl"
                        element={
                            <AdminProtectedRoute>
                                <AdminLayout>
                                    <IPLManagement />
                                </AdminLayout>
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/settings"
                        element={
                            <AdminProtectedRoute>
                                <AdminLayout>
                                    <AdminSettings />
                                </AdminLayout>
                            </AdminProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App

