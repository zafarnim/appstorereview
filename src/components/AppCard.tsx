'use client';

import { App } from '@/types';
import StarRating from './StarRating';
import Image from 'next/image';

interface AppCardProps {
  app: App;
  onSelect: (app: App) => void;
  isSelected?: boolean;
}

export default function AppCard({ app, onSelect, isSelected }: AppCardProps) {
  return (
    <button
      onClick={() => onSelect(app)}
      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
        isSelected
          ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
          : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100">
          <Image
            src={app.icon}
            alt={app.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-semibold text-zinc-900 truncate">{app.name}</h3>
          <p className="text-[12px] text-zinc-500 truncate">{app.developer}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={app.rating} size="sm" />
            <span className="text-[11px] text-zinc-400">
              {app.reviewCount >= 1000000
                ? `${(app.reviewCount / 1000000).toFixed(1)}M`
                : app.reviewCount >= 1000
                ? `${(app.reviewCount / 1000).toFixed(0)}K`
                : app.reviewCount}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
