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
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/layanan" element={<LayananPage />} />
                        <Route path="/kegiatan/:id" element={<KegiatanDetailPage />} />

                        {/* Protected Route */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/agenda" element={<AgendaPage />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    )
}

export default App
