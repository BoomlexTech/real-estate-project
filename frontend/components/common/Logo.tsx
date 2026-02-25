import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
    className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
    return (
        <Link href="/" className={`shrink-0 ${className}`}>
            <div className="bg-white rounded-md px-2 py-1 inline-flex items-center">
                <Image
                    src="/logo2.png"
                    alt="Awtad Real Estate and Brokerage"
                    width={140}
                    height={58}
                    className="object-contain h-10 w-auto"
                    priority
                />
            </div>
        </Link>
    );
}
