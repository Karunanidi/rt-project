import { supabase } from './supabaseClient'

// ============= CITIZEN MANAGEMENT =============

export async function fetchAllCitizens() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    if (error) throw error
    return data
}

export async function updateCitizen(id: string, updates: Partial<any>) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteCitizen(id: string) {
    // Note: This only deletes from profiles. Auth user deletion requires admin API
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export async function updateUserRole(id: string, role: string) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// ============= ACTIVITY MANAGEMENT =============

export async function fetchActivities() {
    const { data, error } = await supabase
        .from('kegiatan')
        .select('*')
        .order('date', { ascending: false })

    if (error) throw error
    return data
}

export async function createActivity(activity: any) {
    const { data, error } = await supabase
        .from('kegiatan')
        .insert(activity)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateActivity(id: string, updates: any) {
    const { data, error } = await supabase
        .from('kegiatan')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteActivity(id: string) {
    const { error } = await supabase
        .from('kegiatan')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export async function uploadActivityImages(files: File[], activityId?: string): Promise<string[]> {
    const uploadedUrls: string[] = []

    for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${activityId || 'temp'}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error } = await supabase.storage
            .from('kegiatan-images')
            .upload(fileName, file)

        if (error) {
            console.error('Upload error:', error)
            continue
        }

        const { data: { publicUrl } } = supabase.storage
            .from('kegiatan-images')
            .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
}

export async function deleteActivityImage(imageUrl: string) {
    // Extract filename from URL
    const fileName = imageUrl.split('/').pop()
    if (!fileName) return

    const { error } = await supabase.storage
        .from('kegiatan-images')
        .remove([fileName])

    if (error) throw error
}

// ============= SERVICE MANAGEMENT =============

export async function fetchServiceRequests(filters?: { category?: string; status?: string }) {
    let query = supabase
        .from('layanan')
        .select('*, profiles(full_name, house_number)')
        .order('created_at', { ascending: false })

    if (filters?.category) {
        query = query.eq('category', filters.category)
    }

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
}

export async function updateServiceStatus(id: string, status: string, adminResponse?: string) {
    const updates: any = { status }
    if (adminResponse) {
        updates.admin_response = adminResponse
    }

    const { data, error } = await supabase
        .from('layanan')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// ============= IPL MANAGEMENT =============

export async function fetchIPLPayments(filters?: { month?: number; year?: number }) {
    let query = supabase
        .from('ipl_payments')
        .select('*, profiles(full_name, house_number)')
        .order('year', { ascending: false })
        .order('month', { ascending: false })

    if (filters?.month) {
        query = query.eq('month', filters.month)
    }

    if (filters?.year) {
        query = query.eq('year', filters.year)
    }

    const { data, error } = await query
    if (error) throw error
    return data
}

export async function createMonthlyInvoices(month: number, year: number, amount: number) {
    // Fetch all citizens
    const { data: citizens, error: fetchError } = await supabase
        .from('profiles')
        .select('id')

    if (fetchError) throw fetchError

    // Create invoices for each citizen
    const invoices = citizens.map(citizen => ({
        user_id: citizen.id,
        month,
        year,
        amount,
        status: 'belum_bayar',
    }))

    const { data, error } = await supabase
        .from('ipl_payments')
        .insert(invoices)
        .select()

    if (error) throw error
    return data
}

export async function updatePaymentStatus(id: string, status: string) {
    const updates: any = { status }

    if (status === 'lunas') {
        updates.paid_date = new Date().toISOString()
    } else {
        updates.paid_date = null
    }

    const { data, error } = await supabase
        .from('ipl_payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// ============= DASHBOARD STATS =============

export async function fetchDashboardStats() {
    const [citizensCount, activitiesCount, servicesCount, totalIPLPayments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('kegiatan').select('*', { count: 'exact', head: true }),
        supabase.from('layanan').select('*', { count: 'exact', head: true }).eq('status', 'menunggu'),
        supabase.from('ipl_payments').select('amount').eq('status', 'lunas'),
    ])

    return {
        totalCitizens: citizensCount.count || 0,
        totalActivities: activitiesCount.count || 0,
        pendingServices: servicesCount.count || 0,
        totalIPLPayments: totalIPLPayments.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0,
    }
}
