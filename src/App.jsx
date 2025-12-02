import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/steam-logo.svg';
import { useState, useEffect } from 'react';
import Encabezado from './Components/Encabezado';
import Buscador from './Components/Buscador';
import SteamProfile from './Components/SteamProfile';
import SteamGames from './Components/SteamGames';

function App() {

  const [steamId, setSteamId] = useState("");
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [totalGames, setTotalGames] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  
  // We'll perform fetches on-demand via handleSearch which sets `query`.

  const handleSearch = (id) => {
    const trimmed = (id || '').trim();
    setError(null);
    setProfile(null);
    setGames([]);
    setTotalGames(0);
    setIsPrivate(false);
    setSteamId(trimmed);

    if (!trimmed) {
      setError('Introduce un Steam64 ID válido (solo números)');
      return;
    }

    if (!/^[0-9]{16,17}$/.test(trimmed)) {
      setError('Introduce un Steam64 ID válido (solo números, 16-17 dígitos)');
      return;
    }

    // set the query to trigger useEffect
    setQuery(trimmed);
  };

  useEffect(() => {
    if (!query) return;

    const apikey = import.meta.env.VITE_STEAM_API_KEY || "";
    if (!apikey) {
      setError('Falta la API key de Steam. Añade VITE_STEAM_API_KEY en .env');
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const pUrl = `/steam/ISteamUser/GetPlayerSummaries/v2/?key=${apikey}&steamids=${encodeURIComponent(query)}`;
        const pRes = await fetch(pUrl, { signal });
        const pJson = await pRes.json();

        const player = pJson.response && pJson.response.players && pJson.response.players[0];
        if (!player) {
          if (!cancelled) setError('No se encontró el perfil (SteamID inválido)');
          return;
        }

        if (cancelled) return;
        setProfile(player);

        const visibility = player.communityvisibilitystate || 1;
        if (visibility !== 3) {
          if (!cancelled) {
            setIsPrivate(true);
            setGames([]);
            setTotalGames(0);
          }
          return;
        }

        if (cancelled) return;
        setIsPrivate(false);

        const gUrl = `/steam/IPlayerService/GetOwnedGames/v1/?key=${apikey}&steamid=${encodeURIComponent(query)}&include_appinfo=true&include_played_free_games=true`;
        const gRes = await fetch(gUrl, { signal });
        const gJson = await gRes.json();
        const owned = (gJson.response && gJson.response.games) || [];

        if (!cancelled) {
          setGames(owned);
          setTotalGames(owned.length || 0);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // request was aborted, ignore
          return;
        }
        if (!cancelled) setError('Error al conectar con la API de Steam');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => { cancelled = true; controller.abort(); };
  }, [query]);

  return (
    <div className="App">
        <Encabezado
          logo={logo}
        />

        <div className="Main-container">
          <h3 className="section-title">Buscar Perfil de Usuario</h3>

          <div className="Search-card">
            <Buscador
              onSearch={handleSearch}
              examples={["76561198303926498", "76561198034326474", "76561197960287930"]}
            />
          </div>

          {error && (
            <div className="error-box">{error}</div>
          )}

          {loading && (
            <div className="loading-box">Cargando perfil...</div>
          )}

          <SteamProfile profile={profile} isPrivate={isPrivate} />

          {!isPrivate && games && games.length > 0 && (
            <SteamGames games={games} />
          )}

          {isPrivate && profile && (
            <div className="private-box">Perfil privado — la lista de juegos no está disponible.</div>
          )}
        </div>
       
    </div>
  );
}

export default App;