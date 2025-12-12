import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { Toaster } from "@/components/ui/toaster"

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 flex flex-col">
            <Navbar />
            <main className="container py-8 flex-1">
                {children}
            </main>
            <Footer />
            <Toaster />
        </div>
    )
}
