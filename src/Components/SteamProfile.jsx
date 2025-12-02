import React from 'react';

function SteamProfile({ profile, isPrivate = false }) {
  if (!profile) return null;

  const { personaname, avatarfull, steamid, profileurl, personastate, timecreated } = profile;

  const stateMap = {
    0: { text: 'Offline', color: 'red' },
    1: { text: 'Online', color: 'green' },
    2: { text: 'Busy', color: 'orange' },
    3: { text: 'Away', color: 'gold' },
    4: { text: 'Snooze', color: 'gray' },
    5: { text: 'Looking to trade', color: 'blue' },
    6: { text: 'Looking to play', color: 'teal' },
  };

  const stateInfo = stateMap[personastate] || { text: 'Desconocido', color: 'gray' };

  const created = timecreated ? new Date(timecreated * 1000).toLocaleDateString('es-ES') : 'Desconocida';

  return (
    <div className="Profile-card">
      <div className="Profile-inner">
        <div className="Profile-avatar-wrap">
          <img className="Profile-avatar" src={avatarfull} alt={personaname} />
        </div>
        <div className="Profile-info">
          <h2>{personaname}</h2>
          <p className="muted">SteamID64: {steamid}</p>
          <p>Estado: <span className="status-dot" style={{ background: stateInfo.color }}></span> <span style={{ marginLeft: '0.5rem' }}>{stateInfo.text}</span></p>
          <p>Perfil: <a href={profileurl} target="_blank" rel="noreferrer">Ver en Steam</a></p>
          <p>Cuenta creada: {created}</p>

          {isPrivate && (
            <div className="private-badge">Perfil privado</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SteamProfile;
