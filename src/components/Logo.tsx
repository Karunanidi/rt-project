
export function Logo({ className = "w-8 h-8", showText = true }: { className?: string, showText?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <img src="logo-rt.png" alt="Logo RT 10/04" className={className} />
            {showText && (
                <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    WargaSepuluh
                </span>
            )}
        </div>
    )
}
