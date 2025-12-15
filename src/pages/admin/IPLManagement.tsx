import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Plus, CheckCircle, XCircle, Filter } from "lucide-react"
import { fetchIPLPayments, createMonthlyInvoices, updatePaymentStatus } from "@/lib/adminApi"
import { useToast } from "@/components/ui/use-toast"

interface IPLPayment {
    id: string
    user_id: string
    month: number
    year: number
    amount: number
    status: string
    paid_date?: string
    profiles?: {
        full_name: string
        house_number: string
    }
}

const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export function IPLManagement() {
    const [payments, setPayments] = useState<IPLPayment[]>([])
    const [filteredPayments, setFilteredPayments] = useState<IPLPayment[]>([])
    const [loading, setLoading] = useState(true)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [monthFilter, setMonthFilter] = useState<string>("all")
    const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString())
    const [newInvoice, setNewInvoice] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: 150000,
    })
    const { toast } = useToast()

    useEffect(() => {
        loadPayments()
    }, [])

    useEffect(() => {
        filterPayments()
    }, [monthFilter, yearFilter, payments])

    async function loadPayments() {
        try {
            const data = await fetchIPLPayments()
            setPayments(data || [])
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal memuat data IPL",
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    function filterPayments() {
        let filtered = [...payments]

        if (monthFilter !== "all") {
            filtered = filtered.filter(p => p.month === parseInt(monthFilter))
        }

        if (yearFilter !== "all") {
            filtered = filtered.filter(p => p.year === parseInt(yearFilter))
        }

        setFilteredPayments(filtered)
    }

    async function handleCreateInvoices() {
        try {
            await createMonthlyInvoices(newInvoice.month, newInvoice.year, newInvoice.amount)
            toast({
                title: "Berhasil",
                description: `Tagihan ${monthNames[newInvoice.month - 1]} ${newInvoice.year} berhasil dibuat untuk semua warga`,
            })
            setCreateDialogOpen(false)
            loadPayments()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal membuat tagihan",
                description: error.message,
            })
        }
    }

    async function togglePaymentStatus(payment: IPLPayment) {
        const newStatus = payment.status === "lunas" ? "belum_bayar" : "lunas"
        try {
            await updatePaymentStatus(payment.id, newStatus)
            toast({
                title: "Berhasil",
                description: `Status pembayaran berhasil diubah menjadi ${newStatus === "lunas" ? "Lunas" : "Belum Bayar"}`,
            })
            loadPayments()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal mengubah status",
                description: error.message,
            })
        }
    }

    const getStatusBadge = (status: string) => {
        if (status === "lunas") {
            return <Badge className="bg-emerald-100 text-emerald-700">Lunas</Badge>
        }
        return <Badge className="bg-red-100 text-red-700">Belum Bayar</Badge>
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Manajemen IPL</h1>
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                        <p className="mt-4 text-muted-foreground">Memuat data IPL...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Pembayaran IPL</h1>
                    <p className="text-muted-foreground mt-2">Kelola tagihan dan pembayaran IPL warga</p>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Tagihan Bulanan
                </Button>
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
                            <Label>Bulan</Label>
                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Bulan</SelectItem>
                                    {monthNames.map((name, index) => (
                                        <SelectItem key={index} value={(index + 1).toString()}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tahun</Label>
                            <Select value={yearFilter} onValueChange={setYearFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tahun</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pembayaran</CardTitle>
                    <CardDescription>Total {filteredPayments.length} tagihan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Warga</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Tgl Bayar</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Tidak ada data pembayaran
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{payment.profiles?.full_name || "N/A"}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {payment.profiles?.house_number || "N/A"}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {monthNames[payment.month - 1]} {payment.year}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                Rp {payment.amount.toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {payment.paid_date
                                                    ? new Date(payment.paid_date).toLocaleDateString('id-ID')
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => togglePaymentStatus(payment)}
                                                    className={payment.status === "lunas" ? "text-red-600" : "text-emerald-600"}
                                                >
                                                    {payment.status === "lunas" ? (
                                                        <>
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Batalkan
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Tandai Lunas
                                                        </>
                                                    )}
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

            {/* Create Invoice Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Buat Tagihan Bulanan</DialogTitle>
                        <DialogDescription>
                            Buat tagihan IPL untuk semua warga pada bulan tertentu
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Bulan</Label>
                                <Select
                                    value={newInvoice.month.toString()}
                                    onValueChange={(value) => setNewInvoice({ ...newInvoice, month: parseInt(value) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthNames.map((name, index) => (
                                            <SelectItem key={index} value={(index + 1).toString()}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tahun</Label>
                                <Input
                                    type="number"
                                    value={newInvoice.year}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, year: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Jumlah Tagihan</Label>
                            <Input
                                type="number"
                                value={newInvoice.amount}
                                onChange={(e) => setNewInvoice({ ...newInvoice, amount: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleCreateInvoices}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600"
                        >
                            Buat Tagihan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
