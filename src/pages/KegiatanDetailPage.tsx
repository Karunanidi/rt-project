import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { Calendar, MapPin, Share2, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

interface Kegiatan {
    id: string
    title: string
    date: string
    location: string
    description: string
    cover_url: string
    gallery_urls?: string[]
}

export function KegiatanDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [data, setData] = useState<Kegiatan | null>(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        // Determine if we need to fetch real data or use mock
        // For this demonstration, I will mock the data if ID is passed, 
        // but include the real fetch logic commented out or as fallback

        async function fetchData() {
            setLoading(true)
            // Real Fetch Logic:
            // const { data, error } = await supabase.from('kegiatan').select('*').eq('id', id).single()

            // Mock Data for Demo Purposes since DB might be empty
            // We simulate a network delay
            await new Promise(r => setTimeout(r, 500))

            // Default fallback mock
            const mockData: Kegiatan = {
                id: id || "1",
                title: "Kerja Bakti Lingkungan Akbar",
                date: "24 Desember 2024",
                location: "Lapangan Utama RT 10",
                cover_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
                description: `
           <p>Mari bersama-sama membersihkan lingkungan RT kita agar tetap asri dan nyaman menjelang tahun baru. Kegiatan ini merupakan agenda rutin tahunan yang wajib diikuti oleh minimal satu perwakilan dari setiap rumah.</p>
           <br/>
           <h3 class="font-bold text-lg">Agenda Kegiatan:</h3>
           <ul class="list-disc pl-5">
             <li>07:00 - Kumpul di Lapangan Utama</li>
             <li>07:30 - Pembagian Sektor Kebersihan</li>
             <li>08:00 - Mulai Kerja Bakti</li>
             <li>10:00 - Istirahat & Snack</li>
             <li>11:30 - Selesai</li>
           </ul>
           <br/>
           <p>Diharapkan membawa peralatan kebersihan masing-masing seperti sapu lidi, cangkul, atau karung sampah.</p>
         `,
                gallery_urls: [
                    "https://images.unsplash.com/photo-1442544213729-6a15f1611937?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1527965408463-82ae0731825c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    "https://images.unsplash.com/photo-1591189863430-ab87e120f312?q=80&w=2070&auto=format&fit=crop"
                ]
            }

            // Attempt to fetch from Supabase, if fail use mock
            if (id) {
                const { data: dbData } = await supabase.from('kegiatan').select('*').eq('id', id).single()
                if (dbData) setData(dbData)
                else setData(mockData)
            } else {
                setData(mockData)
            }
            setLoading(false)
        }

        fetchData()
    }, [id])

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>
    if (!data) return <div className="h-screen flex items-center justify-center">Data tidak ditemukan</div>

    const handleRegister = () => {
        toast({
            title: "Pendaftaran Berhasil",
            description: "Anda telah terdaftar sebagai peserta kegiatan ini."
        })
    }

    return (
        <div className="pb-20">
            {/* Hero Header with Back Button */}
            <div className="relative h-[400px] w-full bg-gray-900">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url(${data.cover_url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                <div className="absolute top-6 left-6 z-20">
                    <Link to="/">
                        <Button variant="secondary" size="sm" className="gap-2 backdrop-blur-md bg-white/20 hover:bg-white/40 border-0 text-white">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <div className="container relative h-full flex flex-col justify-end pb-12 z-10">
                    <Badge className="w-fit mb-4 bg-emerald-500 hover:bg-emerald-600 text-white border-0">Akan Datang</Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
                        {data.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-white/90 font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-emerald-400" />
                            {data.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-emerald-400" />
                            {data.location}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container grid md:grid-cols-3 gap-10 mt-10">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: data.description }} />
                    </div>

                    {/* Gallery */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Galeri Dokumentasi</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.gallery_urls?.map((url, i) => (
                                <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                    <img src={url} alt={`Galeri ${i}`} className="h-full w-full object-cover" />
                                </div>
                            ))}
                            {!data.gallery_urls && <p className="text-muted-foreground">Belum ada dokumentasi.</p>}
                        </div>
                    </div>
                </div>

                {/* Sidebar / CTA */}
                <div className="space-y-6">
                    <Card className="glass-card shadow-lg sticky top-24 border-emerald-100">
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground uppercase text-xs tracking-wider">Tanggal & Waktu</Label>
                                <p className="font-semibold">{data.date}, 07:00 WIB</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground uppercase text-xs tracking-wider">Lokasi</Label>
                                <p className="font-semibold">{data.location}</p>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6 shadow-md">
                                        Daftar Kehadiran
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Konfirmasi Kehadiran</DialogTitle>
                                        <DialogDescription>
                                            Silakan isi data diri untuk daftar hadir kegiatan {data.title}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Nama Lengkap</Label>
                                            <Input placeholder="Nama Anda" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nomor Rumah</Label>
                                            <Input placeholder="Contoh: A1-10" />
                                        </div>
                                        <Button className="w-full" onClick={handleRegister}>Kirim Konfirmasi</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" className="w-full gap-2">
                                <Share2 className="h-4 w-4" /> Bagikan Info
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
