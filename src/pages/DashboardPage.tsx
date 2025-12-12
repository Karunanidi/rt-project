import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"
import { useRef, useState } from "react"

export function DashboardPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    // Mock Data (replace with useEffect fetch if table exists)
    const iplHistory = [
        { month: "Oktober 2024", amount: "Rp 150.000", status: "Lunas", date: "02 Okt 2024" },
        { month: "September 2024", amount: "Rp 150.000", status: "Lunas", date: "05 Sep 2024" },
        { month: "Agustus 2024", amount: "Rp 150.000", status: "Lunas", date: "01 Agu 2024" },
    ]

    // Extract Identity from User Metadata or Email
    const getIdentity = () => {
        if (!user) return "Warga"
        if (user.user_metadata?.full_name) return user.user_metadata.full_name
        // Fallback: extract from email "123456@..."
        return user.email?.split('@')[0] || "Warga"
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !user) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { error } = await supabase.storage
                .from('ipl-receipts') // Ensure this bucket exists in Supabase
                .upload(fileName, file)

            if (error) throw error

            toast({
                title: "Upload Berhasil",
                description: "Bukti pembayaran telah terkirim.",
            })
        } catch (error: any) {
            console.error("Upload error:", error)
            toast({
                variant: "destructive",
                title: "Upload Gagal",
                description: "Gagal mengupload bukti pembayaran.",
            })
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <>
            {/* Mobile Layout (< lg) */}
            <div className="lg:hidden space-y-4">
                {/* Mobile Profile Header - Compact */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-14 w-14 border-2 border-white/30 shadow-lg">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                                <AvatarFallback className="bg-white text-emerald-600">WG</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold truncate">{getIdentity()}</h2>
                                <p className="text-xs text-emerald-50 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm h-9 text-xs"
                            >
                                <Download className="h-3 w-3 mr-1" /> Unduh
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                            />
                            <Button
                                size="sm"
                                className="bg-white text-emerald-600 hover:bg-white/90 h-9 text-xs font-semibold"
                                onClick={handleUploadClick}
                                disabled={uploading}
                            >
                                <Upload className="h-3 w-3 mr-1" /> {uploading ? "Uploading..." : "Upload Bukti"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile Status Overview - Prominent */}
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Status IPL Tahun Ini</CardTitle>
                        <CardDescription className="text-xs">Progress pembayaran 2024</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Horizontal Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-3xl font-bold text-emerald-600">80%</span>
                                <span className="text-xs text-muted-foreground">Terbayar</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-emerald-50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-1">Terbayar</p>
                                <p className="text-base font-bold text-emerald-600">Rp 1.5jt</p>
                                <p className="text-xs text-muted-foreground">10 Bulan</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-1">Tunggakan</p>
                                <p className="text-base font-bold text-red-600">Rp 0</p>
                                <p className="text-xs text-muted-foreground">0 Bulan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile Billing Cards - Stacked */}
                <div className="space-y-3">
                    <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-white">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-sm">Tagihan Bulan Ini</h3>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">Lunas</Badge>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">Rp 150.000</p>
                            <p className="text-xs text-muted-foreground mt-1">Dibayar pada 2 Nov 2024</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500 shadow-sm bg-white/60">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-sm">Tagihan Desember</h3>
                                <Badge variant="outline" className="text-amber-600 border-amber-200 text-xs">Belum Terbit</Badge>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">Rp 150.000</p>
                            <p className="text-xs text-muted-foreground mt-1">Jatuh tempo 10 Des 2024</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile Payment History - List View */}
                <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Riwayat Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {iplHistory.map((item, i) => (
                                <div key={i} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm">{item.month}</span>
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            <span className="text-emerald-600 font-medium text-xs">{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold">{item.amount}</span>
                                        <span className="text-xs text-muted-foreground">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="px-4 py-3 bg-red-50/50">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm">Juli 2024</span>
                                    <div className="flex items-center gap-1.5">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-red-500 font-medium text-xs">Belum Lunas</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-bold">Rp 150.000</span>
                                    <span className="text-xs text-muted-foreground">-</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Layout (>= lg) */}
            <div className="hidden lg:block space-y-8">
                {/* Desktop Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-card p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                            <AvatarFallback>WG</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{getIdentity()}</h2>
                            <p className="text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <Button variant="outline" className="gap-2 flex-1 md:flex-none">
                            <Download className="h-4 w-4" /> Unduh Laporan
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                        />
                        <Button
                            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 border-0 flex-1 md:flex-none"
                            onClick={handleUploadClick}
                            disabled={uploading}
                        >
                            <Upload className="h-4 w-4" /> {uploading ? "Mengupload..." : "Upload Bukti"}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* KPI Card */}
                    <Card className="col-span-1 border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
                        <CardHeader>
                            <CardTitle className="text-lg">Status IPL Tahun Ini</CardTitle>
                            <CardDescription>Progress pembayaran 2024</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-4">
                            <div className="relative flex items-center justify-center h-40 w-40">
                                {/* CSS Circle Mock */}
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-bold text-emerald-600">80%</span>
                                    <span className="text-xs text-muted-foreground">Terbayar</span>
                                </div>
                            </div>
                            <div className="mt-6 w-full space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Terbayar (10 Bln)</span>
                                    <span className="font-medium text-emerald-600">Rp 1.500.000</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tunggakan</span>
                                    <span className="font-medium text-red-500">Rp 0</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment History & Current Bills */}
                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        {/* Active Bill Mock */}
                        <div className="grid gap-4 grid-cols-2">
                            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base">Tagihan Bulan Ini</CardTitle>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0">Lunas</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Rp 150.000</div>
                                    <p className="text-xs text-muted-foreground mt-1">Dibayar pada 2 Nov 2024</p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-amber-500 shadow-sm opacity-60">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base">Tagihan Desember</CardTitle>
                                        <Badge variant="outline" className="text-amber-600 border-amber-200 shrink-0">Belum Terbit</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Rp 150.000</div>
                                    <p className="text-xs text-muted-foreground mt-1">Jatuh tempo 10 Des 2024</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="shadow-md border-0 overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Riwayat Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead>Bulan</TableHead>
                                                <TableHead>Jumlah</TableHead>
                                                <TableHead>Tanggal Bayar</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {iplHistory.map((item, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium whitespace-nowrap">{item.month}</TableCell>
                                                    <TableCell>{item.amount}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{item.date}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                            <span className="text-emerald-600 font-medium">{item.status}</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell className="font-medium">Juli 2024</TableCell>
                                                <TableCell>Rp 150.000</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                        <span className="text-red-500 font-medium whitespace-nowrap">Belum Lunas</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
