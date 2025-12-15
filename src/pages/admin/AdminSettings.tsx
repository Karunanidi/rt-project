import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon } from "lucide-react"

export function AdminSettings() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
                <p className="text-muted-foreground mt-2">Konfigurasi sistem admin</p>
            </div>

            {/* Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        Pengaturan Sistem
                    </CardTitle>
                    <CardDescription>
                        Halaman pengaturan akan segera tersedia
                    </CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <SettingsIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Fitur pengaturan sedang dalam pengembangan</p>
                </CardContent>
            </Card>
        </div>
    )
}
