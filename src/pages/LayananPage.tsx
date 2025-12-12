import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { FileUp, Send, CheckCircle } from "lucide-react"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

export function LayananPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [category, setCategory] = useState("administrasi")

    // Base Form State
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        // Dynamic fields
        jenis_surat: "",
        tujuan: "",
        lokasi_kejadian: "",
        tanggal_kejadian: ""
    })

    // File Upload State
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSelectChange = (val: string, key: string) => {
        if (key === 'category') setCategory(val)
        else setFormData(prev => ({ ...prev, [key]: val }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let attachmentUrl = null

            // 1. Upload File (if exists)
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `layanan/${user?.id || 'guest'}/${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('layanan-uploads') // Ensure bucket exists
                    .upload(fileName, file)

                if (uploadError) throw new Error("Gagal upload file: " + uploadError.message)

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage.from('layanan-uploads').getPublicUrl(fileName)
                attachmentUrl = publicUrl
            }

            // 2. Prepare Form Data
            const submissionData = {
                user_id: user?.id || null,
                email: user?.email || "guest", // Backup for guests
                category,
                status: 'pending',
                judul: formData.judul,
                deskripsi: formData.deskripsi,
                attachment_url: attachmentUrl,
                form_data: { // Store dynamic fields in JSONB
                    jenis_surat: category === 'surat' ? formData.jenis_surat : null,
                    tujuan: category === 'surat' ? formData.tujuan : null,
                    lokasi_kejadian: category === 'pengaduan' ? formData.lokasi_kejadian : null,
                    tanggal_kejadian: category === 'pengaduan' ? formData.tanggal_kejadian : null,
                    category_label: getCategoryLabel(category)
                }
            }

            // 3. Insert to DB
            const { error: dbError } = await supabase
                .from('layanan_warga')
                .insert(submissionData)

            if (dbError) throw dbError

            // 4. Create Notification
            await supabase
                .from('notifications')
                .insert({
                    type: 'layanan_new',
                    message: `Layanan baru diajukan: ${formData.judul} (${user?.email || 'Guest'})`
                })

            setSuccess(true)
            toast({
                title: "Pengajuan Berhasil",
                description: "Permintaan layanan anda telah dikirim ke pengurus.",
            })

        } catch (error: any) {
            console.error("Submission error:", error)
            toast({
                variant: "destructive",
                title: "Gagal Mengirim",
                description: error.message || "Terjadi kesalahan saat mengirim data."
            })
        } finally {
            setLoading(false)
        }
    }

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'surat': return "Pengajuan Surat"
            case 'pengaduan': return "Pengaduan / Laporan"
            case 'saran': return "Saran & Masukan"
            case 'administrasi': return "Administrasi Kependudukan"
            default: return "Layanan Umum"
        }
    }

    if (success) {
        return (
            <div className="container max-w-lg py-20 text-center">
                <div className="bg-emerald-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
                <p className="text-muted-foreground mb-8">Layanan anda telah berhasil diajukan dan akan segera diproses oleh pengurus RT.</p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate("/")} variant="outline">Kembali ke Beranda</Button>
                    <Button onClick={() => setSuccess(false)}>Ajukan Lainnya</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Layanan Warga Digital</h1>
                <p className="text-muted-foreground">Sampaikan kebutuhan administrasi atau pengaduan anda secara langsung.</p>
            </div>

            <Card className="glass-card shadow-xl border-white/50">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Formulir Pengajuan</CardTitle>
                        <CardDescription>Silakan isi data berikut dengan lengkap</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Category Selection */}
                        <div className="space-y-2">
                            <Label>Jenis Layanan</Label>
                            <Select value={category} onValueChange={(val: string) => handleSelectChange(val, 'category')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="administrasi">Administrasi Kependudukan</SelectItem>
                                    <SelectItem value="surat">Pengajuan Surat Pengantar</SelectItem>
                                    <SelectItem value="pengaduan">Pengaduan & Laporan</SelectItem>
                                    <SelectItem value="saran">Saran & Masukan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Common Fields */}
                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul Pengajuan</Label>
                            <Input
                                id="judul"
                                placeholder="Contoh: Surat Pengantar KTP / Laporan Lampu Mati"
                                required
                                value={formData.judul}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Dynamic Fields: Surat */}
                        {category === 'surat' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_surat">Jenis Surat</Label>
                                    <Select onValueChange={(val: string) => handleSelectChange(val, 'jenis_surat')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jenis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ktp">Pengantar KTP</SelectItem>
                                            <SelectItem value="kk">Pengantar KK</SelectItem>
                                            <SelectItem value="skck">Pengantar SKCK</SelectItem>
                                            <SelectItem value="domisili">Surat Domisili</SelectItem>
                                            <SelectItem value="lainnya">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tujuan">Tujuan Pembuatan</Label>
                                    <Input id="tujuan" placeholder="Keperluan..." onChange={handleInputChange} />
                                </div>
                            </div>
                        )}

                        {/* Dynamic Fields: Pengaduan */}
                        {category === 'pengaduan' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                                <div className="space-y-2">
                                    <Label htmlFor="lokasi_kejadian">Lokasi Kejadian</Label>
                                    <Input id="lokasi_kejadian" placeholder="Depan rumah blok..." onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_kejadian">Tanggal Kejadian</Label>
                                    <Input id="tanggal_kejadian" type="date" onChange={handleInputChange} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi Detail</Label>
                            <Textarea
                                id="deskripsi"
                                placeholder="Jelaskan kebutuhan atau laporan anda secara rinci..."
                                rows={5}
                                value={formData.deskripsi}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Lampiran (Opsional)</Label>
                            <div className="flex items-center gap-4">
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    {file ? "Ganti File" : "Upload Dokumen/Foto"}
                                </Button>
                                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                    {file ? file.name : "Maks. 5MB"}
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg text-lg h-12"
                            disabled={loading}
                        >
                            {loading ? "Mengirim..." : (
                                <>
                                    Kirim Pengajuan <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
