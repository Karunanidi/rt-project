import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { X, Upload, Image as ImageIcon } from "lucide-react"

interface ImageUploaderProps {
    images: File[]
    onImagesChange: (files: File[]) => void
    maxImages?: number
}

export function ImageUploader({
    images,
    onImagesChange,
    maxImages = 5,
}: ImageUploaderProps) {
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Create previews for new files
        const newPreviews = images.map((file) => URL.createObjectURL(file))
        setPreviews(newPreviews)

        // Cleanup function to revoke object URLs
        return () => {
            newPreviews.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [images])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)

            // Check max images limit
            const totalImages = images.length + newFiles.length
            if (totalImages > maxImages) {
                alert(`Maksimal ${maxImages} gambar yang dapat diunggah.`)
                return
            }

            onImagesChange([...images, ...newFiles])
        }
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        onImagesChange(newImages)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-full h-full"
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center gap-2 aspect-square transition-colors bg-muted/5 hover:bg-muted/10"
                    >
                        <div className="p-2 rounded-full bg-background border">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">Upload Foto</span>
                    </div>
                )}
            </div>

            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
            />

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ImageIcon className="h-3 w-3" />
                <span>Maksimal {maxImages} gambar (JPG, PNG)</span>
            </div>
        </div>
    )
}
