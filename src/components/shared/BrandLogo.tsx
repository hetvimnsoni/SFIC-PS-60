import React from "react";

export function BrandLogo({
  size = 36,
  showText = true,
  className = "",
}: {
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Connected Bridge + Book Knowledge SVG Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <rect width="48" height="48" rx="12" fill="#312E81" />
        {/* Subtle background glow */}
        <circle cx="24" cy="24" r="18" fill="#4338CA" fillOpacity="0.3" />
        {/* Bridge Arch */}
        <path
          d="M8 34C14 26 34 26 40 34"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Vertical suspension bridges */}
        <path d="M16 29V34M24 27V34M32 29V34" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" />
        {/* Open Book Wings (Shiksha) */}
        <path
          d="M12 18C16 16 20 17 24 20C28 17 32 16 36 18V28C32 26 28 27 24 30C20 27 16 26 12 28V18Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />
        {/* Center spine */}
        <path d="M24 20V30" stroke="#312E81" strokeWidth="2" strokeLinecap="round" />
        {/* AI Sparkle */}
        <circle cx="36" cy="12" r="3" fill="#F59E0B" />
        <path
          d="M36 6V8M36 16V18M30 12H32M40 12H42"
          stroke="#FCD34D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              Shiksha<span className="text-indigo-600">Setu</span>
            </span>
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              AI
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 tracking-tight mt-0.5">
            Smart Gap & Remedial Engine
          </span>
        </div>
      )}
    </div>
  );
}
