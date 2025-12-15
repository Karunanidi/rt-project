import { Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

interface AdminNavbarProps {
    onMenuClick: () => void
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
    const { profile, user } = useAdminAuth()
    const { signOut } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                {/* Page Title / Breadcrumb */}
                <div className="hidden lg:block">
                    <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
                </div>

                {/* Spacer for mobile */}
                <div className="lg:hidden" />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline font-medium">
                                {profile?.full_name || 'Admin'}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{profile?.full_name || 'Admin'}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                <p className="text-xs text-emerald-600 font-semibold">Role: Admin</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Dashboard Warga</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Keluar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}
