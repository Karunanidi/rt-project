import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { AlertCircle, User, Home, FileText, Mail, Lock, Phone } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nama_lengkap: "",
        nomor_rumah: "",
        nik: "",
        no_hp: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validation
        if (formData.password.length < 8) {
            setError("Password minimal 8 karakter")
            setLoading(false)
            return
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Konfirmasi password tidak sesuai")
            setLoading(false)
            return
        }
        if (!/^\d{16}$/.test(formData.nik)) {
            setError("NIK harus 16 digit angka")
            setLoading(false)
            return
        }

        try {
            // 1. Sign Up
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.nama_lengkap,
                        nomor_rumah: formData.nomor_rumah
                    }
                }
            })

            if (authError) throw authError

            if (authData.user) {
                // 2. Insert Profile (Table: profiles)
                // Ensure this table exists with fields: id (uuid, PK), full_name, house_number, nik, phone
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        full_name: formData.nama_lengkap,
                        house_number: formData.nomor_rumah, // Standardized column name
                        nik: formData.nik,
                        phone: formData.no_hp
                    })

                if (profileError) {
                    console.error("Profile creation error:", profileError)
                    // Note: If profile fails, user is still created in Auth. 
                    // UX wise, we accept it but warn dev console.
                }

                toast({
                    title: "Registrasi Berhasil",
                    description: "Silakan login dengan akun baru anda.",
                })
                navigate("/login")
            }

        } catch (err: any) {
            console.error("Registration error:", err)
            setError(err.message || "Terjadi kesalahan saat registrasi.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
            <Card className="w-full max-w-lg glass-card border-white/40 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Daftar WargaSepuluh
                    </CardTitle>
                    <CardDescription>
                        Lengkapi data diri anda untuk bergabung.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="nama_lengkap" placeholder="Budi Santoso" className="pl-9" required value={formData.nama_lengkap} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nomor_rumah">Nomor Rumah</Label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="nomor_rumah" placeholder="A1-10" className="pl-9" required value={formData.nomor_rumah} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">NIK (16 Digit)</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="nik" placeholder="327xxxxxxxxxxxxx" className="pl-9" maxLength={16} required value={formData.nik} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="no_hp">No. Handphone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="no_hp" placeholder="0812xxxxxxxx" className="pl-9" required value={formData.no_hp} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="budi@example.com" className="pl-9" required value={formData.email} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="password" type="password" placeholder="Min. 8 karakter" className="pl-9" required value={formData.password} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="confirmPassword" type="password" placeholder="Ulangi password" className="pl-9" required value={formData.confirmPassword} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                            disabled={loading}
                        >
                            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{" "}
                            <Link to="/login" className="text-emerald-600 hover:underline">
                                Login disini
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
