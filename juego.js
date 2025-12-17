  let nombre = "";
  let preguntaUsadaJaguar = null;
  let chiapasCompletado = false;
  let nivelEnCurso = "jaguar"; // valores posibles: "jaguar" | "mujer"

(() => {
  let mapaTimer = null;




//FUNCION MOSTRAR PANTALLAS
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

      if (mapaTimer) clearTimeout(mapaTimer);
      mapaTimer = setTimeout(() => {
        if (mensaje) mensaje.style.display = "block";
      }, 3000);
    }
  }



//FUNCION GuardarNombre
  function guardarNombre() {
    const input = document.getElementById("jugador");
    if (!input) {
      console.error("No se encontró el input #jugador.");
      return;
    }
    const nombreIngresado = (input.value || "").trim();
    if (nombreIngresado === "") {
      alert("Por favor, ingresa tu nombre para continuar.");
      input.focus();
      return;
    }
    nombre = nombreIngresado;
    const span = document.getElementById("nombreJugador");
    if (span) span.innerText = nombre;
    mostrarPantalla("bienvenida");
  }




//FUNCION CerrarMensaje
  function cerrarMensaje() {
    const mensaje = document.getElementById("mensajeBienvenida");
    if (mensaje) mensaje.style.display = "none";
    function iniciarNivelJaguar() {
  nivelEnCurso = "jaguar";
  mostrarDatoCuriosoChiapas();
}




//FUNCION Iniciar Nivel mujer chiapas
function iniciarNivelMujer() {
  nivelEnCurso = "mujer";
  mostrarDatoCuriosoMujer(); // o reutilizado si ocupas el mismo de Chiapas
}
    // Jaguar: primer nivel → blanco y negro + pulsación
    const jaguar = document.getElementById("jaguarImg");
    jaguar.classList.add("bnw", "pulsar");
    jaguar.style.cursor = "pointer";
    jaguar.onclick = () => iniciarNivelJaguar();
    // Mujer: segundo nivel → bloqueada en blanco y negro
    const mujer = document.getElementById("mujerImg");
    mujer.classList.add("bnw");
    mujer.style.cursor = "not-allowed";
  }





//FUNCION Iniciar Nivel Jaguar
  function iniciarNivelJaguar() {
    // Mostrar pantalla de dato curioso
    mostrarDatoCuriosoChiapas();
  }





//FUNCION Completar nivel jaguar
  function completarNivelJaguar() {
    const jaguar = document.getElementById("jaguarImg");
    jaguar.classList.remove("bnw", "pulsar");
    jaguar.style.cursor = "default";
    const mujer = document.getElementById("mujerImg");
    mujer.classList.remove("bnw");
    mujer.style.cursor = "pointer";
    mujer.onclick = () => iniciarNivelMujer();
  }




  function iniciarNivelMujer() {
    alert("Pregunta de la Mujer...");
  }

  window.addEventListener("beforeunload", function (e) {
    const mensaje = "¡Ojo! Si sales ahora, perderás tu progreso. ¿Estás seguro de abandonar la aventura?";
    e.preventDefault();
    e.returnValue = mensaje;
    return mensaje;
  });

  window.mostrarPantalla = mostrarPantalla;
  window.guardarNombre = guardarNombre;
  window.cerrarMensaje = cerrarMensaje;

  
})();







// LÓGICA DE CHIAPAS
const datosCuriososChiapas = [
  "Chiapas genera una gran parte de su electricidad a partir de energía hidroeléctrica, gracias a presas como La Angostura y Chicoasén.",
  "Muchas familias en Chiapas usan cocinas que no hacen humo. Así cuidan el aire y su salud.",
  "En Chiapas hay huertos en casa donde se siembran frutas y verduras para comer sano.",
  "Algunas comunidades juntan agua de lluvia para tener agua limpia sin gastar tanta.",
  "Los campesinos siembran cuidando la tierra para que siga fuerte y fértil.",
  "En Chiapas hay jaguares, monos y tucanes. ¡Y muchas personas los ayudan a vivir seguros!",
  "En las escuelas enseñan a separar la basura para reciclar y cuidar la naturaleza."
];




let score = 0;
let preguntaActual = null;
let intentosFallidos = 0;
const preguntasChiapas = [
  {
    pregunta: "¿Cuál es el nombre de la selva tropical más grande de México, ubicada en Chiapas?",
    opciones: ["Selva Lacandona", "Selva de Chiapas", "Selva de México"],
    correcta: "A",
    retro: "La Selva Lacandona es un lugar increíble lleno de animales y plantas únicas."
  },
  {
    pregunta: "¿Qué animal vive en Chiapas y está protegido?",
    opciones: ["Jaguar", "Elefante", "Canguro"],
    correcta: "A",
    retro: "El jaguar es un símbolo de fuerza y está protegido para conservar su hábitat en Chiapas."
  },
  {
    pregunta: "¿Qué comida típica se prepara con plátano en Chiapas?",
    opciones: ["Tamales de bola", "Tacos al pastor", "Pizza"],
    correcta: "A",
    retro: "Los tamales de bola son una delicia chiapaneca que se prepara con plátano y otros ingredientes locales."
  },
  {
    pregunta: "¿Qué río importante pasa por Chiapas?",
    opciones: ["Río Grijalva", "Río Bravo", "Río Nilo"],
    correcta: "A",
    retro: "El Río Grijalva atraviesa Chiapas y es vital para la vida, la agricultura y la energía hidroeléctrica."
  },
  {
    pregunta: "¿Qué ciudad es famosa por sus casas coloniales en Chiapas?",
    opciones: ["San Cristóbal de las Casas", "Cancún", "Guadalajara"],
    correcta: "A",
    retro: "San Cristóbal de las Casas es conocida por su arquitectura colonial y su riqueza cultural."
  }
];

function mostrarDatoCuriosoChiapas() {
  const texto = datosCuriososChiapas[Math.floor(Math.random() * datosCuriososChiapas.length)];
  const pantalla = document.getElementById("datoCuriosoChiapas");
  const textoElemento = document.getElementById("textoCuriosoChiapas");

  textoElemento.innerHTML = `<strong style="font-size:40px;">¿Sabías que… 💡</strong><br><br>${texto}`;
  pantalla.style.display = "flex";

  setTimeout(() => {
  pantalla.style.display = "none";
  mostrarPreguntaChiapas(); // ← aquí se muestra la pregunta del jaguar
}, 7000);
}

let tiempoRestante = 15;
let intervaloCronometro = null;



function mostrarPreguntaChiapas() {
  const pantalla = document.getElementById("preguntaChiapas");
  pantalla.style.display = "flex";

  if (!preguntaActual || intentosFallidos === 0) {
  const indice = Math.floor(Math.random() * preguntasChiapas.length);
  preguntaActual = preguntasChiapas[indice];
  preguntaUsadaJaguar = indice; // ← esto es clave
}

  document.getElementById("textoPreguntaChiapas").innerText = preguntaActual.pregunta;
  document.getElementById("opcionA").innerText = preguntaActual.opciones[0];
  document.getElementById("opcionB").innerText = preguntaActual.opciones[1];
  document.getElementById("opcionC").innerText = preguntaActual.opciones[2];

  // Reiniciar cronómetro
  tiempoRestante = 15;
  const cronometroElemento = document.getElementById("cronometro");
  cronometroElemento.innerText = `Tiempo: ${tiempoRestante} segundos`;

  if (intervaloCronometro) clearInterval(intervaloCronometro);
  intervaloCronometro = setInterval(() => {
    tiempoRestante--;
    cronometroElemento.innerText = `Tiempo: ${tiempoRestante} segundos`;

    if (tiempoRestante <= 0) {
      clearInterval(intervaloCronometro);
      mostrarMensajeTiempoAgotado();
      intentosFallidos++;
      if (score > 0) score--;
      actualizarScore();
      mostrarPreguntaChiapas(); // vuelve a mostrar la misma pregunta
    }
  }, 1000);

  const form = document.getElementById("formularioPreguntaChiapas");
form.onsubmit = function (e) {
  e.preventDefault();
  clearInterval(intervaloCronometro); // detener cronómetro al responder
  const seleccion = form.respuesta.value;

  if (seleccion === preguntaActual.correcta) {
    pantalla.style.display = "none";

    if (intentosFallidos === 0) {
      score += 20;
      mostrarPantalla20Puntos();
    } else if (intentosFallidos === 1) {
      score += 15;
      mostrarPantalla15Puntos();
    } else {
      score += 10;
      mostrarPantalla10Puntos();
    }

    actualizarScore();
  } else {
    intentosFallidos++;
    if (score > 0) score--; // opcional: restar puntos por error
    actualizarScore();
    mostrarMensajeIntentaDeNuevo();
    mostrarPreguntaChiapas(); // vuelve a mostrar la misma pregunta
  }
};
}

function actualizarScore() {
  document.querySelectorAll("#score").forEach(span => {
    span.innerText = score;
  });
}

function mostrarMensajeIntentaDeNuevo() {
  document.getElementById("mensajeIntentaDeNuevo").style.display = "flex";
}

function cerrarMensajeIntenta() {
  document.getElementById("mensajeIntentaDeNuevo").style.display = "none";
  mostrarPreguntaChiapas(); // vuelve a mostrar la misma pregunta
}

function mostrarMensajeTiempoAgotado() {
  document.getElementById("mensajeTiempoAgotado").style.display = "flex";
}

function cerrarMensajeTiempo() {
  document.getElementById("mensajeTiempoAgotado").style.display = "none";
  mostrarPreguntaChiapas(); // vuelve a mostrar la misma pregunta
}



function mostrarPantalla20Puntos() {
  document.getElementById("nombre20puntos").innerText = nombre;
  document.getElementById("retro20puntos").innerText = preguntaActual.retro || "";
  document.getElementById("pantalla20puntos").style.display = "flex";
}



function mostrarPantalla15Puntos() {
  document.getElementById("nombre15puntos").innerText = nombre;
  document.getElementById("retro15puntos").innerText = preguntaActual.retro || "";
  document.getElementById("pantalla15puntos").style.display = "flex";
}



function mostrarPantalla10Puntos() {
  document.getElementById("nombre10puntos").innerText = nombre;
  document.getElementById("retro10puntos").innerText = preguntaActual.retro || "";
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
  if (nivelEnCurso === "jaguar") {
    // Jaguar queda estático
    const jaguar = document.getElementById("jaguarImg");
    jaguar.classList.remove("bnw", "pulsar");
    jaguar.style.cursor = "default";
    jaguar.onclick = null;

    // Mujer se desbloquea con animación
    const mujer = document.getElementById("mujerImg");
    mujer.classList.remove("bnw");
    mujer.classList.add("pulsar");
    mujer.style.cursor = "pointer";
    mujer.onclick = () => iniciarNivelMujer();

    // Oculta bienvenida de Chiapas si quedó abierta
    const bienvenidaChiapas = document.getElementById("mensajeBienvenida");
    if (bienvenidaChiapas) bienvenidaChiapas.style.display = "none";

    // Regresa al mapa de Chiapas
    mostrarPantalla("mapa");

  } else if (nivelEnCurso === "mujer") {
    // Chiapas completado
    chiapasCompletado = true;

    // Jaguar y mujer quedan estáticos
    const jaguar = document.getElementById("jaguarImg");
    jaguar.classList.remove("bnw", "pulsar");
    jaguar.style.cursor = "default";
    jaguar.onclick = null;

    const mujer = document.getElementById("mujerImg");
    mujer.classList.remove("bnw", "pulsar");
    mujer.style.cursor = "default";
    mujer.onclick = null;

    // Oculta bienvenida de Chiapas si quedó abierta
    const bienvenidaChiapas = document.getElementById("mensajeBienvenida");
    if (bienvenidaChiapas) bienvenidaChiapas.style.display = "none";

    // Muestra Oaxaca directamente
    mostrarPantallaOaxaca();
  }
}



const datosCuriososMujer = [
  "Las mujeres en Chiapas participan en proyectos de ecoturismo que cuidan la naturaleza.",
  "Muchas mujeres siembran huertos en casa para alimentar a sus familias de forma saludable.",
  "En Chiapas, las mujeres enseñan a reciclar y cuidar el agua en sus comunidades.",
  "Algunas mujeres artesanas usan tintes naturales para proteger el medio ambiente.",
  "Las mujeres chiapanecas ayudan a conservar tradiciones que respetan la tierra."
];

let preguntaActualMujer = null;
let intentosFallidosMujer = 0;

function iniciarNivelMujer() {
  nivelEnCurso = "mujer";
  mostrarDatoCuriosoMujer();
}

function mostrarDatoCuriosoMujer() {
  const texto = datosCuriososMujer[Math.floor(Math.random() * datosCuriososMujer.length)];
  const pantalla = document.getElementById("datoCuriosoMujer");
  const textoElemento = document.getElementById("textoCuriosoMujer");

  // Oculta bienvenida Chiapas si estuviera visible
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
  // 1) Oculta cualquier bienvenida de Chiapas, si quedó abierta
  const bienvenidaChiapas = document.getElementById("mensajeBienvenida");
  if (bienvenidaChiapas) bienvenidaChiapas.style.display = "none";

  // 2) Muestra la pantalla correcta de MUJER
  const pantalla = document.getElementById("preguntaMujer"); // ← NO usar 'preguntaChiapas'
  pantalla.style.display = "flex";

  // 3) Selección de pregunta (evitar repetir la del jaguar)
  const preguntasDisponibles = preguntasChiapas.filter((_, i) => i !== preguntaUsadaJaguar);
  if (!preguntaActualMujer || intentosFallidosMujer === 0) {
    preguntaActualMujer = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
    intentosFallidosMujer = 0; // reinicia intentos al asignar nueva pregunta
  }

  // 4) Pinta textos en los IDs DE MUJER
  document.getElementById("textoPreguntaMujer").innerText = preguntaActualMujer.pregunta;
  document.getElementById("opcionAMujer").innerText = preguntaActualMujer.opciones[0];
  document.getElementById("opcionBMujer").innerText = preguntaActualMujer.opciones[1];
  document.getElementById("opcionCMujer").innerText = preguntaActualMujer.opciones[2];

  // 5) Cronómetro en el ID DE MUJER
  let tiempoRestante = 15;
  const cronometroElemento = document.getElementById("cronometroMujer");
  cronometroElemento.innerText = `Tiempo: ${tiempoRestante} segundos`;

  const form = document.getElementById("formularioPreguntaMujer");
  // Limpia posible selección anterior
  form.reset();

  // 6) Intervalo
  let intervalo = setInterval(() => {
    tiempoRestante--;
    cronometroElemento.innerText = `Tiempo: ${tiempoRestante} segundos`;
    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      mostrarMensajeTiempoAgotado();
      intentosFallidosMujer++;
      if (score > 0) score--;
      actualizarScore();
      mostrarPreguntaMujer();
    }
  }, 1000);

  // 7) Evaluación usando el FORM DE MUJER
  form.onsubmit = function (e) {
    e.preventDefault();
    clearInterval(intervalo);
    const seleccion = form.respuesta.value;

    if (seleccion === preguntaActualMujer.correcta) {
      pantalla.style.display = "none";

      if (intentosFallidosMujer === 0) {
        score += 20; mostrarPantalla20Puntos();
      } else if (intentosFallidosMujer === 1) {
        score += 15; mostrarPantalla15Puntos();
      } else {
        score += 10; mostrarPantalla10Puntos();
      }
      actualizarScore();
       preguntaActualMujer = null;
    } else {
      intentosFallidosMujer++;
      if (score > 0) score--;
      actualizarScore();
      mostrarMensajeIntentaDeNuevo();

      // Si ya falló 3 veces, cerrar y mostrar retro mínima
      if (intentosFallidosMujer >= 3) {
        pantalla.style.display = "none";
        mostrarPantalla10Puntos();
        preguntaActualMujer = null; // limpiar
      }

    }
  };
}









//LOGICA DE OAXACA


function mostrarPantallaOaxaca() {
  const pantalla = document.getElementById("pantallaOaxaca");
  pantalla.style.display = "flex";

  // Paso 2: mostrar íconos después de 2 segundos
  setTimeout(() => {
    const iconos = document.getElementById("iconosOaxaca");
    iconos.style.display = "block";

    // Paso 3: mostrar bienvenida después de otros 2 segundos
    setTimeout(() => {
      const bienvenida = document.getElementById("bienvenidaOaxaca");
      bienvenida.style.display = "block";
    }, 3000);
  }, 2000);
}


window.addEventListener("load", () => {
  const musica = document.getElementById("musicaFondo");
  musica.volume = 1000; // volumen inicial (0.0 a 1.0)
  musica.play().catch(err => {
    console.log("El navegador bloqueó el autoplay, se activará al primer clic.");
  });
});


window.addEventListener("load", () => {
  const logo = document.getElementById("logo");
  const btn = document.getElementById("btnComenzar");

  // Simulamos duración de animación del logo (ej. 3 segundos)
  setTimeout(() => {
    btn.style.display = "block"; // aparece el botón
  }, 10000);
});