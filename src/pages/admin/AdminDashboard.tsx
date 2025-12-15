import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { fetchDashboardStats } from "@/lib/adminApi"
import { useToast } from "@/components/ui/use-toast"

export function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCitizens: 0,
        totalActivities: 0,
        pendingServices: 0,
        totalIPLPayments: 0,
    })
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await fetchDashboardStats()
                setStats(data)
            } catch (error: any) {
                console.error('Error fetching stats:', error)
                toast({
                    variant: "destructive",
                    title: "Gagal memuat statistik",
                    description: error.message,
                })
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [toast])

    const statCards = [
        {
            title: "Total Warga Terdaftar",
            value: stats.totalCitizens,
            description: "Jumlah warga yang terdaftar",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Total Kegiatan",
            value: stats.totalActivities,
            description: "Kegiatan RT yang tercatat",
            icon: Calendar,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Layanan Menunggu",
            value: stats.pendingServices,
            description: "Pengajuan yang belum diproses",
            icon: AlertCircle,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            title: "Total Pembayaran IPL",
            value: `Rp ${stats.totalIPLPayments.toLocaleString('id-ID')}`,
            description: "Total IPL yang sudah terbayar",
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                    <p className="text-muted-foreground mt-2">Selamat datang di Admin Panel WargaSepuluh.id</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-muted-foreground mt-2">Selamat datang di Admin Panel WargaSepuluh.id</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Aktivitas Terkini
                        </CardTitle>
                        <CardDescription>
                            Ringkasan aktivitas sistem minggu ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm">Warga baru terdaftar</span>
                            <span className="font-semibold text-emerald-600">+5</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm">Kegiatan dibuat</span>
                            <span className="font-semibold text-emerald-600">+3</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm">Layanan diselesaikan</span>
                            <span className="font-semibold text-emerald-600">+12</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Informasi Sistem
                        </CardTitle>
                        <CardDescription>
                            Status dan informasi penting
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">Database Status</p>
                            <p className="text-xs text-blue-700 mt-1">Semua sistem berjalan normal</p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-emerald-900">Storage Usage</p>
                            <p className="text-xs text-emerald-700 mt-1">18% dari kapasitas tersedia</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
