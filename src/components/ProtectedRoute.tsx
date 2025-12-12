import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { session } = useAuth()

    if (!session) {
        return <Navigate to="/login" replace />
    }

    return children
}
