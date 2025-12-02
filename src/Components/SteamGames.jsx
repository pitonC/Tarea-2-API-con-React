import React from 'react';

function SteamGames({ games }) {
  if (!games) return null;

  const total = games.length;

  // sort by playtime_forever desc and take top 5
  const top = [...games].sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0)).slice(0, 5);

  const toHours = (minutes) => (minutes ? (minutes / 60).toFixed(1) : '0.0');

  return (
    <div className="Games-card">
      <h3>Información de Juegos</h3>
      <div className="Games-content">
        <p>Total de juegos: <strong>{total}</strong></p>
        <h4>Top 5 juegos más jugados:</h4>
        <div className="Games-list">
          {top.map((g, i) => (
            <div key={g.appid || i} className="Games-item">
              <span className="game-name">{g.name}</span>
              <span className="game-hours">- {toHours(g.playtime_forever)} horas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SteamGames;
