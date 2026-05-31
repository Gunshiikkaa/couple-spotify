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

// Helper to generate Spotify search URL for a track
const getSpotifyUrl = (title, artist) => {
  const query = encodeURIComponent(`${title} ${artist.split(',')[0].trim()}`);
  return `https://open.spotify.com/search/${query}`;
};

// Database of relationship milestone tracks with YouTube audio
const TRACKS = [
  {
    id: 'c1',
    title: 'Tum Se Hi',
    artist: 'Pritam, Mohit Chauhan',
    album: 'Jab We Met',
    date: 'June 15, 2023',
    year: '2023',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_1cgfo81cgfo81cgf.png',
    desc: 'Holding onto the seat, running behind me, and letting go. That was the day I learned to fly.',
    spotifyUrl: getSpotifyUrl('Tum Se Hi', 'Mohit Chauhan'),
    youtubeId: 'Cb6wuzOurPc'
  },
  {
    id: 'c2',
    title: 'Subhanallah',
    artist: 'Pritam, Sreerama Chandra',
    album: 'Yeh Jawaani Hai Deewani',
    date: 'October 12, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_1sv3a21sv3a21sv3.png',
    desc: 'Under a canopy of stars, listening to you spin tales of old adventures by the cracking fire.',
    spotifyUrl: getSpotifyUrl('Subhanallah', 'Sreerama Chandra'),
    youtubeId: 'QYO6AlxiRE4'
  },
  {
    id: 'c3',
    title: 'Raabta',
    artist: 'Pritam, Arijit Singh, Shreya Ghoshal',
    album: 'Agent Vinod',
    date: 'July 8, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_2f0qew2f0qew2f0q.png',
    desc: 'Patiently showing me how to cast. The look of pure pride on your face was bigger than the catch.',
    spotifyUrl: getSpotifyUrl('Raabta', 'Arijit Singh'),
    youtubeId: 'zlt38OOqwDc'
  },
  {
    id: 'c4',
    title: 'Tujh Mein Rab Dikhta Hai',
    artist: 'Salim-Sulaiman, Roop Kumar Rathod',
    album: 'Rab Ne Bana Di Jodi',
    date: 'September 5, 2025',
    year: '2025',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_2skbkv2skbkv2skb.png',
    desc: 'When you showed me that doing the right thing, even when no one is looking, defines your true character.',
    spotifyUrl: getSpotifyUrl('Tujh Mein Rab Dikhta Hai', 'Roop Kumar Rathod'),
    youtubeId: 'qoq8B8ThgEM'
  },
  {
    id: 't1',
    title: 'Saibo',
    artist: 'Sachin-Jigar, Tochi Raina, Shreya Ghoshal',
    album: 'Shor in the City',
    date: 'May 12, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_6jmnus6jmnus6jmn.png',
    desc: 'Finding a quiet wooden cabin café in the mountain woods and watching the pine silhouettes in the sunset glow.',
    spotifyUrl: getSpotifyUrl('Saibo', 'Tochi Raina'),
    youtubeId: '9Bmh6vaQt0s'
  },
  {
    id: 't2',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh',
    album: 'Brahmāstra',
    date: 'August 18, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_7ax92t7ax92t7ax9.png',
    desc: 'Dancing to our favorite indie band on the lawn back-row with bags of popcorn and starry skies.',
    spotifyUrl: getSpotifyUrl('Kesariya', 'Arijit Singh'),
    youtubeId: 'BddP6PYo2gs'
  },
  {
    id: 't3',
    title: 'Pehla Nasha',
    artist: 'Jatin-Lalit, Udit Narayan, Sadhana Sargam',
    album: 'Jo Jeeta Wohi Sikandar',
    date: 'July 5, 2024',
    year: '2024',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_8e16pj8e16pj8e16.png',
    desc: 'Surprise cheese board and lemonade on the warm sand, defending our sandwiches from ambitious seagulls.',
    spotifyUrl: getSpotifyUrl('Pehla Nasha', 'Udit Narayan'),
    youtubeId: 'ODu7OyAqK-Q'
  },
  {
    id: 't4',
    title: 'Agar Tum Saath Ho',
    artist: 'A.R. Rahman, Arijit Singh, Alka Yagnik',
    album: 'Tamasha',
    date: 'October 24, 2025',
    year: '2025',
    duration: 180,
    icon: '/sample-couple/Gemini_Generated_Image_9gv16v9gv16v9gv1.png',
    desc: 'Celebrating our anniversary with fancy formal clothes, gourmet menus, and making plans for seasons to come.',
    spotifyUrl: getSpotifyUrl('Agar Tum Saath Ho', 'Arijit Singh'),
    youtubeId: 'sK7riqg2mr4'
  }
];

export default function App() {
  const [activeProfile, setActiveProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Player States
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(180);
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

  // YouTube Player Refs
  const ytPlayerRef = useRef(null);
  const ytReadyRef = useRef(false);
  const ytTimePollerRef = useRef(null);
  const pendingTrackRef = useRef(null);
  const isPlayingRef = useRef(false);
  const currentTrackRef = useRef(null);
  const shuffleRef = useRef(false);
  const repeatRef = useRef('none');

  // Keep refs in sync with state
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);

  // Initialize YouTube IFrame Player API
  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      ytPlayerRef.current = new window.YT.Player('yt-player', {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1
        },
        events: {
          onReady: () => {
            ytReadyRef.current = true;
            // If a track was queued before player was ready, play it now
            if (pendingTrackRef.current) {
              const track = pendingTrackRef.current;
              pendingTrackRef.current = null;
              loadYouTubeTrack(track);
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState.ENDED === 0
            if (event.data === 0) {
              handleTrackFinishedYT();
            }
          },
          onError: (event) => {
            console.warn('YouTube player error:', event.data);
          }
        }
      });
    };

    // YouTube API might already be loaded or we wait for the callback
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (ytTimePollerRef.current) clearInterval(ytTimePollerRef.current);
    };
  }, []);

  // Load and play a YouTube track
  const loadYouTubeTrack = (track) => {
    if (!ytReadyRef.current || !ytPlayerRef.current) {
      pendingTrackRef.current = track;
      return;
    }
    try {
      ytPlayerRef.current.loadVideoById({
        videoId: track.youtubeId,
        startSeconds: 0
      });
    } catch (e) {
      console.warn('Failed to load YouTube track:', e);
    }
  };

  // Start polling YouTube player for currentTime & duration
  const startYTPoller = () => {
    if (ytTimePollerRef.current) clearInterval(ytTimePollerRef.current);
    ytTimePollerRef.current = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const t = ytPlayerRef.current.getCurrentTime();
          const d = ytPlayerRef.current.getDuration();
          if (t !== undefined && !isNaN(t)) setCurrentTime(t);
          if (d && !isNaN(d) && d > 0) setTrackDuration(d);
        } catch (e) {}
      }
    }, 500);
  };

  const stopYTPoller = () => {
    if (ytTimePollerRef.current) {
      clearInterval(ytTimePollerRef.current);
      ytTimePollerRef.current = null;
    }
  };

  // Handle track finished from YouTube player state change
  const handleTrackFinishedYT = () => {
    const rep = repeatRef.current;
    const shuf = shuffleRef.current;
    const ct = currentTrackRef.current;
    if (rep === 'one') {
      // Replay same track
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
      }
      setCurrentTime(0);
    } else {
      // Go to next track
      if (!ct) return;
      let nextIdx = 0;
      if (shuf) {
        nextIdx = Math.floor(Math.random() * TRACKS.length);
      } else {
        const currentIdx = TRACKS.findIndex(t => t.id === ct.id);
        nextIdx = (currentIdx + 1) % TRACKS.length;
        if (currentIdx === TRACKS.length - 1 && rep === 'none') {
          setIsPlaying(false);
          setCurrentTime(0);
          stopYTPoller();
          return;
        }
      }
      const nextTrack = TRACKS[nextIdx];
      setCurrentTrack(nextTrack);
      setCurrentTime(0);
      setIsPlaying(true);
      loadYouTubeTrack(nextTrack);
    }
  };

  // Browser History API integration to prevent exit on Back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        // Return to Intro screen if no history state is left
        stopAmbientMusic();
        if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
          try { ytPlayerRef.current.pauseVideo(); } catch(e) {}
        }
        stopYTPoller();
        setActiveProfile(null);
        setCurrentTrack(null);
        setIsPlaying(false);
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const changeTab = (tab) => {
    setActiveTab(tab);
    window.history.pushState({ tab }, '', `#${tab}`);
  };

  // Save liked songs to localStorage
  useEffect(() => {
    localStorage.setItem('spotifyLikedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Sync YouTube play/pause with isPlaying state
  useEffect(() => {
    if (!ytPlayerRef.current || !ytReadyRef.current) return;
    try {
      if (isPlaying && currentTrack) {
        const state = ytPlayerRef.current.getPlayerState();
        // YT.PlayerState: PLAYING=1, PAUSED=2, BUFFERING=3, CUED=5
        if (state === 2 || state === 5) {
          ytPlayerRef.current.playVideo();
        }
        startYTPoller();
      } else {
        if (typeof ytPlayerRef.current.pauseVideo === 'function') {
          ytPlayerRef.current.pauseVideo();
        }
        stopYTPoller();
      }
    } catch (e) {}
  }, [isPlaying, currentTrack]);

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
    setTrackDuration(track.duration || 180);
    setIsPlaying(true);
    loadYouTubeTrack(track);
    startYTPoller();
  };

  const handleTogglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      handlePlayTrack(TRACKS[0]);
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
      if (currentIdx === TRACKS.length - 1 && repeat === 'none') {
        setIsPlaying(false);
        setCurrentTime(0);
        stopYTPoller();
        return;
      }
    }
    handlePlayTrack(TRACKS[nextIdx]);
  };

  const handlePrev = () => {
    if (!currentTrack) return;
    if (currentTime > 3) {
      // Seek to beginning of current track
      setCurrentTime(0);
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        try { ytPlayerRef.current.seekTo(0, true); } catch(e) {}
      }
      return;
    }
    const currentIdx = TRACKS.findIndex(t => t.id === currentTrack.id);
    let prevIdx = currentIdx - 1;
    if (prevIdx < 0) prevIdx = TRACKS.length - 1;
    handlePlayTrack(TRACKS[prevIdx]);
  };

  // Seek handler for progress bar — syncs YouTube player
  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try { ytPlayerRef.current.seekTo(newTime, true); } catch(e) {}
    }
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

  const handleProfileSelect = (profile) => {
    setActiveProfile(profile);
    window.history.pushState({ tab: 'home' }, '', '#home');
  };

  const handleSwitchProfile = () => {
    stopAmbientMusic();
    setActiveProfile(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setActiveTab('home');
    window.history.pushState(null, '', window.location.pathname);
  };

  if (!activeProfile) {
    return <IntroScreen onProfileSelect={handleProfileSelect} />;
  }

  // Filter tracks for search tab query
  const filteredSearchTracks = TRACKS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-layout">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={changeTab} />

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
                  onClick={() => changeTab(pl.id)}
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
            setActiveTab={changeTab}
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
        setCurrentTime={handleSeek}
        duration={trackDuration}
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
        setCurrentTime={handleSeek}
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
        setCurrentTime={handleSeek}
        duration={trackDuration}
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
