'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-[14px]', gap: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-[16px]', gap: 'gap-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-[24px]', gap: 'gap-3' },
  };

  const { icon, text, gap } = sizes[size];

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {/* Logo Icon - Stylized "P" with review/chart element */}
      <div className={`${icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Main circle background */}
          <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#logoGradient)" />

          {/* Stylized "P" */}
          <path
            d="M12 10h8c4.418 0 8 3.134 8 7s-3.582 7-8 7h-4v8h-4V10z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M16 14v6h4c2.209 0 4-1.343 4-3s-1.791-3-4-3h-4z"
            fill="url(#logoGradient)"
          />

          {/* Star accent */}
          <circle cx="30" cy="10" r="6" fill="url(#starGradient)" />
          <path
            d="M30 6.5l.927 1.854 2.073.301-1.5 1.463.354 2.066L30 11.25l-1.854.934.354-2.066-1.5-1.463 2.073-.301L30 6.5z"
            fill="white"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${text} font-bold text-zinc-900 tracking-tight leading-none`}>
            Pikan
          </span>
          <span className={`${size === 'lg' ? 'text-[12px]' : 'text-[10px]'} font-medium text-indigo-600 tracking-wide uppercase leading-none mt-0.5`}>
            Review
          </span>
        </div>
      )}
    </div>
  );
}
