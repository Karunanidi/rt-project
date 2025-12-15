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
import { Search, Edit, Trash2, Shield, User } from "lucide-react"
import { fetchAllCitizens, updateCitizen, deleteCitizen, updateUserRole } from "@/lib/adminApi"
import { useToast } from "@/components/ui/use-toast"

interface Citizen {
    id: string
    full_name: string
    house_number: string
    nik: string
    phone: string
    role: string
    email?: string
}

export function CitizenManagement() {
    const [citizens, setCitizens] = useState<Citizen[]>([])
    const [filteredCitizens, setFilteredCitizens] = useState<Citizen[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null)
    const [formData, setFormData] = useState({
        full_name: "",
        house_number: "",
        nik: "",
        phone: "",
        role: "user",
    })
    const { toast } = useToast()

    useEffect(() => {
        loadCitizens()
    }, [])

    useEffect(() => {
        // Filter citizens based on search query
        if (searchQuery.trim() === "") {
            setFilteredCitizens(citizens)
        } else {
            const query = searchQuery.toLowerCase()
            const filtered = citizens.filter(
                (citizen) =>
                    citizen.full_name.toLowerCase().includes(query) ||
                    citizen.house_number.toLowerCase().includes(query) ||
                    citizen.nik.includes(query)
            )
            setFilteredCitizens(filtered)
        }
    }, [searchQuery, citizens])

    async function loadCitizens() {
        try {
            const data = await fetchAllCitizens()
            setCitizens(data)
            setFilteredCitizens(data)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal memuat data warga",
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    function handleEdit(citizen: Citizen) {
        setSelectedCitizen(citizen)
        setFormData({
            full_name: citizen.full_name,
            house_number: citizen.house_number,
            nik: citizen.nik,
            phone: citizen.phone,
            role: citizen.role || "user",
        })
        setEditDialogOpen(true)
    }

    function handleDeleteClick(citizen: Citizen) {
        setSelectedCitizen(citizen)
        setDeleteDialogOpen(true)
    }

    async function handleSaveEdit() {
        if (!selectedCitizen) return

        try {
            await updateCitizen(selectedCitizen.id, formData)
            toast({
                title: "Berhasil",
                description: "Data warga berhasil diperbarui",
            })
            setEditDialogOpen(false)
            loadCitizens()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal memperbarui data",
                description: error.message,
            })
        }
    }

    async function handleDelete() {
        if (!selectedCitizen) return

        try {
            await deleteCitizen(selectedCitizen.id)
            toast({
                title: "Berhasil",
                description: "Warga berhasil dihapus",
            })
            setDeleteDialogOpen(false)
            loadCitizens()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal menghapus warga",
                description: error.message,
            })
        }
    }

    async function toggleAdminRole(citizen: Citizen) {
        const newRole = citizen.role === "admin" ? "user" : "admin"
        try {
            await updateUserRole(citizen.id, newRole)
            toast({
                title: "Berhasil",
                description: `Role berhasil diubah menjadi ${newRole}`,
            })
            loadCitizens()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal mengubah role",
                description: error.message,
            })
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Manajemen Warga</h1>
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                        <p className="mt-4 text-muted-foreground">Memuat data warga...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Warga</h1>
                <p className="text-muted-foreground mt-2">Kelola data warga terdaftar di RT/RW 10/04</p>
            </div>

            {/* Search & Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Warga</CardTitle>
                    <CardDescription>
                        Total {filteredCitizens.length} warga {searchQuery && `(dari ${citizens.length} total)`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari berdasarkan nama, nomor rumah, atau NIK..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Nama Lengkap</TableHead>
                                    <TableHead>Nomor Rumah</TableHead>
                                    <TableHead>NIK</TableHead>
                                    <TableHead>No. HP</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCitizens.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {searchQuery ? "Tidak ada warga yang cocok dengan pencarian" : "Belum ada warga terdaftar"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCitizens.map((citizen) => (
                                        <TableRow key={citizen.id}>
                                            <TableCell className="font-medium">{citizen.full_name}</TableCell>
                                            <TableCell>{citizen.house_number}</TableCell>
                                            <TableCell className="font-mono text-sm">{citizen.nik}</TableCell>
                                            <TableCell>{citizen.phone}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={citizen.role === "admin" ? "default" : "outline"}
                                                    className={citizen.role === "admin" ? "bg-emerald-600" : ""}
                                                >
                                                    {citizen.role === "admin" ? "Admin" : "User"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => toggleAdminRole(citizen)}
                                                        title={citizen.role === "admin" ? "Hapus role admin" : "Jadikan admin"}
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(citizen)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteClick(citizen)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Edit Data Warga</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi warga. Klik simpan untuk menyimpan perubahan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama Lengkap</Label>
                            <Input
                                id="edit-name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-house">Nomor Rumah</Label>
                            <Input
                                id="edit-house"
                                value={formData.house_number}
                                onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-nik">NIK</Label>
                            <Input
                                id="edit-nik"
                                value={formData.nik}
                                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                                maxLength={16}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-phone">No. Handphone</Label>
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger id="edit-role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-emerald-500 to-teal-600">
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Warga?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus <span className="font-semibold">{selectedCitizen?.full_name}</span>?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
