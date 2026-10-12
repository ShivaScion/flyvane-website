import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, Mic, Coffee, Headphones, Moon, Laptop, Shuffle, Heart } from 'lucide-react';
import { Aira3DModel, CompanionActivity, CompanionPose } from './Aira3DModel';
import { getHumaneDialogue, generateOrganicThought } from '../data/airaDialogues';

interface AiraCompanionProps {
  onOpenModal: () => void;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
}

interface LivingRoutine {
  id: string;
  title: string;
  badge: string;
  activity: CompanionActivity;
  pose: CompanionPose;
  vibe: 'ambient_coffee' | 'ambient_lean' | 'ambient_lofi' | 'ambient_nap' | 'ambient_hack' | 'ambient_ponder';
}

const LIVING_ROUTINES: LivingRoutine[] = [
  {
    id: 'coffee_logs',
    title: 'Sipping Dark Roast',
    badge: 'Sipping Dark Roast',
    activity: 'sipping_coffee',
    pose: 'idle',
    vibe: 'ambient_coffee',
  },
  {
    id: 'boundary_lean',
    title: 'Leaning on Boundary',
    badge: 'Boundary Lean',
    activity: 'leaning_boundary',
    pose: 'flirting',
    vibe: 'ambient_lean',
  },
  {
    id: 'lofi_beats',
    title: 'Lo-Fi Chill Beats',
    badge: 'Lo-Fi Headspace',
    activity: 'listening_music',
    pose: 'idle',
    vibe: 'ambient_lofi',
  },
  {
    id: 'power_nap',
    title: 'Tranquil Catnap',
    badge: 'Quiet Pause',
    activity: 'dozing_sleeping',
    pose: 'idle',
    vibe: 'ambient_nap',
  },
  {
    id: 'deck_hack',
    title: 'Hacking Cyber Deck',
    badge: 'Cyber Deck Active',
    activity: 'hacking_laptop',
    pose: 'sneak_pose',
    vibe: 'ambient_hack',
  },
  {
    id: 'flirty_watch',
    title: 'Observing Admirer',
    badge: 'Observing Admirer',
    activity: 'none',
    pose: 'flirting',
    vibe: 'ambient_ponder',
  },
];

export const AiraCompanion: React.FC<AiraCompanionProps> = ({
  onOpenModal,
  speakText,
  isSpeaking,
  isAudioEnabled,
  onToggleAudio,
}) => {
  // Initialize Living Routine
  const [currentRoutine, setCurrentRoutine] = useState<LivingRoutine>(() => {
    const randomIndex = Math.floor(Math.random() * LIVING_ROUTINES.length);
    return LIVING_ROUTINES[randomIndex];
  });

  const [poseName, setPoseName] = useState<CompanionPose>(currentRoutine.pose);
  const poseNameRef = useRef<CompanionPose>(currentRoutine.pose);
  const isWalkingMotionRef = useRef<boolean>(false);

  const updatePose = (newPose: CompanionPose) => {
    poseNameRef.current = newPose;
    setPoseName(newPose);
  };

  const [activity, setActivity] = useState<CompanionActivity>(currentRoutine.activity);
  const [dialog, setDialog] = useState<string>(() => getHumaneDialogue(currentRoutine.vibe));
  const [statusBadge, setStatusBadge] = useState<string>(currentRoutine.badge);

  const [isCursorOffscreen, setIsCursorOffscreen] = useState<boolean>(false);
  const [walkDirection, setWalkDirection] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Coordinates
  const rigRef = useRef<HTMLDivElement | null>(null);

  const getDockPos = () => ({
    x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 240) : 800,
    y: typeof window !== 'undefined' ? Math.max(20, window.innerHeight - 340) : 500,
  });

  const currentPosRef = useRef<{ x: number; y: number }>(getDockPos());
  const targetPosRef = useRef<{ x: number; y: number }>(getDockPos());
  const [companionPos, setCompanionPos] = useState<{ x: number; y: number }>(getDockPos());

  // State Machine Flags & Timers
  const isSeekingIdleCursorRef = useRef<boolean>(false);
  const isKneelingAtCursorRef = useRef<boolean>(false);
  const isReactionLockedRef = useRef<boolean>(false);

  const idleTimerRef = useRef<any>(null);
  const hoverDwellTimerRef = useRef<any>(null);
  const lastHoverTargetRef = useRef<string | null>(null);
  const lastCursorPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const leftWindowTimestampRef = useRef<number | null>(null);

  // 1. Organic Ambient Life Cycle (Cycles every 26s if undisturbed)
  useEffect(() => {
    const routineInterval = setInterval(() => {
      if (!isSeekingIdleCursorRef.current && !isKneelingAtCursorRef.current && !isReactionLockedRef.current) {
        setCurrentRoutine((prev) => {
          const available = LIVING_ROUTINES.filter((r) => r.id !== prev.id);
          const next = available[Math.floor(Math.random() * available.length)];
          setPoseName(next.pose);
          setActivity(next.activity);
          // Pick fresh non-repeating humane dialogue or organic composite thought
          if (Math.random() > 0.4) {
            setDialog(getHumaneDialogue(next.vibe));
          } else {
            setDialog(generateOrganicThought());
          }
          setStatusBadge(next.badge);
          return next;
        });
      }
    }, 26000);

    return () => clearInterval(routineInterval);
  }, []);

  // 2. Cursor Event Handlers, Hover Dwell Debounce & Humane Comebacks
  useEffect(() => {
    const dock = getDockPos();
    currentPosRef.current = { ...dock };
    targetPosRef.current = { ...dock };
    setCompanionPos({ ...dock });

    const handlePointerMove = (e: PointerEvent) => {
      const cursorX = e.clientX;
      const cursorY = e.clientY;
      lastCursorPosRef.current = { x: cursorX, y: cursorY };

      // Case A: User was idle and Aira was kneeling/patting -> user resumed work!
      if (isSeekingIdleCursorRef.current || isKneelingAtCursorRef.current) {
        isSeekingIdleCursorRef.current = false;
        isKneelingAtCursorRef.current = false;
        setActivity('none');
        setPoseName('flirting');
        setDialog(getHumaneDialogue('resume_after_idle'));
        setStatusBadge("Resuming Work");

        const dockPos = getDockPos();
        targetPosRef.current = { ...dockPos };

        isReactionLockedRef.current = true;
        setTimeout(() => {
          isReactionLockedRef.current = false;
        }, 3200);
      }

      // Case B: Debounced Element Reaction (Prevents flicker/confusion between actions)
      handleDebouncedElementInspect(cursorX, cursorY);

      // Case C: Reset 5-Second Idle Timer
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        triggerGracefulIdleVisit(cursorX, cursorY);
      }, 5000);
    };

    // User Leaves the Window / Tab
    const handleMouseLeave = () => {
      leftWindowTimestampRef.current = Date.now();
      setIsCursorOffscreen(true);
      setPoseName('headShake');
      setActivity('none');
      setDialog(getHumaneDialogue('mouse_leave'));
      setStatusBadge("Looking Away");
      clearTimeout(idleTimerRef.current);
    };

    // User Returns to the Window / Tab
    const handleMouseEnter = () => {
      setIsCursorOffscreen(false);

      const now = Date.now();
      const leftAt = leftWindowTimestampRef.current;

      // Immediate Return Flirt (< 12 seconds)
      if (leftAt && now - leftAt < 12000) {
        updatePose('flirting');
        setActivity('none');
        setDialog(getHumaneDialogue('immediate_return'));
        setStatusBadge("Teasing • Flirting");

        isReactionLockedRef.current = true;
        setTimeout(() => {
          isReactionLockedRef.current = false;
        }, 4200);
      } else if (leftAt && now - leftAt >= 12000) {
        updatePose('flirting');
        setDialog(getHumaneDialogue('long_return'));
        setStatusBadge("Welcome Back");
      }

      leftWindowTimestampRef.current = null;
    };

    const handleWindowBlur = () => {
      setIsCursorOffscreen(true);
      leftWindowTimestampRef.current = Date.now();
      isReactionLockedRef.current = false;
      clearTimeout(hoverDwellTimerRef.current);
      clearTimeout(idleTimerRef.current);
    };

    const handleWindowFocus = () => {
      handleMouseEnter();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 60FPS Graceful Walking & Physics Tick (Direct DOM transform, zero React re-render cascades)
    let animationFrameId: number;

    const tick = () => {
      animationFrameId = requestAnimationFrame(tick);

      const curr = currentPosRef.current;
      const target = targetPosRef.current;

      const dx = target.x - curr.x;
      const dy = target.y - curr.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 16) {
        // Graceful walking velocity: ~2.4px per frame with natural sway
        const speed = Math.min(Math.max(dist * 0.024, 1.8), 3.2);
        const angle = Math.atan2(dy, dx);

        curr.x += Math.cos(angle) * speed;
        curr.y += Math.sin(angle) * speed;

        setWalkDirection({ dx, dy });

        if (!isKneelingAtCursorRef.current) {
          isWalkingMotionRef.current = true;
          updatePose('walk');
          setActivity('none');
        }

        // Direct GPU transform on DOM node (bypasses React state overhead at 60 FPS)
        if (rigRef.current) {
          rigRef.current.style.transform = `translate3d(${curr.x}px, ${curr.y}px, 0)`;
        }
      } else {
        // Reached Destination!
        setWalkDirection({ dx: 0, dy: 0 });

        if (isSeekingIdleCursorRef.current && !isKneelingAtCursorRef.current) {
          // Arrived at idle cursor: Kneel & Gently Pat
          isKneelingAtCursorRef.current = true;
          isSeekingIdleCursorRef.current = false;
          isWalkingMotionRef.current = false;
          setCompanionPos({ x: curr.x, y: curr.y });
          updatePose('sneak_pose'); // Deep kneel / crouch posture
          setActivity('kneeling_pat');
          setDialog(getHumaneDialogue('idle_care_kneel'));
          setStatusBadge("Checking In • Beside You");
        } else if (!isSeekingIdleCursorRef.current && !isKneelingAtCursorRef.current) {
          // Settled back at dock
          if (isWalkingMotionRef.current || poseNameRef.current === 'walk' || poseNameRef.current === 'run') {
            isWalkingMotionRef.current = false;
            setCompanionPos({ x: curr.x, y: curr.y });
            updatePose(currentRoutine.pose);
            setActivity(currentRoutine.activity);
            setDialog(getHumaneDialogue(currentRoutine.vibe));
            setStatusBadge(currentRoutine.badge);
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(idleTimerRef.current);
      clearTimeout(hoverDwellTimerRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [currentRoutine]);

  // Debounced Hover Inspector: Requires dwelling for at least 320ms before reacting
  const handleDebouncedElementInspect = (x: number, y: number) => {
    if (isSeekingIdleCursorRef.current || isKneelingAtCursorRef.current || isReactionLockedRef.current) return;

    const el = document.elementFromPoint(x, y);
    if (!el) return;

    let detectedSection: 'roi' | 'workbench' | 'contact' | 'experience' | 'default' = 'default';

    if (el.closest('#roi-arbitrage') || el.closest('input[type="range"]') || el.tagName === 'INPUT') {
      detectedSection = 'roi';
    } else if (el.closest('#workbench') || el.closest('.terminal') || el.closest('button[data-cmd]')) {
      detectedSection = 'workbench';
    } else if (el.closest('#contact') || el.closest('form')) {
      detectedSection = 'contact';
    } else if (el.closest('#experience') || el.closest('#work')) {
      detectedSection = 'experience';
    }

    if (detectedSection === lastHoverTargetRef.current) return;

    clearTimeout(hoverDwellTimerRef.current);
    hoverDwellTimerRef.current = setTimeout(() => {
      lastHoverTargetRef.current = detectedSection;
      applyComponentReaction(detectedSection);
    }, 320);
  };

  // Apply stable, humane reaction with a 2.8s lock
  const applyComponentReaction = (section: 'roi' | 'workbench' | 'contact' | 'experience' | 'default') => {
    isReactionLockedRef.current = true;

    if (section === 'roi') {
      updatePose('sad_pose');
      setActivity('none');
      setDialog(getHumaneDialogue('roi_arbitrage'));
      setStatusBadge("Observing • Manual Burn Rate");
    } else if (section === 'workbench') {
      updatePose('flirting');
      setActivity('none');
      setDialog(getHumaneDialogue('workbench'));
      setStatusBadge("Observing • Terminal Shell");
    } else if (section === 'contact') {
      updatePose('flirting');
      setActivity('none');
      setDialog(getHumaneDialogue('contact'));
      setStatusBadge("Observing • Contact Inquiry");
    } else if (section === 'experience') {
      updatePose('flirting');
      setActivity('none');
      setDialog(getHumaneDialogue('experience'));
      setStatusBadge("Observing • Credentials");
    } else {
      updatePose(currentRoutine.pose);
      setActivity(currentRoutine.activity);
      setDialog(getHumaneDialogue(currentRoutine.vibe));
      setStatusBadge(currentRoutine.badge);
    }

    setTimeout(() => {
      isReactionLockedRef.current = false;
    }, 2800);
  };

  // Trigger Graceful Stroll to Cursor after 5 seconds of stillness
  const triggerGracefulIdleVisit = (cursorX: number, cursorY: number) => {
    if (isReactionLockedRef.current) return;

    isSeekingIdleCursorRef.current = true;
    isKneelingAtCursorRef.current = false;
    isWalkingMotionRef.current = true;
    updatePose('walk');
    setActivity('none');
    setDialog("Heading over with a graceful stroll to check on you.");
    setStatusBadge("Walking to Cursor");

    const isRightSide = cursorX > window.innerWidth / 2;
    const targetX = Math.max(15, Math.min(window.innerWidth - 230, isRightSide ? cursorX - 145 : cursorX + 25));
    const targetY = Math.max(15, Math.min(window.innerHeight - 330, cursorY - 140));

    targetPosRef.current = { x: targetX, y: targetY };
  };

  // Dialog bubble placement
  const isNearTop = companionPos.y < 220;
  const isNearRight = companionPos.x > (typeof window !== 'undefined' ? window.innerWidth - 300 : 800);

  return (
    <div
      ref={rigRef}
      id="aira-companion-rig"
      className="fixed top-0 left-0 z-40 select-none pointer-events-none will-change-transform"
      style={{
        transform: `translate3d(${companionPos.x}px, ${companionPos.y}px, 0)`,
      }}
    >
      {/* Editorial Minimalist Dialog Bubble */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className={`absolute w-72 bg-[#090b10]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 shadow-2xl pointer-events-auto ${
            isNearTop ? 'top-full mt-2' : 'bottom-full mb-2'
          } ${isNearRight ? 'right-0' : 'left-0'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] font-mono text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5 text-white font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Aira • Living Companion
              {isSpeaking && (
                <span className="flex items-center gap-0.5 ml-1.5">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-pulse rounded-full" />
                  <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150 rounded-full" />
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleAudio}
                className="hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                title={isAudioEnabled ? "Mute Aira" : "Unmute Aira"}
              >
                {isAudioEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400 font-mono">ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="text-neutral-500 font-mono">MUTED</span>
                  </>
                )}
              </button>

              {isAudioEnabled && (
                <button
                  onClick={() => speakText(dialog)}
                  className="hover:text-white text-cyan-400 transition-colors"
                  title="Replay Audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Humane Status Tag (Zero Emojis) */}
          <div className="mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase border ${
              isKneelingAtCursorRef.current
                ? 'bg-pink-500/15 border-pink-500/30 text-pink-300'
                : poseName === 'flirting'
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-300 font-semibold shadow-[0_0_10px_rgba(244,114,182,0.2)]'
                : poseName === 'sad_pose'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : activity === 'sipping_coffee'
                ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                : activity === 'listening_music'
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                : activity === 'dozing_sleeping'
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
            }`}>
              {poseName === 'flirting' ? (
                <Heart className="w-2.5 h-2.5 text-pink-400 animate-pulse fill-pink-400" />
              ) : activity === 'sipping_coffee' ? (
                <Coffee className="w-2.5 h-2.5 text-orange-400" />
              ) : activity === 'listening_music' ? (
                <Headphones className="w-2.5 h-2.5 text-indigo-400" />
              ) : activity === 'dozing_sleeping' ? (
                <Moon className="w-2.5 h-2.5 text-purple-400" />
              ) : activity === 'hacking_laptop' ? (
                <Laptop className="w-2.5 h-2.5 text-cyan-400" />
              ) : (
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              )}
              {statusBadge}
            </span>
          </div>

          {/* Dialog Text */}
          <p className="text-xs text-neutral-200 font-sans leading-relaxed mb-2.5">
            "{dialog}"
          </p>

          {/* 5-Second Idle Care Details */}
          {isKneelingAtCursorRef.current && (
            <div className="p-2 mb-2 rounded bg-pink-950/40 border border-pink-500/25 text-[10px] text-pink-200 flex items-center justify-between">
              <span>Checking on you with a gentle pat. Move mouse to resume.</span>
            </div>
          )}

          {/* Quick Routine Switcher & 5s Test Trigger (Zero Emojis) */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => {
                const available = LIVING_ROUTINES.filter((r) => r.id !== currentRoutine.id);
                const next = available[Math.floor(Math.random() * available.length)];
                setCurrentRoutine(next);
                setPoseName(next.pose);
                setActivity(next.activity);
                setDialog(getHumaneDialogue(next.vibe));
                setStatusBadge(next.badge);
              }}
              className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 flex items-center gap-1 transition-all"
              title="Shuffle ambient routine"
            >
              <Shuffle className="w-2.5 h-2.5 text-cyan-400" /> Shuffle Routine
            </button>

            <button
              onClick={() => {
                const last = lastCursorPosRef.current;
                triggerGracefulIdleVisit(
                  last.x || window.innerWidth / 2,
                  last.y || window.innerHeight / 2
                );
              }}
              className="text-[9px] font-mono px-2 py-0.5 rounded bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 transition-all"
              title="Trigger the graceful walk, kneel and pat visit immediately"
            >
              Test Care Visit
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* True 3D WebGL Skeletal Rig Mount */}
      <div
        onClick={onOpenModal}
        className="relative w-48 sm:w-56 h-64 sm:h-80 cursor-pointer flex items-center justify-center filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] pointer-events-auto"
      >
        <Aira3DModel
          currentPose={poseName}
          activity={activity}
          isCursorOffscreen={isCursorOffscreen}
          walkDirection={walkDirection}
          onClickModel={onOpenModal}
          width={220}
          height={320}
        />

        {/* Talk / Voice Trigger Button */}
        <div
          className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-110 transition-transform"
          title="Talk with Aira"
        >
          <Mic className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
