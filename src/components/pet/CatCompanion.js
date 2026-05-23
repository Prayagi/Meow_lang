'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CAT_COLORS = {
  orange: { body: '#f8a855', dark: '#e8923a', light: '#fbc07a', nose: '#f5836b' },
  gray: { body: '#9ca3af', dark: '#7c8490', light: '#b8bfc9', nose: '#f5a0a0' },
  black: { body: '#374151', dark: '#1f2937', light: '#4b5563', nose: '#6b7280' },
  white: { body: '#f1f0f5', dark: '#d4d2de', light: '#fafafa', nose: '#f5b0b0' },
  calico: { body: '#d4956a', dark: '#b87a50', light: '#e8b08a', nose: '#f5836b' },
};

const EXPRESSIONS = {
  idle: { leftEye: 'open', rightEye: 'open', mouth: 'neutral', pupils: 'center' },
  happy: { leftEye: 'happy', rightEye: 'happy', mouth: 'smile', pupils: 'center' },
  confused: { leftEye: 'wide', rightEye: 'squint', mouth: 'oh', pupils: 'left' },
  sleeping: { leftEye: 'closed', rightEye: 'closed', mouth: 'neutral', pupils: 'center' },
  zoomies: { leftEye: 'star', rightEye: 'star', mouth: 'open', pupils: 'center' },
  typing: { leftEye: 'open', rightEye: 'open', mouth: 'neutral', pupils: 'follow' },
  thinking: { leftEye: 'open', rightEye: 'squint', mouth: 'neutral', pupils: 'up' },
  celebrating: { leftEye: 'happy', rightEye: 'happy', mouth: 'open', pupils: 'center' },
};

const SPEECH_BUBBLES = {
  idle: ['...', '💭', 'meow?'],
  happy: ['Purrrfect! ✨', 'Yay! 🎉', 'Nailed it! 🐾'],
  confused: ['Hmm... 🤔', 'Hiss?', 'Try again! 💪'],
  sleeping: ['zzz...', '💤', 'zzZZzz...'],
  zoomies: ['MEOW!! 🎊', 'AMAZING! ⭐', 'WOW! 🌟'],
  typing: ['I see you! 👀', 'Go go go!', '🐾✨'],
  thinking: ['Computing...', '🧮', 'Hmm...'],
  celebrating: ['PARTY! 🎉', 'You did it! 🏆', 'Legendary! 👑'],
};

function CatEye({ cx, cy, expression, side }) {
  const eyeSize = 14;
  
  switch (expression) {
    case 'happy':
      return (
        <motion.path
          d={`M ${cx - eyeSize/2} ${cy + 2} Q ${cx} ${cy - eyeSize/2} ${cx + eyeSize/2} ${cy + 2}`}
          stroke="#1f2937"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      );
    case 'closed':
      return (
        <motion.line
          x1={cx - eyeSize/2} y1={cy}
          x2={cx + eyeSize/2} y2={cy}
          stroke="#1f2937"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    case 'wide':
      return (
        <>
          <circle cx={cx} cy={cy} r={eyeSize/2 + 2} fill="white" stroke="#1f2937" strokeWidth="1.5" />
          <motion.circle
            cx={cx}
            cy={cy}
            r={4}
            fill="#1f2937"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <circle cx={cx + 2} cy={cy - 2} r={1.5} fill="white" />
        </>
      );
    case 'squint':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={eyeSize/2} ry={eyeSize/4} fill="white" stroke="#1f2937" strokeWidth="1.5" />
          <circle cx={cx + (side === 'left' ? -1 : 1)} cy={cy} r={3} fill="#1f2937" />
        </>
      );
    case 'star':
      return (
        <motion.text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="16"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          ⭐
        </motion.text>
      );
    case 'open':
    default:
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={eyeSize/2} ry={eyeSize/2 + 1} fill="white" stroke="#1f2937" strokeWidth="1.5" />
          <motion.circle
            cx={cx}
            cy={cy}
            r={4.5}
            fill="#1f2937"
            animate={{
              cx: expression === 'follow' ? [cx - 2, cx + 2, cx] : cx,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx={cx + 2} cy={cy - 2} r={1.5} fill="white" />
        </>
      );
  }
}

function CatMouth({ cx, cy, expression }) {
  switch (expression) {
    case 'smile':
      return (
        <motion.path
          d={`M ${cx - 8} ${cy} Q ${cx - 4} ${cy + 8} ${cx} ${cy + 2} Q ${cx + 4} ${cy + 8} ${cx + 8} ${cy}`}
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4 }}
        />
      );
    case 'oh':
      return (
        <motion.ellipse
          cx={cx}
          cy={cy + 4}
          rx={4}
          ry={5}
          fill="#1f2937"
          animate={{ ry: [5, 6, 5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      );
    case 'open':
      return (
        <motion.path
          d={`M ${cx - 6} ${cy} Q ${cx} ${cy + 12} ${cx + 6} ${cy}`}
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="#f87171"
          animate={{ d: [
            `M ${cx - 6} ${cy} Q ${cx} ${cy + 12} ${cx + 6} ${cy}`,
            `M ${cx - 7} ${cy} Q ${cx} ${cy + 14} ${cx + 7} ${cy}`,
            `M ${cx - 6} ${cy} Q ${cx} ${cy + 12} ${cx + 6} ${cy}`,
          ]}}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      );
    case 'neutral':
    default:
      return (
        <>
          <path
            d={`M ${cx - 6} ${cy + 2} Q ${cx - 3} ${cy + 5} ${cx} ${cy + 2}`}
            stroke="#1f2937"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx} ${cy + 2} Q ${cx + 3} ${cy + 5} ${cx + 6} ${cy + 2}`}
            stroke="#1f2937"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      );
  }
}

function SpeechBubble({ mood, show }) {
  const messages = SPEECH_BUBBLES[mood] || SPEECH_BUBBLES.idle;
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (show) {
      setMsgIndex(Math.floor(Math.random() * messages.length));
    }
  }, [show, messages.length]);

  return (
    <AnimatePresence>
      {show && (
        <motion.g
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <rect
            x="95" y="-10" width="90" height="36"
            rx="18" ry="18"
            fill="white"
            filter="drop-shadow(0 2px 8px rgba(0,0,0,0.15))"
          />
          <polygon points="100,22 90,35 110,22" fill="white" />
          <text
            x="140" y="12"
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--font-primary)"
            fontWeight="600"
            fill="#1f2937"
          >
            {messages[msgIndex]}
          </text>
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function Sparkles({ active }) {
  if (!active) return null;
  
  const sparklePositions = [
    { x: 30, y: -10, delay: 0 },
    { x: 140, y: 5, delay: 0.2 },
    { x: 10, y: 50, delay: 0.4 },
    { x: 155, y: 60, delay: 0.1 },
    { x: 80, y: -20, delay: 0.3 },
  ];

  return sparklePositions.map((s, i) => (
    <motion.text
      key={i}
      x={s.x}
      y={s.y}
      fontSize="14"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
        y: [s.y, s.y - 15, s.y - 30],
      }}
      transition={{
        duration: 1.2,
        delay: s.delay,
        repeat: Infinity,
        repeatDelay: 0.5,
      }}
    >
      ✨
    </motion.text>
  ));
}

function ZzzBubbles({ active }) {
  if (!active) return null;
  
  return [0, 1, 2].map((i) => (
    <motion.text
      key={i}
      x={120 + i * 12}
      y={20}
      fontSize={12 + i * 4}
      fill="#a78bfa"
      fontWeight="700"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0, 0.8, 0],
        y: [20, -10 - i * 15],
        x: [120 + i * 12, 125 + i * 15],
      }}
      transition={{
        duration: 2,
        delay: i * 0.6,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      z
    </motion.text>
  ));
}

function QuestionMarks({ active }) {
  if (!active) return null;
  
  return (
    <>
      <motion.text
        x="130" y="0"
        fontSize="20"
        fontWeight="bold"
        fill="#fbbf24"
        animate={{
          rotate: [-10, 10, -10],
          y: [0, -5, 0],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        ?
      </motion.text>
      <motion.text
        x="150" y="10"
        fontSize="14"
        fontWeight="bold"
        fill="#fb7185"
        animate={{
          rotate: [10, -10, 10],
          y: [10, 5, 10],
        }}
        transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
      >
        ?
      </motion.text>
    </>
  );
}

export default function CatCompanion({ mood = 'idle', color = 'orange', accessories = [], size = 160 }) {
  const [showBubble, setShowBubble] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const colors = CAT_COLORS[color] || CAT_COLORS.orange;
  const expr = EXPRESSIONS[mood] || EXPRESSIONS.idle;

  // Show speech bubble on mood change
  useEffect(() => {
    if (mood !== 'idle' && mood !== 'sleeping') {
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowBubble(false);
    }
  }, [mood]);

  // Random blinking
  useEffect(() => {
    if (mood === 'sleeping') return;
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [mood]);

  const bodyVariants = {
    idle: {
      scaleY: [1, 1.02, 1],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
      y: [0, -8, 0],
      transition: { duration: 0.4, repeat: 3, ease: 'easeOut' },
    },
    confused: {
      rotate: [0, -3, 3, 0],
      transition: { duration: 0.6, repeat: 2 },
    },
    sleeping: {
      scaleY: [1, 0.97, 1],
      rotate: [0, 2, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
    zoomies: {
      x: [0, 15, -15, 10, -10, 0],
      y: [0, -10, -5, -15, -5, 0],
      rotate: [0, 5, -5, 8, -3, 0],
      transition: { duration: 0.8, repeat: 3 },
    },
    typing: {
      scaleY: [1, 1.01, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
      rotate: [0, 3, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -12, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 0.5, repeat: 4, ease: 'easeOut' },
    },
  };

  const tailVariants = {
    idle: {
      rotate: [-15, 15, -15],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
      rotate: [-25, 25, -25],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
    },
    confused: {
      rotate: [0, -5, 0],
      transition: { duration: 1, repeat: Infinity },
    },
    sleeping: {
      rotate: [5, 8, 5],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
    zoomies: {
      rotate: [-40, 40, -40],
      transition: { duration: 0.2, repeat: Infinity },
    },
    typing: {
      rotate: [-10, 10, -10],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
      rotate: [10, 20, 10],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    celebrating: {
      rotate: [-30, 30, -30],
      transition: { duration: 0.3, repeat: Infinity },
    },
  };

  const earVariants = {
    idle: {},
    happy: { rotate: [0, -5, 0], transition: { duration: 0.5, repeat: 2 } },
    confused: { rotate: [0, 10, -5, 0], transition: { duration: 0.8 } },
    sleeping: { rotate: [0, 5, 0], transition: { duration: 3, repeat: Infinity } },
    zoomies: { rotate: [0, -10, 10, 0], transition: { duration: 0.3, repeat: Infinity } },
    typing: {},
    thinking: { rotate: [0, 5, 0], transition: { duration: 1, repeat: Infinity } },
    celebrating: { rotate: [0, -8, 8, 0], transition: { duration: 0.4, repeat: 3 } },
  };

  const currentEyeExpr = blinking ? 'closed' : expr.leftEye;
  const currentRightEyeExpr = blinking ? 'closed' : expr.rightEye;

  return (
    <motion.div
      style={{
        width: size,
        height: size + 40,
        position: 'relative',
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="-10 -30 190 200"
        width={size}
        height={size + 40}
        style={{ overflow: 'visible' }}
      >
        {/* Effects layers */}
        <Sparkles active={mood === 'happy' || mood === 'celebrating'} />
        <ZzzBubbles active={mood === 'sleeping'} />
        <QuestionMarks active={mood === 'confused'} />
        
        {/* Speech bubble */}
        <SpeechBubble mood={mood} show={showBubble} />

        {/* Tail */}
        <motion.g
          style={{ originX: '45px', originY: '140px' }}
          variants={tailVariants}
          animate={mood}
        >
          <motion.path
            d={`M 45 135 Q 10 120 -5 90 Q -15 70 5 60`}
            stroke={colors.dark}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Body */}
        <motion.g
          variants={bodyVariants}
          animate={mood}
          style={{ originX: '80px', originY: '130px' }}
        >
          {/* Main body */}
          <ellipse cx="80" cy="115" rx="48" ry="42" fill={colors.body} />
          {/* Belly */}
          <ellipse cx="80" cy="120" rx="30" ry="28" fill={colors.light} opacity="0.6" />
          
          {/* Left paw */}
          <motion.ellipse
            cx="55" cy="148" rx="14" ry="10"
            fill={colors.body}
            stroke={colors.dark}
            strokeWidth="1"
            animate={mood === 'typing' ? { 
              y: [0, -3, 0], 
              transition: { duration: 0.3, repeat: Infinity, repeatDelay: 0.1 } 
            } : {}}
          />
          {/* Right paw */}
          <motion.ellipse
            cx="105" cy="148" rx="14" ry="10"
            fill={colors.body}
            stroke={colors.dark}
            strokeWidth="1"
            animate={mood === 'typing' ? { 
              y: [0, -3, 0], 
              transition: { duration: 0.3, repeat: Infinity, repeatDelay: 0.2, delay: 0.15 } 
            } : {}}
          />
          {/* Paw pads */}
          <circle cx="52" cy="150" r="3" fill={colors.nose} opacity="0.5" />
          <circle cx="58" cy="150" r="3" fill={colors.nose} opacity="0.5" />
          <circle cx="102" cy="150" r="3" fill={colors.nose} opacity="0.5" />
          <circle cx="108" cy="150" r="3" fill={colors.nose} opacity="0.5" />

          {/* Head */}
          <circle cx="80" cy="65" r="38" fill={colors.body} />
          
          {/* Inner face lighter area */}
          <ellipse cx="80" cy="72" rx="28" ry="24" fill={colors.light} opacity="0.3" />

          {/* Left ear */}
          <motion.g
            variants={earVariants}
            animate={mood}
            style={{ originX: '55px', originY: '40px' }}
          >
            <polygon points="50,42 42,12 68,35" fill={colors.body} stroke={colors.dark} strokeWidth="1" />
            <polygon points="52,40 46,18 64,36" fill={colors.nose} opacity="0.4" />
          </motion.g>

          {/* Right ear */}
          <motion.g
            variants={earVariants}
            animate={mood}
            style={{ originX: '105px', originY: '40px' }}
          >
            <polygon points="110,42 118,12 92,35" fill={colors.body} stroke={colors.dark} strokeWidth="1" />
            <polygon points="108,40 114,18 96,36" fill={colors.nose} opacity="0.4" />
          </motion.g>

          {/* Eyes */}
          <CatEye cx={65} cy={60} expression={currentEyeExpr} side="left" />
          <CatEye cx={95} cy={60} expression={currentRightEyeExpr} side="right" />

          {/* Nose */}
          <motion.path
            d="M 77 73 L 80 77 L 83 73 Z"
            fill={colors.nose}
            animate={mood === 'happy' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: mood === 'happy' ? Infinity : 0 }}
          />

          {/* Whiskers */}
          <g opacity="0.4" stroke="#1f2937" strokeWidth="1">
            <line x1="45" y1="70" x2="20" y2="65" />
            <line x1="45" y1="75" x2="18" y2="78" />
            <line x1="45" y1="80" x2="22" y2="88" />
            <line x1="115" y1="70" x2="140" y2="65" />
            <line x1="115" y1="75" x2="142" y2="78" />
            <line x1="115" y1="80" x2="138" y2="88" />
          </g>

          {/* Mouth */}
          <CatMouth cx={80} cy={77} expression={expr.mouth} />

          {/* Blush marks */}
          {(mood === 'happy' || mood === 'celebrating') && (
            <>
              <motion.ellipse
                cx="50" cy="72" rx="8" ry="5"
                fill="#f5a9b8"
                opacity="0.4"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.ellipse
                cx="110" cy="72" rx="8" ry="5"
                fill="#f5a9b8"
                opacity="0.4"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          {/* Accessories */}
          {accessories.includes('bowtie') && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <polygon points="68,95 80,100 80,90" fill="#f43f5e" />
              <polygon points="92,95 80,100 80,90" fill="#f43f5e" />
              <circle cx="80" cy="95" r="3" fill="#fbbf24" />
            </motion.g>
          )}

          {accessories.includes('hat') && (
            <motion.g initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <ellipse cx="80" cy="32" rx="28" ry="6" fill="#8b5cf6" />
              <rect x="64" y="8" width="32" height="24" rx="4" fill="#8b5cf6" />
              <rect x="60" y="6" width="40" height="4" rx="2" fill="#a78bfa" />
              <circle cx="80" cy="6" r="4" fill="#fbbf24" />
            </motion.g>
          )}

          {accessories.includes('glasses') && (
            <motion.g initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
              <circle cx="65" cy="60" r="12" fill="none" stroke="#1f2937" strokeWidth="2.5" />
              <circle cx="95" cy="60" r="12" fill="none" stroke="#1f2937" strokeWidth="2.5" />
              <line x1="77" y1="58" x2="83" y2="58" stroke="#1f2937" strokeWidth="2" />
              <line x1="53" y1="58" x2="46" y2="55" stroke="#1f2937" strokeWidth="2" />
              <line x1="107" y1="58" x2="114" y2="55" stroke="#1f2937" strokeWidth="2" />
            </motion.g>
          )}

          {accessories.includes('crown') && (
            <motion.g initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <polygon points="60,32 65,15 72,25 80,8 88,25 95,15 100,32" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="72" cy="28" r="2" fill="#f43f5e" />
              <circle cx="80" cy="22" r="2.5" fill="#6ee7b7" />
              <circle cx="88" cy="28" r="2" fill="#93c5fd" />
            </motion.g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
