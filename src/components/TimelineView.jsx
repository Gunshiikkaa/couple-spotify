import React, { useState } from 'react';

export default function TimelineView({ tracks, currentTrack, isPlaying, onPlayTrack, onTogglePlay }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(''); // 'title', 'album', 'date'
  const [sortAsc, setSortAsc] = useState(true);

  // Format track duration
  const formatDuration = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Sort and filter tracks
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.year.toString().includes(searchTerm)
  );

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    if (!sortKey) return 0;
    
    let valA = a[sortKey];
    let valB = b[sortKey];
    
    if (sortKey === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else {
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
    }
    
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const isCurrentPlaylistPlaying = isPlaying && currentTrack && tracks.some(t => t.id === currentTrack.id);

  return (
    <div className="timeline-view">
      {/* Playlist Banner Header */}
      <div className="playlist-header">
        <div className="playlist-art" style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)' }}>
          📜
        </div>
        <div className="playlist-details">
          <span className="playlist-type">PLAYLIST</span>
          <h1 className="playlist-name">Our Timeline</h1>
          <div className="playlist-meta">
            <strong>Vatsal & Muskan</strong>
            <span>•</span>
            <span>{tracks.length} songs, 24 min 30 sec</span>
          </div>
        </div>
      </div>

      {/* Playlist Actions Row */}
      <div className="playlist-bar">
        <button 
          className="playlist-play-main" 
          onClick={() => {
            if (currentTrack && tracks.some(t => t.id === currentTrack.id)) {
              onTogglePlay();
            } else {
              onPlayTrack(tracks[0]);
            }
          }}
          title={isCurrentPlaylistPlaying ? "Pause Playlist" : "Play Playlist"}
        >
          {isCurrentPlaylistPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translateX(1px)' }}>
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        {/* Playlist Internal Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
          <input 
            type="text" 
            placeholder="Search in timeline..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 12px 8px 36px',
              fontSize: '0.85rem',
              color: '#fff',
              outline: 'none'
            }}
          />
          <svg 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Playlist Tracks Table */}
      <div className="table-wrapper">
        <table className="tracklist-table">
          <thead>
            <tr className="tracklist-header-row">
              <th className="track-number-col">#</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>
                Title {sortKey === 'title' ? (sortAsc ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('album')}>
                Album/Location {sortKey === 'album' ? (sortAsc ? '▲' : '▼') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                Date Happened {sortKey === 'date' ? (sortAsc ? '▲' : '▼') : ''}
              </th>
              <th className="track-duration-col" style={{ paddingRight: '24px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTracks.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              const isThisTrackPlaying = isActive && isPlaying;
              
              return (
                <tr 
                  key={track.id} 
                  className={`track-row ${isActive ? 'active' : ''}`}
                  onClick={() => onPlayTrack(track)}
                >
                  {/* Column 1: Index / Play Controls */}
                  <td className="track-number-col">
                    <span className="number-text">
                      {isThisTrackPlaying ? (
                        <span style={{ color: 'var(--spotify-green)', fontWeight: 'bold' }}>🔊</span>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <button className="row-play-icon" title="Play">
                      {isThisTrackPlaying ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      )}
                    </button>
                  </td>

                  {/* Column 2: Title and Cover Art */}
                  <td>
                    <div className="track-title-col">
                      <div className="track-art">
                        {track.icon && (track.icon.startsWith('/') || track.icon.includes('.png')) ? (
                          <img src={track.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          track.icon || '🎵'
                        )}
                      </div>
                      <div className="track-name-wrapper">
                        <span className="track-name-txt">{track.title}</span>
                        <span className="track-artist-txt">{track.artist}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Location / Context (Album) */}
                  <td className="track-album-col">
                    {track.album}
                  </td>

                  {/* Column 4: Date */}
                  <td className="track-date-col">
                    {track.date}
                  </td>

                  {/* Column 5: Duration */}
                  <td className="track-duration-col" style={{ paddingRight: '24px' }}>
                    {formatDuration(track.duration)}
                  </td>
                </tr>
              );
            })}
            
            {sortedTracks.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No milestones found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
