import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-white/80 border-t backdrop-blur-md">
            <div className="container py-8 md:py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            WargaSepuluh.id
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Portal informasi terpadu untuk warga RT 10/04. Mewujudkan lingkungan yang harmonis dan transparan.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Kontak Admin</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>📍 Jl. Merpati No. 10, RT 10/04</p>
                            <p>📧 admin@wargasepuluh.id</p>
                            <p className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                +62 812-3456-7890
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Tautan Cepat</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/" className="hover:text-emerald-600">Beranda</a></li>
                            <li><a href="/events" className="hover:text-emerald-600">Info Acara</a></li>
                            <li><a href="/agenda" className="hover:text-emerald-600">Agenda RT</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Sosial Media</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-emerald-600">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-emerald-600">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-emerald-600">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} WargaSepuluh.id. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
