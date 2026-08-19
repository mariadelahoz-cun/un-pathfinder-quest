# CUN Career Compass

Quiero que construyas una plataforma web interactiva llamada "Descubre tu Especialización CUN", pensada para la Semana CUN. El objetivo es que estudiantes prospecto interactúen con una experiencia dinámica que combina preguntas y mini-interacciones visuales, para que al final el sistema les recomiende la especialización de posgrado de CUN que mejor se ajusta a su perfil de personalidad y sus objetivos profesionales.

1. Objetivo del producto

Captar el interés de estudiantes prospecto durante la Semana CUN mediante una experiencia entretenida, no un formulario aburrido.

Evaluar personalidad y objetivos del usuario a través de un flujo híbrido (preguntas de selección + mini-interacciones visuales/gamificadas).

Cruzar las respuestas con un motor de matching que recomiende una o varias especializaciones disponibles en CUN, con nivel de afinidad (%).

Capturar datos básicos del prospecto al final (nombre, correo, celular, ciudad) para seguimiento comercial/admisiones.

2. Estructura de la plataforma

Pantalla 1 — Landing / Bienvenida

Hero llamativo con el nombre del reto: "Descubre tu Especialización CUN" o similar.

Botón CTA grande: "Comenzar el reto".

Breve texto motivador (2-3 líneas) explicando que en menos de 5 minutos va a descubrir qué especialización va con su forma de pensar y sus metas.

Barra o ícono que indique "Toma menos de 5 minutos".

Pantalla 2 — Flujo híbrido de preguntas

Entre 8 y 12 pasos en total, mezclando dos tipos de interacción:

Preguntas de selección visual: tarjetas con ícono/ilustración + texto corto, el usuario elige una opción entre 3-4 (nada de texto largo ni checkboxes tradicionales).

Mini-interacciones visuales: por ejemplo, un slider para medir "qué tan orientado a datos vs. orientado a personas" es su perfil, un mapa de intereses donde arrastra íconos a una zona de "me gusta"/"no me gusta", o una rueda que gira y el usuario detiene para revelar una situación hipotética y elegir cómo reaccionaría.

Cada pregunta debe evaluar una combinación de: rasgos de personalidad (analítico, creativo, líder, colaborador, ejecutor), intereses temáticos (tecnología, educación, gestión, comunicación, innovación social, etc.) y objetivos profesionales (quiere emprender, quiere ascender en su empresa, quiere cambiar de carrera, quiere profundizar en su área actual).

Barra de progreso visible en todo momento ("Pregunta 4 de 10").

Transiciones animadas suaves entre pasos (fade o slide), nada brusco.

Sonido/microanimación de feedback cada vez que el usuario elige una opción (por ejemplo, la tarjeta seleccionada se ilumina con el verde institucional).

Pantalla 3 — Loading / Procesando resultado

Pantalla corta de 3-4 segundos con una animación de "calculando tu perfil" para generar expectativa, no un spinner genérico.

Pantalla 4 — Resultado

Revela la especialización recomendada con animación tipo "reveal" (cortina, confeti sutil, o efecto de tarjeta que se voltea).

Muestra:

Nombre de la especialización.

% de afinidad con el perfil del usuario.

3-4 frases explicando por qué esa especialización conecta con sus respuestas (personalidad + objetivos).

Una segunda opción de especialización como "también te podría interesar" con % menor de afinidad.

Botón para "Ver más de esta especialización" que despliega la info que voy a subir (pénsum, dirigido a, duración, modalidad).

Botón para compartir el resultado en redes (genera una tarjeta visual tipo story de Instagram con el resultado).

Pantalla 5 — Captura de datos

Formulario corto (nombre, correo, celular, ciudad) para que el usuario reciba el resultado detallado y sea contactado por admisiones.

Mensaje claro de qué pasa después ("Un asesor académico te va a contactar para contarte más sobre el programa").

3. Contenido dinámico

Voy a subir la información de todas las especializaciones disponibles (nombre, descripción, público objetivo, duración, modalidad, posible pénsum). Estructura el proyecto para que estos datos vivan en un archivo o base de datos separada (JSON o tabla), fácil de actualizar, y que el motor de matching los use como fuente de verdad. No hardcodees las especializaciones dentro de la lógica de la interfaz.

4. Lógica de matching

Cada pregunta debe tener un peso o vector de puntuación asociado a rasgos de personalidad y áreas de interés.

Al final, el sistema suma los puntajes por especialización y ordena de mayor a menor afinidad.

Deja la lógica de scoring en un archivo separado y comentado, para que yo pueda ajustar los pesos fácilmente según las especializaciones reales que suba.

5. Diseño visual

Paleta de colores institucional CUN:

Verde oscuro (color base, estructura y estabilidad de marca) — Pantone 365C, aproximado en hex #5B8C3A (verificar conversión exacta con el manual de marca antes de producción final).

Verde claro (color de resalte, uso exclusivo para acentos/highlights) — Pantone 376C, aproximado en hex #84BD00.

Gris (color complementario, para textos secundarios/legales) — Pantone 423C, aproximado en hex #97999B.

Usa el verde oscuro como color dominante de fondo/estructura, el verde claro solo para elementos de énfasis (botones activos, iconos seleccionados, barra de progreso), y el gris para textos de apoyo, nunca como protagonista.

Tipografía:

Para títulos grandes o el nombre del reto, usa una fuente con estilo manuscrito/orgánico que transmita cercanía (busca alguna disponible en Google Fonts que se acerque a ese espíritu, como "Caveat" o "Kalam", solo para títulos puntuales, no para texto de lectura).

Para todo el resto de la interfaz (preguntas, botones, resultados, formularios) usa una fuente geométrica sans-serif limpia, en la línea de Century Gothic (usa "Poppins" o "Questrial" de Google Fonts como equivalente web).

Estilo general:

Diseño moderno, limpio, con mucho espacio en blanco, tarjetas con bordes redondeados suaves.

Ilustraciones o iconografía flat/minimalista, no fotos de stock genéricas.

Totalmente responsive, priorizando mobile-first porque la mayoría va a interactuar desde el celular en el evento.

Microanimaciones en cada interacción (hover, selección, transición) para que se sienta vivo y no un formulario estático.

6. Funcionalidades técnicas

Guardar las respuestas del usuario en el estado de la sesión, sin perder el progreso si recarga por accidente (usa almacenamiento en memoria de React, no localStorage).

Panel de administrador simple y protegido para poder ver cuántas personas completaron el reto y cuáles fueron los resultados más frecuentes (útil para reportar después del evento).

Estructura pensada para poder actualizar fácilmente las preguntas y las especializaciones sin tocar el código de la interfaz.

7. Tono de copy

Cercano, directo, motivador, sin sonar corporativo ni acartonado.

Nada de frases genéricas de marketing ("descubre tu potencial ilimitado"), preferible algo concreto y honesto sobre lo que el estudiante va a obtener.


## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e8510886-10e8-416d-84ca-dd336c682579).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
