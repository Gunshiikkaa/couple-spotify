import React, { useState, useEffect } from 'react';

export default function HomeView({ activeProfile, tracks, onPlayTrack, setActiveTab }) {
  const [greeting, setGreeting] = useState('Good morning');
  
  // Spotlight Story States (from localStorage)
  const [isEditing, setIsEditing] = useState(false);
  const [spotlightTitle, setSpotlightTitle] = useState(() => 
    localStorage.getItem('spotifySpotlightTitle') || "THE MOMENT THAT CHANGED EVERYTHING"
  );
  const [spotlightSubtitle, setSpotlightSubtitle] = useState(() => 
    localStorage.getItem('spotifySpotlightSubtitle') || "OUR FEATURED HIT STORY"
  );
  const [spotlightText, setSpotlightText] = useState(() => 
    localStorage.getItem('spotifySpotlightText') || "It was a quiet Tuesday morning in October. I looked into your eyes for the first time, and in that split second, the weight of the entire universe shifted. I made a silent vow right then and there: to cherish you, support you, and love you more than life itself. Every single moment since that day has been my greatest honor."
  );
  const [spotlightQuote, setSpotlightQuote] = useState(() => 
    localStorage.getItem('spotifySpotlightQuote') || "You never know the value of a moment, until it becomes a memory that stays with you forever."
  );
  const [spotlightIcon, setSpotlightIcon] = useState(() => 
    localStorage.getItem('spotifySpotlightIcon') || "❤️"
  );

  useEffect(() => {
    localStorage.setItem('spotifySpotlightTitle', spotlightTitle);
    localStorage.setItem('spotifySpotlightSubtitle', spotlightSubtitle);
    localStorage.setItem('spotifySpotlightText', spotlightText);
    localStorage.setItem('spotifySpotlightQuote', spotlightQuote);
    localStorage.setItem('spotifySpotlightIcon', spotlightIcon);
  }, [spotlightTitle, spotlightSubtitle, spotlightText, spotlightQuote, spotlightIcon]);

  // Set greeting based on local time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Filter 6 tracks for Recently Played grid
  const recentTracks = tracks.slice(0, 6);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="home-view">
      {/* Hero section */}
      <div className={`dashboard-hero ${activeProfile?.name || 'US'}`}>
        <span className="hero-subtitle">COUPLE COMPILATION</span>
        <h1 className="hero-title">
          {greeting}, {activeProfile?.name === 'US' ? 'Vatsal & Muskan' : activeProfile?.name}
        </h1>
        <div className="hero-meta">
          <div className="hero-circle-art">🎵</div>
          <span>Made for you • <strong>5 playlists</strong> • {tracks.length} memories</span>
        </div>
      </div>

      <div className="content-section">
        {/* Recently Played 2x3 Grid */}
        <h2 className="section-title">Recently Played</h2>
        <div className="recently-played-grid">
          {recentTracks.map((track) => (
            <div 
              key={track.id} 
              className="recent-card"
              onClick={() => onPlayTrack(track)}
            >
              <div className="recent-art">
                {track.icon || '🎵'}
              </div>
              <div className="recent-info">
                <span className="recent-title">{track.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{track.album}</span>
              </div>
              <button 
                className="recent-play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayTrack(track);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Billboard Spotlight */}
        <h2 className="section-title">Featured Album of the Month</h2>
        <div className="spotlight-banner">
          <div className="spotlight-art-side">
            {spotlightIcon}
            <div className="spotlight-badge">FEATURED</div>
          </div>
          <div className="spotlight-text-side">
            <span className="spotlight-meta">{spotlightSubtitle}</span>
            <h3 className="spotlight-heading">{spotlightTitle}</h3>
            <p className="spotlight-desc">"{spotlightText}"</p>
            <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--spotify-green)', marginBottom: '24px' }}>
              — "{spotlightQuote}"
            </p>
            <div className="spotlight-buttons">
              <button 
                className="spotlight-btn-main"
                onClick={() => onPlayTrack(tracks[0])}
              >
                Play Album
              </button>
              <button 
                className="spotlight-btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Customize Story
              </button>
            </div>
          </div>
        </div>

        {/* Made for Us Grid of playlists */}
        <h2 className="section-title">Made For You</h2>
        <div className="cards-row">
          {/* Blend Card */}
          <div className="spotify-card" onClick={() => setActiveTab('blend')}>
            <div className="card-art-wrapper" style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--love-pink) 100%)' }}>
              🧪
              <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('blend'); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
            <span className="card-title">Our Blend</span>
            <span className="card-desc">Check out our music compatibility percentage, shared genres, and shared traits.</span>
          </div>

          {/* Vatsal's Favorites Card */}
          <div className="spotify-card" onClick={() => setActiveTab('letter')}>
            <div className="card-art-wrapper" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #000000 100%)' }}>
              👔
              <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('letter'); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
            <span className="card-title">Vatsal's Top Mix</span>
            <span className="card-desc">Warm acoustic sweeps, romantic whispers, and notes of appreciation for Muskan.</span>
          </div>

          {/* Muskan's Favorites Card */}
          <div className="spotify-card" onClick={() => setActiveTab('letter')}>
            <div className="card-art-wrapper" style={{ background: 'linear-gradient(135deg, #881337 0%, #000000 100%)' }}>
              👑
              <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('letter'); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
            <span className="card-title">Muskan's Top Mix</span>
            <span className="card-desc">Cozy evening tracks, heartfelt ballads, and sweet letters for Vatsal.</span>
          </div>

          {/* Roadtrip Mix */}
          <div className="spotify-card" onClick={() => setActiveTab('timeline')}>
            <div className="card-art-wrapper" style={{ background: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)' }}>
              🚗
              <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('timeline'); }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
            <span className="card-title">Our Roadtrip Mix</span>
            <span className="card-desc">Tracks we sing out loud while wandering off to new adventures and mountain cabins.</span>
          </div>
        </div>
      </div>

      {/* Customize Spotlight Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <span className="modal-title">Customize Featured Story</span>
                <button type="button" className="modal-close" onClick={() => setIsEditing(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={spotlightTitle} 
                    onChange={(e) => setSpotlightTitle(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subtitle / Album Category</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={spotlightSubtitle} 
                    onChange={(e) => setSpotlightSubtitle(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Story Description</label>
                  <textarea 
                    className="form-textarea"
                    rows="4"
                    value={spotlightText} 
                    onChange={(e) => setSpotlightText(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Inspirational Quote</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={spotlightQuote} 
                    onChange={(e) => setSpotlightQuote(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cover Emoji / Art</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={spotlightIcon} 
                    onChange={(e) => setSpotlightIcon(e.target.value)} 
                    maxLength="5"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="modal-btn-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
