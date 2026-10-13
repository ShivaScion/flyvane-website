export default function CinematicBackground({ activeMode }: { activeMode: string }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-50 bg-[#030406] overflow-hidden">
      {/* 
        The actual high-res cinematic images/videos will be placed here via public/assets/.
        For now, we establish the layout, atmospheric overlay, and mode-specific ambient glows.
      */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-1000"
        style={{ backgroundImage: `url('/assets/bg-${activeMode.toLowerCase().replace(' ', '-')}.jpg')` }}
      />

      {/* Mode-specific radial ambient lighting */}
      {activeMode === 'Automation Services' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,216,255,0.15),transparent_60%)]" />
      )}
      {activeMode === 'Marketing Services' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(245,158,11,0.15),transparent_60%)]" />
      )}

      {/* Global vignette and blend overlay to ensure text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030406]/30 via-transparent to-[#030406]/90 mix-blend-multiply" />
    </div>
  );
}
