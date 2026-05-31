import React, { useState, useEffect, useRef } from 'react';
import IntroScreen from './components/IntroScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import LyricsDrawer from './components/LyricsDrawer';
import HomeView from './components/HomeView';
import TimelineView from './components/TimelineView';
import BlendView from './components/BlendView';
import DatePlanner from './components/DatePlanner';
import LettersView from './components/LettersView';
import MemoryVault from './components/MemoryVault';
import FullScreenPlayer from './components/FullScreenPlayer';
import './App.css';

// Database of relationship milestone tracks
const TRACKS = [
  {
    id: 'c1',
    title: 'LEARNING TO RIDE',
    artist: 'Vatsal & Muskan',
    album: 'Park Lane',
    date: 'June 15, 2023',
    year: '2023',
    duration: 180, // 3:00
    icon: '/sample-couple/Gemini_Generated_Image_1cgfo81cgfo81cgf.png',
    desc: 'Holding onto the seat, running behind me, and letting go. That was the day I learned to fly.'
  },
  {
    id: 'c2',
    title: 'CAMPFIRE CHRONICLES',
    artist: 'Vatsal & Muskan',
    album: 'Forest Retreat',
    date: 'October 12, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_1sv3a21sv3a21sv3.png',
    desc: 'Under a canopy of stars, listening to you spin tales of old adventures by the cracking fire.'
  },
  {
    id: 'c3',
    title: 'CATCHING THE FIRST FISH',
    artist: 'Vatsal & Muskan',
    album: 'Pine Lake',
    date: 'July 8, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_2f0qew2f0qew2f0q.png',
    desc: 'Patiently showing me how to cast. The look of pure pride on your face was bigger than the catch.'
  },
  {
    id: 'c4',
    title: 'THE ART OF HONESTY',
    artist: 'Vatsal & Muskan',
    album: 'Home',
    date: 'September 5, 2025',
    year: '2025',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_2skbkv2skbkv2skb.png',
    desc: 'When you showed me that doing the right thing, even when no one is looking, defines your true character.'
  },
  {
    id: 't1',
    title: 'The Sunset Café Visit',
    artist: 'Vatsal & Muskan',
    album: 'Mountain Vista Café',
    date: 'May 12, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_6jmnus6jmnus6jmn.png',
    desc: 'Finding a quiet wooden cabin café in the mountain woods and watching the pine silhouettes in the sunset glow.'
  },
  {
    id: 't2',
    title: 'Concert Under the Stars',
    artist: 'Vatsal & Muskan',
    album: 'City Amphitheater',
    date: 'August 18, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_7ax92t7ax92t7ax9.png',
    desc: 'Dancing to our favorite indie band on the lawn back-row with bags of popcorn and starry skies.'
  },
  {
    id: 't3',
    title: 'Beachside Afternoon Picnic',
    artist: 'Vatsal & Muskan',
    album: 'Sandy Shores Beach',
    date: 'July 5, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_8e16pj8e16pj8e16.png',
    desc: 'Surprise cheese board and lemonade on the warm sand, defending our sandwiches from ambitious seagulls.'
  },
  {
    id: 't4',
    title: 'Anniversary Special Gala',
    artist: 'Vatsal & Muskan',
    album: 'The Glasshouse Bistro',
    date: 'October 24, 2025',
    year: '2025',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_9gv16v9gv16v9gv1.png',
    desc: 'Celebrating our anniversary with fancy formal clothes, gourmet menus, and making plans for seasons to come.'
  }
];

export default function App() {
  const [activeProfile, setActiveProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Player States
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none'); // 'none' | 'all' | 'one'
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem('spotifyLikedSongs');
    return saved ? JSON.parse(saved) : {};
  });
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Context Ref for Ambient Synthesizer
  const audioCtxRef = useRef(null);
  const musicTimerRef = useRef(null);
  const currentChordIdx = useRef(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Save liked songs to localStorage
  useEffect(() => {
    localStorage.setItem('spotifyLikedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Sync player ticking when track is playing
  useEffect(() => {
    let interval = null;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime >= currentTrack.duration) {
            handleTrackFinished();
            return prevTime;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, shuffle, repeat]);

  // Audio synthesis: Chords Cmaj7 -> Am7 -> Fmaj7 -> G6
  const chords = [
    [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
    [110.00, 130.81, 164.81, 196.00], // A2, C3, E3, G3
    [87.31, 110.00, 130.81, 164.81],  // F2, A2, C3, E3
    [98.00, 123.47, 146.83, 164.81]   // G2, B2, D3, E3
  ];

  const playChord = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    // Do not clash with playing track
    if (isPlaying) return;

    const now = audioCtxRef.current.currentTime;
    const notes = chords[currentChordIdx.current];
    currentChordIdx.current = (currentChordIdx.current + 1) % chords.length;

    const filter = audioCtxRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    notes.forEach((freq, index) => {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.15); // arpeggiated entrance

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + index * 0.15 + 0.4); // soft fade-in
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.6); // long release

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(now + index * 0.15);
      osc.stop(now + 5.0);
    });
  };

  const startAmbientMusic = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      playChord();
      musicTimerRef.current = setInterval(playChord, 5200);
      setIsMusicPlaying(true);
    } catch (e) {
      console.warn("Could not play ambient synth", e);
    }
  };

  const stopAmbientMusic = () => {
    if (musicTimerRef.current) {
      clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setIsMusicPlaying(false);
  };

  // Toggle ambient music easily
  const handleToggleAmbient = () => {
    if (isMusicPlaying) stopAmbientMusic();
    else startAmbientMusic();
  };

  // If milestone is playing, temporarily suspend ambient synth chords
  useEffect(() => {
    if (isPlaying) {
      // Pause ambient interval when track is actively playing
      if (musicTimerRef.current) {
        clearInterval(musicTimerRef.current);
        musicTimerRef.current = null;
      }
    } else if (isMusicPlaying && !musicTimerRef.current) {
      // Resume ambient interval when track pauses
      musicTimerRef.current = setInterval(playChord, 5200);
    }
  }, [isPlaying]);

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      handlePlayTrack(TRACKS[0]);
    }
  };

  const handleTrackFinished = () => {
    if (repeat === 'one') {
      setCurrentTime(0);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (!currentTrack) return;
    let nextIdx = 0;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * TRACKS.length);
    } else {
      const currentIdx = TRACKS.findIndex(t => t.id === currentTrack.id);
      nextIdx = (currentIdx + 1) % TRACKS.length;
      // If it's the last song and repeat is none, stop playing
      if (currentIdx === TRACKS.length - 1 && repeat === 'none') {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
    }
    handlePlayTrack(TRACKS[nextIdx]);
  };

  const handlePrev = () => {
    if (!currentTrack) return;
    if (currentTime > 3) {
      setCurrentTime(0);
      return;
    }
    const currentIdx = TRACKS.findIndex(t => t.id === currentTrack.id);
    let prevIdx = currentIdx - 1;
    if (prevIdx < 0) prevIdx = TRACKS.length - 1;
    handlePlayTrack(TRACKS[prevIdx]);
  };

  const handleToggleLike = (trackId) => {
    setLikedSongs(prev => {
      const updated = { ...prev, [trackId]: !prev[trackId] };
      // Particle pop effect
      if (updated[trackId]) {
        try {
          const heart = document.createElement('div');
          heart.innerHTML = '💖';
          heart.style.position = 'fixed';
          heart.style.left = '50%';
          heart.style.top = '50%';
          heart.style.transform = 'translate(-50%, -50%)';
          heart.style.fontSize = '8rem';
          heart.style.zIndex = '9999';
          heart.style.pointerEvents = 'none';
          heart.style.animation = 'heart-pop 0.6s ease-out forwards';
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 600);
        } catch (e) {}
      }
      return updated;
    });
  };

  const handleSwitchProfile = () => {
    stopAmbientMusic();
    setActiveProfile(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setActiveTab('home');
  };

  if (!activeProfile) {
    return <IntroScreen onProfileSelect={setActiveProfile} />;
  }

  // Filter tracks for search tab query
  const filteredSearchTracks = TRACKS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-layout">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content body */}
      <div className="content-wrapper">
        <Header 
          activeProfile={activeProfile} 
          onSwitchProfile={handleSwitchProfile}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleAmbient}
        />

        {/* Search tab panel */}
        {activeTab === 'search' && (
          <div className="content-section" style={{ padding: '40px 32px' }}>
            <h1 className="playlist-name" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Search</h1>
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
              <input 
                type="text" 
                placeholder="What memory do you want to play?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#282828',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '16px 20px 16px 56px',
                  fontSize: '1rem',
                  color: '#fff',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
              <svg 
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" 
                style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {searchQuery ? (
              <div>
                <h3 className="section-title">Search Results</h3>
                <div className="recently-played-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {filteredSearchTracks.map((track) => (
                    <div 
                      key={track.id} 
                      className="recent-card"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <div className="recent-art">
                        {track.icon && (track.icon.startsWith('/') || track.icon.includes('.png')) ? (
                          <img src={track.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          track.icon || '🎵'
                        )}
                      </div>
                      <div className="recent-info">
                        <span className="recent-title">{track.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{track.album}</span>
                      </div>
                      <button className="recent-play-btn" onClick={(e) => { e.stopPropagation(); handlePlayTrack(track); }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  {filteredSearchTracks.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', padding: '16px' }}>No matches found for "{searchQuery}"</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="section-title">Browse all categories</h3>
                <div className="cards-row" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                  <div className="spotify-card" style={{ height: '140px', background: '#3f3f46', justifyContent: 'flex-end', padding: '16px' }} onClick={() => { setSearchQuery('Cozy'); }}>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-montserrat)' }}>Cozy Acoustics</span>
                  </div>
                  <div className="spotify-card" style={{ height: '140px', background: '#1e3a8a', justifyContent: 'flex-end', padding: '16px' }} onClick={() => { setSearchQuery('Trip'); }}>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-montserrat)' }}>Roadtrips</span>
                  </div>
                  <div className="spotify-card" style={{ height: '140px', background: '#be185d', justifyContent: 'flex-end', padding: '16px' }} onClick={() => { setSearchQuery('Anniversary'); }}>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-montserrat)' }}>Special Dates</span>
                  </div>
                  <div className="spotify-card" style={{ height: '140px', background: '#15803d', justifyContent: 'flex-end', padding: '16px' }} onClick={() => { setSearchQuery('First'); }}>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-montserrat)' }}>First Milestones</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'library' && (
          <div className="content-section" style={{ padding: '32px 16px 40px' }}>
            <h1 className="playlist-name" style={{ fontSize: '2rem', marginBottom: '24px' }}>Your Library</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'vault', title: 'Liked Songs', desc: 'Playlist • Memories', icon: '💖', color: 'var(--love-pink)' },
                { id: 'timeline', title: 'Our Timeline', desc: 'Playlist • Milestones', icon: '📜', color: '#f59e0b' },
                { id: 'blend', title: 'Our Blend', desc: 'Playlist • Compatibility', icon: '🧪', color: 'var(--spotify-green)' },
                { id: 'planner', title: 'Date Planner', desc: 'Podcast • Future Plans', icon: '📅', color: 'var(--accent-blue)' },
                { id: 'letter', title: 'Secret Letters', desc: 'Profile • Message Board', icon: '💌', color: 'var(--accent-purple)' }
              ].map((pl) => (
                <div 
                  key={pl.id} 
                  className="recent-card" 
                  onClick={() => setActiveTab(pl.id)}
                  style={{ 
                    padding: '12px 16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    cursor: 'pointer', 
                    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
                    borderRadius: '6px',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '4px', 
                    background: pl.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1.6rem', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    flexShrink: 0
                  }}>
                    {pl.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pl.title}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pl.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'home' && (
          <HomeView 
            activeProfile={activeProfile} 
            tracks={TRACKS}
            onPlayTrack={handlePlayTrack}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineView 
            tracks={TRACKS}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
            onTogglePlay={handleTogglePlay}
          />
        )}
        {activeTab === 'vault' && (
          <MemoryVault 
            tracks={TRACKS}
            likedSongs={likedSongs}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
            onTogglePlay={handleTogglePlay}
          />
        )}
        {activeTab === 'blend' && (
          <BlendView activeProfile={activeProfile} />
        )}
        {activeTab === 'planner' && (
          <DatePlanner />
        )}
        {activeTab === 'letter' && (
          <LettersView activeProfile={activeProfile} />
        )}
      </div>

      {/* Persistent Bottom Player */}
      <PlayerBar 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={currentTrack ? currentTrack.duration : 180}
        onNext={handleNext}
        onPrev={handlePrev}
        shuffle={shuffle}
        setShuffle={setShuffle}
        repeat={repeat}
        setRepeat={setRepeat}
        likedSongs={likedSongs}
        onToggleLike={handleToggleLike}
        lyricsOpen={lyricsOpen}
        setLyricsOpen={setLyricsOpen}
        onOpenFullScreen={() => setFullScreenOpen(true)}
      />

      {/* Synchronized Lyrics Overlay Drawer */}
      <LyricsDrawer 
        isOpen={lyricsOpen}
        onClose={() => setLyricsOpen(false)}
        currentTrack={currentTrack}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        activeProfile={activeProfile}
      />

      {/* Immersive Full Screen Player */}
      <FullScreenPlayer 
        isOpen={fullScreenOpen}
        onClose={() => setFullScreenOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        onNext={handleNext}
        onPrev={handlePrev}
        shuffle={shuffle}
        setShuffle={setShuffle}
        repeat={repeat}
        setRepeat={setRepeat}
        likedSongs={likedSongs}
        onToggleLike={handleToggleLike}
        activeProfile={activeProfile}
      />
    </div>
  );
}
