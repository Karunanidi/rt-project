import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    DollarSign,
    Settings,
    ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Manajemen Warga", href: "/admin/warga", icon: Users },
    { title: "Kegiatan RT", href: "/admin/kegiatan", icon: Calendar },
    { title: "Layanan Warga", href: "/admin/layanan", icon: FileText },
    { title: "Pembayaran IPL", href: "/admin/ipl", icon: DollarSign },
    { title: "Pengaturan", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
    const location = useLocation()

    return (
        <aside
            className={cn(
                "fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-emerald-600 to-teal-700 text-white transition-transform duration-300 z-40",
                "w-72 flex flex-col shadow-xl",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
        >
            {/* Logo Header */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold">WargaSepuluh.id</h1>
                <p className="text-emerald-100 text-sm mt-1">Admin Panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.href

                        return (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                        "hover:bg-white/10 group",
                                        isActive && "bg-white/20 shadow-lg"
                                    )}
                                >
                                    <Icon className={cn(
                                        "h-5 w-5 transition-transform",
                                        isActive && "scale-110"
                                    )} />
                                    <span className="flex-1 font-medium">{item.title}</span>
                                    {isActive && (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 text-xs text-emerald-100">
                <p>© 2024 WargaSepuluh.id</p>
                <p className="mt-1">Admin Panel RT/RW 10/04</p>
            </div>
        </aside>
    )
}
