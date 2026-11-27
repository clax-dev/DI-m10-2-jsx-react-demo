import { useEffect, useState } from 'react';
import ResumenKPIs from './ResumenKPIs.jsx';

// ============================================================================
// [CLAVE EXPOSICIÓN 6] DEMO INTEGRADORA DE TODAS LAS CARACTERÍSTICAS DE JSX
// ----------------------------------------------------------------------------
// Este componente reúne en un caso real de aula:
// - Fragmentos (<>...</>) y atributos camelCase (className, onClick, onChange)
// - Expresiones JS { } y estilos en línea dinámicos style={{ }}
// - Renderizado condicional (ternario + && booleano seguro)
// - Listas con .map() y key única estable
// - Comunicación mediante props y composición de componentes
// ----------------------------------------------------------------------------
// FLUJO DEL DATO (tickets 07-10):
//   localStorage ──(carga inicial)──> estado `expedientes` ──(useEffect)──> localStorage
//                                          │
//                     búsqueda + filtro + orden (valores derivados)
//                                          │
//                     `listaVisible` ──> <ResumenKPIs /> y grid de tarjetas
// ============================================================================

const CLAVE_STORAGE = 'm10-2-expedientes';

const EXPEDIENTES_INICIALES = [
  { id: 101, nombre: 'Lucía Serrano', nota: 8.7, modulos: ['DI', 'PSP', 'AD'] },
  { id: 102, nombre: 'Marcos Vega', nota: 4.3, modulos: ['DI', 'SGE'] },
  { id: 103, nombre: 'Sofía Navarro', nota: 9.5, modulos: ['DI', 'PSP', 'AD', 'PMDM'] }
];

// Ticket 07.2: cada criterio de orden es una función comparadora
const ORDENACIONES = {
  'nota-desc': { etiqueta: 'Nota (mayor a menor)', comparar: (a, b) => b.nota - a.nota },
  'nota-asc': { etiqueta: 'Nota (menor a mayor)', comparar: (a, b) => a.nota - b.nota },
  'nombre-asc': { etiqueta: 'Nombre (A–Z)', comparar: (a, b) => a.nombre.localeCompare(b.nombre, 'es') }
};

const FORMULARIO_VACIO = { nombre: '', nota: '', modulos: '' };

// Ticket 10.1: lectura defensiva. Si la clave no existe o el JSON está corrupto,
// volvemos a los datos iniciales en lugar de romper la aplicación.
function cargarExpedientes() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    const datos = guardado ? JSON.parse(guardado) : null;
    return Array.isArray(datos) ? datos : EXPEDIENTES_INICIALES;
  } catch {
    return EXPEDIENTES_INICIALES;
  }
}

function TarjetaExpediente({ alumno, seleccionado, onSeleccionar }) {
  const aprobado = alumno.nota >= 5;

  return (
    <article
      className="box"
      style={{
        borderColor: seleccionado ? 'var(--primary)' : 'var(--border)',
        borderWidth: seleccionado ? '2px' : '1px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>{alumno.nombre}</h3>
        <span className={`badge ${aprobado ? 'badge-ok' : 'badge-fail'}`}>
          {aprobado ? `Aprobado (${alumno.nota})` : `Pendiente (${alumno.nota})`}
        </span>
      </div>

      {alumno.modulos.length > 0 && (
        <div className="btn-row" style={{ marginTop: '0.6rem' }}>
          {alumno.modulos.map((mod) => (
            <span key={`${alumno.id}-${mod}`} className="code-inline">
              {mod}
            </span>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button type="button" className="btn" onClick={() => onSeleccionar(alumno)}>
          {seleccionado ? 'Expediente seleccionado' : 'Seleccionar expediente'}
        </button>
      </div>
    </article>
  );
}

export default function DemoIntegradora() {
  // Ticket 08.1 + 10.1: el array pasa a ser estado; la función se ejecuta solo
  // en el primer render (inicialización perezosa) para leer localStorage una vez.
  const [expedientes, setExpedientes] = useState(cargarExpedientes);
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('nota-desc');
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errorForm, setErrorForm] = useState('');

  // Ticket 10.1: cada vez que cambian los expedientes, se guardan automáticamente
  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(expedientes));
  }, [expedientes]);

  // Ticket 07: filtro + búsqueda + orden encadenados. `filter` ya crea un array
  // nuevo, así que `sort` no muta el estado original.
  const termino = busqueda.trim().toLowerCase();
  const listaVisible = expedientes
    .filter((a) => !soloAprobados || a.nota >= 5)
    .filter((a) => a.nombre.toLowerCase().includes(termino))
    .sort(ORDENACIONES[orden].comparar);

  const actualizarCampo = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    setErrorForm('');
  };

  // Ticket 08.2 / 08.3: validación y alta
  const darDeAlta = (e) => {
    e.preventDefault();
    const nombre = formulario.nombre.trim();
    const nota = Number(formulario.nota);

    if (!nombre) {
      setErrorForm('El nombre completo es obligatorio.');
      return;
    }
    if (formulario.nota === '' || Number.isNaN(nota) || nota < 0 || nota > 10) {
      setErrorForm('La nota debe ser un número entre 0 y 10.');
      return;
    }

    // "DI, psp, ,DI" -> ['DI', 'PSP']. El Set elimina repetidos: si no,
    // dos módulos iguales generarían keys duplicadas en la tarjeta.
    const modulos = [
      ...new Set(
        formulario.modulos
          .split(',')
          .map((m) => m.trim().toUpperCase())
          .filter(Boolean)
      )
    ];

    const nuevo = { id: Date.now(), nombre, nota, modulos };
    setExpedientes((prev) => [...prev, nuevo]);
    setFormulario(FORMULARIO_VACIO);
  };

  // Ticket 10.2: borra la clave y vuelve a los 3 expedientes originales.
  // (El useEffect la reescribirá enseguida con esos 3 datos iniciales.)
  const restablecer = () => {
    localStorage.removeItem(CLAVE_STORAGE);
    setExpedientes(EXPEDIENTES_INICIALES);
    setSeleccionado(null);
  };

  return (
    <>
      <section className="card">
        <h2>6. Ejemplo Integrador: Panel de Expedientes DAM2</h2>
        <p className="subtitle">
          Composición de componentes reutilizables aplicando todas las reglas de JSX.
        </p>

        {/* Ticket 09: KPIs sobre la lista que se está viendo (reacciona a filtros y altas) */}
        <ResumenKPIs alumnos={listaVisible} />

        <div className="form-grid" style={{ marginBottom: '1rem' }}>
          <div>
            <label htmlFor="buscar-alumno">Buscar por nombre:</label>
            <input
              id="buscar-alumno"
              type="search"
              className="input"
              placeholder="Ej.: Lucía"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="orden-select">Ordenar por:</label>
            <select
              id="orden-select"
              className="input"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              {Object.entries(ORDENACIONES).map(([clave, { etiqueta }]) => (
                <option key={clave} value={clave}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="btn-row" style={{ marginBottom: '1rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSoloAprobados((prev) => !prev)}
          >
            {soloAprobados ? 'Mostrar todos los alumnos' : 'Filtrar solo aprobados (>= 5)'}
          </button>
          <button type="button" className="btn btn-danger" onClick={restablecer}>
            Restablecer datos iniciales
          </button>

          {seleccionado && (
            <span className="pill">
              Seleccionado: {seleccionado.nombre} (ID #{seleccionado.id})
            </span>
          )}
        </div>

        {/* Ticket 07.3: estado vacío */}
        {listaVisible.length === 0 ? (
          <p className="box box-warn">No se encontraron expedientes con esos criterios</p>
        ) : (
          <div className="grid-2">
            {listaVisible.map((alumno) => (
              <TarjetaExpediente
                key={alumno.id}
                alumno={alumno}
                seleccionado={seleccionado?.id === alumno.id}
                onSeleccionar={setSeleccionado}
              />
            ))}
          </div>
        )}
      </section>

      {/* Ticket 08: formulario controlado de alta */}
      <section className="card">
        <h2>Alta de nuevo expediente</h2>
        <form onSubmit={darDeAlta} noValidate>
          <div className="form-grid">
            <div>
              <label htmlFor="alta-nombre">Nombre completo *</label>
              <input
                id="alta-nombre"
                name="nombre"
                type="text"
                className="input"
                placeholder="Ej.: Elena Martínez"
                value={formulario.nombre}
                onChange={actualizarCampo}
              />
            </div>
            <div>
              <label htmlFor="alta-nota">Nota (0–10) *</label>
              <input
                id="alta-nota"
                name="nota"
                type="number"
                min="0"
                max="10"
                step="0.1"
                className="input"
                value={formulario.nota}
                onChange={actualizarCampo}
              />
            </div>
            <div>
              <label htmlFor="alta-modulos">Módulos (separados por comas)</label>
              <input
                id="alta-modulos"
                name="modulos"
                type="text"
                className="input"
                placeholder="Ej.: DI, PSP, AD"
                value={formulario.modulos}
                onChange={actualizarCampo}
              />
            </div>
          </div>

          {errorForm && (
            <p role="alert" className="msg-error">
              {errorForm}
            </p>
          )}

          <div className="btn-row">
            <button type="submit" className="btn">Dar de alta</button>
          </div>
        </form>

        <p className="file-hint">
          Archivo para mostrar en VS Code: <code className="code-inline">src/components/06_DemoIntegradora.jsx</code>
        </p>
      </section>
    </>
  );
}
