'use client';

export type DateRange = 'all' | '7d' | '30d' | '90d' | '1y';

interface DateFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
  const options: { value: DateRange; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="flex items-center gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
            value === option.value
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
