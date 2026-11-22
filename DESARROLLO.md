# Notas de desarrollo · Cuenta Clara (landing neo-brutalista)

Guía para retomar el proyecto: cómo está armado, por qué y cómo cambiarlo.

## Puesta en marcha

Sitio estático sin build ni dependencias:

```bash
python -m http.server 8000      # o: npx serve .
```

Se publica con GitHub Pages desde la raíz de la rama principal.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Hero con maqueta del producto en HTML, cinta en movimiento, funciones, calculadoras, precios, testimonios, preguntas frecuentes (`<details>`) y pie |
| `estilo.css` | Variables del estilo neo-brutalista, componentes (botón, tarjeta, pegatina), layout y animaciones |
| `app.js` | Maqueta animada, calculadora de ITBMS, calculadora de ahorro y precios mensual o anual |

## Sistema visual

El estilo se apoya en pocas variables de `estilo.css`:

| Variable | Valor | Uso |
|---|---|---|
| `--borde` | `3px solid var(--negro)` | Todos los bordes |
| `--sombra`, `--sombra-chica` | Sombras desplazadas sin desenfoque | Profundidad "dura"; al presionar un botón la sombra desaparece y el botón se desplaza para simular que se hunde |
| `--lima`, `--rosa`, `--azul`, `--amarillo` | Colores planos | Cada color identifica un tipo de bloque |
| `--crema`, `--negro`, `--gris` | Fondo y texto | |
| `--display` (Unbounded), `--texto` (Public Sans) | Tipografía | |

## Cómo funciona `app.js`

- **`animarMaqueta()`:** escribe el nombre del cliente letra por letra, simula el envío de la factura y muestra la notificación de pago, en bucle. Si `reducido` (`prefers-reduced-motion`) es verdadero, muestra directamente el estado final.
- **`calculadoraITBMS()`:** subtotal × `ITBMS` (7 %), con casilla para servicios exentos; recalcula en cada `input`.
- **`calculadoraAhorro()`:** horas ahorradas al mes según facturas, minutos por factura y tarifa por hora.
- **`precios()`:** interruptor mensual/anual (`.interruptor button` con `role="radio"`, `aria-checked` y flechas del teclado). Cada monto es un `.precio span` con `data-mensual` y `data-anual`; al cambiar de período se reescribe el texto y la nota `#nota-precio`.
- Formato de moneda con `usd()` (dos decimales).

## Detalles a recordar

- La cinta inclinada se sale del ancho de la pantalla a propósito; `overflow-x: clip` en el contenedor evita el scroll horizontal en celulares (`hidden` rompería el `position: sticky` del menú).
- El contexto local (ITBMS del 7 %, Yappy, ACH) está en el texto de `index.html` y en la constante `ITBMS`.

## Cómo extenderlo

- **Nuevo plan de precios:** duplicar una tarjeta de precios en `index.html` con su `<span data-mensual="..." data-anual="...">`; `precios()` la toma sola.
- **Otra tasa de impuesto:** cambiar `ITBMS` en `app.js` y el texto que la menciona.
- **Nuevo color de bloque:** agregar la variable en `:root` y una clase que la use.

## Pendientes

- Los botones de registro no llevan a ningún lado: es una landing de demostración.
- Se podría agregar un modo oscuro respetando el estilo (bordes claros sobre fondo oscuro).

> Producto, precios, cifras y testimonios ficticios.
