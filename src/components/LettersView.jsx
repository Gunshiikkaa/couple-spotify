import React, { useState, useEffect } from 'react';

const DEFAULT_BIO_VATSAL = "Vatsal is a legendary compiler of laughter and programmer of peace. Established in 2023, he rose to popularity in Muskan's heart through his signature bad jokes, expert late-night driving skills, and an unparalleled ability to offer warm hugs when life gets busy. In his downtime, he specializes in eating leftovers, assembling sofas, and defending sandwiches from ambitious beachside seagulls.";

const DEFAULT_BIO_MUSKAN = "Muskan is a critically acclaimed sovereign of smiles and chief executive of warmth. Widely recognized in Vatsal's heart as the greatest thing to ever happen, she dominates the charts with her glowing laugh, insightful advice, and cozy presence. Her artistic influences include hot chocolate mugs, stargazing, mountain cafés, and keeping Vatsal on track.";

const DEFAULT_LETTER_VATSAL = "Dear Muskan,\n\nFrom the moment I met you on that quiet Tuesday, my life has felt like a beautiful song. You are the rhythm that keeps me grounded and the melody that brings joy to my days. Every date, road trip, and simple afternoon picnic we share is a memory I cherish more than anything.\n\nThank you for being my partner, my listener, and my best friend. Here's to writing many more albums of memories together.\n\nWith all my love,\nVatsal";

const DEFAULT_LETTER_MUSKAN = "Dear Vatsal,\n\nYou are my safe haven and my favorite song. Looking back at everything we've built—from fixing our apartment furniture to stargazing under cold nights—I am so incredibly proud of us.\n\nThank you for always catching me, making me laugh, and showing me what true honesty looks like. You define my world, and I love you more than words can express.\n\nWith all my heart,\nMuskan";

export default function LettersView({ activeProfile }) {
  const [selectedArtist, setSelectedArtist] = useState(activeProfile?.name === 'Muskan' ? 'vatsal' : 'muskan');
  const [activeSubTab, setActiveSubTab] = useState('bio');
  
  // Letter storage states
  const [letterVatsal, setLetterVatsal] = useState(() => 
    localStorage.getItem('letterFromVatsal') || DEFAULT_LETTER_VATSAL
  );
  const [letterMuskan, setLetterMuskan] = useState(() => 
    localStorage.getItem('letterFromMuskan') || DEFAULT_LETTER_MUSKAN
  );
  const [bioVatsal, setBioVatsal] = useState(() => 
    localStorage.getItem('bioVatsal') || DEFAULT_BIO_VATSAL
  );
  const [bioMuskan, setBioMuskan] = useState(() => 
    localStorage.getItem('bioMuskan') || DEFAULT_BIO_MUSKAN
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editBio, setEditBio] = useState('');

  useEffect(() => {
    localStorage.setItem('letterFromVatsal', letterVatsal);
    localStorage.setItem('letterFromMuskan', letterMuskan);
    localStorage.setItem('bioVatsal', bioVatsal);
    localStorage.setItem('bioMuskan', bioMuskan);
  }, [letterVatsal, letterMuskan, bioVatsal, bioMuskan]);

  const handleEditClick = () => {
    if (selectedArtist === 'vatsal') {
      setEditText(letterVatsal);
      setEditBio(bioVatsal);
    } else {
      setEditText(letterMuskan);
      setEditBio(bioMuskan);
    }
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedArtist === 'vatsal') {
      setLetterVatsal(editText);
      setBioVatsal(editBio);
    } else {
      setLetterMuskan(editText);
      setBioMuskan(editBio);
    }
    setIsEditing(false);
  };

  const isVatsal = selectedArtist === 'vatsal';
  const currentArtistName = isVatsal ? 'Vatsal' : 'Muskan';
  const listenerName = isVatsal ? 'Muskan' : 'Vatsal';
  const currentBio = isVatsal ? bioVatsal : bioMuskan;
  const currentLetter = isVatsal ? letterVatsal : letterMuskan;
  const currentGradient = isVatsal 
    ? 'linear-gradient(180deg, #1e3a8a 0%, #121212 100%)' 
    : 'linear-gradient(180deg, #881337 0%, #121212 100%)';

  return (
    <div className="letters-view">
      {/* Artist Select Bar */}
      <div style={{ display: 'flex', gap: '12px', padding: '24px 32px 0' }}>
        <button 
          className="spotlight-btn-edit" 
          style={{ 
            borderColor: selectedArtist === 'vatsal' ? 'var(--spotify-green)' : 'var(--text-muted)',
            color: selectedArtist === 'vatsal' ? '#fff' : 'var(--text-muted)',
            backgroundColor: selectedArtist === 'vatsal' ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
            borderRadius: '20px',
            padding: '8px 20px'
          }}
          onClick={() => { setSelectedArtist('vatsal'); setActiveSubTab('bio'); }}
        >
          👔 Vatsal
        </button>
        <button 
          className="spotlight-btn-edit" 
          style={{ 
            borderColor: selectedArtist === 'muskan' ? 'var(--spotify-green)' : 'var(--text-muted)',
            color: selectedArtist === 'muskan' ? '#fff' : 'var(--text-muted)',
            backgroundColor: selectedArtist === 'muskan' ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
            borderRadius: '20px',
            padding: '8px 20px'
          }}
          onClick={() => { setSelectedArtist('muskan'); setActiveSubTab('bio'); }}
        >
          👑 Muskan
        </button>
      </div>

      {/* Spotify Artist Header */}
      <div className="artist-header" style={{ backgroundImage: currentGradient }}>
        <div className="artist-header-content">
          <div className="artist-verified">
            <span className="artist-verified-badge">✓</span>
            <span>Verified Artist</span>
          </div>
          <h1 className="artist-name">{currentArtistName}</h1>
          <span className="artist-listeners">1 monthly listener ({listenerName} ❤️)</span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="artist-nav-tabs">
        <button 
          className={`artist-tab-btn ${activeSubTab === 'bio' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('bio')}
        >
          About The Artist
        </button>
        <button 
          className={`artist-tab-btn ${activeSubTab === 'letter' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('letter')}
        >
          Letters to You
        </button>
        <button 
          className={`artist-tab-btn ${activeSubTab === 'snapshots' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('snapshots')}
        >
          Polaroids
        </button>
      </div>

      {/* Tab Panels */}
      <div className="artist-body">
        {activeSubTab === 'bio' && (
          <div className="artist-about-section">
            <div className="about-bio-card" style={{ background: isVatsal ? 'linear-gradient(135deg, #1e3a8a, #000)' : 'linear-gradient(135deg, #881337, #000)' }}>
              <div className="about-bio-content">
                <span className="about-bio-lbl">ARTIST SPOTLIGHT BIO</span>
                <p className="about-bio-txt">
                  {currentBio}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800 }}>About {currentArtistName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                This is a summary of the artist's contributions to the SpotiLove relationship compilation. Every date cataloged, smile generated, and song shared is compiled into their official artist statistics.
              </p>
              <button 
                className="spotlight-btn-edit" 
                style={{ width: 'fit-content' }}
                onClick={handleEditClick}
              >
                Edit Bio & Letters
              </button>
            </div>
          </div>
        )}

        {activeSubTab === 'letter' && (
          <div>
            <div className="letter-card">
              <h3 className="letter-title">Message from {currentArtistName}</h3>
              <div className="letter-paragraphs">
                {currentLetter.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <button className="spotlight-btn-main" onClick={handleEditClick}>
              Update Message
            </button>
          </div>
        )}

        {activeSubTab === 'snapshots' && (
          <div>
            <h3 className="section-title">Memory Polaroids</h3>
            <div className="cards-row">
              <div className="spotify-card">
                <div className="card-art-wrapper" style={{ background: '#3e3e3e', fontSize: '2.5rem' }}>📷</div>
                <span className="card-title">Summer Trip</span>
                <span className="card-desc">Holding hands under the sunset cafe terrace.</span>
              </div>
              <div className="spotify-card">
                <div className="card-art-wrapper" style={{ background: '#3e3e3e', fontSize: '2.5rem' }}>🏕️</div>
                <span className="card-title">Stargazing Camp</span>
                <span className="card-desc">Wrapped in wool blankets by the campfire.</span>
              </div>
              <div className="spotify-card">
                <div className="card-art-wrapper" style={{ background: '#3e3e3e', fontSize: '2.5rem' }}>🏡</div>
                <span className="card-title">New Home Vibe</span>
                <span className="card-desc">Assembly instructions scattered all over the rug.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Bio and Letter Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <span className="modal-title">Edit {currentArtistName}'s Profile</span>
                <button type="button" className="modal-close" onClick={() => setIsEditing(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Artist Bio</label>
                  <textarea 
                    className="form-textarea"
                    rows="4"
                    value={editBio} 
                    onChange={(e) => setEditBio(e.target.value)} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Letter Message to Partner</label>
                  <textarea 
                    className="form-textarea"
                    rows="8"
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)} 
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
