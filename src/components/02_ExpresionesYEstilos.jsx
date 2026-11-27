import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 2] EXPRESIONES JAVASCRIPT { } Y ESTILOS EN LÍNEA
// ----------------------------------------------------------------------------
// 1. Dentro de { } solo caben EXPRESIONES (algo que produce un valor):
//    variables, cálculos, llamadas a funciones, template literals, ternarios.
// 2. NO caben SENTENCIAS (if, for, while, switch). Esas se resuelven fuera
//    del `return` o con expresiones equivalentes.
// 3. `style={{ ... }}` lleva DOBLE LLAVE:
//    - Llave exterior: abre expresión JSX.
//    - Llave interior: define un objeto literal de JavaScript.
//    - Propiedades CSS en camelCase: `backgroundColor`, `fontSize`, `borderRadius`.
// 4. React IGNORA en pantalla: true, false, null y undefined.
// ============================================================================

// Ticket 03: tipos impositivos como datos (añadir uno nuevo = añadir una línea)
const TIPOS_IVA = [
  { id: 'general', etiqueta: 'General (21%)', tasa: 0.21 },
  { id: 'reducido', etiqueta: 'Reducido (10%)', tasa: 0.1 },
  { id: 'superreducido', etiqueta: 'Superreducido (4%)', tasa: 0.04 }
];

const DESCUENTO_MAX = 50;

const formatearEuros = (cantidad) => `${cantidad.toFixed(2)} €`;

// Mantiene un número dentro de [min, max]
const limitar = (valor, min, max) => Math.min(Math.max(valor, min), max);

export default function ExpresionesYEstilos() {
  const [precioBase, setPrecioBase] = useState(100);
  const [tipoIvaId, setTipoIvaId] = useState('general');
  const [descuento, setDescuento] = useState(0);
  const [colorDestacado, setColorDestacado] = useState('#38bdf8');

  // Ticket 03: el desglose son valores DERIVADOS del estado (no se guardan, se calculan)
  const tasaIva = TIPOS_IVA.find((t) => t.id === tipoIvaId).tasa;
  const importeDescontado = precioBase * (descuento / 100);
  const baseImponible = precioBase - importeDescontado;
  const cuotaIva = baseImponible * tasaIva;
  const totalFinal = baseImponible + cuotaIva;

  // Objeto de estilos dinámico en JavaScript
  const estiloTarjetaDinamica = {
    backgroundColor: 'var(--surface-alt)',
    border: `2px solid ${colorDestacado}`,
    borderRadius: '10px',
    padding: '1rem',
    transition: 'border-color 0.2s ease'
  };

  return (
    <section className="card">
      <h2>2. Expresiones JavaScript &#123; &#125; y Estilos en Línea</h2>
      <p className="subtitle">
        Las llaves son una ventana directa a JavaScript dentro del marcado JSX.
      </p>

      <div className="grid-2">
        <div className="box">
          <h3>Calculadora fiscal (IVA y descuentos)</h3>
          <label htmlFor="precio-input">Precio base (€):</label>
          <input
            id="precio-input"
            type="number"
            min="0"
            step="0.01"
            className="input"
            value={precioBase}
            onChange={(e) => setPrecioBase(Math.max(Number(e.target.value) || 0, 0))}
          />

          <div className="grid-2" style={{ marginTop: '0.6rem', gap: '0.75rem' }}>
            <div>
              <label htmlFor="iva-select">Tipo de IVA:</label>
              <select
                id="iva-select"
                className="input"
                value={tipoIvaId}
                onChange={(e) => setTipoIvaId(e.target.value)}
              >
                {TIPOS_IVA.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.etiqueta}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="descuento-input">Descuento (%) 0–{DESCUENTO_MAX}:</label>
              <input
                id="descuento-input"
                type="number"
                min="0"
                max={DESCUENTO_MAX}
                className="input"
                value={descuento}
                onChange={(e) => setDescuento(limitar(Number(e.target.value) || 0, 0, DESCUENTO_MAX))}
              />
            </div>
          </div>

          <ul className="list">
            <li className="list-item">
              <span>Precio Base:</span>
              <strong>{formatearEuros(precioBase)}</strong>
            </li>
            <li className="list-item">
              <span>Importe Descontado ({descuento}%):</span>
              <strong>- {formatearEuros(importeDescontado)}</strong>
            </li>
            <li className="list-item">
              <span>Base Imponible:</span>
              <strong>{formatearEuros(baseImponible)}</strong>
            </li>
            <li className="list-item">
              <span>Cuota de IVA ({(tasaIva * 100).toFixed(0)}%):</span>
              <strong>{formatearEuros(cuotaIva)}</strong>
            </li>
            <li className="list-item">
              <span>Total Final:</span>
              {/* Ticket 03.4: estilo en línea condicional con un ternario dentro del objeto */}
              <strong
                style={{
                  color: descuento > 0 ? 'var(--green)' : 'inherit',
                  fontSize: '1.1rem'
                }}
              >
                {formatearEuros(totalFinal)}
              </strong>
            </li>
            <li className="list-item">
              <span>Valores ignorados (true/false/null):</span>
              <strong>[{true}{false}{null}{undefined}] (vacío)</strong>
            </li>
          </ul>
        </div>

        <div style={estiloTarjetaDinamica}>
          <h3 style={{ color: colorDestacado, marginTop: 0 }}>
            Estilos en línea con style=&#123;&#123; camelCase &#125;&#125;
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-soft)' }}>
            El borde y el título de este recuadro se calculan dinámicamente desde un objeto
            JavaScript usando <code className="code-inline">border</code> y <code className="code-inline">color</code>.
          </p>

          <div className="btn-row">
            <button type="button" className="btn" onClick={() => setColorDestacado('#38bdf8')}>
              Azul Cyan
            </button>
            <button type="button" className="btn" style={{ backgroundColor: '#059669' }} onClick={() => setColorDestacado('#10b981')}>
              Verde Esmeralda
            </button>
            <button type="button" className="btn" style={{ backgroundColor: '#d97706' }} onClick={() => setColorDestacado('#f59e0b')}>
              Ámbar
            </button>
          </div>
        </div>
      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/02_ExpresionesYEstilos.jsx</code>
      </p>
    </section>
  );
}
