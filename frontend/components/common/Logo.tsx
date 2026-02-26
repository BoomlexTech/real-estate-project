import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
    className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
    return (
        <Link href="/" className={`shrink-0 flex items-center ${className}`}>
            <Image
                src="/logo2.png"
                alt="Awtad Real Estate and Brokerage"
                width={140}
                height={58}
                className="object-contain h-10 w-auto"
                priority
            />
            <span
                style={{
                    color: '#c9a96e',
                    fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif',
                    fontSize: '1.7rem',
                    fontWeight: '400',
                    letterSpacing: '0.05em',
                    lineHeight: 1,
                    paddingRight: '0.1em',
                }}
            >
                AWTAD
            </span>
        </Link>
    );
}
