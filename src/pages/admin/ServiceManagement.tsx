import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Eye, Filter } from "lucide-react"
import { fetchServiceRequests, updateServiceStatus } from "@/lib/adminApi"
import { useToast } from "@/components/ui/use-toast"

interface ServiceRequest {
    id: string
    user_id: string
    category: string
    description: string
    status: string
    admin_response?: string
    created_at: string
    profiles?: {
        full_name: string
        house_number: string
    }
}

export function ServiceManagement() {
    const [services, setServices] = useState<ServiceRequest[]>([])
    const [filteredServices, setFilteredServices] = useState<ServiceRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [newStatus, setNewStatus] = useState<string>("")
    const [adminResponse, setAdminResponse] = useState<string>("")
    const { toast } = useToast()

    useEffect(() => {
        loadServices()
    }, [])

    useEffect(() => {
        filterServices()
    }, [statusFilter, categoryFilter, services])

    async function loadServices() {
        try {
            const data = await fetchServiceRequests()
            setServices(data || [])
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal memuat layanan",
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    function filterServices() {
        let filtered = [...services]

        if (statusFilter !== "all") {
            filtered = filtered.filter(s => s.status === statusFilter)
        }

        if (categoryFilter !== "all") {
            filtered = filtered.filter(s => s.category === categoryFilter)
        }

        setFilteredServices(filtered)
    }

    function handleViewDetail(service: ServiceRequest) {
        setSelectedService(service)
        setNewStatus(service.status)
        setAdminResponse(service.admin_response || "")
        setDetailDialogOpen(true)
    }

    async function handleUpdateStatus() {
        if (!selectedService) return

        try {
            await updateServiceStatus(selectedService.id, newStatus, adminResponse)
            toast({ title: "Berhasil", description: "Status layanan berhasil diperbarui" })
            setDetailDialogOpen(false)
            loadServices()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal memperbarui status",
                description: error.message,
            })
        }
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string; className: string }> = {
            menunggu: { label: "Menunggu", className: "bg-amber-100 text-amber-700" },
            diproses: { label: "Diproses", className: "bg-blue-100 text-blue-700" },
            selesai: { label: "Selesai", className: "bg-emerald-100 text-emerald-700" },
        }
        const variant = variants[status] || variants.menunggu
        return <Badge className={variant.className}>{variant.label}</Badge>
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Manajemen Layanan</h1>
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                        <p className="mt-4 text-muted-foreground">Memuat data layanan...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Layanan Warga</h1>
                <p className="text-muted-foreground mt-2">Kelola pengajuan layanan dari warga</p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filter
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="menunggu">Menunggu</SelectItem>
                                    <SelectItem value="diproses">Diproses</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="pengaduan">Pengaduan</SelectItem>
                                    <SelectItem value="surat">Pengajuan Surat</SelectItem>
                                    <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Services Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Layanan</CardTitle>
                    <CardDescription>Total {filteredServices.length} pengajuan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Warga</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Tidak ada layanan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredServices.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{service.profiles?.full_name || "N/A"}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {service.profiles?.house_number || "N/A"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize">{service.category}</TableCell>
                                            <TableCell className="max-w-xs">
                                                <p className="line-clamp-2 text-sm">{service.description}</p>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(service.created_at).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(service.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewDetail(service)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Detail
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Detail Layanan</DialogTitle>
                        <DialogDescription>
                            Lihat detail dan ubah status pengajuan layanan
                        </DialogDescription>
                    </DialogHeader>
                    {selectedService && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Nama Warga</Label>
                                    <p className="font-medium mt-1">{selectedService.profiles?.full_name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Nomor Rumah</Label>
                                    <p className="font-medium mt-1">{selectedService.profiles?.house_number}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Kategori</Label>
                                <p className="font-medium mt-1 capitalize">{selectedService.category}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Deskripsi</Label>
                                <p className="mt-1">{selectedService.description}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Tanggal Pengajuan</Label>
                                <p className="mt-1">{new Date(selectedService.created_at).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="pt-4 border-t">
                                <Label htmlFor="status">Update Status</Label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger id="status" className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="menunggu">Menunggu</SelectItem>
                                        <SelectItem value="diproses">Diproses</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="response">Respon Admin</Label>
                                <Textarea
                                    id="response"
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    placeholder="Tambahkan catatan atau respon untuk warga..."
                                    rows={4}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                            Tutup
                        </Button>
                        <Button
                            onClick={handleUpdateStatus}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600"
                        >
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
