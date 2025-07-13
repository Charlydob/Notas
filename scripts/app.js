const buscador = document.getElementById('buscador');
const botonMas = document.getElementById('botonMas');
const contenedorNotas = document.getElementById('contenedorNotas');
const resultadoTexto = document.getElementById('resultadoTexto');

const editor = document.getElementById('editor');
const tituloNota = document.getElementById('tituloNota');
const cuerpoNota = document.getElementById('cuerpoNota');
const colorNota = document.getElementById('colorNota');
const guardarNota = document.getElementById('guardarNota');
const eliminarNota = document.getElementById('eliminarNota');
const cancelarNota = document.getElementById('cancelarNota');

let notas = [];
let notaActual = null;

function guardarEnLocalStorage() {
  localStorage.setItem('notas', JSON.stringify(notas));
}

function cargarDesdeLocalStorage() {
  const data = localStorage.getItem('notas');
  if (data) {
    notas = JSON.parse(data);
  } else {
    notas = [];
  }
}

function renderizarNotas(filtro = '') {
  contenedorNotas.innerHTML = '';
  const notasFiltradas = notas.filter(nota =>
    nota.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  if (filtro.trim() !== '') {
    resultadoTexto.textContent = `Mostrando resultados para: "${filtro}"`;
  } else {
    resultadoTexto.textContent = '';
  }

  notasFiltradas.forEach((nota, index) => {
    const btn = document.createElement('button');
    btn.textContent = nota.titulo;
    btn.style.backgroundColor = nota.color || 'rgba(255, 255, 255, 0.07)';
    btn.addEventListener('click', () => mostrarEditor(nota, index));
    contenedorNotas.appendChild(btn);
  });
}

function mostrarEditor(nota = null, index = null) {
  editor.classList.remove('oculto');
  notaActual = index;

  if (nota) {
    tituloNota.value = nota.titulo;
    cuerpoNota.value = nota.contenido;
    colorNota.value = nota.color || '#ffffff';
  } else {
    tituloNota.value = '';
    cuerpoNota.value = '';
    colorNota.value = '#ffffff';
  }
}

function cerrarEditor() {
  editor.classList.add('oculto');
  notaActual = null;
}

guardarNota.addEventListener('click', () => {
  const nuevaNota = {
    titulo: tituloNota.value.trim(),
    contenido: cuerpoNota.value.trim(),
    color: colorNota.value
  };

  if (!nuevaNota.titulo) {
    alert('La nota necesita un título.');
    return;
  }

  if (notaActual !== null) {
    notas[notaActual] = nuevaNota;
  } else {
    notas.push(nuevaNota);
  }

  guardarEnLocalStorage();
  renderizarNotas(buscador.value);
  cerrarEditor();
});

eliminarNota.addEventListener('click', () => {
  if (notaActual !== null) {
    notas.splice(notaActual, 1);
    guardarEnLocalStorage();
    renderizarNotas(buscador.value);
    cerrarEditor();
  }
});

cancelarNota.addEventListener('click', cerrarEditor);

botonMas.addEventListener('click', () => mostrarEditor());

buscador.addEventListener('input', () => {
  renderizarNotas(buscador.value);
});

// Inicialización
cargarDesdeLocalStorage();
renderizarNotas();

// Previene doble toque para hacer zoom
let lastTouch = 0;
document.addEventListener('touchend', function (event) {
  const now = new Date().getTime();
  if (now - lastTouch <= 300) {
    event.preventDefault();
  }
  lastTouch = now;
}, { passive: false });

// Previene pinch zoom
document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });

// Escala progresiva en notas según scroll
contenedorNotas.addEventListener('scroll', () => {
  const notasBotones = contenedorNotas.querySelectorAll('button');
  const topCont = contenedorNotas.getBoundingClientRect().top;

  notasBotones.forEach(nota => {
    const top = nota.getBoundingClientRect().top - topCont;
    const factor = Math.max(0.75, 1 - top / 500);
    nota.style.transform = `scale(${factor})`;
  });
});

setTimeout(() => {
  contenedorNotas.dispatchEvent(new Event('scroll'));
}, 10);
