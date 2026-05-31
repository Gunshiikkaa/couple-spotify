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

export default function FullScreenPlayer({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration: durationProp,
  onNext,
  onPrev,
  shuffle,
  setShuffle,
  repeat,
  setRepeat,
  likedSongs,
  onToggleLike,
  activeProfile
}) {
  const lyricsContainerRef = useRef(null);
  const activeLineRef = useRef(null);
  const progressBarRef = useRef(null);

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

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLineClick = (time) => {
    setCurrentTime(time);
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !currentTrack) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    setCurrentTime(percentage * duration);
  };

  if (!currentTrack) return null;

  const duration = durationProp || currentTrack.duration || 180;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = !!likedSongs[currentTrack.id];

  return (
    <div className={`full-screen-player ${isOpen ? 'open' : ''} ${activeProfile?.name || 'US'}`}>
      {/* Top Header Row */}
      <div className="fsp-header">
        <button className="fsp-btn-minimize" onClick={onClose} title="Minimize">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div className="fsp-header-title-wrapper">
          <span className="fsp-header-sub">PLAYING FROM PLAYLIST</span>
          <div className="fsp-header-title">Our Timeline 📜</div>
        </div>

        <div style={{ width: '40px' }} /> {/* Spacer */}
      </div>

      {/* Main Split Panel Content */}
      <div className="fsp-body">
        {/* Left Side: Artwork, Meta, Like */}
        <div className="fsp-left">
          <div className={`fsp-art-wrapper ${isPlaying ? 'playing' : ''}`}>
            {currentTrack.icon && (currentTrack.icon.startsWith('/') || currentTrack.icon.includes('.png')) ? (
              <img src={currentTrack.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
            ) : (
              currentTrack.icon || '🎵'
            )}
          </div>
          
          <div className="fsp-metadata">
            <div style={{ overflow: 'hidden', paddingRight: '16px' }}>
              <h2 className="fsp-track-title">{currentTrack.title}</h2>
              <div className="fsp-track-artist">{currentTrack.album} • {currentTrack.year}</div>
            </div>
            
            <button 
              className={`player-like-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => onToggleLike(currentTrack.id)}
              style={{ padding: '8px' }}
              title={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side: Scrollable Synchronized Lyrics */}
        <div className="fsp-right" ref={lyricsContainerRef}>
          {trackLyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            return (
              <p
                key={idx}
                ref={isActive ? activeLineRef : null}
                className={`lyric-line ${isActive ? 'active' : ''}`}
                onClick={() => handleLineClick(line.time)}
                style={{ fontSize: '2rem', padding: '6px 0' }}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="fsp-footer">
        {/* Progress Bar */}
        <div className="fsp-progress-row">
          <span className="progress-time">{formatTime(currentTime)}</span>
          <div 
            className="progress-slider-outer" 
            ref={progressBarRef}
            onClick={handleProgressClick}
            style={{ height: '6px' }}
          >
            <div className="progress-slider-inner" style={{ width: `${progressPercent}%` }} />
            <div className="progress-handle" style={{ left: `${progressPercent}%`, display: 'block' }} />
          </div>
          <span className="progress-time">{formatTime(duration)}</span>
        </div>

        {/* Playback Controls */}
        <div className="fsp-controls-row">
          {/* Shuffle */}
          <button 
            className={`control-btn ${shuffle ? 'active' : ''}`}
            onClick={() => setShuffle(!shuffle)}
            style={{ padding: '8px' }}
            title="Shuffle"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
              <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
          </button>

          {/* Previous */}
          <button className="control-btn" onClick={onPrev} style={{ padding: '8px' }} title="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19 20 9 12 19 4 19 20"/>
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button 
            className="fsp-play-btn" 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translateX(1px)' }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button className="control-btn" onClick={onNext} style={{ padding: '8px' }} title="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 4 15 12 5 20 5 4"/>
              <line x1="19" y1="19" x2="19" y2="5" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </button>

          {/* Repeat */}
          <button 
            className={`control-btn ${repeat !== 'none' ? 'active' : ''}`}
            onClick={() => {
              if (repeat === 'none') setRepeat('all');
              else if (repeat === 'all') setRepeat('one');
              else setRepeat('none');
            }}
            style={{ padding: '8px' }}
            title={repeat === 'one' ? 'Repeat One' : repeat === 'all' ? 'Repeat All' : 'Enable Repeat'}
          >
            {repeat === 'one' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                <text x="9" y="15" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">1</text>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
