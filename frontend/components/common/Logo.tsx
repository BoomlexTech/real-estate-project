import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
    className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
    return (
        <Link href="/" className={`shrink-0 flex items-center ${className}`}>
            <Image
                src="/awtad-logo.png"
                alt="Awtad Real Estate and Brokerage"
                width={140}
                height={58}
                className="theme-logo object-contain h-7 md:h-8 w-auto"
                priority
            />
        </Link>
    );
}
