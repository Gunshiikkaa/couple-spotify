import React, { useState, useEffect, useRef } from 'react';

export default function Header({ activeProfile, onSwitchProfile, isMusicPlaying, onToggleMusic }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      {/* Back and Forward Arrow Buttons (Spotify styled) */}
      <div className="header-navigation">
        <button className="nav-btn" title="Go back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button className="nav-btn" title="Go forward">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* User profile menu dropdown */}
      <div className="user-menu" ref={dropdownRef}>
        <button 
          className="user-profile-badge" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="user-avatar" style={{ background: activeProfile.gradient }}>
            {activeProfile.letter}
          </div>
          <span>{activeProfile.name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="user-dropdown">
            <div className="dropdown-item" style={{ borderBottom: '1px solid var(--border-light)', cursor: 'default', color: 'var(--text-muted)' }}>
              <span>Role: {activeProfile.role}</span>
            </div>
            <button 
              className="dropdown-item" 
              onClick={() => {
                onToggleMusic();
                setDropdownOpen(false);
              }}
            >
              <span>{isMusicPlaying ? '🔇 Mute Ambient' : '🔊 Play Ambient'}</span>
            </button>
            <button 
              className="dropdown-item" 
              onClick={() => {
                onSwitchProfile();
                setDropdownOpen(false);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Switch Profile</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
