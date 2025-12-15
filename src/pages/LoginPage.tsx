import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()
    const { toast } = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (error) {
                // Provide user-friendly error messages
                if (error.message.includes("Invalid login credentials")) {
                    throw new Error("Email atau password salah.")
                }
                throw error
            }

            if (data.session) {
                const user = data.user

                // Fetch user profile to check role
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .maybeSingle()

                if (profileError) {
                    console.error('Profile fetch error:', profileError)
                    toast({
                        variant: "destructive",
                        title: "Gagal Memuat Profil",
                        description: "Tidak dapat memuat data profil pengguna.",
                    })
                    return
                }

                // Navigate based on user role
                const targetPath = profile?.role === 'admin' ? '/admin' : '/dashboard'

                toast({
                    title: "Login Berhasil",
                    description: `Selamat datang di WargaSepuluh.id${profile?.role === 'admin' ? ' (Admin)' : ''}`,
                })

                navigate(targetPath)
            }
        } catch (err: any) {
            console.error("Login error:", err)
            setError(err.message || "Gagal login. Silakan coba lagi.")
            toast({
                variant: "destructive",
                title: "Gagal Masuk",
                description: err.message || "Periksa kembali kredensial anda.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <Card className="w-full max-w-md glass-card border-white/40 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Masuk Warga
                    </CardTitle>
                    <CardDescription>
                        Gunakan email terdaftar untuk masuk.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
                                    Lupa Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-100"
                            disabled={loading}
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </Button>
                        <div className="text-center text-sm w-full mt-2">
                            Belum punya akun?{" "}
                            <Link className="text-emerald-600 font-medium hover:underline" to="/register">
                                Daftar Disini
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
