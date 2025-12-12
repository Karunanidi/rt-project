import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })

            if (error) throw error

            setSuccess(true)
            toast({
                title: "Email Terkirim",
                description: "Silakan cek inbox anda untuk instruksi reset password.",
            })

        } catch (err: any) {
            console.error("Reset error:", err)
            setError(err.message || "Gagal mengirim email reset.")
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Terjadi kesalahan saat meminta reset password.",
            })
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <Card className="w-full max-w-md glass-card text-center py-8">
                    <CardContent className="flex flex-col items-center gap-4">
                        <CheckCircle className="h-16 w-16 text-emerald-500" />
                        <h2 className="text-2xl font-bold">Cek Email Anda</h2>
                        <p className="text-muted-foreground">
                            Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke <strong>{email}</strong>.
                        </p>
                        <Link to="/login">
                            <Button variant="outline" className="mt-4">Kembali ke Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <Card className="w-full max-w-md glass-card border-white/40 shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="mb-2">
                        <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-1 h-3 w-3" /> Kembali ke Login
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
                    <CardDescription>
                        Masukkan email anda untuk menerima instruksi reset password.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleReset}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Terdaftar</Label>
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
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={loading}
                        >
                            {loading ? "Mengirim..." : "Kirim Link Reset"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
