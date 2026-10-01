import { useState, useEffect, useRef, useCallback } from "react";

interface PlanetData {
  name: string;
  color: string;
  size: number; // visual radius in px
  realDiameter: string; // km
  distanceFromSun: string; // million km
  orbitalPeriod: string; // Earth years/days
  orbitRadius: number; // px from center
  speed: number; // radians per frame at 1x speed
  description: string;
  emoji: string;
  moons: number;
  type: string;
}

const planets: PlanetData[] = [
  {
    name: "Mercury",
    color: "#b5b5b5",
    size: 6,
    realDiameter: "4,879 km",
    distanceFromSun: "57.9 million km",
    orbitalPeriod: "88 days",
    orbitRadius: 70,
    speed: 0.024,
    description:
      "The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature swings.",
    emoji: "☿",
    moons: 0,
    type: "Terrestrial",
  },
  {
    name: "Venus",
    color: "#e8cda0",
    size: 10,
    realDiameter: "12,104 km",
    distanceFromSun: "108.2 million km",
    orbitalPeriod: "225 days",
    orbitRadius: 105,
    speed: 0.018,
    description:
      "The hottest planet due to its thick CO₂ atmosphere. It rotates backwards compared to most planets.",
    emoji: "♀",
    moons: 0,
    type: "Terrestrial",
  },
  {
    name: "Earth",
    color: "#4a90d9",
    size: 11,
    realDiameter: "12,756 km",
    distanceFromSun: "149.6 million km",
    orbitalPeriod: "365.25 days",
    orbitRadius: 145,
    speed: 0.015,
    description:
      "Our home planet — the only known world with liquid water on its surface and life.",
    emoji: "🌍",
    moons: 1,
    type: "Terrestrial",
  },
  {
    name: "Mars",
    color: "#c1440e",
    size: 8,
    realDiameter: "6,792 km",
    distanceFromSun: "227.9 million km",
    orbitalPeriod: "687 days",
    orbitRadius: 190,
    speed: 0.012,
    description:
      "The Red Planet, home to the tallest volcano (Olympus Mons) and the deepest canyon in the Solar System.",
    emoji: "♂",
    moons: 2,
    type: "Terrestrial",
  },
  {
    name: "Jupiter",
    color: "#c88b3a",
    size: 22,
    realDiameter: "142,984 km",
    distanceFromSun: "778.6 million km",
    orbitalPeriod: "11.86 years",
    orbitRadius: 260,
    speed: 0.007,
    description:
      "The largest planet — a gas giant with a Great Red Spot storm larger than Earth that has raged for centuries.",
    emoji: "♃",
    moons: 95,
    type: "Gas Giant",
  },
  {
    name: "Saturn",
    color: "#e8d5a3",
    size: 19,
    realDiameter: "120,536 km",
    distanceFromSun: "1,433.5 million km",
    orbitalPeriod: "29.46 years",
    orbitRadius: 330,
    speed: 0.005,
    description:
      "Famous for its stunning ring system made of ice and rock. It's the least dense planet — it could float on water!",
    emoji: "♄",
    moons: 146,
    type: "Gas Giant",
  },
  {
    name: "Uranus",
    color: "#7ec8e3",
    size: 15,
    realDiameter: "51,118 km",
    distanceFromSun: "2,872.5 million km",
    orbitalPeriod: "84.01 years",
    orbitRadius: 395,
    speed: 0.003,
    description:
      "An ice giant that rotates on its side. Its blue-green color comes from methane in its atmosphere.",
    emoji: "♅",
    moons: 28,
    type: "Ice Giant",
  },
  {
    name: "Neptune",
    color: "#3f54ba",
    size: 14,
    realDiameter: "49,528 km",
    distanceFromSun: "4,495.1 million km",
    orbitalPeriod: "164.8 years",
    orbitRadius: 450,
    speed: 0.002,
    description:
      "The windiest planet with speeds up to 2,100 km/h. It's the farthest planet from the Sun.",
    emoji: "♆",
    moons: 16,
    type: "Ice Giant",
  },
];

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(
    planets.map(() => Math.random() * Math.PI * 2)
  );
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 900 });

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const size = Math.min(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight,
          900
        );
        setDimensions({ width: size, height: size });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setAngles((prev) =>
        prev.map((angle, i) => angle + planets[i].speed * speed * (delta / 16))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, speed]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = width / 900;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw stars
    const starSeed = 42;
    for (let i = 0; i < 200; i++) {
      const x = ((starSeed * (i + 1) * 7) % width);
      const y = ((starSeed * (i + 1) * 13) % height);
      const size = ((i * 3) % 3) * 0.5 + 0.5;
      const opacity = 0.3 + ((i * 7) % 7) / 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // Draw orbit paths
    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius * scale, 0, Math.PI * 2);
      ctx.strokeStyle =
        selectedPlanet?.name === planet.name
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = selectedPlanet?.name === planet.name ? 1.5 : 0.5;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      35 * scale
    );
    sunGradient.addColorStop(0, "#fff7e6");
    sunGradient.addColorStop(0.3, "#ffcc00");
    sunGradient.addColorStop(0.7, "#ff8800");
    sunGradient.addColorStop(1, "#ff440044");
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35 * scale, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      20 * scale,
      centerX,
      centerY,
      60 * scale
    );
    glowGradient.addColorStop(0, "rgba(255, 200, 50, 0.3)");
    glowGradient.addColorStop(1, "rgba(255, 200, 50, 0)");
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60 * scale, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planets.forEach((planet, i) => {
      const x = centerX + Math.cos(angles[i]) * planet.orbitRadius * scale;
      const y = centerY + Math.sin(angles[i]) * planet.orbitRadius * scale;
      const planetSize = planet.size * scale;

      // Planet shadow/glow
      if (hoveredPlanet === planet.name || selectedPlanet?.name === planet.name) {
        ctx.beginPath();
        ctx.arc(x, y, planetSize + 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `${planet.color}44`;
        ctx.fill();
      }

      // Planet body
      const planetGradient = ctx.createRadialGradient(
        x - planetSize * 0.3,
        y - planetSize * 0.3,
        0,
        x,
        y,
        planetSize
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(0.7, planet.color);
      planetGradient.addColorStop(1, darkenColor(planet.color, 40));
      ctx.beginPath();
      ctx.arc(x, y, planetSize, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn rings
      if (planet.name === "Saturn") {
        ctx.beginPath();
        ctx.ellipse(x, y, planetSize * 1.8, planetSize * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(232, 213, 163, 0.6)";
        ctx.lineWidth = 2.5 * scale;
        ctx.stroke();
      }

      // Planet label
      if (hoveredPlanet === planet.name || selectedPlanet?.name === planet.name) {
        ctx.font = `${11 * scale}px sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(planet.name, x, y - planetSize - 8 * scale);
      }
    });
  }, [angles, dimensions, selectedPlanet, hoveredPlanet]);

  // Click handler
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const { width } = dimensions;
      const centerX = width / 2;
      const centerY = width / 2;
      const scale = width / 900;

      for (let i = planets.length - 1; i >= 0; i--) {
        const planet = planets[i];
        const x = centerX + Math.cos(angles[i]) * planet.orbitRadius * scale;
        const y = centerY + Math.sin(angles[i]) * planet.orbitRadius * scale;
        const dist = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        const hitRadius = Math.max(planet.size * scale + 8, 15);
        if (dist <= hitRadius) {
          setSelectedPlanet(
            selectedPlanet?.name === planet.name ? null : planet
          );
          return;
        }
      }
      setSelectedPlanet(null);
    },
    [angles, dimensions, selectedPlanet]
  );

  // Mouse move handler
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const { width } = dimensions;
      const centerX = width / 2;
      const centerY = width / 2;
      const scale = width / 900;

      for (let i = planets.length - 1; i >= 0; i--) {
        const planet = planets[i];
        const x = centerX + Math.cos(angles[i]) * planet.orbitRadius * scale;
        const y = centerY + Math.sin(angles[i]) * planet.orbitRadius * scale;
        const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        const hitRadius = Math.max(planet.size * scale + 8, 15);
        if (dist <= hitRadius) {
          setHoveredPlanet(planet.name);
          canvas.style.cursor = "pointer";
          return;
        }
      }
      setHoveredPlanet(null);
      canvas.style.cursor = "default";
    },
    [angles, dimensions]
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="text-center py-4 px-4 relative z-10">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
          🌌 Solar System Explorer
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Click on any planet to learn more • Use controls to adjust speed
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 px-4 pb-4 relative">
        {/* Solar System Canvas */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-center w-full max-w-[900px] aspect-square"
        >
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="rounded-full border border-white/5"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Info Panel */}
        <div className="lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2 w-full max-w-sm">
          {selectedPlanet ? (
            <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${lightenColor(selectedPlanet.color, 30)}, ${selectedPlanet.color})`,
                  }}
                >
                  {selectedPlanet.emoji}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPlanet.name}</h2>
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                    {selectedPlanet.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="ml-auto text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {selectedPlanet.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  label="Diameter"
                  value={selectedPlanet.realDiameter}
                  icon="📏"
                />
                <InfoCard
                  label="Distance from Sun"
                  value={selectedPlanet.distanceFromSun}
                  icon="☀️"
                />
                <InfoCard
                  label="Orbital Period"
                  value={selectedPlanet.orbitalPeriod}
                  icon="🔄"
                />
                <InfoCard
                  label="Known Moons"
                  value={selectedPlanet.moons.toString()}
                  icon="🌙"
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <p className="text-gray-400 text-lg mb-2">🪐</p>
              <p className="text-gray-300 text-sm">
                Click on a planet to see its details
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {planets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlanet(p)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[10px] text-gray-400">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M4 2l10 6-10 6V2z" />
              </svg>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              Speed:
            </span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-sm font-mono text-yellow-400 w-12 text-right">
              {speed.toFixed(1)}x
            </span>
          </div>

          {/* Speed presets */}
          <div className="hidden sm:flex gap-1">
            {[0.5, 1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  speed === s
                    ? "bg-yellow-400/20 text-yellow-400"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-semibold text-white mt-0.5">{value}</div>
    </div>
  );
}

// Utility functions
function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `rgb(${r}, ${g}, ${b})`;
}

export default App;
