import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"
import { Link } from "react-router-dom"
import { useRef } from "react"

export function HeroCarousel() {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    )

    const backgroundImages = [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1442544213729-6a15f1611937?q=80&w=1332&auto=format&fit=crop"
    ]

    return (
        <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-3xl group">

            {/* 1. Background Carousel */}
            <Carousel
                plugins={[plugin.current]}
                className="absolute inset-0 h-full w-full"
                opts={{
                    loop: true,
                    watchDrag: false, // Disable drag to keep usage focused on static content
                }}
            >
                <CarouselContent className="h-full ml-0">
                    {backgroundImages.map((img, index) => (
                        <CarouselItem key={index} className="h-full pl-0">
                            <div className="h-full w-full overflow-hidden">
                                <img
                                    src={img}
                                    alt={`Hero background ${index + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-110"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* 2. Static Overlay (Gradient & Text) */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-900/60 to-transparent z-10" />

            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24">
                <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                    <div className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md border border-white/30">
                        Resmi & Terpercaya
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                        WargaSepuluh.id
                    </h1>
                    <p className="text-lg md:text-2xl text-emerald-50 font-medium max-w-lg leading-relaxed drop-shadow-md">
                        Portal Informasi Resmi RT 10 / RW 04.<br />
                        Mewujudkan Lingkungan Harmonis, Aman, dan Sejahtera.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/agenda">
                            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 border-0 shadow-lg shadow-emerald-900/20">
                                Lihat Agenda
                            </Button>
                        </Link>
                        <Link to="/layanan">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white backdrop-blur-sm">
                                Layanan Warga
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}
