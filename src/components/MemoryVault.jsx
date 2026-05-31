import React from 'react';

export default function MemoryVault({ tracks, likedSongs, currentTrack, isPlaying, onPlayTrack, onTogglePlay }) {
  // Filter tracks to only include liked ones
  const likedTracksList = tracks.filter(track => !!likedSongs[track.id]);

  const formatDuration = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isCurrentPlaylistPlaying = isPlaying && currentTrack && likedTracksList.some(t => t.id === currentTrack.id);

  return (
    <div className="memory-vault">
      {/* Liked Songs Header (Spotify Style) */}
      <div className="playlist-header" style={{ background: 'linear-gradient(180deg, #4c1d95 0%, rgba(18, 18, 18, 0) 100%)' }}>
        <div 
          className="playlist-art" 
          style={{ 
            background: 'linear-gradient(135deg, #450a0a 0%, #2e1065 100%)', 
            fontSize: '5rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          💖
        </div>
        <div className="playlist-details">
          <span className="playlist-type">PLAYLIST</span>
          <h1 className="playlist-name">Liked Songs</h1>
          <div className="playlist-meta">
            <strong>Vatsal & Muskan</strong>
            <span>•</span>
            <span>{likedTracksList.length} songs</span>
          </div>
        </div>
      </div>

      {/* Playlist Actions Row */}
      <div className="playlist-bar">
        {likedTracksList.length > 0 && (
          <button 
            className="playlist-play-main" 
            style={{ backgroundColor: 'var(--love-pink)', color: '#fff' }}
            onClick={() => {
              if (currentTrack && likedTracksList.some(t => t.id === currentTrack.id)) {
                onTogglePlay();
              } else {
                onPlayTrack(likedTracksList[0]);
              }
            }}
            title={isCurrentPlaylistPlaying ? "Pause Liked Songs" : "Play Liked Songs"}
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
        )}
      </div>

      {/* Tracklist Table */}
      <div className="table-wrapper">
        <table className="tracklist-table">
          <thead>
            <tr className="tracklist-header-row">
              <th className="track-number-col">#</th>
              <th>Title</th>
              <th>Album/Location</th>
              <th>Date Happened</th>
              <th className="track-duration-col" style={{ paddingRight: '24px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {likedTracksList.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              const isThisTrackPlaying = isActive && isPlaying;
              
              return (
                <tr 
                  key={track.id} 
                  className={`track-row ${isActive ? 'active' : ''}`}
                  onClick={() => onPlayTrack(track)}
                >
                  <td className="track-number-col">
                    <span className="number-text">
                      {isThisTrackPlaying ? (
                        <span style={{ color: 'var(--love-pink)', fontWeight: 'bold' }}>🔊</span>
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
                  <td>
                    <div className="track-title-col">
                      <div className="track-art">
                        {track.icon || '🎵'}
                      </div>
                      <div className="track-name-wrapper">
                        <span className="track-name-txt" style={{ color: isActive ? 'var(--love-pink)' : '#fff' }}>{track.title}</span>
                        <span className="track-artist-txt">{track.artist}</span>
                      </div>
                    </div>
                  </td>
                  <td className="track-album-col">{track.album}</td>
                  <td className="track-date-col">{track.date}</td>
                  <td className="track-duration-col" style={{ paddingRight: '24px' }}>
                    {formatDuration(track.duration)}
                  </td>
                </tr>
              );
            })}
            
            {likedTracksList.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💙</div>
                  <h3 style={{ color: '#fff', marginBottom: '8px' }}>Songs you like will appear here</h3>
                  <p style={{ fontSize: '0.88rem' }}>Save memories to your Liked Songs by clicking the heart icon on cards or inside the player bar.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
