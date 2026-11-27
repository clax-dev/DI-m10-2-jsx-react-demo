# M10.2. JSX con React — Proyecto de Demostración para el Aula

**Autor:** Guillermo Prat Astillero · Desarrollo de Interfaces (2º DAM)
**Aplicación desplegada:** https://m10-2-jsx-react-demo-peach.vercel.app

## Mejoras implementadas (sprint de 10 tickets)

| Ticket | Archivo | Mejora |
|---|---|---|
| 01 | `App.jsx`, `index.css` | Selector de tema claro/oscuro (clase CSS + variables) y pie corporativo con año dinámico |
| 02 | `01_SintaxisYFragmentos.jsx` | Input controlado con validación inmediata (`role="alert"`) y saludo en tiempo real |
| 03 | `02_ExpresionesYEstilos.jsx` | Calculadora fiscal: IVA 21/10/4 %, descuento 0–50 % y desglose completo con 2 decimales |
| 04 | `03_RenderizadoCondicional.jsx` | Corrección de la trampa del `0`, botón "Marcar todas como leídas" y estado vacío |
| 05 | `04_ListasYKeys.jsx` | Control de duplicados (sin distinguir mayúsculas), buscador y contador "Mostrando X de Y" |
| 06 | `05_EventosYSeguridadXSS.jsx` | Historial de los 5 últimos eventos, limpiar historial y 3 payloads XSS de prueba |
| 07 | `06_DemoIntegradora.jsx` | Buscador por nombre combinable con "Solo aprobados", ordenación y estado vacío |
| 08 | `06_DemoIntegradora.jsx` | Expedientes en `useState` y formulario controlado de alta |
| 09 | `ResumenKPIs.jsx` | Componente de KPIs (total, nota media, % aprobados) que reacciona a filtros y altas |
| 10 | `06_DemoIntegradora.jsx` | Persistencia en `localStorage`, botón "Restablecer datos iniciales" y build limpio |

Además se corrigió un error de sintaxis del proyecto base en `05_EventosYSeguridadXSS.jsx` (comillas dobles anidadas en el valor inicial del input) que impedía compilar.

Proyecto educativo en **React 18 + Vite** diseñado para explicar paso a paso todas las características de **JSX (JavaScript XML)** directamente desde Visual Studio Code.

## Puesta en marcha rápida (3 pasos)

1. Abre esta carpeta en **Visual Studio Code**.
2. Abre una terminal integrada (`Ctrl + ñ` o `Ctrl + \``) y ejecuta:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Se abrirá automáticamente en `http://localhost:5173`.

## Guion sugerido para la exposición en clase

Cada pestaña de la aplicación corresponde a un archivo numerado dentro de `src/components/`, con comentarios guiados (`[CLAVE EXPOSICIÓN]`):

1. `01_SintaxisYFragmentos.jsx` — Nodo raíz único, Fragmentos (`<>...</>`), cierre obligatorio, `className`, `htmlFor` y componentes en Mayúscula.
2. `02_ExpresionesYEstilos.jsx` — Llaves `{ }` (expresiones vs. sentencias), estilos en línea `style={{ }}` en `camelCase` y valores ignorados por React.
3. `03_RenderizadoCondicional.jsx` — *Early return*, operador ternario (`? :`), operador `&&` y demostración en vivo de la **trampa del `0`**.
4. `04_ListasYKeys.jsx` — Transformación de arrays con `.map()` y la importancia real de la prop `key` en el algoritmo de reconciliación.
5. `05_EventosYSeguridadXSS.jsx` — Eventos `onClick={fn}` vs. `onClick={() => fn(arg)}` y demostración práctica de protección automática contra **XSS**.
6. `06_DemoIntegradora.jsx` — Ejemplo completo integrando todas las reglas de JSX en un mini-panel de módulos.
