import Link from 'next/link';

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export default function Logo({ className = '', showText = true }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-2.5 shrink-0 ${className}`}>
            {/* Icon mark — abstract building + "RC" */}
            <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                {/* Outer rounded-square */}
                <rect width="36" height="36" rx="8" fill="#c9a84c" />
                {/* Building silhouette */}
                <rect x="6" y="14" width="7" height="16" rx="1" fill="#1a1f2e" />
                <rect x="15" y="8" width="7" height="22" rx="1" fill="#1a1f2e" />
                <rect x="24" y="12" width="6" height="18" rx="1" fill="#1a1f2e" />
                {/* Window dots */}
                <rect x="8" y="17" width="3" height="3" rx="0.5" fill="#c9a84c" opacity="0.6" />
                <rect x="8" y="22" width="3" height="3" rx="0.5" fill="#c9a84c" opacity="0.6" />
                <rect x="17" y="11" width="3" height="3" rx="0.5" fill="#c9a84c" opacity="0.6" />
                <rect x="17" y="16" width="3" height="3" rx="0.5" fill="#c9a84c" opacity="0.6" />
                <rect x="17" y="21" width="3" height="3" rx="0.5" fill="#c9a84c" opacity="0.6" />
                <rect x="25.5" y="15" width="3" height="3" rx="0.5" fill="#c9a84c" opacity="0.6" />
                <rect x="25.5" y="20" width="3" height="3" rx="0.5" fill="#c9a84c" opacity="0.6" />
            </svg>

            {/* Wordmark */}
            {showText && (
                <div className="hidden sm:flex items-baseline gap-1.5 text-xl font-bold tracking-wide">
                    <span style={{ color: '#c9a84c' }}>REAL</span>
                    <span className="text-white font-light">CAPITAL</span>
                </div>
            )}
        </Link>
    );
}
