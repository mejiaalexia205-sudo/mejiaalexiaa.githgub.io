// =====================================
// ESTADO GLOBAL
// =====================================
let nombre = "";
let score = 0;
let nivelEnCurso = null;          // "jaguar" | "mujer"
let chiapasCompletado = false;
let preguntaUsadaJaguar = null;

// Estado Jaguar
let preguntaActual = null;
let intentosFallidos = 0;
let intervaloCronometro = null;
let tiempoRestante = 0;

// Estado Mujer
let preguntaActualMujer = null;
let intentosFallidosMujer = 0;
let intervaloCronometroMujer = null;
let tiempoRestanteMujer = 0;
let mapaTimer = null;
let bienvenidaChiapasMostrada = false;



// Estado Oaxaca
let intervaloCronometroOaxaca = null;
let tiempoRestanteOaxaca = 0;
let intentosFallidosOaxaca = 0;


// Estado Guerrero
let preguntaActualGuerrero = null;
let intentosFallidosGuerrero = 0;
let intervaloCronometroGuerrero = null;
let tiempoRestanteGuerrero = 0;



function actualizarScore() {
  const el = document.getElementById("score");
  if (el) el.innerText = score;
}





// =====================================
// UTILIDADES DE PANTALLAS Y NOMBRE
// =====================================

function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
  const pantalla = document.getElementById(id);
  if (!pantalla) {
    console.warn(`No se encontró la pantalla con id "${id}"`);
    return;
  }
  pantalla.classList.add("activa");

  if (id === "mapa") {
    const mensaje = document.getElementById("mensajeBienvenida");
    if (mensaje) mensaje.style.display = "none";

    if (!bienvenidaChiapasMostrada) {
      // Solo la primera vez que entras al mapa
      if (mapaTimer) clearTimeout(mapaTimer);
      mapaTimer = setTimeout(() => {
        if (mensaje) {
          mensaje.style.display = "block";
          bienvenidaChiapasMostrada = true; // marcar que ya se mostró
        }
      }, 3000);
    }
  }
}


function guardarNombre() {
  const input = document.getElementById("jugador");
  if (!input) {
    console.error("No se encontró el input #jugador.");
    return;
  }
  const nombreIngresado = (input.value || "").trim();
  if (!nombreIngresado) {
    alert("Por favor, ingresa tu nombre para continuar.");
    input.focus();
    return;
  }
  nombre = nombreIngresado;
  const span = document.getElementById("nombreJugador");
  if (span) span.innerText = nombre;
  mostrarPantalla("bienvenida");
}

// Mensaje de bienvenida Chiapas → activa Jaguar y bloquea Mujer
function cerrarMensaje() {
  const mensaje = document.getElementById("mensajeBienvenida");
  if (mensaje) mensaje.style.display = "none";

   // Activar Jaguar (color + pulsación)
  const jaguar = document.getElementById("jaguarImg");
  if (jaguar) {
    jaguar.classList.remove("bnw"); // ← quita blanco y negro
    jaguar.classList.add("pulsar"); // ← animación
    jaguar.style.cursor = "pointer";
    jaguar.onclick = () => iniciarNivelJaguar();
  }


 // Bloquear Mujer (blanco y negro, sin animación)
  const mujer = document.getElementById("mujerImg");
  if (mujer) {
    mujer.classList.add("bnw"); // ← se queda en blanco y negro
    mujer.classList.remove("pulsar"); // ← sin animación
    mujer.style.cursor = "not-allowed";
    mujer.onclick = null;
  }

}





// ===============================================================================================================
// LÓGICA DE CHIAPAS COMPLETA
// ===============================================================================================================
const datosCuriososChiapas = [
  "En Chiapas hay selvas enormes donde viven jaguares. Cuidarlas ayuda a que los animales tengan casa.",
  "Los ríos de Chiapas dan energía limpia con las presas, como si fueran grandes baterías de agua.",
  "En muchos pueblos de Chiapas se usan huertos caseros: la gente siembra su comida y cuida la tierra.",
  "El café de Chiapas se cultiva en montañas verdes, y muchos campesinos lo hacen sin dañar la naturaleza.",
  "En Chiapas se protege la selva Lacandona, un lugar lleno de plantas y animales únicos en el mundo.",
  "Algunas comunidades de Chiapas usan paneles solares para tener luz sin contaminar.",
  "Los niños en Chiapas aprenden que separar la basura ayuda a mantener limpio su pueblo.",
  "En Chiapas se cuida el agua porque es muy valiosa: sin agua no hay vida.",
  "Los bosques de Chiapas ayudan a que tengamos aire limpio para respirar.",
  "En las montañas de Chiapas se siembra maíz cuidando la tierra con respeto.",
  "Los ríos de Chiapas son el hogar de peces y tortugas que necesitan agua limpia.",
  "En Chiapas se hacen proyectos para plantar más árboles y cuidar la selva.",
  "El Parque Nacional Lagunas de Montebello protege lagos de colores mágicos.",
  "Los campesinos de Chiapas usan técnicas antiguas para sembrar sin químicos.",
  "En algunos pueblos se recicla el plástico para hacer artesanías útiles.",
  "Los murciélagos de Chiapas ayudan a polinizar flores y mantener la selva viva.",
  "Los niños aprenden que cuidar los animales es cuidar su propio futuro.",
  "En Chiapas se promueve el ecoturismo: visitar la naturaleza sin dañarla.",
  "Los árboles de Chiapas guardan agua en sus raíces y ayudan a que no falte.",
  "En Chiapas se enseña que la naturaleza es como un amigo: hay que cuidarla."
];


const preguntasChiapas = [
  {
    pregunta: "¿Cuál es un animal famoso de Chiapas?",
    opciones: ["Jaguar", "Perro", "Gato"],
    correcta: "A",
    retro: "El jaguar vive en la selva de Chiapas y es un símbolo muy importante."
  },
  {
    pregunta: "¿Qué comida típica se prepara en Chiapas?",
    opciones: ["Pizza", "Tamales", "Hamburguesa"],
    correcta: "B",
    retro: "Los tamales son una comida tradicional hecha con masa de maíz."
  },
  {
    pregunta: "¿Cuál es la capital de Chiapas?",
    opciones: ["Monterrey", "Tuxtla Gutiérrez", "Cancún"],
    correcta: "B",
    retro: "Tuxtla Gutiérrez es la ciudad capital de Chiapas."
  },
  {
    pregunta: "¿Qué fiesta se celebra con música y bailes en Chiapas?",
    opciones: ["La Fiesta Grande de Chiapa de Corzo", "Feria de San Marcos", "Fiesta de la Virgen de Guadalupe"],
    correcta: "A",
    retro: "Es una fiesta muy alegre con danzantes llamados 'Parachicos'."
  },
  {
    pregunta: "¿Qué bebida se produce en Chiapas?",
    opciones: ["Refresco", "Café", "Jugo de manzana"],
    correcta: "B",
    retro: "El café de Chiapas es famoso en todo el mundo."
  },
  {
    pregunta: "¿Qué río importante pasa por Chiapas?",
    opciones: ["Río Nilo", "Río Amazonas", "Río Grijalva"],
    correcta: "C",
    retro: "El río Grijalva atraviesa Chiapas y forma el Cañón del Sumidero."
  },
  {
    pregunta: "¿Qué lugar turístico tiene paredes enormes de piedra?",
    opciones: ["Pirámides de Egipto", "Cañón del Sumidero", "Torre Eiffel"],
    correcta: "B",
    retro: "El Cañón del Sumidero es un lugar natural impresionante en Chiapas."
  },
  {
    pregunta: "¿Qué traje típico usan los danzantes en Chiapa de Corzo?",
    opciones: ["Traje de baño", "Traje de parachico", "Traje de astronauta"],
    correcta: "B",
    retro: "El traje de parachico es muy colorido y se usa en la Fiesta Grande de Chiapa de Corzo."
  },
  {
    pregunta: "¿Qué artesanía se hace en Chiapas?",
    opciones: ["Aviones", "Bordados", "Robots"],
    correcta: "B",
    retro: "Los bordados chiapanecos son muy coloridos y hechos a mano."
  },
  {
    pregunta: "¿Qué fruta se cultiva en Chiapas?",
    opciones: ["Kiwi", "Uvas", "Mango"],
    correcta: "C",
    retro: "En Chiapas se cultivan mangos jugosos y dulces."
  },
  {
    pregunta: "¿Qué selva famosa está en Chiapas?",
    opciones: ["Selva del Amazonas", "Selva Lacandona", "Selva Negra"],
    correcta: "B",
    retro: "La Selva Lacandona es hogar de jaguares, monos y muchas plantas."
  },
  {
    pregunta: "¿Qué lago tiene colores diferentes en Chiapas?",
    opciones: ["Lagunas de Montebello", "Lago Ness", "Lago Titicaca"],
    correcta: "A",
    retro: "Las Lagunas de Montebello cambian de color por los minerales del agua."
  },
  {
    pregunta: "¿Qué instrumento musical se usa en las fiestas de Chiapas?",
    opciones: ["Marimba", "Guitarra eléctrica", "Batería"],
    correcta: "A",
    retro: "La marimba es un instrumento tradicional de Chiapas."
  },
  {
    pregunta: "¿Qué animal marino se puede ver en Chiapas?",
    opciones: ["Tortuga", "Delfín", "Tiburón"],
    correcta: "A",
    retro: "En las playas de Chiapas llegan tortugas a poner sus huevos."
  },
  {
    pregunta: "¿Qué idioma además del español se habla en Chiapas?",
    opciones: ["Alemán", "Tzotzil", "Francés"],
    correcta: "B",
    retro: "El tzotzil es una lengua indígena que se habla en Chiapas."
  },
  {
    pregunta: "¿Qué dulce típico se hace en Chiapas?",
    opciones: ["Chocolate", "Helado", "Dulce de calabaza"],
    correcta: "A",
    retro: "El chocolate se prepara con cacao cultivado en Chiapas."
  },
  {
    pregunta: "¿Qué animal ayuda a polinizar flores en Chiapas?",
    opciones: ["Elefante", "Murciélago", "Cocodrilo"],
    correcta: "B",
    retro: "Los murciélagos ayudan a que las flores den frutos."
  },
  {
    pregunta: "¿Qué comida típica se hace con plátano en Chiapas?",
    opciones: ["Hot dog", "Empanadas de plátano", "Pizza"],
    correcta: "B",
    retro: "Las empanadas de plátano son un postre delicioso de Chiapas."
  },
  {
    pregunta: "¿Qué animal se protege mucho en Chiapas?",
    opciones: ["Perro", "Jaguar", "Conejo"],
    correcta: "B",
    retro: "El jaguar es un animal en peligro y se cuida en Chiapas."
  },
  {
    pregunta: "¿Qué bebida refrescante se toma en Chiapas?",
    opciones: ["Refresco", "Agua de coco", "Pozol"],
    correcta: "C",
    retro: "El pozol es una bebida hecha con maíz y cacao."
  },
  {
    pregunta: "¿Qué montaña importante está en Chiapas?",
    opciones: ["Popocatépetl", "Volcán Tacaná", "Monte Everest"],
    correcta: "B",
    retro: "El volcán Tacaná es el más alto de Chiapas."
  },
  {
    pregunta: "¿Qué animal pequeño vive en la selva de Chiapas?",
    opciones: ["Mono", "Tigre", "Oso polar"],
    correcta: "A",
    retro: "Los monos saltan entre los árboles de la selva chiapaneca."
  },
  {
    pregunta: "¿Qué flor se cultiva en Chiapas?",
    opciones: ["Orquídea", "Rosa", "Tulipán"],
    correcta: "A",
    retro: "Las orquídeas crecen en la selva húmeda de Chiapas."
  },
  {
    pregunta: "¿Qué vestimenta tradicional se usa en Chiapas?",
    opciones: ["Uniforme escolar", "Traje espacial", "Traje de parachico"],
    correcta: "C",
    retro: "El traje de parachico se usa en la Fiesta Grande de Chiapa de Corzo."
  },
  {
    pregunta: "¿Qué animal se puede ver en los ríos de Chiapas?",
    opciones: ["Pingüino", "Cocodrilo", "Caballo"],
    correcta: "B",
    retro: "Los cocodrilos viven en los ríos y lagunas de Chiapas."
  }
];



// =====================================
// NIVEL JAGUAR: flujo completo
// =====================================
        function iniciarNivelJaguar() {
        nivelEnCurso = "jaguar";
        mostrarDatoCuriosoChiapas();
        }

        function mostrarDatoCuriosoChiapas() {
        const texto = datosCuriososChiapas[Math.floor(Math.random() * datosCuriososChiapas.length)];
        const pantalla = document.getElementById("datoCuriosoChiapas");
        const textoElemento = document.getElementById("textoCuriosoChiapas");

        textoElemento.innerHTML = `<strong style="font-size:40px;">¿Sabías que… 💡</strong><br><br>${texto}`;
        pantalla.style.display = "flex";

        setTimeout(() => {
            pantalla.style.display = "none";
            mostrarPreguntaChiapas();
        }, 7000);
        }

        function mostrarPreguntaChiapas() {
        const pantalla = document.getElementById("preguntaChiapas");
        pantalla.style.display = "flex";

        // Seleccionar pregunta SOLO si no hay una activa
        if (!preguntaActual) {
            const indice = Math.floor(Math.random() * preguntasChiapas.length);
            preguntaActual = preguntasChiapas[indice];
            preguntaUsadaJaguar = indice;  // para excluirla en Mujer
            intentosFallidos = 0;
        }

        // Pintar textos
        document.getElementById("textoPreguntaChiapas").innerText = preguntaActual.pregunta;
        document.getElementById("opcionA").innerText = preguntaActual.opciones[0];
        document.getElementById("opcionB").innerText = preguntaActual.opciones[1];
        document.getElementById("opcionC").innerText = preguntaActual.opciones[2];

        // Cronómetro
        iniciarCronometroChiapas(15);

        // Evaluación
        const form = document.getElementById("formularioPreguntaChiapas");
        form.onsubmit = function (e) {
            e.preventDefault();
            detenerCronometroChiapas();
            const seleccion = form.respuesta.value;

            if (seleccion === preguntaActual.correcta) {
            pantalla.style.display = "none";

            if (intentosFallidos === 0) { score += 20; mostrarPantalla20Puntos(); }
            else if (intentosFallidos === 1) { score += 15; mostrarPantalla15Puntos(); }
            else { score += 10; mostrarPantalla10Puntos(); }

            actualizarScore();
            preguntaActual = null;  // limpiar para siguiente ronda
            } else {
            intentosFallidos++;
            
            mostrarMensajeIntentaDeNuevo();
            // NO reabrir pregunta automáticamente: el botón del mensaje la mantiene en pantalla
            }
        };
        }

        function iniciarCronometroChiapas(segundos) {
        detenerCronometroChiapas();
        tiempoRestante = segundos;
        const cronometroElemento = document.getElementById("cronometro");
        cronometroElemento.innerText = `Tiempo: ${tiempoRestante} segundos`;

        intervaloCronometro = setInterval(() => {
            tiempoRestante--;
            cronometroElemento.innerText = `Tiempo: ${tiempoRestante} segundos`;
            if (tiempoRestante <= 0) {
            detenerCronometroChiapas();
            mostrarMensajeTiempoAgotado();
            intentosFallidos++;
            
            actualizarScore();
            // NO reabrir pregunta automáticamente
            }
        }, 1000);
        }
        function detenerCronometroChiapas() {
        if (intervaloCronometro) {
            clearInterval(intervaloCronometro);
            intervaloCronometro = null;
        }
        }

        function completarNivelJaguar() {
        const jaguar = document.getElementById("jaguarImg");
        if (jaguar) {
            jaguar.classList.remove("bnw", "pulsar");
            jaguar.style.cursor = "default";
            jaguar.onclick = null;
        }

        const mujer = document.getElementById("mujerImg");
        if (mujer) {
            mujer.classList.remove("bnw");
            mujer.classList.add("pulsar");
            mujer.style.cursor = "pointer";
            mujer.onclick = () => iniciarNivelMujer();
        }

        const bienvenidaChiapas = document.getElementById("mensajeBienvenida");
        if (bienvenidaChiapas) bienvenidaChiapas.style.display = "none";

        mostrarPantalla("mapa");
        }




// =====================================
// NIVEL MUJER: flujo completo
// =====================================
        function iniciarNivelMujer() {
        nivelEnCurso = "mujer";
        mostrarDatoCuriosoMujer();
        }

        function mostrarDatoCuriosoMujer() {
        const texto = datosCuriososChiapas[Math.floor(Math.random() * datosCuriososChiapas.length)];
        const pantalla = document.getElementById("datoCuriosoMujer");
        const textoElemento = document.getElementById("textoCuriosoMujer");

        const bienvenidaChiapas = document.getElementById("mensajeBienvenida");
        if (bienvenidaChiapas) bienvenidaChiapas.style.display = "none";

        textoElemento.innerHTML = `<strong style="font-size:40px;">¿Sabías que… 💡</strong><br><br>${texto}`;
        pantalla.style.display = "flex";

        setTimeout(() => {
            pantalla.style.display = "none";
            mostrarPreguntaMujer();
        }, 7000);
        }

        function mostrarPreguntaMujer() {
        const pantalla = document.getElementById("preguntaMujer");
        pantalla.style.display = "flex";

        // Selección de pregunta (evitar repetir la del jaguar)
        const preguntasDisponibles = preguntasChiapas.filter((_, i) => i !== preguntaUsadaJaguar);
        if (!preguntaActualMujer) {
            preguntaActualMujer = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
            intentosFallidosMujer = 0;
        }

        document.getElementById("textoPreguntaMujer").innerText = preguntaActualMujer.pregunta;
        document.getElementById("opcionAMujer").innerText = preguntaActualMujer.opciones[0];
        document.getElementById("opcionBMujer").innerText = preguntaActualMujer.opciones[1];
        document.getElementById("opcionCMujer").innerText = preguntaActualMujer.opciones[2];

        iniciarCronometroMujer(15);

        const form = document.getElementById("formularioPreguntaMujer");
        form.reset();
        form.onsubmit = function (e) {
            e.preventDefault();
            detenerCronometroMujer();
            const seleccion = form.respuesta.value;

            if (seleccion === preguntaActualMujer.correcta) {
            pantalla.style.display = "none";

            if (intentosFallidosMujer === 0) { score += 20; mostrarPantalla20Puntos(); }
            else if (intentosFallidosMujer === 1) { score += 15; mostrarPantalla15Puntos(); }
            else { score += 10; mostrarPantalla10Puntos(); }

            actualizarScore();
            // NO limpiamos aquí retro; la tomamos en mostrarPantallaXXPuntos
            } else {
            intentosFallidosMujer++;
            
            mostrarMensajeIntentaDeNuevo();
            // NO reabrir pregunta automáticamente
            }
        };
        }

        function iniciarCronometroMujer(segundos) {
        detenerCronometroMujer();
        tiempoRestanteMujer = segundos;
        const el = document.getElementById("cronometroMujer");
        el.innerText = `Tiempo: ${tiempoRestanteMujer} segundos`;

        intervaloCronometroMujer = setInterval(() => {
            tiempoRestanteMujer--;
            el.innerText = `Tiempo: ${tiempoRestanteMujer} segundos`;
            if (tiempoRestanteMujer <= 0) {
            detenerCronometroMujer();
            mostrarMensajeTiempoAgotado();
            intentosFallidosMujer++;
            // NO reabrir pregunta automáticamente
            }
        }, 1000);
        }
        function detenerCronometroMujer() {
        if (intervaloCronometroMujer) {
            clearInterval(intervaloCronometroMujer);
            intervaloCronometroMujer = null;
        }
        }










// =====================================
// MENSAJES DE ERROR / TIEMPO AGOTADO
// =====================================
        function mostrarMensajeIntentaDeNuevo() {
        document.getElementById("mensajeIntentaDeNuevo").style.display = "flex";
        }




        function cerrarMensajeIntenta() {
        document.getElementById("mensajeIntentaDeNuevo").style.display = "none";

        if (nivelEnCurso === "jaguar") {
          mostrarPreguntaChiapas();
          iniciarCronometroChiapas(12);

        } else if (nivelEnCurso === "mujer") {
          mostrarPreguntaMujer();
          iniciarCronometroMujer(12);

        } else if (nivelEnCurso === "botellaOaxaca" || nivelEnCurso === "aveOaxaca") {
          mostrarPreguntaOaxaca();
          if (intentosFallidosOaxaca === 0) iniciarCronometroOaxaca(15);
          else if (intentosFallidosOaxaca === 1) iniciarCronometroOaxaca(12);
          else iniciarCronometroOaxaca(10);

        } else if (nivelEnCurso === "iconoAcapulco" || nivelEnCurso === "iconoTigre") {
          mostrarPreguntaGuerrero();
          if (intentosFallidosGuerrero === 0) iniciarCronometroGuerrero(15);
          else if (intentosFallidosGuerrero === 1) iniciarCronometroGuerrero(12);
          else iniciarCronometroGuerrero(10);
        }
      }




        

        function mostrarMensajeTiempoAgotado() {
        document.getElementById("mensajeTiempoAgotado").style.display = "flex";
        }



       function cerrarMensajeTiempo() {
        document.getElementById("mensajeTiempoAgotado").style.display = "none";

        if (nivelEnCurso === "jaguar") {
          mostrarPreguntaChiapas();
          iniciarCronometroChiapas(12);

        } else if (nivelEnCurso === "mujer") {
          mostrarPreguntaMujer();
          iniciarCronometroMujer(12);

        } else if (nivelEnCurso === "botellaOaxaca" || nivelEnCurso === "aveOaxaca") {
          mostrarPreguntaOaxaca();
          if (intentosFallidosOaxaca === 0) iniciarCronometroOaxaca(15);
          else if (intentosFallidosOaxaca === 1) iniciarCronometroOaxaca(12);
          else iniciarCronometroOaxaca(10);

        } else if (nivelEnCurso === "iconoAcapulco" || nivelEnCurso === "iconoTigre") {
          mostrarPreguntaGuerrero();
          if (intentosFallidosGuerrero === 0) iniciarCronometroGuerrero(15);
          else if (intentosFallidosGuerrero === 1) iniciarCronometroGuerrero(12);
          else iniciarCronometroGuerrero(10);
        }
      }







// =====================================
// PUNTOS Y CIERRES
// =====================================
        function mostrarPantalla20Puntos() {
        document.getElementById("nombre20puntos").innerText = nombre;
        // Retro según nivel actual
        const retro = (nivelEnCurso === "mujer" ? preguntaActualMujer?.retro : preguntaActual?.retro) || "";
        document.getElementById("retro20puntos").innerText = retro;
        document.getElementById("pantalla20puntos").style.display = "flex";
        }

        function mostrarPantalla15Puntos() {
        document.getElementById("nombre15puntos").innerText = nombre;
        const retro = (nivelEnCurso === "mujer" ? preguntaActualMujer?.retro : preguntaActual?.retro) || "";
        document.getElementById("retro15puntos").innerText = retro;
        document.getElementById("pantalla15puntos").style.display = "flex";
        }

        function mostrarPantalla10Puntos() {
        document.getElementById("nombre10puntos").innerText = nombre;
        const retro = (nivelEnCurso === "mujer" ? preguntaActualMujer?.retro : preguntaActual?.retro) || "";
        document.getElementById("retro10puntos").innerText = retro;
        document.getElementById("pantalla10puntos").style.display = "flex";
        }

        function cerrarPantalla20() {
        document.getElementById("pantalla20puntos").style.display = "none";
        manejarCierrePuntos();
        }
        function cerrarPantalla15() {
        document.getElementById("pantalla15puntos").style.display = "none";
        manejarCierrePuntos();
        }
        function cerrarPantalla10() {
        document.getElementById("pantalla10puntos").style.display = "none";
        manejarCierrePuntos();
        }



       function manejarCierrePuntos() {
        // Limpiar preguntas y cronómetros por seguridad
        detenerCronometroChiapas();
        detenerCronometroMujer();
        detenerCronometroOaxaca();
        detenerCronometroGuerrero();

        preguntaActual = null;
        preguntaActualMujer = null;
        preguntaActualGuerrero = null;

        intentosFallidos = 0;
        intentosFallidosMujer = 0;
        intentosFallidosOaxaca = 0;
        intentosFallidosGuerrero = 0;


        if (nivelEnCurso === "jaguar") {
          // Jaguar termina: desbloquea Mujer y regresa al mapa
          completarNivelJaguar();

        } else if (nivelEnCurso === "mujer") {
          // Mujer termina: Chiapas completado → ir a Oaxaca
          chiapasCompletado = true;

          const jaguar = document.getElementById("jaguarImg");
          if (jaguar) {
            jaguar.classList.remove("bnw", "pulsar");
            jaguar.style.cursor = "default";
            jaguar.onclick = null;
          }

          const mujer = document.getElementById("mujerImg");
          if (mujer) {
            mujer.classList.remove("bnw", "pulsar");
            mujer.style.cursor = "default";
            mujer.onclick = null;
          }

          const bienvenidaChiapas = document.getElementById("mensajeBienvenida");
          if (bienvenidaChiapas) bienvenidaChiapas.style.display = "none";

          mostrarPantallaOaxaca();


        } else if (nivelEnCurso === "botellaOaxaca") {
            // Botella completada → regresa al mapa, bloquea botella y activa ave
            completarNivelBotellaOaxaca();

          } else if (nivelEnCurso === "aveOaxaca") {
            // Ave completada → regresa al mapa, bloquea ave y activa transición a Guerrero
            completarNivelAveOaxaca();

          } else if (nivelEnCurso === "iconoAcapulco") {
            // Acapulco completado → bloquea Acapulco y activa Tigre
            completarNivelAcapulcoGuerrero();

          } else if (nivelEnCurso === "iconoTigre") {
            // Tigre completado → bloquea todos los íconos de Guerrero
            completarNivelTigreGuerrero();

          } else {
            // Cualquier otro contexto → regresa al mapa genérico
            mostrarPantalla("mapa");
          }
        }







// ===============================================================================================================
// LÓGICA DE OAXACA COMPLETA
// ===============================================================================================================


function mostrarPantallaOaxaca() {
  const pantalla = document.getElementById("pantallaOaxaca");
  if (pantalla) pantalla.style.display = "flex";

  // Mostrar iconos y bienvenida según tu lógica actual
  setTimeout(() => {
    const iconos = document.getElementById("iconosOaxaca");
    if (iconos) iconos.style.display = "block";

    setTimeout(() => {
      const bienvenida = document.getElementById("bienvenidaOaxaca");
      if (bienvenida) bienvenida.style.display = "block";
    }, 3000);
  }, 2000);
}


function iniciarNivelOaxaca() {
  // Ocultar bienvenida
  document.getElementById("bienvenidaOaxaca").style.display = "none";

  // Poner todos los íconos en blanco y negro
  document.querySelectorAll("#iconosOaxaca .icono-oaxaca").forEach(icono => {
    icono.classList.add("icono-estado"); // filtro BN
    icono.classList.remove("icono-activo", "pulsacion");
  });

  // Activar la botella como primer nivel
  const botella = document.getElementById("botellaOaxaca");
  botella.classList.remove("icono-estado");
  botella.classList.add("icono-activo", "pulsacion");
  botella.style.cursor = "pointer";

  // Botella
botella.onclick = () => {
  nivelEnCurso = "botellaOaxaca";   // ← importante
  botella.classList.remove("pulsacion");
  mostrarDatoCuriosoOaxaca();
};

// Ave
ave.onclick = () => {
  nivelEnCurso = "aveOaxaca";       // ← importante
  ave.classList.remove("pulsacion");
  mostrarDatoCuriosoOaxaca(); // o mostrarPreguntaOaxaca() según tu diseño
};


}



function completarNivelBotellaOaxaca() {
  // Bloquear botella
  const botella = document.getElementById("botellaOaxaca");
  if (botella) {
    botella.classList.remove("icono-activo", "pulsacion");
    botella.style.cursor = "default";
    botella.onclick = null;
  }

  // Asegurar que el mapa de Oaxaca esté visible
  const mapa = document.getElementById("pantallaOaxaca"); // usa el id real de tu HTML
  if (mapa) mapa.style.display = "flex";

  // Asegurar que los iconos estén visibles
  const iconos = document.getElementById("iconosOaxaca");
  if (iconos) iconos.style.display = "block";

  // Ocultar bienvenida
  const bienvenidaOaxaca = document.getElementById("bienvenidaOaxaca");
  if (bienvenidaOaxaca) bienvenidaOaxaca.style.display = "none";

  // Activar el ave
  const ave = document.getElementById("aveOaxaca");
  if (ave) {
    ave.classList.remove("icono-estado");
    ave.classList.add("icono-activo", "pulsacion");
    ave.style.cursor = "pointer";
    ave.onclick = () => {
      nivelEnCurso = "aveOaxaca";
      ave.classList.remove("pulsacion");
      mostrarDatoCuriosoOaxaca(); // o mostrarPreguntaOaxaca()
    };
  }
}



function completarNivelAveOaxaca() {
  // Bloquear todos los íconos de Oaxaca y Chiapas
  document.querySelectorAll("#iconosOaxaca .icono-oaxaca, #iconosChiapas .icono-chiapas").forEach(icono => {
    icono.onclick = null;
    icono.style.cursor = "default";
    icono.classList.remove("icono-activo", "pulsacion");
    icono.classList.add("icono-completado"); // opcional: para que se vean en color fijo
  });

  // Asegurar que la pantalla de Oaxaca siga visible
  const pantallaOaxaca = document.getElementById("pantallaOaxaca");
  if (pantallaOaxaca) pantallaOaxaca.style.display = "flex";

  const mapaOaxaca = document.getElementById("mapaOaxaca");

  // 3 segundos después → cambiar fondo a Guerrero
  setTimeout(() => {
    if (mapaOaxaca) mapaOaxaca.style.backgroundImage = "url('img/mapa-guerrero.png')";

    // 3 segundos después → mostrar íconos de Guerrero
    setTimeout(() => {
      const iconosGuerrero = document.getElementById("iconosGuerrero");
      if (iconosGuerrero) iconosGuerrero.style.display = "block";

      // 3 segundos después → mostrar bienvenida Guerrero
      setTimeout(() => {
        document.getElementById("bienvenidaGuerrero").style.display = "flex";
      }, 2000);

    }, 2000);

  }, 1000);
}





const datosCuriososOaxaca = [
  "Oaxaca es conocido como la tierra de los siete moles.",
  "La Guelaguetza es la fiesta más importante de Oaxaca.",
  "El Árbol del Tule es uno de los más grandes del mundo.",
  "El mezcal es una bebida típica de Oaxaca hecha de agave.",
  "El queso Oaxaca, también llamado quesillo, es famoso por su forma de tiras.",
  "En Oaxaca se hablan más de 15 lenguas indígenas, como zapoteco y mixteco.",
  "Los alebrijes nacieron en Oaxaca como artesanías coloridas.",
  "Las playas de Huatulco están en la costa de Oaxaca.",
  "Monte Albán es una zona arqueológica zapoteca muy importante.",
  "Los chapulines son insectos que se comen como botana en Oaxaca.",
  "El barro negro de San Bartolo Coyotepec es una artesanía típica.",
  "La Catedral de Oaxaca está en el centro histórico de la ciudad.",
  "El mercado de Tlacolula es famoso por su comida y artesanías.",
  "El Istmo de Tehuantepec es una región cultural de Oaxaca.",
  "El danzón y la marimba también se escuchan en Oaxaca.",
  "El huipil es una vestimenta tradicional de las mujeres oaxaqueñas.",
  "Hierve el Agua es un sitio natural con cascadas petrificadas.",
  "El Valle de Oaxaca tiene muchos pueblos con tradiciones únicas.",
  "El carnaval de Putla es una celebración muy alegre.",
  "La Sierra Norte de Oaxaca es hogar de bosques y montañas."
];

const preguntasOaxaca = [
  {
    pregunta: "¿Qué bebida típica se hace en Oaxaca?",
    opciones: ["Refresco", "Mezcal", "Agua de coco"],
    correcta: "B",
    retro: "El mezcal se hace con agave y es muy famoso en Oaxaca."
  },
  {
    pregunta: "¿Qué fiesta tradicional se celebra en Oaxaca?",
    opciones: ["Carnaval de Río", "Guelaguetza", "Halloween"],
    correcta: "B",
    retro: "La Guelaguetza es una fiesta llena de bailes y trajes típicos."
  },
  {
    pregunta: "¿Qué árbol gigante está en Oaxaca?",
    opciones: ["Árbol del Tule", "Árbol de Navidad", "Árbol de manzanas"],
    correcta: "A",
    retro: "El Árbol del Tule es uno de los más grandes del mundo."
  },
  {
    pregunta: "¿Qué comida típica se hace con queso Oaxaca?",
    opciones: ["Pizza", "Quesadillas", "Hot dog"],
    correcta: "B",
    retro: "El quesillo se usa en quesadillas y es muy famoso."
  },
  {
    pregunta: "¿Qué animal fantástico se hace en artesanías de Oaxaca?",
    opciones: ["Alebrijes", "Robots", "Dragones chinos"],
    correcta: "A",
    retro: "Los alebrijes son figuras coloridas de animales fantásticos."
  },
  {
    pregunta: "¿Qué sitio arqueológico zapoteca está en Oaxaca?",
    opciones: ["Monte Albán", "Teotihuacán", "Chichén Itzá"],
    correcta: "A",
    retro: "Monte Albán fue una ciudad zapoteca muy importante."
  },
  {
    pregunta: "¿Qué insecto se come como botana en Oaxaca?",
    opciones: ["Chapulín", "Hormiga", "Grillo"],
    correcta: "A",
    retro: "Los chapulines se comen tostados con sal y limón."
  },
  {
    pregunta: "¿Qué artesanía se hace con barro negro en Oaxaca?",
    opciones: ["Platos y jarrones", "Zapatos", "Sombreros"],
    correcta: "A",
    retro: "El barro negro es famoso por su brillo y color."
  },
  {
    pregunta: "¿Qué playa famosa está en Oaxaca?",
    opciones: ["Huatulco", "Acapulco", "Cancún"],
    correcta: "A",
    retro: "Huatulco tiene bahías y playas muy bonitas."
  },
  {
    pregunta: "¿Qué vestimenta tradicional usan las mujeres en Oaxaca?",
    opciones: ["Huipil", "Vestido de gala", "Uniforme escolar"],
    correcta: "A",
    retro: "El huipil es una prenda tradicional bordada."
  },
  {
    pregunta: "¿Qué cascadas petrificadas están en Oaxaca?",
    opciones: ["Hierve el Agua", "Cascadas de Agua Azul", "Cataratas del Niágara"],
    correcta: "A",
    retro: "Hierve el Agua es un sitio natural único."
  },
  {
    pregunta: "¿Qué región cultural está en Oaxaca?",
    opciones: ["Istmo de Tehuantepec", "Altiplano Central", "Yucatán"],
    correcta: "A",
    retro: "El Istmo de Tehuantepec tiene tradiciones muy especiales."
  },
  {
    pregunta: "¿Qué mercado famoso está en Oaxaca?",
    opciones: ["Tlacolula", "La Merced", "San Juan"],
    correcta: "A",
    retro: "El mercado de Tlacolula es famoso por su comida y artesanías."
  },
  {
    pregunta: "¿Qué música se escucha en Oaxaca además de la banda?",
    opciones: ["Marimba", "Rock", "Jazz"],
    correcta: "A",
    retro: "La marimba y el danzón también se escuchan en Oaxaca."
  },
  {
    pregunta: "¿Qué queso típico se produce en Oaxaca?",
    opciones: ["Quesillo", "Queso manchego", "Queso parmesano"],
    correcta: "A",
    retro: "El quesillo es conocido como queso Oaxaca."
  },
  {
    pregunta: "¿Qué lengua indígena se habla en Oaxaca?",
    opciones: ["Zapoteco", "Francés", "Inglés"],
    correcta: "A",
    retro: "El zapoteco es una lengua indígena de Oaxaca."
  },
  {
    pregunta: "¿Qué otra lengua indígena se habla en Oaxaca?",
    opciones: ["Mixteco", "Alemán", "Portugués"],
    correcta: "A",
    retro: "El mixteco es otra lengua indígena de Oaxaca."
  },
  {
    pregunta: "¿Qué sitio natural está en la Sierra Norte de Oaxaca?",
    opciones: ["Bosques y montañas", "Desierto", "Glaciares"],
    correcta: "A",
    retro: "La Sierra Norte tiene bosques y montañas verdes."
  },
  {
    pregunta: "¿Qué carnaval alegre se celebra en Oaxaca?",
    opciones: ["Putla", "Río de Janeiro", "Venecia"],
    correcta: "A",
    retro: "El carnaval de Putla es muy alegre y colorido."
  },
  {
    pregunta: "¿Qué valle tiene pueblos con tradiciones únicas?",
    opciones: ["Valle de Oaxaca", "Valle de México", "Valle del Nilo"],
    correcta: "A",
    retro: "El Valle de Oaxaca tiene pueblos con tradiciones únicas."
  },
  {
    pregunta: "¿Qué catedral está en el centro histórico de Oaxaca?",
    opciones: ["Catedral de Oaxaca", "Catedral de Puebla", "Catedral de Guadalajara"],
    correcta: "A",
    retro: "La Catedral de Oaxaca está en el centro histórico."
  },
  {
    pregunta: "¿Qué artesanía colorida nació en Oaxaca?",
    opciones: ["Alebrijes", "Piñatas", "Sombreros"],
    correcta: "A",
    retro: "Los alebrijes son artesanías coloridas de Oaxaca."
  },
  {
    pregunta: "¿Qué comida típica de Oaxaca lleva mole?",
    opciones: ["Mole negro", "Pizza", "Hamburguesa"],
    correcta: "A",
    retro: "El mole negro es uno de los siete moles de Oaxaca."
  },
  {
    pregunta: "¿Qué fiesta se celebra con trajes típicos y bailes?",
    opciones: ["Guelaguetza", "Navidad", "Año Nuevo"],
    correcta: "A",
    retro: "La Guelaguetza celebra la cultura oaxaqueña."
  },
  {
    pregunta: "¿Qué insecto se come en Oaxaca además del chapulín?",
    opciones: ["Hormiga chicatana", "Mosca", "Escarabajo"],
    correcta: "A",
    retro: "La hormiga chicatana también se come en Oaxaca."
  }
];


// --- Flujo de la botella en Oaxaca ---

function mostrarDatoCuriosoOaxaca() {
  const texto = datosCuriososOaxaca[Math.floor(Math.random() * datosCuriososOaxaca.length)];
  const pantalla = document.getElementById("datoCuriosoOaxaca");
  const textoElemento = document.getElementById("textoCuriosoOaxaca");

  textoElemento.innerHTML = `<strong style="font-size:40px;">¿Sabías que… 💡</strong><br><br>${texto}`;
  pantalla.style.display = "flex";

  setTimeout(() => {
    pantalla.style.display = "none";
    mostrarPreguntaOaxaca();
  }, 7000);
}

function mostrarPreguntaOaxaca() {
  const pantalla = document.getElementById("preguntaOaxaca");
  pantalla.style.display = "flex";

  // Seleccionar pregunta SOLO si no hay una activa
 if (!preguntaActual) {
  const indice = Math.floor(Math.random() * preguntasOaxaca.length);
  preguntaActual = preguntasOaxaca[indice];
  preguntaUsadaBotellaOaxaca = indice;
  intentosFallidosOaxaca = 0;   // ✅ usa el contador de Oaxaca
}

  // Pintar textos
  document.getElementById("textoPreguntaOaxaca").innerText = preguntaActual.pregunta;
  document.getElementById("opcionAOaxaca").innerText = preguntaActual.opciones[0];
  document.getElementById("opcionBOaxaca").innerText = preguntaActual.opciones[1];
  document.getElementById("opcionCOaxaca").innerText = preguntaActual.opciones[2];

  // Cronómetro
  if (intentosFallidosOaxaca === 0) iniciarCronometroOaxaca(15);

  // Evaluación
  const form = document.getElementById("formularioPreguntaOaxaca");
  form.onsubmit = function (e) {
    e.preventDefault();
    detenerCronometroOaxaca();
    const seleccion = form.respuesta.value;

    if (seleccion === preguntaActual.correcta) {
      pantalla.style.display = "none";

      if (intentosFallidosOaxaca  === 0) { score += 20; mostrarPantalla20Puntos(); }
      else if (intentosFallidosOaxaca  === 1) { score += 15; mostrarPantalla15Puntos(); }
      else { score += 10; mostrarPantalla10Puntos(); }

      actualizarScore();
      preguntaActual = null;  // limpiar para siguiente ronda
    } else {
      intentosFallidosOaxaca++;
      mostrarMensajeIntentaDeNuevo();
      // NO reabrir pregunta automáticamente: el botón del mensaje la mantiene en pantalla
    }
  };
}

function iniciarCronometroOaxaca(segundos) {
  detenerCronometroOaxaca(); // limpia cualquier cronómetro previo
  tiempoRestanteOaxaca = segundos;

  const cronometroElemento = document.getElementById("cronometroOaxaca");
  cronometroElemento.innerText = `Tiempo: ${tiempoRestanteOaxaca} segundos`; // ← actualiza inmediatamente

  intervaloCronometroOaxaca = setInterval(() => {
    if (tiempoRestanteOaxaca > 0) {
      tiempoRestanteOaxaca--;
      cronometroElemento.innerText = `Tiempo: ${tiempoRestanteOaxaca} segundos`;
    }

    if (tiempoRestanteOaxaca <= 0) {
      detenerCronometroOaxaca();
      mostrarMensajeTiempoAgotado();
      intentosFallidosOaxaca++;
      actualizarScore();
    }
  }, 1000);
}




function detenerCronometroOaxaca() {
  if (intervaloCronometroOaxaca) {
    clearInterval(intervaloCronometroOaxaca);
    intervaloCronometroOaxaca  = null;
  }
}


function intentarDeNuevoOaxaca() {
  // Oculta el mensaje de "intenta de nuevo"
  const mensaje = document.getElementById("mensajeIntentaDeNuevo");
  if (mensaje) mensaje.style.display = "none";

  // Vuelve a mostrar la pregunta
  const pantalla = document.getElementById("preguntaOaxaca");
  if (pantalla) pantalla.style.display = "flex";

  // Reinicia el cronómetro
  iniciarCronometroOaxaca(15);
}










// ===============================================================================================================
// LÓGICA DE GUERRERO COMPLETA
// ===============================================================================================================



function mostrarPantallaGuerrero() {
  const pantalla = document.getElementById("pantallaOaxaca"); // usamos la misma pantalla, ya con fondo cambiado
  if (pantalla) pantalla.style.display = "flex";

  // Mostrar iconos y bienvenida según tu lógica actual
  setTimeout(() => {
    const iconos = document.getElementById("iconosGuerrero");
    if (iconos) iconos.style.display = "block";

    setTimeout(() => {
      const bienvenida = document.getElementById("bienvenidaGuerrero");
      if (bienvenida) bienvenida.style.display = "block";
    }, 3000);
  }, 2000);
}

function iniciarNivelGuerrero() {
  // Ocultar bienvenida
  document.getElementById("bienvenidaGuerrero").style.display = "none";

  // Poner todos los íconos en blanco y negro
  document.querySelectorAll("#iconosGuerrero .icono-guerrero").forEach(icono => {
    icono.classList.add("icono-estado");
    icono.classList.remove("icono-activo", "pulsacion");
  });

  // Activar Acapulco como primer nivel
  const acapulco = document.getElementById("iconoAcapulco");
  acapulco.classList.remove("icono-estado");
  acapulco.classList.add("icono-activo", "pulsacion");
  acapulco.style.cursor = "pointer";

  acapulco.onclick = () => {
    nivelEnCurso = "iconoAcapulco";
    acapulco.classList.remove("pulsacion");
    mostrarDatoCuriosoGuerrero();
  };

  // Tigre (se activa después de Acapulco)
  const tigre = document.getElementById("iconoTigre");
  tigre.onclick = () => {
    nivelEnCurso = "iconoTigre";
    tigre.classList.remove("pulsacion");
    mostrarDatoCuriosoGuerrero();
  };
}

function completarNivelAcapulcoGuerrero() {
  // Bloquear Acapulco
  const acapulco = document.getElementById("iconoAcapulco");
  if (acapulco) {
    acapulco.classList.remove("icono-activo", "pulsacion");
    acapulco.style.cursor = "default";
    acapulco.onclick = null;
  }

  // Activar Tigre
  const tigre = document.getElementById("iconoTigre");
  if (tigre) {
    tigre.classList.remove("icono-estado");
    tigre.classList.add("icono-activo", "pulsacion");
    tigre.style.cursor = "pointer";
    tigre.onclick = () => {
      nivelEnCurso = "iconoTigre";
      tigre.classList.remove("pulsacion");
      mostrarDatoCuriosoGuerrero();
    };
  }
}

function completarNivelTigreGuerrero() {
  // Bloquear todos los íconos de Guerrero
  document.querySelectorAll("#iconosGuerrero .icono-guerrero").forEach(icono => {
    icono.onclick = null;
    icono.style.cursor = "default";
    icono.classList.remove("icono-activo", "pulsacion");
    icono.classList.add("icono-completado");
  });

  // Mantener visible el mapa estático
  const pantallaGuerrero = document.getElementById("pantallaOaxaca"); 
  if (pantallaGuerrero) pantallaGuerrero.style.display = "flex";

  // 3 segundos después mostrar el resultado final
  setTimeout(() => {
  if (score >= 90) {
    mostrarPodioFinal("pantallaPrimerLugar");
  } else if (score >= 60) {
    mostrarPodioFinal("pantallaSegundoLugar");
  } else {
    mostrarPodioFinal("pantallaTercerLugar");
  }
  }, 3000);


}

// --- Datos curiosos y preguntas de Guerrero ---
const datosCuriososGuerrero = [
  "En Acapulco está La Quebrada, donde los clavadistas saltan desde 35 metros, ¡como un edificio de 10 pisos!",
  "El acantilado de La Quebrada mide 45 metros de alto y los clavadistas esperan la ola para caer en el agua.",
  "Algunos clavadistas bajan con una antorcha encendida antes de saltar, ¡parece magia!",
  "En Taxco los artesanos hacen joyas brillantes de plata que se venden en todo el mundo.",
  "El pozole es un platillo típico de Guerrero que se come en fiestas y reuniones.",
  "En Iguala se hizo la primera Bandera de México en 1821.",
  "El chilate es una bebida refrescante hecha con cacao, arroz y canela.",
  "En Guerrero se cultiva cacao, el fruto que sirve para hacer chocolate.",
  "El tigre aparece en las danzas tradicionales y es símbolo de fuerza.",
  "En las fiestas se baila la Danza del Tlacololero, que representa a los agricultores sembrando maíz.",
  "El mango es una fruta tropical muy dulce que se da en Guerrero.",
  "En Chilapa se hacen fiestas con máscaras de madera muy coloridas.",
  "El pan de Chilapa es famoso y se hornea en hornos de barro.",
  "En Acapulco se han filmado películas y series porque sus playas son muy bonitas.",
  "Guerrero tiene montañas altas y también playas hermosas, todo en un mismo estado.",
  "El maíz es muy importante en Guerrero, se usa para tortillas y tamales.",
  "En las costas de Guerrero llegan tortugas marinas para poner sus huevos.",
  "Los mercados de Guerrero están llenos de colores, frutas y artesanías.",
  "En Guerrero hay cuevas con pinturas antiguas hechas por los primeros habitantes.",
  "Guerrero es un estado con mucha historia y tradiciones que siguen vivas hoy."
];



const preguntasGuerrero = [
  {
    pregunta: "¿Cuál es la ciudad famosa por sus playas en Guerrero?",
    opciones: ["Acapulco", "Taxco", "Chilapa"],
    correcta: "A",
    retro: "Acapulco es famoso por sus playas y clavadistas."
  },
  {
    pregunta: "¿Qué metal precioso se trabaja en Taxco?",
    opciones: ["Oro", "Plata", "Cobre"],
    correcta: "B",
    retro: "Taxco es famoso por sus artesanías de plata."
  },
  {
    pregunta: "¿Qué animal aparece en las danzas tradicionales de Guerrero?",
    opciones: ["Conejo", "Tigre", "León"],
    correcta: "B",
    retro: "El tigre es símbolo de fuerza en las danzas."
  },
  {
    pregunta: "¿Qué bebida refrescante se hace con cacao, arroz y canela?",
    opciones: ["Chilate", "Horchata", "Atole"],
    correcta: "A",
    retro: "El chilate es típico de Guerrero."
  },
  {
    pregunta: "¿Qué fruta dulce y amarilla se da en Guerrero?",
    opciones: ["Sandía", "Mango", "Manzana"],
    correcta: "B",
    retro: "El mango es muy común en Guerrero."
  },
  {
    pregunta: "¿Dónde saltan los clavadistas desde grandes alturas?",
    opciones: ["El Popocatépetl", "La Quebrada", "El Zócalo"],
    correcta: "B",
    retro: "La Quebrada es un acantilado famoso en Acapulco."
  },
  {
    pregunta: "¿Qué alimento básico se usa para tortillas y tamales?",
    opciones: ["Maíz", "Trigo", "Arroz"],
    correcta: "A",
    retro: "El maíz es la base de la alimentación en Guerrero."
  },
  {
    pregunta: "¿Qué danza representa a los agricultores en Guerrero?",
    opciones: ["Viejitos", "Tlacololero", "Venado"],
    correcta: "B",
    retro: "La Danza del Tlacololero representa la siembra."
  },
  {
    pregunta: "¿Qué animal marino llega a las playas de Guerrero?",
    opciones: ["Tiburón", "Delfín", "Tortuga"],
    correcta: "C",
    retro: "Las tortugas marinas llegan a Guerrero para poner sus huevos."
  },
  {
    pregunta: "¿En qué ciudad se hizo la primera Bandera de México?",
    opciones: ["Iguala", "Acapulco", "Taxco"],
    correcta: "A",
    retro: "La primera bandera se hizo en Iguala en 1821."
  },
  {
    pregunta: "¿Qué platillo típico se come en fiestas de Guerrero?",
    opciones: ["Mole", "Pozole", "Tamales"],
    correcta: "B",
    retro: "El pozole es muy popular en Guerrero."
  },
  {
    pregunta: "¿Qué tipo de artesanías se hacen en Taxco?",
    opciones: ["Plata", "Barro", "Madera"],
    correcta: "A",
    retro: "Taxco es famoso por la plata."
  },
  {
    pregunta: "¿Qué bebida se prepara con cacao en Guerrero?",
    opciones: ["Café", "Chilate", "Chocolate caliente"],
    correcta: "B",
    retro: "El chilate se hace con cacao y arroz."
  },
  {
    pregunta: "¿Qué fruta tropical se encuentra en Guerrero?",
    opciones: ["Mango", "Uva", "Pera"],
    correcta: "A",
    retro: "El mango es típico de Guerrero."
  },
  {
    pregunta: "¿Qué fiesta usa máscaras de madera en Guerrero?",
    opciones: ["Fiesta de Chilapa", "Carnaval", "Día de Muertos"],
    correcta: "A",
    retro: "En Chilapa se usan máscaras de madera."
  },
  {
    pregunta: "¿Qué tipo de pan es famoso en Chilapa?",
    opciones: ["Pan de muerto", "Pan de caja", "Pan de Chilapa"],
    correcta: "C",
    retro: "El pan de Chilapa se hornea en hornos de barro."
  },
  {
    pregunta: "¿Qué bebida se hace con cacao y arroz?",
    opciones: ["Champurrado", "Chilate", "Atole"],
    correcta: "B",
    retro: "El chilate es refrescante y típico de Guerrero."
  },
  {
    pregunta: "¿Qué animal es símbolo en las danzas de Guerrero?",
    opciones: ["Tigre", "Águila", "Perro"],
    correcta: "A",
    retro: "El tigre es muy importante en las tradiciones."
  },
  {
    pregunta: "¿Qué ciudad de Guerrero es famosa por el turismo?",
    opciones: ["Chilapa", "Acapulco", "Iguala"],
    correcta: "B",
    retro: "Acapulco es un destino turístico muy conocido."
  },
  {
    pregunta: "¿Qué bebida refrescante se toma en Guerrero?",
    opciones: ["Agua de jamaica", "Chilate", "Horchata"],
    correcta: "B",
    retro: "El chilate es típico de Guerrero."
  },
  {
    pregunta: "¿Qué fruta se usa para jugos en Guerrero?",
    opciones: ["Manzana", "Mango", "Kiwi"],
    correcta: "B",
    retro: "El mango se usa mucho en jugos."
  },
  {
    pregunta: "¿Qué danza representa la siembra en Guerrero?",
    opciones: ["Tlacololero", "Venado", "Viejitos"],
    correcta: "A",
    retro: "El Tlacololero representa a los agricultores."
  },
  {
    pregunta: "¿Qué ciudad de Guerrero tiene clavadistas famosos?",
    opciones: ["Taxco", "Acapulco", "Iguala"],
    correcta: "B",
    retro: "Los clavadistas de La Quebrada están en Acapulco."
  },
  {
    pregunta: "¿Qué bebida típica lleva cacao y canela?",
    opciones: ["Atole", "Chilate", "Café"],
    correcta: "B",
    retro: "El chilate lleva cacao, arroz y canela."
  },
  {
    pregunta: "¿Qué símbolo importante se creó en Iguala?",
    opciones: ["Himno nacional", "Escudo nacional", "Primera Bandera de México"],
    correcta: "C",
    retro: "La primera bandera se creó en Iguala."
  }
];




// --- Flujo de Guerrero ---
function mostrarDatoCuriosoGuerrero() {
  const texto = datosCuriososGuerrero[Math.floor(Math.random() * datosCuriososGuerrero.length)];
  const pantalla = document.getElementById("datoCuriosoGuerrero");
  const textoElemento = document.getElementById("textoCuriosoGuerrero");

  textoElemento.innerHTML = `<strong style="font-size:40px;">¿Sabías que… 💡</strong><br><br>${texto}`;
  pantalla.style.display = "flex";

  setTimeout(() => {
    pantalla.style.display = "none";
    mostrarPreguntaGuerrero();
  }, 7000);
}

function mostrarPreguntaGuerrero() {
  const pantalla = document.getElementById("preguntaGuerrero");
  pantalla.style.display = "flex";

  if (!preguntaActual) {
    const indice = Math.floor(Math.random() * preguntasGuerrero.length);
    preguntaActual = preguntasGuerrero[indice];
    preguntaUsadaGuerrero = indice;
    intentosFallidosGuerrero = 0;
  }

  document.getElementById("textoPreguntaGuerrero").innerText = preguntaActual.pregunta;
  document.getElementById("opcionAGuerrero").innerText = preguntaActual.opciones[0];
  document.getElementById("opcionBGuerrero").innerText = preguntaActual.opciones[1];
  document.getElementById("opcionCGuerrero").innerText = preguntaActual.opciones[2];

  if (intentosFallidosGuerrero === 0) iniciarCronometroGuerrero(15);

  const form = document.getElementById("formularioPreguntaGuerrero");
  form.onsubmit = function (e) {
    e.preventDefault();
    detenerCronometroGuerrero();
    const seleccion = form.respuesta.value;

    if (seleccion === preguntaActual.correcta) {
      pantalla.style.display = "none";

      if (intentosFallidosGuerrero === 0) { score += 20; mostrarPantalla20Puntos(); }
      else if (intentosFallidosGuerrero === 1) { score += 15; mostrarPantalla15Puntos(); }
      else { score += 10; mostrarPantalla10Puntos(); }

      actualizarScore();
      preguntaActual = null;
    } else {
      intentosFallidosGuerrero++;
      mostrarMensajeIntentaDeNuevo();
    }
  };
}

function iniciarCronometroGuerrero(segundos) {
  detenerCronometroGuerrero();
  tiempoRestanteGuerrero = segundos;

  const cronometroElemento = document.getElementById("cronometroGuerrero");
  cronometroElemento.innerText = `Tiempo: ${tiempoRestanteGuerrero} segundos`;

  intervaloCronometroGuerrero = setInterval(() => {
    if (tiempoRestanteGuerrero > 0) {
      tiempoRestanteGuerrero--;
      cronometroElemento.innerText = `Tiempo: ${tiempoRestanteGuerrero} segundos`;
    }

    if (tiempoRestanteGuerrero <= 0) {
      detenerCronometroGuerrero();
      mostrarMensajeTiempoAgotado();
      intentosFallidosGuerrero++;
      actualizarScore();
    }
  }, 1000);
}

function detenerCronometroGuerrero() {
  if (intervaloCronometroGuerrero) {
    clearInterval(intervaloCronometroGuerrero);
    intervaloCronometroGuerrero = null;
  }
}

function intentarDeNuevoGuerrero() {
  const mensaje = document.getElementById("mensajeIntentaDeNuevo");
  if (mensaje) mensaje.style.display = "none";

  const pantalla = document.getElementById("preguntaGuerrero");
  if (pantalla) pantalla.style.display = "flex";

  iniciarCronometroGuerrero(15);
}









// =====================================
// MENSAJE DEL PODIO FINAL Y DESPEDIDA
// =====================================


function mostrarPodioFinal(idPantalla) {
  const pantalla = document.getElementById(idPantalla);
  if (!pantalla) return;

  // Ocultar todas las pantallas de podio
  document.querySelectorAll(
    "#pantallaPrimerLugar, #pantallaSegundoLugar, #pantallaTercerLugar"
  ).forEach(p => {
    p.style.display = "none";
    p.classList.remove("activa");
  });

  // Mostrar la pantalla actual
  pantalla.style.display = "flex";
  pantalla.classList.add("activa");

  // Nombre del jugador
  pantalla.querySelectorAll(".nombreJugadorFinal")
    .forEach(el => {
      el.textContent = nombre;
    });

  // Score final (ID, no clase)
  const scoreEl = pantalla.querySelector("#scoreFinal");
  if (scoreEl) {
    scoreEl.textContent = score;
  }
}





function mostrarDespedidaIktan() {
  document.getElementById("pantallaPrimerLugar").style.display = "none";
  document.getElementById("pantallaSegundoLugar").style.display = "none";
  document.getElementById("pantallaTercerLugar").style.display = "none";
  document.getElementById("pantallaDespedidaIktan").style.display = "flex";
}



// =====================================
// EVENTOS DE VENTANA
// =====================================

window.addEventListener("beforeunload", function (e) {
  const mensaje = "¡Ojo! Si sales ahora, perderás tu progreso. ¿Estás seguro de abandonar la aventura?";
  e.preventDefault();
  e.returnValue = mensaje;
  return mensaje;
});

window.addEventListener("load", () => {
  const musica = document.getElementById("musicaFondo");
  if (musica) {
    musica.volume = 1.0; // 0.0 a 1.0; tu código tenía 1000 (inválido)
    musica.play().catch(() => {
      console.log("El navegador bloqueó el autoplay, se activará al primer clic.");
    });
  }
});

window.addEventListener("load", () => {
  const logo = document.getElementById("logo");
  const btn = document.getElementById("btnComenzar");
  setTimeout(() => {
    if (btn) btn.style.display = "block";
  }, 10000);
});





// =====================================
// EXPORTS A WINDOW (si los usas en HTML)
// =====================================
window.mostrarPantalla = mostrarPantalla;
window.guardarNombre = guardarNombre;
window.cerrarMensaje = cerrarMensaje;
window.iniciarNivelJaguar = iniciarNivelJaguar;
window.iniciarNivelMujer = iniciarNivelMujer;
window.cerrarMensajeIntenta = cerrarMensajeIntenta;
window.cerrarMensajeTiempo = cerrarMensajeTiempo;
window.cerrarPantalla20 = cerrarPantalla20;
window.cerrarPantalla15 = cerrarPantalla15;
window.cerrarPantalla10 = cerrarPantalla10;