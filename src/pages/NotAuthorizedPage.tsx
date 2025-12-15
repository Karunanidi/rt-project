import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function NotAuthorizedPage() {
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <Card className="w-full max-w-md text-center border-red-200 shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="mx-auto bg-red-100 rounded-full p-4 w-fit">
                        <ShieldAlert className="h-12 w-12 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-700">
                        Akses Ditolak
                    </CardTitle>
                    <CardDescription className="text-base">
                        Anda tidak memiliki izin untuk mengakses halaman admin.
                        Hanya pengguna dengan role <span className="font-semibold text-red-600">admin</span> yang dapat mengakses area ini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator RT/RW.
                    </p>
                </CardContent>
                <CardFooter className="flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        Kembali
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                        onClick={() => navigate('/')}
                    >
                        Ke Halaman Utama
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
