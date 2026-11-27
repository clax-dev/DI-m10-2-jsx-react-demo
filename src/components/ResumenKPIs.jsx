// ============================================================================
// Ticket 09: COMPONENTE PRESENTACIONAL REUTILIZABLE
// ----------------------------------------------------------------------------
// - No tiene estado propio: todo lo calcula a partir de la prop `alumnos`.
// - Cuando el padre cambia la lista (alta, filtro, búsqueda), React vuelve a
//   renderizar este componente con la nueva prop y los KPIs se recalculan solos.
// ============================================================================

export default function ResumenKPIs({ alumnos }) {
  const total = alumnos.length;
  const media = total > 0 ? alumnos.reduce((suma, a) => suma + a.nota, 0) / total : 0;
  const aprobados = alumnos.filter((a) => a.nota >= 5).length;
  const porcentajeAprobados = total > 0 ? (aprobados / total) * 100 : 0;

  // Las tarjetas también son datos: se pintan con .map() y key estable
  const kpis = [
    { id: 'total', etiqueta: 'Total de alumnos', valor: total },
    { id: 'media', etiqueta: 'Nota media del grupo', valor: total > 0 ? media.toFixed(2) : '—' },
    {
      id: 'aprobados',
      etiqueta: 'Porcentaje de aprobados',
      valor: total > 0 ? `${porcentajeAprobados.toFixed(1)} %` : '—'
    }
  ];

  return (
    <div className="kpi-grid" aria-label="Indicadores del grupo">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="kpi">
          <div className="kpi-label">{kpi.etiqueta}</div>
          <div className="kpi-valor">{kpi.valor}</div>
        </div>
      ))}
    </div>
  );
}
