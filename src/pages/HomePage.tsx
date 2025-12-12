
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Megaphone, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { HeroCarousel } from "@/components/HeroCarousel"

export function HomePage() {
    return (
        <div className="space-y-12 pb-10">
            {/* Hero Section */}
            <HeroCarousel />

            {/* Announcement Banner */}
            <div className="glass-card flex flex-col md:flex-row items-start md:items-center gap-4 rounded-xl border-l-4 border-l-amber-500 p-6 shadow-md">
                <div className="flex bg-amber-100 p-3 rounded-full shrink-0">
                    <Megaphone className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-foreground">Pengumuman Penting: Kerja Bakti Akbar</h3>
                    <p className="text-muted-foreground">Kerja bakti pembersihan selokan utama akan dilaksanakan pada Minggu, 24 Desember 2024. Diharapkan kehadiran seluruh warga.</p>
                </div>
            </div>

            {/* Upcoming Events */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold tracking-tight">Acara Mendatang</h2>
                    <Link to="/events">
                        <Button variant="ghost" className="gap-2">
                            Lihat Semua <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                            <div className="h-48 w-full bg-gray-200 bg-[url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge className="w-fit mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Sosial</Badge>
                                </div>
                                <CardTitle className="line-clamp-1">Kerja Bakti Lingkungan</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-3 w-3" /> 24 Desember 2024
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    Mari bersama-sama membersihkan lingkungan RT kita agar tetap asri dan nyaman menjelang tahun baru.
                                </p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Link to={`/kegiatan/${i}`} className="w-full">
                                    <Button variant="ghost" size="sm" className="w-full justify-start p-0 text-emerald-600 hover:text-emerald-700 hover:bg-transparent">
                                        Detail Acara <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Agenda Timeline (Horizontal) */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Agenda RT</h2>
                    <Link to="/agenda">
                        <Button variant="outline" size="sm">Buka Kalender</Button>
                    </Link>
                </div>
                <div className="relative pb-8">
                    {/* Desktop Horizontal Line */}
                    <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-emerald-100 -z-10 rounded-full mx-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { date: "15 Des", title: "Rapat Pengurus", status: "Selesai" },
                            { date: "24 Des", title: "Kerja Bakti", status: "Wajib" },
                            { date: "31 Des", title: "Malam Tahun Baru", status: "Sosial" },
                            { date: "05 Jan", title: "Posyandu", status: "Rutin" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-2">
                                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white border-4 border-emerald-50 shadow-md md:mb-2 z-10">
                                    <Calendar className="h-5 w-5 text-emerald-600" />
                                </div>
                                {/* Mobile Vertical Line Connector */}
                                {idx !== 3 && (
                                    <div className="md:hidden absolute left-6 top-12 bottom-[-24px] w-0.5 bg-emerald-100 -z-10" />
                                )}

                                <div className="text-left md:text-center glass-card p-4 rounded-xl w-full hover:bg-white/60 transition-colors">
                                    <span className="text-sm font-bold text-emerald-600 block">{item.date}</span>
                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                    <Badge variant="outline" className="mt-1 text-xs border-emerald-200 text-emerald-700">{item.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
