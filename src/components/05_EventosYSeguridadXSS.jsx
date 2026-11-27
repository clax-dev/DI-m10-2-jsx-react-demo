import { useRef, useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 5] EVENTOS EN JSX Y SEGURIDAD AUTOMÁTICA CONTRA XSS
// ----------------------------------------------------------------------------
// 1. EVENTOS:
//    - En HTML: onclick="saludar()" (cadena de texto).
//    - En JSX:  onClick={saludar}   (referencia a función en camelCase).
//    - Si necesita argumentos: onClick={() => saludar('DAM2')}.
//      ¡ERROR TÍPICO!: escribir onClick={saludar('DAM2')} ejecuta la función
//      inmediatamente al renderizar, no al hacer clic.
// 2. PREVENCIÓN DE XSS (Cross-Site Scripting):
//    - JSX escapa automáticamente cualquier cadena insertada dentro de { }.
//    - Si un atacante introduce `<script>` o `<img onerror=...>`, React lo
//      pinta como texto plano seguro sin ejecutar código JavaScript.
// ============================================================================

const MAX_EVENTOS = 5;

// Ticket 06.3: vectores de ataque típicos para probar el escapado de JSX
const PAYLOADS_XSS = [
  { id: 'img', nombre: 'img onerror', codigo: `<img src=x onerror="alert('XSS img')" />` },
  { id: 'script', nombre: 'script', codigo: `<script>alert('XSS script')</script>` },
  { id: 'svg', nombre: 'svg onload', codigo: `<svg onload="alert('XSS svg')"></svg><a href="javascript:alert(1)">clic</a>` }
];

export default function EventosYSeguridadXSS() {
  // Ticket 06.1: en vez de un único texto, una lista de eventos { id, texto }
  const [historial, setHistorial] = useState([]);
  // Corrección del proyecto base: el valor inicial tenía comillas dobles anidadas
  // y rompía la compilación. Con template literal (`...`) el problema desaparece.
  const [entradaUsuario, setEntradaUsuario] = useState(PAYLOADS_XSS[0].codigo);

  // useRef guarda un contador que sobrevive a los renders SIN provocar re-render.
  // Da a cada evento una key única y estable (dos clics en el mismo ms no colisionan).
  const siguienteId = useRef(1);

  const registrarEvento = (texto) => {
    const evento = {
      id: siguienteId.current++,
      texto: `${new Date().toLocaleTimeString()} · ${texto}`
    };
    // Nuevo evento arriba y recortamos a los 5 últimos
    setHistorial((prev) => [evento, ...prev].slice(0, MAX_EVENTOS));
  };

  // Manejador sin parámetros (se pasa como referencia: onClick={manejarClickSimple})
  const manejarClickSimple = () => {
    registrarEvento('Clic simple registrado');
  };

  // Manejador con parámetros (requiere función flecha: onClick={() => manejarConParametro(...)})
  const manejarConParametro = (accion) => {
    registrarEvento(`Acción ejecutada con parámetro: "${accion}"`);
  };

  const cargarPayload = (payload) => {
    setEntradaUsuario(payload.codigo);
    registrarEvento(`Payload XSS cargado: ${payload.nombre}`);
  };

  return (
    <section className="card">
      <h2>5. Manejo de Eventos y Protección Nativa contra XSS</h2>
      <p className="subtitle">
        Prueba los botones de eventos y comprueba cómo JSX neutraliza automáticamente código HTML/JS malicioso.
      </p>

      <div className="grid-2">
        <div className="box box-success">
          <h3>Sintaxis de Eventos (Synthetic Events)</h3>
          <div className="btn-row">
            {/* Referencia directa a la función */}
            <button type="button" className="btn" onClick={manejarClickSimple}>
              onClick=&#123;fn&#125;
            </button>
            {/* Función flecha para pasar argumentos sin ejecutar en el render */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => manejarConParametro('Exportar PDF')}
            >
              onClick=&#123;() =&gt; fn(arg)&#125;
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setHistorial([])}
              disabled={historial.length === 0}
            >
              Limpiar historial
            </button>
          </div>

          <h3>Historial (últimos {MAX_EVENTOS} eventos)</h3>
          {historial.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Ningún evento todavía.</p>
          ) : (
            <ol className="list" style={{ marginTop: '0.4rem' }}>
              {historial.map((evento) => (
                <li key={evento.id} className="list-item" style={{ fontSize: '0.88rem' }}>
                  <span>{evento.texto}</span>
                  <code className="code-inline">#{evento.id}</code>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="box box-warn">
          <h3>Escapado automático contra XSS</h3>
          <label htmlFor="xss-input">Introduce HTML o un payload XSS:</label>
          <input
            id="xss-input"
            type="text"
            className="input"
            value={entradaUsuario}
            onChange={(e) => setEntradaUsuario(e.target.value)}
          />

          <div className="btn-row">
            {PAYLOADS_XSS.map((payload) => (
              <button
                key={payload.id}
                type="button"
                className="btn btn-secondary"
                onClick={() => cargarPayload(payload)}
              >
                Cargar payload XSS de prueba ({payload.nombre})
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.65rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.85rem',
              wordBreak: 'break-all'
            }}
          >
            {/* JSX escapa automáticamente esta cadena: NO se ejecuta el script */}
            Salida renderizada segura: {entradaUsuario}
          </div>
        </div>
      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/05_EventosYSeguridadXSS.jsx</code>
      </p>
    </section>
  );
}
