const MATERIAS = {
  1: [
    {codigo:'107', nombre:'Lógica', icono:'∴', carrera:'ambas', descripcion:'Herramientas de razonamiento y pensamiento lógico para analizar problemas y construir argumentos.', contenidos:'Proposiciones, razonamiento lógico, relaciones y resolución de problemas.'},
    {codigo:'115', nombre:'Lengua y Comunicación', icono:'Aa', carrera:'ambas', descripcion:'Desarrollo de competencias para comprender, organizar y comunicar información académica.', contenidos:'Comprensión lectora, comunicación, lenguaje y producción de textos.'},
    {codigo:'116', nombre:'Introducción a la Informática', icono:'⌘', carrera:'ambas', descripcion:'Conceptos fundamentales de informática y uso de herramientas tecnológicas para el estudio.', contenidos:'Informática, tecnología, conceptos computacionales y herramientas digitales.'},
    {codigo:'177', nombre:'Matemática I', icono:'∑', carrera:'ambas', descripcion:'Fundamentos matemáticos aplicados al razonamiento y a la resolución de problemas.', contenidos:'Conjuntos numéricos, operaciones, orden en R, funciones y representación.'},
    {codigo:'601', nombre:'Introducción a la Administración', icono:'▥', carrera:'administracion', descripcion:'Introducción al pensamiento administrativo y a los conceptos esenciales de la administración.', contenidos:'Conceptos administrativos, organizaciones, procesos y fundamentos de la administración.'},
    {codigo:'631', nombre:'Fundamentos de la Contabilidad', icono:'₿', carrera:'ambas', descripcion:'Base para comprender el registro y análisis de las operaciones económicas de una organización.', contenidos:'Activo, pasivo, patrimonio, partida doble, libros y estados financieros.'},
    {codigo:'641', nombre:'Teoría Económica I', icono:'◌', carrera:'ambas', descripcion:'Fundamentos de la ciencia económica y aproximación a la realidad económica y la microeconomía.', contenidos:'Actividad económica, proceso económico, leyes económicas y relación con otras ciencias.'}
  ],
  2: [
    {codigo:'178', nombre:'Matemática II', icono:'∞', carrera:'ambas', descripcion:'Continuación del razonamiento matemático con énfasis en funciones, límites y continuidad.', contenidos:'Límites, continuidad, funciones acotadas, máximos, mínimos y asíntotas.'},
    {codigo:'602', nombre:'Teoría de la Organización', icono:'◎', carrera:'administracion', descripcion:'Estudio de las organizaciones, su estructura y los enfoques utilizados para comprender su funcionamiento.', contenidos:'Organización, estructura, modelos organizacionales y enfoques de análisis.'},
    {codigo:'632', nombre:'Contabilidad Intermedia', icono:'▤', carrera:'ambas', descripcion:'Profundización de los procedimientos contables mediante ejercicios y casos prácticos.', contenidos:'Registro contable, libro mayor, operaciones y ejercicios de aplicación.'}
  ]
};

let lapsoActual=1;
let materiaAbierta=null;
let alturaTarjeta=0;
const grid=document.getElementById('materiasGrid');
const contador=document.getElementById('contadorMaterias');

function renderMaterias(){
  const lista=MATERIAS[lapsoActual];
  contador.textContent=`${lista.length} ${lista.length===1?'materia':'materias'}`;
  const materiasVisibles=materiaAbierta?lista.filter(m=>m.codigo===materiaAbierta):lista;
  grid.innerHTML=materiasVisibles.map(m=>{
    const abierta=m.codigo===materiaAbierta;
    return `<article class="materia-card${abierta?' abierta':''}" data-codigo="${m.codigo}" tabindex="0" aria-expanded="${abierta}" aria-label="${abierta?'Materia abierta':'Abrir materia'}: ${m.nombre}">
      <div class="materia-top"><span class="materia-icon">${m.icono}</span><span class="codigo">Cód. ${m.codigo}</span></div>
      <h3>${m.nombre}</h3>
      ${abierta?`<p class="materia-introduccion">${m.descripcion}</p>`:''}
      ${abierta?`<div class="materia-acciones">
        <a class="materia-recurso" href="Biblioteca.html">Ir a la biblioteca</a>
        <a class="materia-recurso" href="Juegos Educativos.html">Juegos interactivos</a>
        <button class="materia-cerrar" type="button" data-cerrar-materia>Cerrar</button>
      </div>`:'<span class="materia-indicacion">Haz clic para ver el resumen y los recursos <span aria-hidden="true">→</span></span>'}
    </article>${abierta?`<div class="materia-documento">
      <section><h4>Resumen de la materia</h4><p>${m.descripcion}</p></section>
      <section><h4>Contenidos principales</h4><p>${m.contenidos}</p></section>
    </div>`:''}`;
  }).join('');
  if(materiaAbierta){
    grid.style.setProperty('--materia-card-height',`${alturaTarjeta}px`);
  }else{
    grid.style.removeProperty('--materia-card-height');
  }
}

grid.addEventListener('click',event=>{
  const elemento=event.target;
  if(!(elemento instanceof Element))return;
  if(elemento.closest('[data-cerrar-materia]')){
    const codigoTarjeta=elemento.closest('.materia-card')?.dataset.codigo;
    materiaAbierta=null;
    renderMaterias();
    grid.querySelector(`[data-codigo="${codigoTarjeta}"]`)?.focus();
    return;
  }
  const tarjeta=elemento.closest('.materia-card');
  if(tarjeta&&!elemento.closest('a')&&!tarjeta.classList.contains('abierta')){
    alturaTarjeta=tarjeta.getBoundingClientRect().height;
    materiaAbierta=tarjeta.dataset.codigo;
    renderMaterias();
    grid.querySelector('.materia-card')?.focus();
  }
});

grid.addEventListener('keydown',event=>{
  const tarjeta=event.target;
  if(!(tarjeta instanceof HTMLElement)||!tarjeta.matches('.materia-card')||tarjeta.classList.contains('abierta'))return;
  if(event.key==='Enter'||event.key===' '){
    event.preventDefault();
    alturaTarjeta=tarjeta.getBoundingClientRect().height;
    materiaAbierta=tarjeta.dataset.codigo;
    renderMaterias();
    grid.querySelector('.materia-card')?.focus();
  }
});

document.querySelectorAll('.lapso-tab').forEach(btn=>btn.addEventListener('click',()=>{
  lapsoActual=Number(btn.dataset.lapso);
  materiaAbierta=null;
  alturaTarjeta=0;
  document.querySelectorAll('.lapso-tab').forEach(b=>b.classList.toggle('activo',b===btn));
  renderMaterias();
}));
renderMaterias();
