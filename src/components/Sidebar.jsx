import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const customPlaylists = [
    { id: 'vault', title: 'Liked Songs', desc: 'Playlist • Memories', icon: '💖', color: 'var(--love-pink)' },
    { id: 'timeline', title: 'Our Timeline', desc: 'Playlist • Milestones', icon: '📜', color: '#f59e0b' },
    { id: 'blend', title: 'Our Blend', desc: 'Playlist • Compatibility', icon: '🧪', color: 'var(--spotify-green)' },
    { id: 'planner', title: 'Date Planner', desc: 'Podcast • Future Plans', icon: '📅', color: 'var(--accent-blue)' },
    { id: 'letter', title: 'Secret Letters', desc: 'Profile • Message Board', icon: '💌', color: 'var(--accent-purple)' }
  ];

  return (
    <aside className="sidebar">
      {/* Upper Navigation Box */}
      <div className="sidebar-box">
        <a href="#" className="sidebar-logo" onClick={() => setActiveTab('home')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.892-.982-.336.076-.67-.135-.746-.472-.076-.336.135-.67.472-.746 3.847-.878 7.14-.5 9.82 1.14.293.18.385.564.206.853zm1.226-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.183-.412.126-.85-.103-.976-.515-.126-.412.103-.85.515-.976 3.666-1.112 8.23-.574 11.35 1.345.367.227.488.708.26 1.07zm.106-2.825C14.368 8.65 8.49 8.455 5.097 9.484c-.522.158-1.076-.14-1.234-.662-.158-.522.14-1.076.662-1.234 3.916-1.188 10.42-.96 14.507 1.464.47.28.623.89.344 1.36-.28.47-.89.622-1.36.343z"/>
          </svg>
          <span>SpotiLove</span>
        </a>
        
        <ul className="sidebar-nav">
          <li>
            <a 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a 
              className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              <span>Search</span>
            </a>
          </li>
          <li className="mobile-only">
            <a 
              className={`nav-item ${activeTab === 'library' || ['vault', 'timeline', 'blend', 'planner', 'letter'].includes(activeTab) ? 'active' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                <path d="M6 6h10"/>
                <path d="M6 10h10"/>
              </svg>
              <span>Library</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Library/Playlists Box */}
      <div className="sidebar-library">
        <div className="library-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="M6 6h10"/>
            <path d="M6 10h10"/>
          </svg>
          <span>Your Library</span>
        </div>
        
        <ul className="library-list">
          {customPlaylists.map((pl) => (
            <li key={pl.id}>
              <a 
                className={`library-item ${activeTab === pl.id ? 'active' : ''}`}
                onClick={() => setActiveTab(pl.id)}
              >
                <div className="library-art" style={{ background: pl.color }}>
                  {pl.icon}
                </div>
                <div className="library-item-info">
                  <span className="library-item-title">{pl.title}</span>
                  <span className="library-item-desc">{pl.desc}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
