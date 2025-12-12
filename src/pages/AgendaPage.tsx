import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AgendaPage() {
    const agendaItems = [
        {
            month: "November 2024", items: [
                { date: "20", title: "Kerja Bakti Lingkungan", desc: "Pembersihan saluran air dan taman.", type: "fisik" },
                { date: "25", title: "Rapat Warga Bulanan", desc: "Pembahasan laporan keuangan dan rencana tahun baru.", type: "rapat" },
            ]
        },
        {
            month: "Desember 2024", items: [
                { date: "01", title: "Posyandu Balita", desc: "Pemeriksaan rutin balita dan lansia.", type: "kesehatan" },
                { date: "15", title: "Pemilihan Ketua RT Baru", desc: "Persiapan panitia pemilihan.", type: "organisasi" },
                { date: "31", title: "Malam Tahun Baru", desc: "Kumpul warga dan barbeque.", type: "sosial" },
            ]
        }
    ]

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Agenda RT</h1>
                <p className="text-muted-foreground">Jadwal kegiatan RT 05/02.</p>
            </div>

            <div className="space-y-8">
                {agendaItems.map((monthGroup, i) => (
                    <div key={i} className="space-y-4">
                        <h3 className="text-xl font-semibold text-emerald-700 sticky top-20 bg-white/80 backdrop-blur-sm py-2 z-10">{monthGroup.month}</h3>
                        <div className="relative border-l-2 border-emerald-100 ml-4 space-y-6 pb-4">
                            {monthGroup.items.map((item, j) => (
                                <div key={j} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4 flex gap-4">
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-emerald-50 rounded-lg text-emerald-700">
                                                <span className="text-xl font-bold">{item.date}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{item.title}</h4>
                                                <p className="text-muted-foreground text-sm">{item.desc}</p>
                                                <Badge variant="secondary" className="mt-2 capitalize">{item.type}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
