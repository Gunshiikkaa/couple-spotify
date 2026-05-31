import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function BlendView({ activeProfile }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const cardRef = useRef(null);
  const compatibilityScore = 98.4;

  const sharedGenres = [
    { name: "Cozy Acoustics ☕", score: 95, desc: "A joint love for slow morning melodies, coffee shops, and soft acoustic guitar." },
    { name: "Late Night Beats 🌙", score: 88, desc: "Driving along empty streets under yellow lamps, talking about everything and nothing." },
    { name: "Epic Anthems 🚗", score: 82, desc: "Singing at the top of our lungs with the windows down, climbing mountain curves." },
    { name: "Sweet Ballads 💖", score: 92, desc: "Soft piano lines, sappy lyrics, and promises made under warm blankets." }
  ];

  const handleGenerateCard = () => {
    // Play a sweet ring sound (C major chord sweep)
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.05 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + 1.5);
        });
      }
    } catch (e) {}
    
    setShowShareModal(true);
  };

  const handleDownload = () => {
    if (cardRef.current) {
      // Temporarily hide the close button or ensure it is not inside cardRef
      html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Double quality for premium crisp image downloads
        logging: false,
        useCORS: true
      }).then(canvas => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `SpotiLove-Blend-Card.png`;
        link.href = image;
        link.click();
      });
    }
  };

  return (
    <div className="blend-container">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span className="hero-subtitle" style={{ color: 'var(--spotify-green)' }}>MADE FOR US</span>
        <h1 className="playlist-name" style={{ fontSize: '3rem', margin: '8px 0' }}>Our Music Blend</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          We compared the tracks of Vatsal & Muskan. Here is how your musical souls align.
        </p>
      </div>

      {/* Overlapping glowing blend circles */}
      <div className="blend-visualizer">
        <div className="blend-circle circle-he">
          <span style={{ transform: 'translateX(-15px)' }}>👔</span>
        </div>
        <div className="blend-circle circle-she">
          <span style={{ transform: 'translateX(15px)' }}>👑</span>
        </div>
        <div className="blend-compatibility-badge">
          <span className="blend-comp-number">{compatibilityScore}%</span>
          <span className="blend-comp-lbl">Match</span>
        </div>
      </div>

      {/* Blend Taste Profile Report */}
      <div className="blend-report">
        <h3 className="blend-report-title">Our Shared Taste Profile</h3>
        
        <div className="blend-genres-row">
          {sharedGenres.map((genre, idx) => (
            <div key={idx} className="genre-bar-item">
              <div className="genre-bar-lbl">
                <span>{genre.name}</span>
                <span style={{ color: 'var(--love-pink)' }}>{genre.score}% Similarity</span>
              </div>
              <div className="genre-track-outer">
                <div 
                  className="genre-track-inner" 
                  style={{ width: `${genre.score}%` }} 
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                {genre.desc}
              </span>
            </div>
          ))}
        </div>

        <div className="blend-fun-fact">
          <strong>🔥 BLEND FUN FACT:</strong> Your music tastes overlap on <strong>94% acoustic romantic ballads</strong>. Vatsal tends to introduce upbeat indie rhythms, while Muskan anchors the list with emotional, deep lyrical tracks. Together, they create a perfect late-evening soundscape.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
          <button 
            className="spotlight-btn-main" 
            style={{ backgroundColor: 'var(--spotify-green)', color: '#000', padding: '14px 32px' }}
            onClick={handleGenerateCard}
          >
            Generate Blend Card
          </button>
        </div>
      </div>

      {/* Generated Blend Card Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '380px', 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              border: '2px solid var(--spotify-green)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 0 30px rgba(29, 185, 84, 0.4)'
            }}
          >
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <button 
                className="modal-close" 
                onClick={() => setShowShareModal(false)}
                style={{ position: 'absolute', right: '0', top: '-10px', fontSize: '1.25rem', zIndex: 10 }}
              >
                ✕
              </button>
              
              {/* Card wrapper to download */}
              <div 
                ref={cardRef} 
                style={{ 
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                  padding: '16px 8px',
                  borderRadius: '12px'
                }}
              >
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', margin: '0 auto 12px', overflow: 'hidden', border: '2px solid var(--spotify-green)', boxShadow: '0 0 10px rgba(29, 185, 84, 0.4)' }}>
                  <img src="/sample-couple/Gemini_Generated_Image_wyjtibwyjtibwyjt.png" alt="US" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '4px', color: '#fff' }}>SpotiLove Blend</h2>
                <span style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '20px' }}>
                  VATSAL + MUSKAN
                </span>

                {/* Card visual representation */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '24px 16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #fff', zIndex: 1, overflow: 'hidden' }}>
                      <img src="/sample-couple/Gemini_Generated_Image_unc07lunc07lunc0.png" alt="Vatsal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-15px', zIndex: 2, overflow: 'hidden' }}>
                      <img src="/sample-couple/Gemini_Generated_Image_w10zbaw10zbaw10z.png" alt="Muskan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-montserrat)', color: 'var(--spotify-green)' }}>
                    {compatibilityScore}%
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#fff', display: 'block', marginTop: '4px' }}>
                    COMPATIBILITY SCORE
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.4 }}>
                    "We match on cozy coffee store dates, long drives, and acoustic whispers. Our love genre is defined as Cozy-Romantic-Acoustics."
                  </p>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--spotify-green)', fontWeight: 800 }}>
                  💖 CRAFTED WITH LOVE FOREVER 💖
                </div>
              </div>

              <button 
                className="modal-btn-submit" 
                style={{ width: '100%', marginTop: '20px', borderRadius: '4px', backgroundColor: 'var(--spotify-green)', color: '#000' }}
                onClick={handleDownload}
              >
                Download Card
              </button>
              
              <button 
                className="modal-btn-cancel" 
                style={{ width: '100%', marginTop: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 700 }}
                onClick={() => setShowShareModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
