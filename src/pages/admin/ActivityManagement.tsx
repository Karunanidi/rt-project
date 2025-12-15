import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react"
import { fetchActivities, createActivity, updateActivity, deleteActivity, uploadActivityImages } from "@/lib/adminApi"
import { useToast } from "@/components/ui/use-toast"
import { ImageUploader } from "@/components/admin/ImageUploader"

interface Activity {
    id: string
    title: string
    description: string
    date: string
    location: string
    images: string[]
}

export function ActivityManagement() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
    })
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const { toast } = useToast()

    useEffect(() => {
        loadActivities()
    }, [])

    async function loadActivities() {
        try {
            const data = await fetchActivities()
            setActivities(data || [])
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal memuat kegiatan",
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    function handleCreate() {
        setSelectedActivity(null)
        setFormData({ title: "", description: "", date: "", location: "" })
        setImageFiles([])
        setDialogOpen(true)
    }

    function handleEdit(activity: Activity) {
        setSelectedActivity(activity)
        setFormData({
            title: activity.title,
            description: activity.description,
            date: activity.date,
            location: activity.location,
        })
        setImageFiles([])
        setDialogOpen(true)
    }

    function handleDeleteClick(activity: Activity) {
        setSelectedActivity(activity)
        setDeleteDialogOpen(true)
    }

    async function handleSave() {
        setUploading(true)
        try {
            let imageUrls: string[] = []

            // Upload images if any
            if (imageFiles.length > 0) {
                imageUrls = await uploadActivityImages(imageFiles, selectedActivity?.id)
            }

            // Combine with existing images if editing
            const allImages = selectedActivity
                ? [...(selectedActivity.images || []), ...imageUrls]
                : imageUrls

            const activityData = {
                ...formData,
                images: allImages,
            }

            if (selectedActivity) {
                await updateActivity(selectedActivity.id, activityData)
                toast({ title: "Berhasil", description: "Kegiatan berhasil diperbarui" })
            } else {
                await createActivity(activityData)
                toast({ title: "Berhasil", description: "Kegiatan berhasil dibuat" })
            }

            setDialogOpen(false)
            loadActivities()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal menyimpan kegiatan",
                description: error.message,
            })
        } finally {
            setUploading(false)
        }
    }

    async function handleDelete() {
        if (!selectedActivity) return

        try {
            await deleteActivity(selectedActivity.id)
            toast({ title: "Berhasil", description: "Kegiatan berhasil dihapus" })
            setDeleteDialogOpen(false)
            loadActivities()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gagal menghapus kegiatan",
                description: error.message,
            })
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Manajemen Kegiatan</h1>
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                        <p className="mt-4 text-muted-foreground">Memuat data kegiatan...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Kegiatan</h1>
                    <p className="text-muted-foreground mt-2">Kelola kegiatan RT/RW 10/04</p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Kegiatan
                </Button>
            </div>

            {/* Activities Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Kegiatan</CardTitle>
                    <CardDescription>Total {activities.length} kegiatan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead>Gambar</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Belum ada kegiatan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activities.map((activity) => (
                                        <TableRow key={activity.id}>
                                            <TableCell className="font-medium max-w-xs">
                                                <div>
                                                    <p className="font-semibold">{activity.title}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(activity.date).toLocaleDateString('id-ID')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    {activity.location}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {activity.images?.length || 0} foto
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(activity)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteClick(activity)}
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

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedActivity ? "Edit Kegiatan" : "Buat Kegiatan Baru"}</DialogTitle>
                        <DialogDescription>
                            {selectedActivity ? "Perbarui informasi kegiatan" : "Tambahkan kegiatan baru untuk warga"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul Kegiatan</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Contoh: Gotong Royong Mingguan"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Deskripsi lengkap kegiatan..."
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Tanggal</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Contoh: Balai RT"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Upload Gambar Kegiatan</Label>
                            <ImageUploader
                                images={imageFiles}
                                onImagesChange={setImageFiles}
                                maxImages={10}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={uploading}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={uploading || !formData.title || !formData.date}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600"
                        >
                            {uploading ? "Menyimpan..." : selectedActivity ? "Perbarui" : "Buat"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kegiatan?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kegiatan <span className="font-semibold">{selectedActivity?.title}</span>?
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
