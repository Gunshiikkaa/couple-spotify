import React, { useRef } from 'react';

export default function PlayerBar({
  currentTrack,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  onNext,
  onPrev,
  shuffle,
  setShuffle,
  repeat,
  setRepeat,
  likedSongs,
  onToggleLike,
  lyricsOpen,
  setLyricsOpen,
  onOpenFullScreen
}) {
  const progressBarRef = useRef(null);

  // Format seconds to MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate percentage of progress
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle clicking on progress bar to seek
  const handleProgressClick = (e) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    setCurrentTime(percentage * duration);
  };

  if (!currentTrack) {
    return (
      <div className="player-bar" style={{ justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No track selected. Click a memory to play.</p>
      </div>
    );
  }

  const isLiked = !!likedSongs[currentTrack.id];

  return (
    <div className="player-bar">
      {/* Left side: Track details */}
      <div className="player-track-info">
        <div 
          className={`player-art ${isPlaying ? 'playing' : ''}`}
          onClick={onOpenFullScreen}
          title="Expand"
        >
          {currentTrack.icon || '🎵'}
        </div>
        <div className="player-metadata">
          <span className="player-track-name">{currentTrack.title}</span>
          <span className="player-track-artist">{currentTrack.album} • {currentTrack.year}</span>
        </div>
        <button 
          className={`player-like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onToggleLike(currentTrack.id)}
          title={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Center side: Controls and Progress */}
      <div className="player-controls-container">
        <div className="player-buttons">
          {/* Shuffle */}
          <button 
            className={`control-btn ${shuffle ? 'active' : ''}`}
            onClick={() => setShuffle(!shuffle)}
            title="Shuffle"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
              <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
          </button>
          
          {/* Previous */}
          <button className="control-btn" onClick={onPrev} title="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19 20 9 12 19 4 19 20"/>
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button 
            className="control-btn-play" 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translateX(1px)' }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button className="control-btn" onClick={onNext} title="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
            title={repeat === 'one' ? 'Repeat One' : repeat === 'all' ? 'Repeat All' : 'Enable Repeat'}
          >
            {repeat === 'one' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                <text x="9" y="15" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">1</text>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="player-progress-bar">
          <span className="progress-time">{formatTime(currentTime)}</span>
          <div 
            className="progress-slider-outer" 
            ref={progressBarRef}
            onClick={handleProgressClick}
          >
            <div className="progress-slider-inner" style={{ width: `${progressPercent}%` }} />
            <div className="progress-handle" style={{ left: `${progressPercent}%` }} />
          </div>
          <span className="progress-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right side: Actions (Lyrics, Volume) */}
      <div className="player-actions">
        {/* Lyrics Button */}
        <button 
          className={`action-btn ${lyricsOpen ? 'active' : ''}`}
          onClick={() => setLyricsOpen(!lyricsOpen)}
          title="Lyrics"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
        </button>

        {/* Volume */}
        <div className="volume-bar">
          <button className="action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>
          <div className="volume-slider-outer">
            <div className="volume-slider-inner" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
