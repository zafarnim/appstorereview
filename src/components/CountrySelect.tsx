'use client';

import { COUNTRIES } from '@/types';

interface CountrySelectProps {
  value: string;
  onChange: (countryCode: string) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full px-3 py-2 pr-9 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 cursor-pointer shadow-sm"
      >
        <option value="">All Countries</option>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
        <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
