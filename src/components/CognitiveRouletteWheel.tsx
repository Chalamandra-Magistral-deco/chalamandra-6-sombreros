import { useEffect, useRef } from 'react';
import { HatKey, TRAINER_HATS } from '../data/trainerData';
import { sound } from '../lib/audio';

interface Props {
  targetHat: HatKey | null;
  isSpinning: boolean;
  onSpinEnd: (hat: HatKey) => void;
  characterAccent: string;
}

const HATS_ORDER: HatKey[] = ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul'];

export const CognitiveRouletteWheel = ({
  targetHat,
  isSpinning,
  onSpinEnd,
  characterAccent
}: Props) => {
  const currentAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTickSectorRef = useRef<number>(-1);

  // Sector angle is 360 / 6 = 60 degrees
  const sectorSize = 360 / HATS_ORDER.length;

  useEffect(() => {
    if (!isSpinning) return;

    // Calculate landing angle so top pointer (at 270° or -90°) hits the target hat
    const targetIndex = targetHat ? HATS_ORDER.indexOf(targetHat) : Math.floor(Math.random() * HATS_ORDER.length);
    const targetIdx = targetIndex >= 0 ? targetIndex : 0;

    // Pointer is at the top (angle 270 deg or -90 deg)
    // Sector center for index i starts at i * sectorSize, center at (i + 0.5) * sectorSize
    // Rotation R such that ( (targetIdx + 0.5) * 60 + R ) % 360 == 270
    // R = 270 - (targetIdx + 0.5) * 60 + 360 * spins
    const targetCenter = (targetIdx + 0.5) * sectorSize;
    const baseLandingAngle = 270 - targetCenter;
    
    // Normalize current angle
    const startAngle = currentAngleRef.current;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 2)); // 5 to 6 full spins
    const totalRotation = startAngle + extraSpins + ((baseLandingAngle - (startAngle % 360) + 360) % 360);

    const duration = 4200; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease-out deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3.2);
      const angle = startAngle + (totalRotation - startAngle) * easeOut;
      currentAngleRef.current = angle;

      // Audio tick when passing sector boundaries
      const normalized = (angle % 360 + 360) % 360;
      const currentSector = Math.floor(normalized / sectorSize);
      if (currentSector !== lastTickSectorRef.current) {
        lastTickSectorRef.current = currentSector;
        const tickFreq = 600 + (1 - progress) * 400;
        sound.playSpinTick(tickFreq);
      }

      const wheelElem = document.getElementById('roulette-wheel-svg');
      if (wheelElem) {
        wheelElem.style.transform = `rotate(${angle}deg)`;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        const finalHat = HATS_ORDER[targetIdx];
        onSpinEnd(finalHat);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSpinning, targetHat, onSpinEnd, sectorSize]);

  // Generate SVG path for a 60-degree sector
  const getSectorPath = (index: number) => {
    const startAngle = (index * sectorSize * Math.PI) / 180;
    const endAngle = ((index + 1) * sectorSize * Math.PI) / 180;
    const radius = 140;
    const cx = 150;
    const cy = 150;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-4">
      {/* Top pointer / indicator needle */}
      <div className="absolute -top-1 z-30 flex flex-col items-center">
        <div className="w-5 h-7 bg-amber-400 border-2 border-slate-950 shadow-xl shadow-amber-400/50 clip-needle rotate-180 transform" 
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} 
        />
        <div className="w-2.5 h-2.5 bg-white rounded-full border border-slate-950 -mt-1 z-10 shadow" />
      </div>

      {/* Wheel outer glow container */}
      <div className="relative p-2 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 shadow-2xl shadow-black/80">
        <svg
          id="roulette-wheel-svg"
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="transition-transform will-change-transform drop-shadow-md"
          style={{ transformOrigin: '50% 50%' }}
        >
          {/* Wheel Sectors */}
          {HATS_ORDER.map((hatKey, idx) => {
            const hat = TRAINER_HATS[hatKey];
            const midAngle = ((idx + 0.5) * sectorSize * Math.PI) / 180;
            const textRadius = 92;
            const textX = 150 + textRadius * Math.cos(midAngle);
            const textY = 150 + textRadius * Math.sin(midAngle);
            const textRotation = (idx + 0.5) * sectorSize + 90;

            return (
              <g key={hatKey}>
                <path
                  d={getSectorPath(idx)}
                  fill={hat.bgHex}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  className="transition-opacity hover:opacity-90"
                />
                {/* Text Label on sector */}
                <text
                  x={textX}
                  y={textY}
                  fill={hatKey === 'blanco' || hatKey === 'amarillo' ? '#0f172a' : '#ffffff'}
                  fontSize="10"
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  className="tracking-wider uppercase select-none font-sans"
                >
                  {hat.name.replace('Sombrero ', '')}
                </text>
              </g>
            );
          })}

          {/* Central hub with Chalamandra & DecoX branding */}
          <circle cx="150" cy="150" r="38" fill="#090d16" stroke="#f59e0b" strokeWidth="2.5" />
          <clipPath id="chalamandra-hub-clip">
            <circle cx="150" cy="150" r="32" />
          </clipPath>
          <image
            href="/src/assets/images/chalamandra_avatar_1790335163182.jpg"
            x="118"
            y="118"
            width="64"
            height="64"
            clipPath="url(#chalamandra-hub-clip)"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle cx="150" cy="150" r="32" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
        </svg>

        {/* Outer perimeter decorative studs */}
        <div className="absolute inset-0 rounded-full pointer-events-none border-4 border-slate-700/30" />
      </div>

      {/* Wheel caption */}
      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <span className={`w-2 h-2 rounded-full ${isSpinning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
        <span>{isSpinning ? 'Calculando sesgos cognitivos...' : 'Ruleta calibrada y lista para girar'}</span>
      </div>
    </div>
  );
};
