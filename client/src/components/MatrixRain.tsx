import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters - mix of code and symbols
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン█▓▒░";
    const charArray = chars.split("");

    // Font size
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    // Initialize drops
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height);
    }

    // Animation function with throttling
    let frameCount = 0;
    const draw = () => {
      frameCount++;
      // Only update every 2 frames for better performance
      if (frameCount % 2 === 0) {
        // Semi-transparent black background for trail effect
        ctx.fillStyle = "rgba(10, 14, 39, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text properties
        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          // Random character
          const char = charArray[Math.floor(Math.random() * charArray.length)];

          // Color: bright red
          const lightness = Math.random() > 0.5 ? 60 : 40;

          // Reduced glow effect for better performance
          ctx.shadowColor = `hsl(0, 100%, ${lightness}%)`;
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.fillStyle = `hsl(0, 100%, ${lightness}%)`;
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          // Random reset
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
