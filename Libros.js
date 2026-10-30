/*
  Catálogo editable de libros.
  - nombre: título que aparece en la tarjeta.
  - etiquetas: términos de búsqueda y categorías asignadas al libro.
  - drive: enlace compartido de Google Drive.
*/
const LIBROS = [
  {
    nombre: "Matemáticas básicas (ejemplo)",
    etiquetas: ["matemáticas", "números", "aritmética"],
    drive: ""
  },
  {
    nombre: "Introducción a la contabilidad (ejemplo)",
    etiquetas: ["contabilidad", "administración", "finanzas"],
    drive: ""
  },
  {
    nombre: "Lectura y comunicación (ejemplo)",
    etiquetas: ["castellano", "literatura", "lengua", "comunicación", "lectura"],
    drive: ""
  },
  {
    nombre: "Informática para principiantes (ejemplo)",
    etiquetas: ["informática", "tecnología", "computación"],
    drive: ""
  },
  {
    nombre: "Gramática y ortografía (ejemplo)",
    etiquetas: ["castellano", "gramática", "ortografía", "escritura"],
    drive: ""
  },
  {
    nombre: "Álgebra elemental (ejemplo)",
    etiquetas: ["matemáticas", "álgebra", "ecuaciones"],
    drive: ""
  },
  {
    nombre: "Geometría básica (ejemplo)",
    etiquetas: ["matemáticas", "geometría", "figuras"],
    drive: ""
  },
  {
    nombre: "Estadística descriptiva (ejemplo)",
    etiquetas: ["matemáticas", "estadística", "datos"],
    drive: ""
  },
  {
    nombre: "Literatura venezolana (ejemplo)",
    etiquetas: ["castellano", "literatura", "Venezuela", "lectura"],
    drive: ""
  },
  {
    nombre: "Cuentos latinoamericanos (ejemplo)",
    etiquetas: ["literatura", "lectura", "Latinoamérica", "narrativa"],
    drive: ""
  },
  {
    nombre: "Introducción a la filosofía (ejemplo)",
    etiquetas: ["literatura", "filosofía", "pensamiento", "lectura"],
    drive: ""
  },
  {
    nombre: "Principios de administración (ejemplo)",
    etiquetas: ["administración", "gestión", "organización"],
    drive: ""
  },
  {
    nombre: "Gestión de recursos humanos (ejemplo)",
    etiquetas: ["administración", "recursos humanos", "gestión"],
    drive: ""
  },
  {
    nombre: "Fundamentos de economía (ejemplo)",
    etiquetas: ["administración", "economía", "finanzas"],
    drive: ""
  },
  {
    nombre: "Contabilidad financiera (ejemplo)",
    etiquetas: ["contabilidad", "finanzas", "administración"],
    drive: ""
  },
  {
    nombre: "Costos y presupuestos (ejemplo)",
    etiquetas: ["contabilidad", "costos", "presupuestos", "finanzas"],
    drive: ""
  },
  {
    nombre: "Programación básica (ejemplo)",
    etiquetas: ["informática", "programación", "tecnología"],
    drive: ""
  },
  {
    nombre: "Internet y herramientas digitales (ejemplo)",
    etiquetas: ["informática", "internet", "tecnología", "computación"],
    drive: ""
  }
];

const CATEGORIAS = ["Castellano", "Matemáticas", "Literatura", "Contabilidad", "Administración", "Informática", "Lógica", "Economía"];

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
const requestedCategory = new URLSearchParams(window.location.search).get("categoria") || "";
let selectedCategory = CATEGORIAS.find(category => normalizeText(category) === normalizeText(requestedCategory)) || "";

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

function driveFileId(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
}

// Convierte enlaces comunes de Drive a una URL de descarga directa cuando es posible.
function driveDownloadUrl(url) {
  const fileId = driveFileId(url);
  return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : url;
}

function driveThumbnailUrl(url) {
  const fileId = driveFileId(url);
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w600` : "";
}

function fallbackCover(bookName) {
  return `<div class="libro-cover-fallback" role="img" aria-label="Portada no disponible para ${escapeHtml(bookName)}">
    <span class="cover-kicker">Biblioteca digital</span>
    <span class="cover-divider" aria-hidden="true"></span>
    <svg class="cover-book" viewBox="0 0 160 100" aria-hidden="true">
      <path d="M10 22c23-12 47-8 70 4v57C57 70 33 68 10 82zM150 22c-23-12-47-8-70 4v57c23-13 47-15 70-1z" fill="#f8fbff" stroke="#d7e5f7" stroke-width="4" stroke-linejoin="round"/>
      <path d="M80 27v56" stroke="#f4b400" stroke-width="5"/>
      <path d="M24 39c18-7 35-5 49 2M24 53c18-7 35-5 49 2M136 39c-18-7-35-5-49 2M136 53c-18-7-35-5-49 2" fill="none" stroke="#9bbbe8" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <span class="cover-divider" aria-hidden="true"></span>
    <strong>Material<br>académico</strong>
  </div>`;
}

// Unifica mayúsculas y acentos para que las búsquedas no dependan de ellos.
function normalizeText(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

grid.addEventListener("error", event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const cover = image.closest(".libro-portada");
  if (!cover) return;
  cover.innerHTML = fallbackCover(image.dataset.bookName);
}, true);

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
    const coverUrl = driveThumbnailUrl(book.drive);
    const portada = coverUrl
      ? `<img src="${escapeHtml(coverUrl)}" alt="Portada de ${escapeHtml(book.nombre)}" data-book-name="${escapeHtml(book.nombre)}" loading="lazy">`
      : fallbackCover(book.nombre);

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
  if (search.value.trim()) {
    selectedCategory = "";
    renderCategories();
  }
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
