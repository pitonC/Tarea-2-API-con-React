import { useState } from 'react';
import { Button, InputGroup, Form } from 'react-bootstrap';

function Buscador({ onSearch, examples = [] }) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(value.trim());
  };

  // only trigger search on button click (no Enter auto-search)

  return (
    <div className="Buscador">
      <InputGroup style={{ width: '70%' }} className="mb-3" size="lg">
        <InputGroup.Text id="inputGroup-sizing-lg">Steam64 ID</InputGroup.Text>
        <Form.Control
          aria-label="Steam64 ID"
          placeholder="Introduce Steam64 ID (solo números, ej. 7656119...)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant="success" onClick={handleSearch} disabled={!/^[0-9]{16,17}$/.test(value.trim())}>Buscar Perfil</Button>
      </InputGroup>

      {/* validation hint */}
      <div style={{ width: '70%', margin: '0 auto', textAlign: 'left', color: 'rgba(255,255,255,0.7)', minHeight: '1.2rem' }}>
        {!/^[0-9]{16,17}$/.test(value.trim()) && value.trim().length > 0 ? (
          <small>Steam64 ID debe ser solo números (16-17 dígitos).</small>
        ) : null}
      </div>

      {examples && examples.length > 0 && (
        <div style={{ width: '70%', display: 'flex', gap: '0.5rem', margin: '0 auto' }}>
          {examples.map((ex, i) => (
            <Button key={i} variant="outline-success" onClick={() => { setValue(ex); if (onSearch) onSearch(ex); }}>
              Perfil de Ejemplo {i + 1}
            </Button>
          ))}
        </div>
      )}

      {/* helper link removed as requested */}
    </div>
  );
}

export default Buscador;