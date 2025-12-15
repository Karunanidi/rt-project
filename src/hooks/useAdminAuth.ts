import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
    id: string
    full_name: string
    house_number: string
    nik: string
    phone: string
    role: string
}

export function useAdminAuth() {
    const { user, session, loading: authLoading } = useAuth()
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkAdminRole() {
            if (authLoading) return

            if (!user || !session) {
                setIsAdmin(false)
                setProfile(null)
                setLoading(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error) {
                    console.error('Error fetching profile:', error)
                    setIsAdmin(false)
                    setProfile(null)
                } else {
                    setProfile(data)
                    setIsAdmin(data?.role === 'admin')
                }
            } catch (err) {
                console.error('Error checking admin role:', err)
                setIsAdmin(false)
                setProfile(null)
            } finally {
                setLoading(false)
            }
        }

        checkAdminRole()
    }, [user, session, authLoading])

    return { isAdmin, profile, loading: loading || authLoading, user, session }
}
