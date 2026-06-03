interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const logoUrl =
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663486760487/At8dxsg5mPbm8xfvpZYQo3/wormgpt-logo_b9037f2f.png";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoUrl}
        alt="WormGPT Logo"
        className={`${sizeMap[size]} object-contain drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]`}
      />
      {showText && size !== "sm" && (
        <div className="flex flex-col">
          <span className="text-lg font-bold neon-text-green">Worm</span>
          <span className="text-lg font-bold neon-text-cyan">GPT</span>
        </div>
      )}
    </div>
  );
}
