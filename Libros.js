/*
  Catálogo editable de libros.
  - nombre: título que aparece en la tarjeta.
  - etiquetas: términos de búsqueda y categorías asignadas al libro.
  - portada: imagen de portada (URL pública o ruta local); vacía usa la portada por defecto.
  - drive: enlace compartido de Google Drive.
*/
const LIBROS = [
  {
    nombre: "Matemáticas básicas (ejemplo)",
    etiquetas: ["matemáticas", "números", "aritmética"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Introducción a la contabilidad (ejemplo)",
    etiquetas: ["contabilidad", "administración", "finanzas"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Lectura y comunicación (ejemplo)",
    etiquetas: ["castellano", "literatura", "lengua", "comunicación", "lectura"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Informática para principiantes (ejemplo)",
    etiquetas: ["informática", "tecnología", "computación"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Gramática y ortografía (ejemplo)",
    etiquetas: ["castellano", "gramática", "ortografía", "escritura"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Álgebra elemental (ejemplo)",
    etiquetas: ["matemáticas", "álgebra", "ecuaciones"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Geometría básica (ejemplo)",
    etiquetas: ["matemáticas", "geometría", "figuras"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Estadística descriptiva (ejemplo)",
    etiquetas: ["matemáticas", "estadística", "datos"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Literatura venezolana (ejemplo)",
    etiquetas: ["castellano", "literatura", "Venezuela", "lectura"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Cuentos latinoamericanos (ejemplo)",
    etiquetas: ["literatura", "lectura", "Latinoamérica", "narrativa"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Introducción a la filosofía (ejemplo)",
    etiquetas: ["literatura", "filosofía", "pensamiento", "lectura"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Principios de administración (ejemplo)",
    etiquetas: ["administración", "gestión", "organización"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Gestión de recursos humanos (ejemplo)",
    etiquetas: ["administración", "recursos humanos", "gestión"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Fundamentos de economía (ejemplo)",
    etiquetas: ["administración", "economía", "finanzas"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Contabilidad financiera (ejemplo)",
    etiquetas: ["contabilidad", "finanzas", "administración"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Costos y presupuestos (ejemplo)",
    etiquetas: ["contabilidad", "costos", "presupuestos", "finanzas"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Programación básica (ejemplo)",
    etiquetas: ["informática", "programación", "tecnología"],
    portada: "",
    drive: ""
  },
  {
    nombre: "Internet y herramientas digitales (ejemplo)",
    etiquetas: ["informática", "internet", "tecnología", "computación"],
    portada: "",
    drive: ""
  }
];

const CATEGORIAS = ["Castellano", "Matemáticas", "Literatura", "Contabilidad", "Administración", "Informática"];

// Elementos de la página que reciben las categorías, resultados y controles de búsqueda.
const grid = document.getElementById("librosGrid");
const search = document.getElementById("buscadorLibros");
const clear = document.getElementById("limpiarBusqueda");
const categoryList = document.getElementById("categoriasLibros");
const pagination = document.getElementById("paginacionLibros");
const previousPage = document.getElementById("paginaAnterior");
const nextPage = document.getElementById("paginaSiguiente");
const currentPageLabel = document.getElementById("paginaActual");
const libraryHeader = document.querySelector(".biblioteca-head");
const BOOKS_PER_PAGE = 12;
let currentPage = 1;
let selectedCategory = "";

function scrollToLibraryHeader() {
  const top = libraryHeader.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({top, behavior:"smooth"});
}

// Escapa contenido del catálogo antes de insertarlo como HTML para evitar interpretar etiquetas.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

// Convierte enlaces comunes de Drive a una URL de descarga directa cuando es posible.
function driveDownloadUrl(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url;
}

// Unifica mayúsculas y acentos para que las búsquedas no dependan de ellos.
function normalizeText(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

// Crea los botones de categoría y marca el filtro actualmente seleccionado.
function renderCategories() {
  categoryList.innerHTML = ["", ...CATEGORIAS].map(category => {
    const label = category || "Todas";
    const active = normalizeText(category) === normalizeText(selectedCategory);
    return `<button class="biblioteca-category${active ? " activo" : ""}" type="button" data-category="${escapeHtml(category)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
  }).join("");
}

// Combina búsqueda y categoría, pagina los resultados y dibuja las tarjetas de libros.
function renderBooks() {
  const term = normalizeText(search.value.trim());
  const filtered = LIBROS.filter(book => {
    const searchableText = [book.nombre, ...book.etiquetas].map(normalizeText).join(" ");
    const matchesTerm = searchableText.includes(term);
    const matchesCategory = !selectedCategory || book.etiquetas.some(tag => normalizeText(tag) === normalizeText(selectedCategory));
    return matchesTerm && matchesCategory;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="biblioteca-empty">No hay resultados para esta categoría o búsqueda.</div>';
    pagination.hidden = true;
    return;
  }

  const pageCount = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  currentPage = Math.min(currentPage, pageCount);
  const start = (currentPage - 1) * BOOKS_PER_PAGE;
  const visibleBooks = filtered.slice(start, start + BOOKS_PER_PAGE);

  grid.innerHTML = visibleBooks.map(book => {
    const portada = book.portada
      ? `<img src="${escapeHtml(book.portada)}" alt="Portada de ${escapeHtml(book.nombre)}" loading="lazy">`
      : `<img src="Portada-por-defecto.png" alt="Portada predeterminada de material académico" loading="lazy">`;

    const download = driveDownloadUrl(book.drive);
    const button = download
      ? `<a class="libro-download" href="${escapeHtml(download)}" download>⬇ Descargar</a>`
      : `<span class="libro-download disabled">⬇ Descargar</span>`;

    return `<article class="libro-card">
      <div class="libro-nombre">${escapeHtml(book.nombre)}</div>
      <div class="libro-portada">${portada}</div>
      <div class="libro-actions">${button}</div>
    </article>`;
  }).join("");

  pagination.hidden = pageCount <= 1;
  previousPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === pageCount;
  currentPageLabel.textContent = `Página ${currentPage} de ${pageCount}`;
}

// Cada nueva búsqueda vuelve a la primera página de resultados.
search.addEventListener("input", () => {
  currentPage = 1;
  renderBooks();
});

// El cambio de categoría actualiza el filtro y vuelve a la primera página.
categoryList.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  currentPage = 1;
  renderCategories();
  renderBooks();
});

// Restablece el texto de búsqueda y la categoría predeterminada «Todas».
clear.addEventListener("click", () => {
  search.value = "";
  currentPage = 1;
  search.focus();
  renderCategories();
  renderBooks();
});

// Navegación entre páginas de resultados.
previousPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
    scrollToLibraryHeader();
  }
});

nextPage.addEventListener("click", () => {
  currentPage++;
  renderBooks();
  scrollToLibraryHeader();
});

renderCategories();
renderBooks();
