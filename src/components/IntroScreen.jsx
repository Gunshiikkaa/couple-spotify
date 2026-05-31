import React, { useState } from 'react';

export default function IntroScreen({ onProfileSelect }) {
  const [isFading, setIsFading] = useState(false);

  const profiles = [
    {
      name: 'Vatsal',
      letter: 'V',
      gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      role: 'Boyfriend 👔',
      emoji: '👔',
      badgeColor: '#2563eb',
      img: '/sample-couple/Gemini_Generated_Image_unc07lunc07lunc0.png'
    },
    {
      name: 'Muskan',
      letter: 'M',
      gradient: 'linear-gradient(135deg, #881337, #db2777)',
      role: 'Girlfriend 👑',
      emoji: '👑',
      badgeColor: '#db2777',
      img: '/sample-couple/Gemini_Generated_Image_w10zbaw10zbaw10z.png'
    },
    {
      name: 'US',
      letter: '❤️',
      gradient: 'linear-gradient(135deg, #581c87, #a855f7)',
      role: 'The Couple 💖',
      emoji: '💖',
      badgeColor: '#9333ea',
      img: '/sample-couple/Gemini_Generated_Image_wyjtibwyjtibwyjt.png'
    }
  ];

  const playLoginChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Romantic synth chime sweep (C major 7th chord: C4, E4, G4, B4, C5)
      const freqs = [261.63, 329.63, 392.00, 493.88, 523.25];
      
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine'; // warm, smooth sine tone
        osc.frequency.setValueAtTime(freq, now + idx * 0.08); // arpeggiated sweep
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.05); // quick swell
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8); // soft decay
        
        // Low pass filter to make it warmer and less harsh
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + 2.0);
      });
    } catch (err) {
      console.warn("Could not synthesize Web Audio login chime", err);
    }
  };

  const handleSelect = (profile) => {
    playLoginChime();
    setIsFading(true);
    setTimeout(() => {
      onProfileSelect(profile);
    }, 1000);
  };

  return (
    <div className={`intro-container ${isFading ? 'fade-out' : ''}`}>
      <div className="intro-logo">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.892-.982-.336.076-.67-.135-.746-.472-.076-.336.135-.67.472-.746 3.847-.878 7.14-.5 9.82 1.14.293.18.385.564.206.853zm1.226-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.183-.412.126-.85-.103-.976-.515-.126-.412.103-.85.515-.976 3.666-1.112 8.23-.574 11.35 1.345.367.227.488.708.26 1.07zm.106-2.825C14.368 8.65 8.49 8.455 5.097 9.484c-.522.158-1.076-.14-1.234-.662-.158-.522.14-1.076.662-1.234 3.916-1.188 10.42-.96 14.507 1.464.47.28.623.89.344 1.36-.28.47-.89.622-1.36.343z"/>
        </svg>
        <span>SpotiLove</span>
      </div>
      
      <h1 className="intro-title">Who's listening?</h1>
      <p className="intro-subtitle">Choose a profile to start playing memories</p>
      
      <div className="profile-list">
        {profiles.map((profile) => (
          <div 
            key={profile.name} 
            className="profile-card"
            onClick={() => handleSelect(profile)}
          >
            <div 
              className="avatar-wrapper"
              style={{ background: profile.img ? 'none' : profile.gradient }}
            >
              {profile.img ? (
                <img 
                  src={profile.img} 
                  alt={profile.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                />
              ) : (
                profile.letter
              )}
              <div 
                className="role-badge" 
                style={{ borderColor: profile.badgeColor }}
              >
                {profile.emoji} {profile.name.toUpperCase()}
              </div>
            </div>
            <span className="profile-name">{profile.name}</span>
            <span className="profile-sub">{profile.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
