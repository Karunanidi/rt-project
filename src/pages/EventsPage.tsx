import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export function EventsPage() {
    const events = [
        { title: "Kerja Bakti Lingkungan", category: "Sosial", date: "20 Nov 2024", time: "07:00 WIB", loc: "Lapangan RT", img: "https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=2000&auto=format&fit=crop" },
        { title: "Rapat Warga Bulanan", category: "Rapat", date: "25 Nov 2024", time: "19:30 WIB", loc: "Balai Warga", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop" },
        { title: "Posyandu Balita", category: "Kesehatan", date: "01 Des 2024", time: "08:00 WIB", loc: "Pos RW", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" },
        { title: "Malam Tirakatan", category: "Budaya", date: "16 Agu 2025", time: "19:00 WIB", loc: "Lapangan RT", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop" },
        { title: "Senam Pagi Bersama", category: "Kesehatan", date: "Setiap Minggu", time: "06:00 WIB", loc: "Taman Komplek", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" },
        { title: "Buka Puasa Bersama", category: "Keagamaan", date: "15 Mar 2025", time: "17:30 WIB", loc: "Masjid Al-Muhajirin", img: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=2144&auto=format&fit=crop" },
    ]

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Info Acara</h1>
                <p className="text-muted-foreground">Ikuti kegiatan terbaru di lingkungan kita.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((e, i) => (
                    <Card key={i} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                        <div className="relative h-48 overflow-hidden">
                            <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110`} style={{ backgroundImage: `url(${e.img})` }} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <Badge className="absolute top-4 left-4 bg-white/90 text-emerald-800 hover:bg-white">{e.category}</Badge>
                        </div>
                        <CardHeader>
                            <CardTitle>{e.title}</CardTitle>
                            <CardDescription className="flex flex-col gap-1 mt-2">
                                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-600" /> {e.date}</span>
                                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-600" /> {e.time}</span>
                                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" /> {e.loc}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link to={`/kegiatan/${i + 1}`} className="w-full">
                                <Button className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0">Detail Kegiatan</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
