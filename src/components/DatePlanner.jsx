import React, { useState, useEffect } from 'react';

const DEFAULT_DATES = [
  { id: 'b1', title: 'Road trip to the coast', desc: 'Pack the snacks, build the perfect road playlist, and watch the waves crash on sandy cliffs.', date: 'May 15, 2026', done: false, icon: '🚗' },
  { id: 'b2', title: 'Couples cooking masterclass', desc: 'Trying to bake pasta from scratch and ending up with flour in our hair, laughing in the kitchen light.', date: 'June 20, 2026', done: false, icon: '🍝' },
  { id: 'b3', title: 'Pitch blankets for midnight stargazing', desc: 'Laying on the hood of the car, defining constellations, and sharing quiet whispers under a sky full of stars.', date: 'August 12, 2025', done: true, icon: '🌌' },
  { id: 'b4', title: 'Write a joint future bucket list', desc: 'Dreaming big: writing down 100 things we want to experience together over the next 10 years.', date: 'October 5, 2025', done: false, icon: '📝' }
];

export default function DatePlanner() {
  const [dates, setDates] = useState(() => {
    const saved = localStorage.getItem('spotifyDatePlanner');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_DATES;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newIcon, setNewIcon] = useState('📅');

  useEffect(() => {
    localStorage.setItem('spotifyDatePlanner', JSON.stringify(dates));
  }, [dates]);

  const handleToggle = (id) => {
    // Play a click sound effect
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now); // E4 note
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08); // slide up
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {}

    setDates(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const handleAddEpisode = (e) => {
    e.preventDefault();
    const newEp = {
      id: 'b_' + Date.now(),
      title: newTitle,
      desc: newDesc,
      date: newDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      done: false,
      icon: newIcon || '📅'
    };
    setDates(prev => [newEp, ...prev]);
    setIsAdding(false);
    setNewTitle('');
    setNewDesc('');
    setNewDate('');
    setNewIcon('📅');
  };

  return (
    <div className="content-section" style={{ padding: '40px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <span className="hero-subtitle" style={{ color: 'var(--spotify-green)' }}>PODCAST SHOW</span>
          <h1 className="playlist-name" style={{ fontSize: '3rem', margin: '4px 0 8px' }}>Future Episodes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Our Date Night Bucket List, structured as episodes of our lifelong podcast.
          </p>
        </div>
        <button 
          className="spotlight-btn-main"
          style={{ backgroundColor: 'var(--spotify-green)', color: '#000' }}
          onClick={() => setIsAdding(true)}
        >
          Add New Episode
        </button>
      </div>

      {/* Episode list */}
      <div className="podcast-episodes-list">
        {dates.map((ep) => (
          <div 
            key={ep.id} 
            className="episode-card"
            onClick={() => handleToggle(ep.id)}
          >
            <div className="episode-art">
              {ep.icon}
            </div>
            
            <div className="episode-content">
              <div className="episode-date-row">
                <span>{ep.date}</span>
                <span>•</span>
                <span>Episode {ep.done ? 'Finished' : 'Planned'}</span>
                {ep.done && <span className="episode-completed-badge">COMPLETED</span>}
              </div>
              
              <h3 className="episode-title" style={{ 
                textDecoration: ep.done ? 'line-through' : 'none', 
                color: ep.done ? 'var(--text-muted)' : '#fff' 
              }}>
                {ep.title}
              </h3>
              
              <p className="episode-desc">
                {ep.desc}
              </p>
              
              <div className="episode-footer">
                <div className="episode-checkbox">
                  <input 
                    type="checkbox" 
                    checked={ep.done} 
                    onChange={() => {}} // handled by parent onClick
                  />
                  <span>Mark as Completed</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Episode Modal */}
      {isAdding && (
        <div className="modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddEpisode}>
              <div className="modal-header">
                <span className="modal-title">Schedule New Date Episode</span>
                <button type="button" className="modal-close" onClick={() => setIsAdding(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Episode Title (Date Night Idea)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="E.g., Dinner in the dark, stargazing..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Episode Notes (Description of activity)</label>
                  <textarea 
                    className="form-textarea"
                    rows="3"
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)} 
                    placeholder="What will we do? Where will we go?..."
                    required
                  />
                </div>
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px' }}>
                  <div>
                    <label>Target Date</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newDate} 
                      onChange={(e) => setNewDate(e.target.value)} 
                      placeholder="E.g., June 2026 or June 15, 2026"
                    />
                  </div>
                  <div>
                    <label>Episode Emoji</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={newIcon} 
                      onChange={(e) => setNewIcon(e.target.value)} 
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="submit" className="modal-btn-submit">Add Episode</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
