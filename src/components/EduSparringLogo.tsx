import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function EduSparringLogo({ className = '', size = 24 }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size}
      className={className}
    >
      {/* Background */}
      <circle cx="50" cy="50" r="48" fill="#0f0a1a"/>
      
      {/* Left Book */}
      <g transform="translate(12, 25)">
        <rect x="0" y="0" width="30" height="40" rx="2" fill="#7c3aed"/>
        <rect x="3" y="3" width="24" height="34" rx="1" fill="#fef3c7"/>
        {/* Grad cap */}
        <polygon points="15,-8 -2,-2 15,4 32,-2" fill="#1e1b4b"/>
        <circle cx="32" cy="-2" r="2" fill="#fbbf24"/>
        {/* Boxing glove */}
        <circle cx="32" cy="20" r="10" fill="#dc2626"/>
        <rect x="26" y="8" width="8" height="8" rx="2" fill="#dc2626"/>
      </g>
      
      {/* Right Book (mirrored) */}
      <g transform="translate(88, 25) scale(-1, 1)">
        <rect x="0" y="0" width="30" height="40" rx="2" fill="#0891b2"/>
        <rect x="3" y="3" width="24" height="34" rx="1" fill="#fef3c7"/>
        {/* Grad cap */}
        <polygon points="15,-8 -2,-2 15,4 32,-2" fill="#164e63"/>
        <circle cx="32" cy="-2" r="2" fill="#fbbf24"/>
        {/* Boxing glove */}
        <circle cx="32" cy="20" r="10" fill="#dc2626"/>
        <rect x="26" y="8" width="8" height="8" rx="2" fill="#dc2626"/>
      </g>
      
      {/* Center spark */}
      <polygon points="50,35 53,45 63,45 55,52 58,62 50,56 42,62 45,52 37,45 47,45" fill="#fbbf24"/>
    </svg>
  );
}

export default EduSparringLogo;
