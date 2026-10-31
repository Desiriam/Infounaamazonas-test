// Catálogo de asignaturas agrupadas por semestre; cada tarjeta se construye con estos datos.
const MATERIAS = {

  // Materias Del Primer Semestre //
  1: [
    {codigo:'115', nombre:'Lengua y Comunicación', categoria:'Castellano', icono:'Aa', carrera:'ambas', 
      descripcion:'Desarrollo de competencias para comprender, organizar y comunicar información académica.', 
      resumen:'La materia fortalece la comprensión y expresión de ideas en contextos académicos. El estudiante practica cómo interpretar textos, organizar información y comunicarla con claridad.', 
      contenidos:'Comprensión lectora, comunicación, lenguaje y producción de textos.'},

    {codigo:'116', nombre:'Introducción a la Informática', categoria:'Informática', icono:'⌘', carrera:'ambas', 
      descripcion:'Conceptos fundamentales de informática y uso de herramientas tecnológicas para el estudio.', 
      resumen:'La asignatura presenta los principios básicos de la informática y su aplicación en el aprendizaje. También orienta sobre el uso de recursos digitales como apoyo para las actividades académicas.', 
      contenidos:'Informática, tecnología, conceptos computacionales y herramientas digitales.'},

    {codigo:'176', nombre:'Matemática I', categoria:'Matemáticas', icono:'∑', carrera:'ambas', 
      descripcion:'Fundamentos matemáticos aplicados al razonamiento y a la resolución de problemas.', 
      resumen:'En esta materia se desarrollan herramientas matemáticas para analizar relaciones y resolver problemas. Se trabajan operaciones, conjuntos numéricos y funciones como base para estudios posteriores.', 
      contenidos:'Conjuntos numéricos, operaciones, orden en R, funciones y representación.'},

    {codigo:'631', nombre:'Fundamentos de la Contabilidad', categoria:'Contabilidad', icono:'₿', carrera:'ambas', 
      descripcion:'Base para comprender el registro y análisis de las operaciones económicas de una organización.', 
      resumen:'La asignatura explica cómo se organiza y registra la información financiera de una entidad. Sus fundamentos permiten reconocer los componentes del patrimonio y comprender la utilidad de los estados financieros.', 
      contenidos:'Activo, pasivo, patrimonio, partida doble, libros y estados financieros.'},

    {codigo:'601', nombre:'Introducción a la Administración', categoria:'Administración', icono:'▥', carrera:'administracion', 
      descripcion:'Introducción al pensamiento administrativo y a los conceptos esenciales de la administración.', 
      resumen:'La materia ofrece una visión inicial de la administración y del papel que cumple en las organizaciones. Aborda cómo se coordinan recursos y actividades para alcanzar objetivos.', 
      contenidos:'Conceptos administrativos, organizaciones, procesos y fundamentos de la administración.'}

  ],
  
  // Materias Del Segundo Semestre //
  2: [
    {codigo:'107', nombre:'Lógica', categoria:'Lógica', icono:'∴', carrera:'ambas', 
      descripcion:'Introducción al razonamiento lógico y a la evaluación de argumentos para la resolución de problemas.', 
      resumen:'Esta materia ayuda a construir razonamientos ordenados y a determinar si una conclusión se deriva de la información disponible. Sus herramientas se aplican al análisis de argumentos y a la solución de problemas.', 
      contenidos:'Proposiciones, conectores lógicos, tablas de verdad, inferencias y argumentos.'},

    {codigo:'178', nombre:'Matemática II', categoria:'Matemáticas', icono:'∞', carrera:'ambas', 
      descripcion:'Continuación del razonamiento matemático con énfasis en funciones, límites y continuidad.', 
      resumen:'La asignatura profundiza el estudio de las funciones y su comportamiento. El análisis de límites y continuidad permite describir cambios y comprender conceptos matemáticos de mayor complejidad.', 
      contenidos:'Límites, continuidad, funciones acotadas, máximos, mínimos y asíntotas.'},

    {codigo:'602', nombre:'Teoría de la Organización', categoria:'Administración', icono:'◎', carrera:'administracion', 
      descripcion:'Estudio de las organizaciones, su estructura y los enfoques utilizados para comprender su funcionamiento.', 
      resumen:'La materia examina cómo se estructuran las organizaciones y cómo se relacionan sus componentes. El estudio de distintos enfoques permite interpretar su funcionamiento y sus formas de coordinación.', 
      contenidos:'Organización, estructura, modelos organizacionales y enfoques de análisis.'},

    {codigo:'632', nombre:'Contabilidad Intermedia', categoria:'Contabilidad', icono:'▤', carrera:'ambas', 
      descripcion:'Profundización de los procedimientos contables mediante ejercicios y casos prácticos.', 
      resumen:'Esta asignatura amplía los conocimientos contables mediante el registro y seguimiento de operaciones. La práctica con ejercicios permite aplicar procedimientos y organizar la información financiera.', 
      contenidos:'Registro contable, libro mayor, operaciones y ejercicios de aplicación.'},

    {codigo:'641', nombre:'Teoría Económica I', categoria:'Economía', icono:'◌', carrera:'ambas', 
      descripcion:'Fundamentos de la ciencia económica y aproximación a la realidad económica y la microeconomía.', 
      resumen:'La materia introduce el análisis de la actividad económica y de las decisiones relacionadas con el uso de recursos. Presenta ideas fundamentales para interpretar fenómenos económicos y su relación con la sociedad.', 
      contenidos:'Actividad económica, proceso económico, leyes económicas y relación con otras ciencias.'}
  ]
};

// Solo se permite abrir una materia entre ambas columnas al mismo tiempo.
let materiaAbierta=null;
// Conserva la altura original de una tarjeta para que la versión abierta no cambie de tamaño.
const alturasTarjeta={1:0,2:0};

// Dibuja las tarjetas y el documento de detalle correspondientes a un semestre.
function renderMaterias(semestre){
  const grid=document.querySelector(`[data-semestre="${semestre}"].materias-grid`);
  const contador=document.getElementById(`contadorMaterias${semestre}`);
  const lista=MATERIAS[semestre];
  contador.textContent=`${lista.length} ${lista.length===1?'materia':'materias'}`;
  const codigoAbierto=materiaAbierta?.semestre===semestre?materiaAbierta.codigo:null;
  grid.innerHTML=lista.map(m=>{
    const abierta=m.codigo===codigoAbierto;
    return `<article class="materia-card${abierta?' abierta':''}" data-codigo="${m.codigo}" tabindex="0" aria-expanded="${abierta}" aria-label="${abierta?'Materia abierta':'Abrir materia'}: ${m.nombre}">
      <div class="materia-top"><span class="materia-icon">${m.icono}</span><span class="codigo">Cód. ${m.codigo}</span></div>
      <h3>${m.nombre}</h3>
      <p class="materia-introduccion">${m.descripcion}</p>
      ${abierta?`<div class="materia-acciones">
        <a class="materia-recurso" href="Biblioteca.html?categoria=${encodeURIComponent(m.categoria)}">Ir a la biblioteca</a>
        <button class="materia-cerrar" type="button" data-cerrar-materia>Cerrar</button>
      </div>`:'<span class="materia-indicacion">Haz clic para ver el resumen y los recursos <span aria-hidden="true">→</span></span>'}
    </article>${abierta?`<div class="materia-documento">
      <section><h4>Resumen de la materia</h4><p>${m.resumen}</p></section>
      <section><h4>Contenidos principales</h4><p>${m.contenidos}</p></section>
    </div>`:''}`;
  }).join('');
  if(codigoAbierto){
    grid.style.setProperty('--materia-card-height',`${alturasTarjeta[semestre]}px`);
  }else{
    grid.style.removeProperty('--materia-card-height');
  }
}

// Actualiza las dos columnas cuando una materia se abre o se cierra.
function renderTodosLosSemestres(){
  renderMaterias(1);
  renderMaterias(2);
}

document.querySelectorAll('.materias-grid').forEach(grid=>{
  const semestre=Number(grid.dataset.semestre);

  // La delegación permite atender también botones creados de nuevo al renderizar las tarjetas.
  grid.addEventListener('click',event=>{
    const elemento=event.target;
    if(!(elemento instanceof Element))return;
    if(elemento.closest('[data-cerrar-materia]')){
      const codigoTarjeta=elemento.closest('.materia-card')?.dataset.codigo;
      materiaAbierta=null;
      renderTodosLosSemestres();
      grid.querySelector(`[data-codigo="${codigoTarjeta}"]`)?.focus({preventScroll:true});
      return;
    }
    const tarjeta=elemento.closest('.materia-card');
    if(tarjeta&&!elemento.closest('a')&&!tarjeta.classList.contains('abierta')){
      alturasTarjeta[semestre]=tarjeta.getBoundingClientRect().height;
      materiaAbierta={semestre,codigo:tarjeta.dataset.codigo};
      renderTodosLosSemestres();
      grid.querySelector('.materia-card.abierta')?.focus({preventScroll:true});
    }
  });

  // Permite abrir una tarjeta enfocada con Enter o con la barra espaciadora.
  grid.addEventListener('keydown',event=>{
    const tarjeta=event.target;
    if(!(tarjeta instanceof HTMLElement)||!tarjeta.matches('.materia-card')||tarjeta.classList.contains('abierta'))return;
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      alturasTarjeta[semestre]=tarjeta.getBoundingClientRect().height;
      materiaAbierta={semestre,codigo:tarjeta.dataset.codigo};
      renderTodosLosSemestres();
      grid.querySelector('.materia-card.abierta')?.focus({preventScroll:true});
    }
  });
});

renderTodosLosSemestres();
