(() => {
const sitePages = [
  ["index.html", "Inicio"],
  ["Curso Introductorio.html", "Curso Introductorio"],
  ["Plan Academico.html", "Plan Académico"],
  ["Biblioteca.html", "Biblioteca"],
  ["Juegos Educativos.html", "Juegos Educativos"]
];

const currentPage = decodeURIComponent(window.location.pathname.split("/").pop()).toLowerCase();
const headerSlot = document.getElementById("header");
const navigationSlot = document.getElementById("site-nav");
const footerSlot = document.getElementById("footer");

if (!headerSlot || !navigationSlot || !footerSlot) {
  throw new Error("Faltan los contenedores compartidos del encabezado, navegación o pie.");
}

headerSlot.innerHTML = `<header class="encabezado-superior">
  <div class="marca">
    <div class="logo-una"><img src="Logo-UNA.png" alt="Logo de la Universidad Nacional Abierta"></div>
    <div><h1>Universidad Nacional Abierta</h1><small>Apoyo Académico</small></div>
  </div>
  <div class="valores">
    <div class="valor"><span aria-hidden="true">◇</span><div>Orientación<br>académica</div></div>
  </div>
</header>`;

navigationSlot.innerHTML = `<nav class="barra-menu" aria-label="Navegación principal">
  ${sitePages.map(([file, label]) => {
    const active = currentPage === file.toLowerCase()
      || (file === "Juegos Educativos.html" && Boolean(document.body.dataset.game));
    return `<a href="${file}"${active ? ' class="activo" aria-current="page"' : ""}>${label}</a>`;
  }).join("")}
</nav>`;

footerSlot.innerHTML = `<footer class="pie">
  <div class="pie-grid">
    <div class="marca-footer">
      <div class="logo-una"><img src="Logo-UNA.png" alt="Logo de la Universidad Nacional Abierta"></div>
      <div><h3>Universidad Nacional Abierta</h3><small>Proyecto académico de servicio comunitario</small></div>
    </div>
  </div>
  <div class="copyright">© 2026 · Sitio académico de demostración para servicio comunitario.</div>
</footer>`;
})();
