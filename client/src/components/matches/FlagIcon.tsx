"use client";

import React from "react";
import { CA, US, AU, GB, DE, IE, NL } from "country-flag-icons/react/3x2";

const map: Record<string, any> = {
  CA,
  US,
  USA: US,
  AU,
  GB,
  UK: GB,
  DE,
  IE,
  NL,
  CH: US, // Placeholder
};

interface FlagIconProps {
  countryCode: string;
  className?: string;
  [key: string]: any;
}

export function FlagIcon({
  countryCode,
  className = "w-6 h-4",
  ...props
}: FlagIconProps) {
  const Fl = map[countryCode?.toUpperCase()];
  return Fl ? (
    <Fl className={`${className} rounded shadow-sm`} {...props} />
  ) : (
    <div className={`${className} bg-zinc-200 rounded`} />
  );
}
