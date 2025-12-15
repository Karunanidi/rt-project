import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export function AdminProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAdmin, loading, session } = useAdminAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                    <p className="mt-4 text-muted-foreground">Memuat...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return <Navigate to="/not-authorized" replace />
    }

    return children
}
