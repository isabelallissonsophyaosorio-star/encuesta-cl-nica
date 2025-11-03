const servicioSelect = document.getElementById("servicio");
const bloqueEncuesta = document.getElementById("bloque-encuesta");
const bloqueDatos = document.getElementById("bloque-datos");
const tituloServicio = document.getElementById("titulo-servicio");
const extraPreguntas = document.getElementById("extra-preguntas");
const btnEnviar = document.getElementById("btnEnviar");
const bloqueGracias = document.getElementById("bloque-gracias");
const btnModificar = document.getElementById("btnModificar");
const formEncuesta = document.getElementById("formEncuesta");

const preguntasPorServicio = {
  "Masajes": [
    "¿El masaje fue realizado con la presión adecuada?",
    "¿El terapeuta explicó claramente la técnica utilizada?",
    "¿Te sentiste cómodo/a durante todo el masaje?",
    "¿El ambiente (música, temperatura, aroma) contribuyó a tu relajación?",
    "¿Repetirías el servicio?"
  ],
  "Limpieza facial": [
    "¿Tu piel se sintió mejor después del tratamiento?",
    "¿El personal explicó el procedimiento de manera adecuada?",
    "¿El personal te explicó los productos utilizados?",
    "¿El ambiente fue agradable y relajante?",
    "¿Recomendarías este servicio?"
  ],
  "Quiropraxia": [
    "¿El especialista te explicó el tratamiento?",
    "¿Experimentaste alivio o mejoría luego de la sesión?",
    "¿El espacio fue adecuado para el procedimiento?",
    "¿Recomendarías el servicio de quiropraxia?"
  ],
  "Uñas": [
    "¿El material usado fue limpio y esterilizado?",
    "¿Te explicaron el procedimiento correctamente?",
    "¿Te sentiste cómodo/a durante el servicio?",
    "¿El resultado final cumplió tus expectativas?",
    "¿El trato fue cordial durante el servicio?"
  ],
  "otros": [
    "¿El servicio fue satisfactorio?",
    "¿Se cumplieron tus expectativas?",
    "¿Volverías a visitarnos?"
  ]
};

// Al seleccionar servicio, ocultar datos personales
servicioSelect.addEventListener("change", () => {
  if (servicioSelect.value !== "") {
    bloqueDatos.style.display = "none"; // ocultar datos
    bloqueEncuesta.classList.remove("oculto");
    tituloServicio.textContent = servicioSelect.value;
    cargarPreguntas(servicioSelect.value);
  }
});

// Cargar preguntas dinámicamente
function cargarPreguntas(servicio) {
  extraPreguntas.innerHTML = "";
  if (preguntasPorServicio[servicio]) {
    const div = document.createElement("div");
    div.classList.add("categoria");
    div.innerHTML = `<h6>${servicio}</h6>`;
    preguntasPorServicio[servicio].forEach((texto) => {
      div.innerHTML += `
        <div class="pregunta">
          <label>${texto}</label>
          <div class="opciones">
            <button>Malo</button><button>Debe mejorar</button>
            <button>Bueno</button><button>Excelente</button>
          </div>
        </div>
      `;
    });
    extraPreguntas.appendChild(div);
    activarBotones();
  }
}

// Activar selección visual
function activarBotones() {
  document.querySelectorAll(".opciones button").forEach(btn => {
    btn.addEventListener("click", () => {
      const grupo = btn.parentElement.querySelectorAll("button");
      grupo.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

// Botón modificar datos personales
btnModificar.addEventListener("click", () => {
  bloqueDatos.style.display = "block";
  bloqueDatos.scrollIntoView({ behavior: "smooth" });
  bloqueEncuesta.classList.remove("oculto");
  formEncuesta.nombre.value = "";
  formEncuesta.telefono.value = "";
  formEncuesta.correo.value = "";
});

// Enviar encuesta
btnEnviar.addEventListener("click", async () => {
  // Capturar respuestas seleccionadas
  const respuestas = [];
  document.querySelectorAll(".pregunta").forEach(preg => {
    const seleccionado = preg.querySelector(".opciones button.selected");
    respuestas.push(seleccionado ? seleccionado.textContent : "");
  });

  // Capturar texto exacto de las preguntas
  const preguntasTexto = [];
  document.querySelectorAll(".pregunta label").forEach(label => {
    preguntasTexto.push(label.textContent);
  });

  // Capturar comentarios
  const comentarios = document.querySelector(".comentarios textarea").value;

  // Construir objeto a enviar
  const data = {
    nombre: formEncuesta.nombre.value,
    telefono: formEncuesta.telefono.value,
    correo: formEncuesta.correo.value,
    servicio: servicioSelect.value,
    respuestas: respuestas,
    preguntas: preguntasTexto,
    comentarios: comentarios
  };

  try {
    const res = await fetch("/guardar", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });

    if(res.ok){
      bloqueGracias.classList.remove("oculto");
      bloqueEncuesta.classList.add("oculto");

      // Limpiar todo formulario después de enviar
      formEncuesta.reset();
      servicioSelect.value = "";
      extraPreguntas.innerHTML = "";
      bloqueDatos.style.display = "none";
    } else {
      alert("Error al guardar la encuesta");
    }
  } catch (err) {
    alert("Error de conexión: " + err.message);
  }
});
