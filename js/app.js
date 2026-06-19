const formTarea = document.getElementById("formTarea");
const listaTareas = document.getElementById("listaTareas");
const errorFormulario = document.getElementById("errorFormulario");
const totalTareas = document.getElementById("totalTareas");
const tareasCompletadas = document.getElementById("tareasCompletadas");
const tareasPendientes = document.getElementById("tareasPendientes");
const btnMensaje = document.getElementById("btnMensaje");
const mensajeInicio = document.getElementById("mensajeInicio");
const btnAyuda = document.getElementById("btnAyuda");
const panelAyuda = document.getElementById("panelAyuda");
const btnTema = document.getElementById("btnTema");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnMenu = document.getElementById("btnMenu");
const menuPrincipal = document.getElementById("menuPrincipal");
const btnVerStorage = document.getElementById("btnVerStorage");
const datosStorage = document.getElementById("datosStorage");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

const CLAVE_TAREAS = "tareasWebFase2";
const CLAVE_TEMA = "temaOrganizador";

let tareas = JSON.parse(localStorage.getItem(CLAVE_TAREAS)) || [];
let filtroActual = "todas";

function guardarTareas() {
    localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
}

function validarFormulario(titulo, fecha, prioridad) {
    if (titulo.trim() === "") {
        return "Debe ingresar el título de la tarea.";
    }

    if (fecha === "") {
        return "Debe seleccionar una fecha límite.";
    }

    if (prioridad === "") {
        return "Debe seleccionar una prioridad.";
    }

    return "";
}

function agregarTarea(titulo, fecha, prioridad) {
    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo.trim(),
        fecha: fecha,
        prioridad: prioridad,
        completada: false
    };

    tareas.push(nuevaTarea);
    guardarTareas();
    mostrarTareas();
}

function obtenerTareasFiltradas() {
    if (filtroActual === "pendientes") {
        return tareas.filter(tarea => !tarea.completada);
    }

    if (filtroActual === "completadas") {
        return tareas.filter(tarea => tarea.completada);
    }

    return tareas;
}

function escaparHTML(texto) {
    return texto.replace(/[&<>'"]/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    }[caracter]));
}

function mostrarTareas() {
    listaTareas.innerHTML = "";
    const tareasFiltradas = obtenerTareasFiltradas();

    if (tareasFiltradas.length === 0) {
        listaTareas.innerHTML = "<li class='item-tarea'>No hay tareas para mostrar.</li>";
    }

    tareasFiltradas.forEach(tarea => {
        const item = document.createElement("li");
        item.className = tarea.completada ? "item-tarea completada" : "item-tarea";

        item.innerHTML = `
            <div>
                <strong>${escaparHTML(tarea.titulo)}</strong>
                <p>Fecha límite: ${tarea.fecha}</p>
                <span class="etiqueta">Prioridad: ${tarea.prioridad}</span>
            </div>
            <div>
                <button class="btn-secundario" onclick="cambiarEstado(${tarea.id})">OK</button>
                <button class="btn-peligro" onclick="eliminarTarea(${tarea.id})">X</button>
            </div>
        `;

        listaTareas.appendChild(item);
    });

    actualizarResumen();
}

function cambiarEstado(id) {
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            tarea.completada = !tarea.completada;
        }
        return tarea;
    });

    guardarTareas();
    mostrarTareas();
}

function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    guardarTareas();
    mostrarTareas();
}

function actualizarResumen() {
    const completadas = tareas.filter(tarea => tarea.completada).length;
    totalTareas.textContent = tareas.length;
    tareasCompletadas.textContent = completadas;
    tareasPendientes.textContent = tareas.length - completadas;
}

function mostrarDatosStorage() {
    const datos = localStorage.getItem(CLAVE_TAREAS) || "[]";
    datosStorage.textContent = JSON.stringify(JSON.parse(datos), null, 4);
}

function aplicarTemaGuardado() {
    const tema = localStorage.getItem(CLAVE_TEMA);
    if (tema === "oscuro") {
        document.body.classList.add("tema-oscuro");
    }
}

formTarea.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const fecha = document.getElementById("fecha").value;
    const prioridad = document.getElementById("prioridad").value;
    const error = validarFormulario(titulo, fecha, prioridad);

    if (error !== "") {
        errorFormulario.textContent = error;
        return;
    }

    errorFormulario.textContent = "";
    agregarTarea(titulo, fecha, prioridad);
    formTarea.reset();
});

btnMensaje.addEventListener("click", function() {
    mensajeInicio.classList.toggle("oculto");
});

btnAyuda.addEventListener("click", function() {
    panelAyuda.classList.toggle("oculto");
});

btnTema.addEventListener("click", function() {
    document.body.classList.toggle("tema-oscuro");
    const temaActual = document.body.classList.contains("tema-oscuro") ? "oscuro" : "claro";
    localStorage.setItem(CLAVE_TEMA, temaActual);
});

btnMenu.addEventListener("click", function() {
    menuPrincipal.classList.toggle("abierto");
});

btnLimpiar.addEventListener("click", function() {
    tareas = [];
    guardarTareas();
    mostrarTareas();
    mostrarDatosStorage();
});

btnVerStorage.addEventListener("click", mostrarDatosStorage);

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", function() {
        botonesFiltro.forEach(btn => btn.classList.remove("activo"));
        boton.classList.add("activo");
        filtroActual = boton.dataset.filtro;
        mostrarTareas();
    });
});

aplicarTemaGuardado();
mostrarTareas();
