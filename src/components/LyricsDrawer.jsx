import React, { useEffect, useRef } from 'react';

// Default lyric database for milestones
const DEFAULT_LYRICS = {
  default: [
    { time: 0, text: "🎵 (Instrumental Intro) 🎵" },
    { time: 10, text: "Every moment with you feels like a melody..." },
    { time: 25, text: "Notes of laughter, chords of care, echoing in harmony." },
    { time: 40, text: "We're building our own playlist, track by track," },
    { time: 55, text: "Looking forward to forever, never looking back." },
    { time: 70, text: "You're the rhythm of my heart, the chorus to my song." },
    { time: 85, text: "With you is exactly where I belong. ❤️" },
    { time: 100, text: "🎵 (Guitar Solo Outro) 🎵" }
  ],
  'c1': [ // Learning to ride
    { time: 0, text: "🚲 Wobbling on two wheels, clutching the handle tight..." },
    { time: 12, text: "You said 'Don't worry, I won't let go' with all your might." },
    { time: 24, text: "I pedaled faster, feeling the wind in my hair," },
    { time: 36, text: "I looked back and saw you smiling, standing right there." },
    { time: 48, text: "That day, I learned to ride, but more than that, you see..." },
    { time: 60, text: "I learned what it felt like to have someone catch me." }
  ],
  'c2': [ // Campfire chronicles
    { time: 0, text: "🔥 Crackling embers rising up to the night sky..." },
    { time: 12, text: "We sat wrapped in a blanket, watching sparks fly." },
    { time: 24, text: "You told me tales of old adventures, wild and free," },
    { time: 36, text: "While the stars listened in, shining down on you and me." },
    { time: 48, text: "With wood smoke in the air, and hot cocoa in our hands," },
    { time: 60, text: "We made our own little kingdom, in the quiet woodland bands." }
  ],
  'c3': [ // Catching first fish
    { time: 0, text: "🎣 Quiet morning by the lake, fog rising off the deep..." },
    { time: 12, text: "Waiting patiently for a bite, while the quiet forest sleeps." },
    { time: 24, text: "You taught me how to cast, how to reel, how to stand," },
    { time: 36, text: "Then the line tugged hard, and we pulled it to the sand!" },
    { time: 48, text: "A tiny little catch, but our laughs were so loud," },
    { time: 60, text: "Holding the slippery fish, you looked so incredibly proud." }
  ],
  'c4': [ // Art of honesty
    { time: 0, text: "🌟 Character isn't what we show when the world is looking on..." },
    { time: 15, text: "It's the quiet choices made, long after the spotlight's gone." },
    { time: 30, text: "You showed me what it means to be true, to stand tall and sincere," },
    { time: 45, text: "To speak with gentle honesty, letting go of doubt and fear." },
    { time: 60, text: "That integrity of yours, it shines so bright and clear." }
  ],
  't1': [ // Sunset Cafe
    { time: 0, text: "☕ A cozy wooden cabin hidden deep inside the trees..." },
    { time: 12, text: "Warm smell of roasted coffee blowing in the mountain breeze." },
    { time: 24, text: "We found a little corner, looking out at the sky," },
    { time: 36, text: "And watched the golden sunset paint the peaks, climbing high." },
    { time: 48, text: "No rush, no phones, just the clinking of our mugs," },
    { time: 60, text: "Surrounded by pine shadows and cozy, quiet hugs." }
  ],
  't2': [ // Concert
    { time: 0, text: "🎸 The drums started playing, the crowd let out a roar..." },
    { time: 12, text: "But we were in the back-row lawn, wanting nothing more." },
    { time: 24, text: "Dancing on the damp grass, popcorn in the air," },
    { time: 36, text: "Singing out our favorite lines, without a single care." },
    { time: 48, text: "Under the summer stars, matching every beat," },
    { time: 60, text: "Your hand in mine made the concert complete." }
  ],
  't3': [ // Picnic
    { time: 0, text: "🧺 Lemonade, a gingham blanket, and the sea-breeze blowing sweet..." },
    { time: 12, text: "We set up our little picnic, a perfect sunny retreat." },
    { time: 24, text: "But then the seagulls gathered, eyeing our sandwich plate," },
    { time: 36, text: "We had to shield our snacks, laughing at our fate." },
    { time: 48, text: "Sandy toes and sticky fingers, waves crashing on the shore," },
    { time: 60, text: "Simple afternoons with you, I couldn't ask for more." }
  ],
  't4': [ // Anniversary
    { time: 0, text: "✨ Dressed in our finest clothes, candlelight reflecting in your eyes..." },
    { time: 12, text: "A formal toast to another year under the beautiful skies." },
    { time: 24, text: "We talked of how we started, how we grew, how we learned," },
    { time: 36, text: "And all the sweet memories we've so beautifully earned." },
    { time: 48, text: "Here's to the chapters written, and the pages yet to write," },
    { time: 60, text: "My love for you grows stronger, with every passing night." }
  ]
};

export default function LyricsDrawer({ isOpen, onClose, currentTrack, currentTime, setCurrentTime, activeProfile }) {
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  const trackLyrics = DEFAULT_LYRICS[currentTrack?.id] || DEFAULT_LYRICS.default;

  // Find the index of the active lyric line
  let activeIndex = -1;
  for (let i = 0; i < trackLyrics.length; i++) {
    if (currentTime >= trackLyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto scroll active lyric line into center of container
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  const handleLineClick = (time) => {
    setCurrentTime(time);
  };

  return (
    <div className={`lyrics-drawer ${isOpen ? 'open' : ''} ${activeProfile?.name || 'US'}`}>
      <button className="lyrics-close-btn" onClick={onClose} title="Close Lyrics">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className="lyrics-container" ref={containerRef}>
        <div style={{ marginBottom: '24px', opacity: 0.5 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Lyrics for: {currentTrack?.title}
          </span>
        </div>

        {trackLyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          return (
            <p
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`lyric-line ${isActive ? 'active' : ''}`}
              onClick={() => handleLineClick(line.time)}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
