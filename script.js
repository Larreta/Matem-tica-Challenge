"use strict";

// ==========================================
// MATEMATICA CHALLENGE
// ==========================================

const preguntas = [
    {
        categoria: "Operaciones básicas",
        pregunta: "María compra 3 cuadernos a $2 cada uno. ¿Cuánto paga en total?",
        alternativas: ["$5", "$6", "$8", "$9"],
        correcta: 1,
        explicacion: "Multiplicamos 3 × 2 = 6. María paga $6."
    },
    {
        categoria: "Suma y resta",
        pregunta: "Pedro tiene 25 caramelos y regala 9. ¿Cuántos le quedan?",
        alternativas: ["14", "15", "16", "17"],
        correcta: 2,
        explicacion: "Restamos 25 − 9 = 16 caramelos."
    },
    {
        categoria: "Multiplicación",
        pregunta: "En un aula hay 6 filas con 4 estudiantes en cada fila. ¿Cuántos estudiantes hay?",
        alternativas: ["10", "20", "24", "28"],
        correcta: 2,
        explicacion: "Multiplicamos 6 × 4 = 24 estudiantes."
    },
    {
        categoria: "División",
        pregunta: "Una profesora reparte 36 lápices entre 6 estudiantes por igual. ¿Cuántos recibe cada uno?",
        alternativas: ["5", "6", "7", "8"],
        correcta: 1,
        explicacion: "Dividimos 36 ÷ 6 = 6 lápices por estudiante."
    },
    {
        categoria: "Razonamiento lógico",
        pregunta: "Un autobús tiene 18 pasajeros. En una parada bajan 5 y suben 3. ¿Cuántos pasajeros quedan?",
        alternativas: ["14", "15", "16", "17"],
        correcta: 2,
        explicacion: "Primero 18 − 5 = 13. Luego 13 + 3 = 16 pasajeros."
    }
];

// ==========================================
// REFERENCIAS A LOS ELEMENTOS HTML
// ==========================================

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaFinal = document.getElementById("pantalla-final");

const nombreJugador = document.getElementById("nombre-jugador");
const botonComenzar = document.getElementById("boton-comenzar");
const botonSiguiente = document.getElementById("boton-siguiente");
const botonReiniciar = document.getElementById("boton-reiniciar");

const contadorPregunta = document.getElementById("contador-pregunta");
const puntuacionTexto = document.getElementById("puntuacion");
const barraProgreso = document.getElementById("barra-progreso");

const categoriaTexto = document.getElementById("categoria");
const preguntaTexto = document.getElementById("pregunta");
const alternativasContenedor = document.getElementById("alternativas");

const tiempoTexto = document.getElementById("tiempo");
const temporizadorContenedor = document.getElementById("temporizador");
const retroalimentacion = document.getElementById("retroalimentacion");

const mensajeFinal = document.getElementById("mensaje-final");
const resumenFinal = document.getElementById("resumen-final");
const resultadoPuntos = document.getElementById("resultado-puntos");
const resultadoCorrectas = document.getElementById("resultado-correctas");
const mensajeMotivacion = document.getElementById("mensaje-motivacion");

// Comprobar que los elementos necesarios existen.
const elementosNecesarios = [
    pantallaInicio,
    pantallaJuego,
    pantallaFinal,
    botonComenzar,
    botonSiguiente,
    botonReiniciar
];

if (elementosNecesarios.some(elemento => elemento === null)) {
    document.body.innerHTML = `
        <div style="font-family:Arial;padding:30px;text-align:center">
            <h1>Error al cargar el juego</h1>
            <p>Comprueba que index.html tenga el código completo y que
            los archivos estén en la misma carpeta.</p>
        </div>
    `;
    throw new Error("Faltan elementos HTML necesarios para iniciar el juego.");
}

// ==========================================
// VARIABLES DEL JUEGO
// ==========================================

let indicePregunta = 0;
let puntos = 0;
let respuestasCorrectas = 0;
let tiempoRestante = 30;
let intervalo = null;
let respondida = false;
let jugador = "Estudiante";

// ==========================================
// INICIAR EL JUEGO
// ==========================================

botonComenzar.addEventListener("click", comenzarJuego);

function comenzarJuego() {
    jugador = nombreJugador.value.trim() || "Estudiante";

    indicePregunta = 0;
    puntos = 0;
    respuestasCorrectas = 0;

    detenerTemporizador();

    pantallaInicio.classList.add("oculto");
    pantallaFinal.classList.add("oculto");
    pantallaJuego.classList.remove("oculto");

    mostrarPregunta();
}

// ==========================================
// MOSTRAR UNA PREGUNTA
// ==========================================

function mostrarPregunta() {
    detenerTemporizador();

    respondida = false;
    tiempoRestante = 30;

    const actual = preguntas[indicePregunta];

    contadorPregunta.textContent =
        `Pregunta ${indicePregunta + 1} de ${preguntas.length}`;

    puntuacionTexto.textContent = `🏆 ${puntos} puntos`;

    barraProgreso.style.width =
        `${(indicePregunta / preguntas.length) * 100}%`;

    categoriaTexto.textContent = actual.categoria;
    preguntaTexto.textContent = actual.pregunta;

    tiempoTexto.textContent = tiempoRestante;
    temporizadorContenedor.classList.remove("urgente");

    retroalimentacion.textContent = "";
    retroalimentacion.style.color = "";

    botonSiguiente.classList.add("oculto");
    alternativasContenedor.replaceChildren();

    actual.alternativas.forEach((alternativa, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "alternativa";

        const letra = document.createElement("span");
        letra.className = "letra";
        letra.textContent = String.fromCharCode(65 + indice);

        const texto = document.createElement("span");
        texto.textContent = alternativa;

        boton.append(letra, texto);

        boton.addEventListener("click", () => {
            comprobarRespuesta(indice);
        });

        alternativasContenedor.appendChild(boton);
    });

    iniciarTemporizador();
}

// ==========================================
// COMPROBAR LA RESPUESTA
// ==========================================

function comprobarRespuesta(indiceElegido) {
    if (respondida) return;

    respondida = true;
    detenerTemporizador();

    const actual = preguntas[indicePregunta];
    const botones = alternativasContenedor.querySelectorAll(".alternativa");

    botones.forEach((boton, indice) => {
        boton.disabled = true;

        if (indice === actual.correcta) {
            boton.classList.add("correcta");
        }

        if (indice === indiceElegido && indice !== actual.correcta) {
            boton.classList.add("incorrecta");
        }
    });

    if (indiceElegido === actual.correcta) {
        respuestasCorrectas++;

        const puntosGanados = 100 + tiempoRestante * 2;
        puntos += puntosGanados;

        retroalimentacion.textContent =
            `✅ ¡Correcto! Ganaste ${puntosGanados} puntos. ${actual.explicacion}`;

        retroalimentacion.style.color = "#15803d";
    } else {
        retroalimentacion.textContent =
            `❌ Respuesta incorrecta. ${actual.explicacion}`;

        retroalimentacion.style.color = "#b91c1c";
    }

    puntuacionTexto.textContent = `🏆 ${puntos} puntos`;
    barraProgreso.style.width =
        `${((indicePregunta + 1) / preguntas.length) * 100}%`;

    botonSiguiente.textContent =
        indicePregunta === preguntas.length - 1
            ? "Ver resultados 🏆"
            : "Siguiente pregunta ➜";

    botonSiguiente.classList.remove("oculto");
}

// ==========================================
// TEMPORIZADOR
// ==========================================

function iniciarTemporizador() {
    intervalo = setInterval(() => {
        tiempoRestante--;

        tiempoTexto.textContent = tiempoRestante;

        if (tiempoRestante <= 10) {
            temporizadorContenedor.classList.add("urgente");
        }

        if (tiempoRestante <= 0) {
            detenerTemporizador();
            tiempoAgotado();
        }
    }, 1000);
}

function detenerTemporizador() {
    if (intervalo !== null) {
        clearInterval(intervalo);
        intervalo = null;
    }
}

function tiempoAgotado() {
    if (respondida) return;

    respondida = true;

    const actual = preguntas[indicePregunta];
    const botones = alternativasContenedor.querySelectorAll(".alternativa");

    botones.forEach((boton, indice) => {
        boton.disabled = true;

        if (indice === actual.correcta) {
            boton.classList.add("correcta");
        }
    });

    retroalimentacion.textContent =
        `⏰ Se acabó el tiempo. ${actual.explicacion}`;

    retroalimentacion.style.color = "#b91c1c";

    barraProgreso.style.width =
        `${((indicePregunta + 1) / preguntas.length) * 100}%`;

    botonSiguiente.textContent =
        indicePregunta === preguntas.length - 1
            ? "Ver resultados 🏆"
            : "Siguiente pregunta ➜";

    botonSiguiente.classList.remove("oculto");
}

// ==========================================
// SIGUIENTE PREGUNTA
// ==========================================

botonSiguiente.addEventListener("click", () => {
    if (!respondida) return;

    indicePregunta++;

    if (indicePregunta < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
});

// ==========================================
// RESULTADOS FINALES
// ==========================================

function mostrarResultados() {
    detenerTemporizador();

    pantallaJuego.classList.add("oculto");
    pantallaFinal.classList.remove("oculto");

    mensajeFinal.textContent =
        respuestasCorrectas === preguntas.length
            ? `¡Excelente trabajo, ${jugador}! 🎉`
            : `¡Buen esfuerzo, ${jugador}! 🌟`;

    resumenFinal.textContent =
        `Terminaste el desafío y respondiste correctamente ` +
        `${respuestasCorrectas} de ${preguntas.length} preguntas.`;

    resultadoPuntos.textContent = puntos;

    resultadoCorrectas.textContent =
        `${respuestasCorrectas}/${preguntas.length}`;

    if (respuestasCorrectas === 5) {
        mensajeMotivacion.textContent =
            "¡Eres un campeón de las matemáticas! Respondiste todo correctamente.";
    } else if (respuestasCorrectas >= 3) {
        mensajeMotivacion.textContent =
            "¡Vas por buen camino! Sigue practicando para mejorar tu resultado.";
    } else {
        mensajeMotivacion.textContent =
            "¡No te rindas! Cada intento es una oportunidad para aprender.";
    }
}

// ==========================================
// VOLVER A JUGAR
// ==========================================

botonReiniciar.addEventListener("click", () => {
    detenerTemporizador();

    pantallaFinal.classList.add("oculto");
    pantallaJuego.classList.add("oculto");
    pantallaInicio.classList.remove("oculto");

    nombreJugador.value = "";
    nombreJugador.focus();
});