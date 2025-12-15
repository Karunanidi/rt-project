import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
    images: File[]
    onImagesChange: (files: File[]) => void
    maxImages?: number
}

export function ImageUploader({ images, onImagesChange, maxImages = 10 }: ImageUploaderProps) {
    const [previews, setPreviews] = useState<string[]>([])

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])

        if (images.length + files.length > maxImages) {
            alert(`Maksimal ${maxImages} gambar`)
            return
        }

        const newImages = [...images, ...files]
        onImagesChange(newImages)

        // Generate previews
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)
        onImagesChange(newImages)
        setPreviews(newPreviews)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full"
                            onClick={() => handleRemove(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-muted-foreground mt-2">Upload Gambar</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
                {images.length} / {maxImages} gambar dipilih
            </p>
        </div>
    )
}
