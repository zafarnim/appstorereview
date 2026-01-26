'use client';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRating({ rating, size = 'md', showValue = false }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const textSizes = {
    sm: 'text-[11px]',
    md: 'text-[12px]',
    lg: 'text-[13px]',
  };

  const gapClasses = {
    sm: 'gap-0.5',
    md: 'gap-0.5',
    lg: 'gap-1',
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating);
    const partial = i === Math.ceil(rating) && rating % 1 !== 0;
    const percentage = partial ? (rating % 1) * 100 : 0;

    stars.push(
      <span key={i} className="relative inline-block">
        <svg
          className={`${sizeClasses[size]} text-zinc-200`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {(filled || partial) && (
          <svg
            className={`${sizeClasses[size]} text-amber-400 absolute top-0 left-0`}
            fill="currentColor"
            viewBox="0 0 20 20"
            style={partial ? { clipPath: `inset(0 ${100 - percentage}% 0 0)` } : undefined}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </span>
    );
  }

  return (
    <div className={`flex items-center ${gapClasses[size]}`}>
      <div className="flex">{stars}</div>
      {showValue && (
        <span className={`${textSizes[size]} text-zinc-500 ml-1 font-medium tabular-nums`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
