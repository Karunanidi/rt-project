import { Link, useNavigate } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { Menu, UserCircle, LogOut, LayoutDashboard } from "lucide-react"
import { useState } from "react"

export function Navbar() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate("/login")
    }

    const NavItems = () => (
        <>
            <NavigationMenuItem>
                <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link to="/events">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Info Acara
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link to="/agenda">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Agenda RT
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            {user && (
                <NavigationMenuItem>
                    <Link to="/dashboard">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Pembayaran IPL
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            )}
            <NavigationMenuItem>
                <a href="#" className={navigationMenuTriggerStyle()}>
                    Dokumentasi
                </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <a href="#" className={navigationMenuTriggerStyle()}>
                    Kontak
                </a>
            </NavigationMenuItem>
        </>
    )

    const MobileNavItems = () => (
        <div className="flex flex-col gap-4 mt-8">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-emerald-600 transition-colors">
                Home
            </Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-emerald-600 transition-colors">
                Info Acara
            </Link>
            <Link to="/agenda" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-emerald-600 transition-colors">
                Agenda RT
            </Link>
            {user && (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-emerald-600 transition-colors">
                    Pembayaran IPL
                </Link>
            )}
            <a href="#" className="text-lg font-medium hover:text-emerald-600 transition-colors">Dokumentasi</a>
            <a href="#" className="text-lg font-medium hover:text-emerald-600 transition-colors">Kontak</a>
        </div>
    )

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Mobile Menu Trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                                WargaSepuluh.id
                            </div>
                            <MobileNavItems />
                        </SheetContent>
                    </Sheet>

                    <Link to="/" className="mr-8 flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden md:inline-block">
                            WargaSepuluh.id
                        </span>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent md:hidden">
                            W10
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavItems />
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                                    <AvatarFallback>User</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link to="/dashboard">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" /> Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/login">
                            <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600">
                                <UserCircle className="mr-2 h-4 w-4" />
                                Login Warga
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
