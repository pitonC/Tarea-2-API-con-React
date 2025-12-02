function Encabezado({ logo, title = 'Steam Web API - Proyecto', subtitle = 'Consulta información de perfiles de Steam' }) {
  return (
    <header className="App-header">
      <div className="Header-inner">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="Header-text">
          <h1>{title}</h1>
          <p className="Header-sub">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

export default Encabezado;