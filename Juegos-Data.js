const SOPA_WORDS = [
  ["LENGUA","Sistema de comunicación humana que estudia la asignatura de Lengua y Comunicación.","🗣️","LENGUA Y COMUNICACIÓN"],
  ["COMUNICACION","Intercambio y transmisión de información entre personas.","💬","LENGUA Y COMUNICACIÓN"],
  ["COMPRENSION","Capacidad para interpretar el sentido de un texto o mensaje.","📖","LENGUA Y COMUNICACIÓN"],
  ["EXPRESION","Comunicación de ideas, sentimientos o conocimientos.","✍️","LENGUA Y COMUNICACIÓN"],
  ["LECTURA","Proceso de interpretar y comprender un texto escrito.","📚","LENGUA Y COMUNICACIÓN"],
  ["INFORMATICA","Estudio del tratamiento automático de la información.","💻","INTRODUCCIÓN A LA INFORMÁTICA"],
  ["TECNOLOGIA","Conjunto de conocimientos y herramientas aplicados a una actividad.","⚙️","INTRODUCCIÓN A LA INFORMÁTICA"],
  ["COMPUTACION","Procesamiento de información mediante sistemas computacionales.","🖥️","INTRODUCCIÓN A LA INFORMÁTICA"],
  ["HERRAMIENTA","Recurso utilizado para realizar una tarea o resolver una necesidad.","🧰","INTRODUCCIÓN A LA INFORMÁTICA"],
  ["DIGITAL","Relacionado con datos representados y procesados electrónicamente.","🔢","INTRODUCCIÓN A LA INFORMÁTICA"],
  ["MATEMATICA","Ciencia que estudia números, relaciones, estructuras y operaciones.","➗","MATEMÁTICA I"],
  ["CONJUNTO","Colección definida de elementos con características comunes.","🔢","MATEMÁTICA I"],
  ["NUMEROS","Elementos que representan cantidades y permiten realizar cálculos.","🔣","MATEMÁTICA I"],
  ["OPERACION","Procedimiento matemático aplicado a uno o más valores.","➕","MATEMÁTICA I"],
  ["FUNCION","Relación que asigna a cada entrada un único valor de salida.","📈","MATEMÁTICA I"],
  ["CONTABILIDAD","Disciplina que registra y analiza las operaciones económicas.","📒","FUNDAMENTOS DE LA CONTABILIDAD"],
  ["ACTIVO","Bienes y derechos que pertenecen a una entidad.","💼","FUNDAMENTOS DE LA CONTABILIDAD"],
  ["PASIVO","Deudas y obligaciones que debe atender una entidad.","📑","FUNDAMENTOS DE LA CONTABILIDAD"],
  ["PATRIMONIO","Conjunto de bienes, derechos y obligaciones de una entidad.","🏦","FUNDAMENTOS DE LA CONTABILIDAD"],
  ["PARTIDA","Cada anotación que forma parte de un registro contable.","🧾","FUNDAMENTOS DE LA CONTABILIDAD"],
  ["ADMINISTRACION","Coordinación de recursos y actividades para alcanzar objetivos.","🏢","INTRODUCCIÓN A LA ADMINISTRACIÓN"],
  ["ORGANIZACION","Grupo estructurado de personas y recursos orientado a objetivos.","🏬","INTRODUCCIÓN A LA ADMINISTRACIÓN"],
  ["PROCESO","Conjunto ordenado de actividades para obtener un resultado.","🔄","INTRODUCCIÓN A LA ADMINISTRACIÓN"],
  ["RECURSO","Medio disponible para realizar actividades y alcanzar objetivos.","🧩","INTRODUCCIÓN A LA ADMINISTRACIÓN"],
  ["OBJETIVO","Resultado que una persona u organización busca alcanzar.","🎯","INTRODUCCIÓN A LA ADMINISTRACIÓN"],
  ["LOGICA","Estudio de las reglas del razonamiento válido.","∴","LÓGICA"],
  ["PROPOSICION","Enunciado que puede ser evaluado como verdadero o falso.","💭","LÓGICA"],
  ["CONECTOR","Expresión que relaciona proposiciones en un razonamiento.","🔗","LÓGICA"],
  ["INFERENCIA","Obtención de una conclusión a partir de premisas.","🧠","LÓGICA"],
  ["ARGUMENTO","Conjunto de razones que sustentan una conclusión.","🗨️","LÓGICA"],
  ["LIMITE","Valor al que se aproxima una función cuando cambia su variable.","↔️","MATEMÁTICA II"],
  ["CONTINUIDAD","Propiedad de una función cuyo comportamiento no presenta saltos.","〰️","MATEMÁTICA II"],
  ["MAXIMO","Mayor valor que alcanza una función en una región determinada.","⬆️","MATEMÁTICA II"],
  ["MINIMO","Menor valor que alcanza una función en una región determinada.","⬇️","MATEMÁTICA II"],
  ["ASINTOTA","Recta a la que una función se aproxima indefinidamente.","📉","MATEMÁTICA II"],
  ["ESTRUCTURA","Forma en que se organizan y relacionan las partes de una entidad.","🏗️","TEORÍA DE LA ORGANIZACIÓN"],
  ["MODELO","Representación que ayuda a describir o analizar una organización.","🗂️","TEORÍA DE LA ORGANIZACIÓN"],
  ["ENFOQUE","Perspectiva utilizada para estudiar una organización.","🔎","TEORÍA DE LA ORGANIZACIÓN"],
  ["COORDINACION","Organización conjunta de tareas y recursos para un propósito común.","🤝","TEORÍA DE LA ORGANIZACIÓN"],
  ["COMPONENTE","Parte que, junto con otras, integra una estructura organizacional.","🧱","TEORÍA DE LA ORGANIZACIÓN"],
  ["REGISTRO","Anotación ordenada de una operación contable.","📝","CONTABILIDAD INTERMEDIA"],
  ["ASIENTO","Anotación de una operación en los libros contables.","📓","CONTABILIDAD INTERMEDIA"],
  ["BALANCE","Estado que presenta la situación financiera de una entidad.","⚖️","CONTABILIDAD INTERMEDIA"],
  ["DEBE","Columna izquierda de una cuenta en el registro contable.","⬅️","CONTABILIDAD INTERMEDIA"],
  ["HABER","Columna derecha de una cuenta en el registro contable.","➡️","CONTABILIDAD INTERMEDIA"],
  ["ECONOMIA","Ciencia que estudia la producción y distribución de bienes y servicios.","📊","TEORÍA ECONÓMICA I"],
  ["MICROECONOMIA","Estudio de las decisiones de consumidores y empresas en los mercados.","🛒","TEORÍA ECONÓMICA I"],
  ["ACTIVIDAD","Acción económica relacionada con la producción o el intercambio.","🏭","TEORÍA ECONÓMICA I"],
  ["PRODUCCION","Creación de bienes o servicios mediante el uso de recursos.","🏭","TEORÍA ECONÓMICA I"],
  ["MERCADO","Espacio o sistema donde se intercambian bienes y servicios.","🛍️","TEORÍA ECONÓMICA I"]
];

function normalizar(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-ZÑ]/gi,"").toUpperCase();}
function barajar(a){return [...a].sort(()=>Math.random()-0.5);}
function elegir(a,n){return barajar(a).slice(0,n);}
function endModal(title,msg,again){
 return `<div class="overlay" id="endModal"><div class="modal"><h3>${title}</h3><p>${msg}</p><div class="btn-row"><button class="btn-game" id="againBtn">${again||"Volver a jugar"}</button><a class="btn-game" href="Juegos Educativos.html">Salir del juego</a></div></div></div>`;
}

const app = document.getElementById("app");
const gameType = document.body.dataset.game;
const toastElement = document.getElementById("toast");

let toastTimer;
let gameAudioContext;

function playGameSound(sound) {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return;
  if (!gameAudioContext) gameAudioContext = new AudioContextConstructor();
  if (gameAudioContext.state === "suspended") gameAudioContext.resume();

  const melodies = {
    letter: [[880, 0, 0.045]],
    shuffle: [[880, 0, 0.07], [660, 0.06, 0.07], [440, 0.12, 0.1]],
    hint: [[660, 0, 0.12], [880, 0.1, 0.16]],
    found: [[523, 0, 0.13], [659, 0.11, 0.13], [784, 0.22, 0.2]],
    victory: [[523, 0, 0.16], [659, 0.13, 0.16], [784, 0.26, 0.16], [1047, 0.39, 0.35]],
    wrong: [[220, 0, 0.18]]
  };
  const notes = melodies[sound];
  if (!notes) throw new Error(`Sonido de juego desconocido: ${sound}.`);

  const startedAt = gameAudioContext.currentTime;
  notes.forEach(([frequency, offset, duration]) => {
    const oscillator = gameAudioContext.createOscillator();
    const volume = gameAudioContext.createGain();
    const noteStart = startedAt + offset;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    volume.gain.setValueAtTime(0.0001, noteStart);
    volume.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.015);
    volume.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);
    oscillator.connect(volume);
    volume.connect(gameAudioContext.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + duration);
  });
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastElement.classList.remove("show"), 2200);
}

function startGame() {
  if (gameType === "sopa") startWordSearch();
  else if (gameType === "crucigrama") startCrossword();
  else if (gameType === "adivina") startGuessWord();
  else if (gameType === "quiz") renderQuizStart();
}

function normalizeWord(word) {
  return normalizar(word);
}

let wordSearchWords = [];
let wordSearchGrid = [];
let wordSearchPlacements = new Map();
let foundWords = new Set();
let hintedWords = new Set();
let wordSearchHintsRemaining = 3;
let activeCells = [];
let selectionStart = null;
let selecting = false;
let lastSoundingCell = null;
let activePointerId = null;
const wordSearchSize = 15;
const wordSearchDirections = [
  [0, 1], [1, 0], [1, 1], [-1, 1]
];
const wordSearchContexts = {
  "LENGUA Y COMUNICACIÓN": "Comprender este concepto ayuda a interpretar mensajes, organizar ideas y comunicarse con claridad en situaciones académicas y cotidianas.",
  "INTRODUCCIÓN A LA INFORMÁTICA": "Estudiar este concepto permite entender mejor cómo se procesa la información y cómo se aprovechan las herramientas digitales para aprender y resolver tareas.",
  "MATEMÁTICA I": "Dominar esta idea facilita resolver problemas, representar relaciones entre cantidades y explicar con orden los procedimientos utilizados.",
  "FUNDAMENTOS DE LA CONTABILIDAD": "Reconocer este elemento ayuda a registrar correctamente las operaciones económicas y a comprender la situación financiera de una organización.",
  "INTRODUCCIÓN A LA ADMINISTRACIÓN": "Este concepto permite comprender cómo se coordinan las personas, las actividades y los recursos para alcanzar los objetivos de una organización.",
  "LÓGICA": "Analizar este concepto ayuda a construir razonamientos coherentes, revisar las evidencias disponibles y determinar si una conclusión está bien sustentada.",
  "MATEMÁTICA II": "Su análisis permite describir el comportamiento de las funciones, interpretar sus cambios y justificar resultados mediante herramientas matemáticas.",
  "TEORÍA DE LA ORGANIZACIÓN": "Comprender este aspecto ayuda a interpretar cómo se relacionan las partes de una organización y cómo influyen en su funcionamiento.",
  "CONTABILIDAD INTERMEDIA": "Aplicar este concepto contribuye a organizar los movimientos contables y preparar información útil para analizar las finanzas de una entidad.",
  "TEORÍA ECONÓMICA I": "Estudiar este concepto ayuda a interpretar las decisiones de consumidores y empresas, así como el uso de recursos en la actividad económica."
};

function wordSearchSummary(word) {
  const context = wordSearchContexts[word[3]];
  if (!context) throw new Error(`No hay un resumen contextual para ${word[3]}.`);
  return `${word[1]} ${context}`;
}

function tryPlaceWord(board, word) {
  for (let attempt = 0; attempt < 1600; attempt++) {
    const [rowStep, columnStep] = wordSearchDirections[Math.floor(Math.random() * wordSearchDirections.length)];
    const row = Math.floor(Math.random() * wordSearchSize);
    const column = Math.floor(Math.random() * wordSearchSize);
    const endRow = row + rowStep * (word.length - 1);
    const endColumn = column + columnStep * (word.length - 1);
    if (endRow < 0 || endRow >= wordSearchSize || endColumn < 0 || endColumn >= wordSearchSize) continue;

    let fits = true;
    for (let index = 0; index < word.length; index++) {
      const current = board[row + rowStep * index][column + columnStep * index];
      if (current && current !== word[index]) {
        fits = false;
        break;
      }
    }
    if (!fits) continue;

    for (let index = 0; index < word.length; index++) {
      board[row + rowStep * index][column + columnStep * index] = word[index];
    }
    return { row, column, rowStep, columnStep };
  }
  return null;
}

function createWordSearchGrid() {
  const selected = elegir(SOPA_WORDS, 10);
  const words = selected
    .map(item => ({ item, answer: normalizeWord(item[0]) }))
    .sort((a, b) => b.answer.length - a.answer.length);

  for (let attempt = 0; attempt < 8; attempt++) {
    const board = Array.from({ length: wordSearchSize }, () => Array(wordSearchSize).fill(""));
    const placed = [];
    const placements = new Map();
    words.forEach(({ item, answer }) => {
      const placement = tryPlaceWord(board, answer);
      if (placement) {
        placed.push({ item, answer });
        placements.set(answer, placement);
      }
    });
    if (placed.length === words.length) {
      const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
      for (let row = 0; row < wordSearchSize; row++) {
        for (let column = 0; column < wordSearchSize; column++) {
          if (!board[row][column]) board[row][column] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
      wordSearchGrid = board;
      wordSearchWords = placed.map(({ item }) => item);
      wordSearchPlacements = placements;
      return;
    }
  }

  throw new Error("No se pudo generar el tablero de la sopa de letras.");
}

function startWordSearch() {
  createWordSearchGrid();
  foundWords = new Set();
  hintedWords = new Set();
  wordSearchHintsRemaining = 3;
  activeCells = [];
  selectionStart = null;
  selecting = false;
  activePointerId = null;
  renderWordSearch();
}

function renderWordSearch() {
  app.innerHTML = `<div class="game-panel">
    <div class="game-topbar">
      <span class="badge"><span id="foundCount">0</span>/${wordSearchWords.length} encontradas</span>
      <div class="progress-wrap"><div class="progress-bar" id="progress"></div></div>
      <button class="btn-game danger" type="button" id="reset">↻ Reiniciar</button>
    </div>
    <div class="wordsearch-layout">
      <div>
        <div class="ws-board-wrap">
          <div class="ws-board" id="wordSearchBoard"></div>
          <section class="word-reveal" id="wordReveal" role="dialog" aria-modal="true" aria-labelledby="wordRevealTitle" hidden></section>
        </div>
        <div class="status-box wordsearch-help">
          <span>Si no lo encuentras pide ayuda</span>
          <div class="hint-controls">
            <button class="btn-game" type="button" id="wordSearchHint">Pista</button>
            <span class="badge" aria-label="Pistas disponibles"><span id="hintCount">3</span>/3</span>
          </div>
          <span class="hint-message" id="hintMessage" role="status" aria-live="polite"></span>
        </div>
      </div>
      <aside class="game-panel" style="box-shadow:none;background:#f8fbff">
        <h3>Palabras</h3>
        <p>Encuentra las seleccionadas para esta partida.</p>
        <div class="word-list">${wordSearchWords.map((word, index) => `<div class="word-item" id="word-${index}">🔹 <span>${word[0]}</span></div>`).join("")}</div>
      </aside>
    </div>
  </div>${endModal("¡Reto completado!", "Has encontrado todas las palabras. Puedes iniciar una nueva partida con otros términos.")}
  <div class="overlay" id="resetConfirm" aria-hidden="true">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="resetConfirmTitle" aria-describedby="resetConfirmMessage">
      <h3 id="resetConfirmTitle">¿Quieres reiniciar?</h3>
      <p id="resetConfirmMessage"></p>
      <div class="btn-row">
        <button class="btn-game" type="button" id="cancelReset">Seguir jugando</button>
        <button class="btn-game" type="button" id="confirmReset">Reiniciar</button>
      </div>
    </section>
  </div>`;

  const board = document.getElementById("wordSearchBoard");
  wordSearchGrid.forEach((row, rowIndex) => row.forEach((letter, columnIndex) => {
    const cell = document.createElement("div");
    cell.className = "ws-cell";
    cell.textContent = letter;
    cell.dataset.row = rowIndex;
    cell.dataset.column = columnIndex;
    board.appendChild(cell);
  }));
  board.addEventListener("pointerdown", beginWordSelection);
  document.getElementById("reset").addEventListener("click", confirmWordSearchReset);
  document.getElementById("cancelReset").addEventListener("click", closeWordSearchReset);
  document.getElementById("confirmReset").addEventListener("click", startWordSearch);
  document.getElementById("resetConfirm").addEventListener("click", event => {
    if (event.target.id === "resetConfirm") closeWordSearchReset();
  });
  document.getElementById("againBtn").addEventListener("click", startWordSearch);
  document.getElementById("wordSearchHint").addEventListener("click", useWordSearchHint);
  document.getElementById("wordReveal").addEventListener("click", event => {
    if (event.target.closest("#continueWordSearch")) continueWordSearch();
  });
}

function confirmWordSearchReset() {
  const foundCount = foundWords.size;
  const message = foundCount === 0
    ? "Es en serio, ¿te rendirás sin comenzar? ¡Qué triste!"
    : foundCount > 8
      ? "Estás por terminar. ¡Vamos, no te rindas!"
      : "Fue un buen intento. Es mejor saber rendirse para intentarlo después.";
  document.getElementById("resetConfirmMessage").textContent = message;
  const dialog = document.getElementById("resetConfirm");
  dialog.classList.add("show");
  dialog.setAttribute("aria-hidden", "false");
  document.getElementById("cancelReset").focus();
}

function closeWordSearchReset() {
  const dialog = document.getElementById("resetConfirm");
  dialog.classList.remove("show");
  dialog.setAttribute("aria-hidden", "true");
  document.getElementById("reset").focus();
}

function useWordSearchHint() {
  const hintMessage = document.getElementById("hintMessage");
  if (wordSearchHintsRemaining === 0) {
    hintMessage.textContent = "Se han agotado todas las pistas.";
    playGameSound("wrong");
    return;
  }

  const pendingWords = wordSearchWords.filter(word => !foundWords.has(normalizeWord(word[0])));
  if (pendingWords.length === 0) return;

  const notYetHinted = pendingWords.filter(word => !hintedWords.has(normalizeWord(word[0])));
  const word = elegir(notYetHinted.length > 0 ? notYetHinted : pendingWords, 1)[0];
  const answer = normalizeWord(word[0]);
  const placement = wordSearchPlacements.get(answer);
  if (!placement) throw new Error(`No se encontró la ubicación de la palabra ${word[0]}.`);

  hintedWords.add(answer);
  wordSearchHintsRemaining--;
  document.getElementById("hintCount").textContent = wordSearchHintsRemaining;
  hintMessage.textContent = wordSearchHintsRemaining === 0 ? "Se han agotado todas las pistas." : "";
  playGameSound("hint");
  showWordSearchHint(placement, answer.length);
}

function showWordSearchHint(placement, wordLength) {
  const board = document.getElementById("wordSearchBoard");
  const cells = [];
  for (let index = 0; index < wordLength; index++) {
    const row = placement.row + placement.rowStep * index;
    const column = placement.column + placement.columnStep * index;
    const cell = board.querySelector(`.ws-cell[data-row="${row}"][data-column="${column}"]`);
    if (!cell) throw new Error(`No se encontró la celda ${row}, ${column} para una pista.`);
    cells.push(cell);
  }
  animateHintCells(board, cells);
}

function animateHintCells(board, cells) {
  const boardBounds = board.getBoundingClientRect();
  for (const cell of cells) {
    cell.classList.remove("hinting");
    void cell.offsetWidth;
    cell.classList.add("hinting");
    setTimeout(() => cell.classList.remove("hinting"), 2500);

    const bounds = cell.getBoundingClientRect();
    for (let particleIndex = 0; particleIndex < 3; particleIndex++) {
      const particle = document.createElement("span");
      particle.className = "hint-particle";
      particle.style.left = `${bounds.left - boardBounds.left + bounds.width / 2}px`;
      particle.style.top = `${bounds.top - boardBounds.top + bounds.height / 2}px`;
      particle.style.setProperty("--particle-x", `${Math.round(Math.random() * 40 - 20)}px`);
      particle.style.setProperty("--particle-y", `${Math.round(Math.random() * 40 - 20)}px`);
      board.appendChild(particle);
      setTimeout(() => particle.remove(), 850);
    }
  }
}

function continueWordSearch() {
  document.getElementById("wordReveal").hidden = true;
  if (foundWords.size === wordSearchWords.length) {
    playGameSound("victory");
    document.getElementById("endModal").classList.add("show");
    showGameCelebration();
  }
}

function showGameCelebration() {
  const overlay = document.getElementById("endModal");
  const layer = document.createElement("div");
  const colors = ["#4b8fd8", "#80b5ed", "#c5e1ff", "#f4b400"];
  layer.className = "celebration-layer";
  for (let index = 0; index < 56; index++) {
    const piece = document.createElement("span");
    piece.className = "celebration-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.setProperty("--fall-duration", `${1.8 + Math.random() * 1.4}s`);
    piece.style.setProperty("--fall-delay", `${Math.random() * 0.65}s`);
    piece.style.setProperty("--fall-drift", `${Math.round(Math.random() * 180 - 90)}px`);
    piece.style.setProperty("--fall-spin", `${Math.round(Math.random() * 900 - 450)}deg`);
    layer.appendChild(piece);
  }
  overlay.appendChild(layer);
  setTimeout(() => layer.remove(), 3500);
}

function beginWordSelection(event) {
  if (!event.isPrimary || !document.getElementById("wordReveal").hidden) return;
  const cell = event.target.closest(".ws-cell");
  if (!cell) return;
  event.preventDefault();
  selecting = true;
  activePointerId = event.pointerId;
  selectionStart = [Number(cell.dataset.row), Number(cell.dataset.column)];
  activeCells = [selectionStart];
  lastSoundingCell = `${selectionStart[0]},${selectionStart[1]}`;
  playGameSound("letter");
  paintWordSelection();
}

function updateWordSelection(event) {
  if (!selecting || event.pointerId !== activePointerId) return;
  const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest(".ws-cell");
  if (!cell || !document.getElementById("wordSearchBoard").contains(cell)) return;
  const row = Number(cell.dataset.row);
  const column = Number(cell.dataset.column);
  const rowDifference = row - selectionStart[0];
  const columnDifference = column - selectionStart[1];
  if (rowDifference !== 0 && columnDifference !== 0 && Math.abs(rowDifference) !== Math.abs(columnDifference)) return;

  const rowStep = Math.sign(rowDifference);
  const columnStep = Math.sign(columnDifference);
  const length = Math.max(Math.abs(rowDifference), Math.abs(columnDifference));
  const currentCell = `${row},${column}`;
  if (currentCell !== lastSoundingCell) {
    lastSoundingCell = currentCell;
    playGameSound("letter");
  }
  activeCells = Array.from({ length: length + 1 }, (_, index) => [
    selectionStart[0] + rowStep * index,
    selectionStart[1] + columnStep * index
  ]);
  paintWordSelection();
}

document.addEventListener("pointermove", updateWordSelection);

function paintWordSelection() {
  document.querySelectorAll(".ws-cell.selecting").forEach(cell => cell.classList.remove("selecting"));
  activeCells.forEach(([row, column]) => {
    document.querySelector(`.ws-cell[data-row="${row}"][data-column="${column}"]`)?.classList.add("selecting");
  });
}

function finishWordSelection(event) {
  if (!selecting || event.pointerId !== activePointerId) return;
  selecting = false;
  activePointerId = null;
  const selected = activeCells.map(([row, column]) => wordSearchGrid[row][column]).join("");
  const wordIndex = wordSearchWords.findIndex(word => {
    const answer = normalizeWord(word[0]);
    return !foundWords.has(answer) && answer === selected;
  });

  if (wordIndex >= 0) {
    const word = wordSearchWords[wordIndex];
    playGameSound("found");
    lastSoundingCell = null;
    foundWords.add(normalizeWord(word[0]));
    document.querySelectorAll("#wordSearchBoard .hinting").forEach(cell => cell.classList.remove("hinting"));
    document.querySelectorAll("#wordSearchBoard .hint-particle").forEach(particle => particle.remove());
    activeCells.forEach(([row, column]) => {
      document.querySelector(`.ws-cell[data-row="${row}"][data-column="${column}"]`)?.classList.add("found");
    });
    document.getElementById(`word-${wordIndex}`).classList.add("found");
    document.getElementById("foundCount").textContent = foundWords.size;
    document.getElementById("progress").style.width = `${foundWords.size / wordSearchWords.length * 100}%`;
    const wordReveal = document.getElementById("wordReveal");
    wordReveal.innerHTML = `<div class="word-reveal-card">
      <span class="word-reveal-kicker">Palabra encontrada</span>
      <h3 id="wordRevealTitle">${word[0]}</h3>
      <p>${wordSearchSummary(word)}</p>
      <button class="btn-game" type="button" id="continueWordSearch">Continuar jugando</button>
    </div>`;
    wordReveal.hidden = false;
    document.getElementById("continueWordSearch").focus();
  } else if (activeCells.length > 1) {
    playGameSound("wrong");
    showToast("Esa selección no corresponde a una palabra pendiente.");
  }

  lastSoundingCell = null;
  activeCells = [];
  paintWordSelection();
}

document.addEventListener("pointerup", finishWordSelection);
document.addEventListener("pointercancel", event => {
  if (!selecting || event.pointerId !== activePointerId) return;
  selecting = false;
  activePointerId = null;
  lastSoundingCell = null;
  activeCells = [];
  paintWordSelection();
});

let crosswordTargets = [];
let crosswordPlacements = [];
let crosswordBoard = [];
let crosswordCurrent = 0;
let crosswordLetters = [];
let crosswordBank = [];
let crosswordUserPositions = [];
let crosswordHintsRemaining = 3;
const crosswordSize = 23;

function crosswordCanPlace(board, word, row, column, direction, requireCrossing) {
  const rowStep = direction === "v" ? 1 : 0;
  const columnStep = direction === "h" ? 1 : 0;
  const endRow = row + rowStep * (word.length - 1);
  const endColumn = column + columnStep * (word.length - 1);
  if (row < 0 || column < 0 || endRow >= crosswordSize || endColumn >= crosswordSize) return false;

  let crossings = 0;
  for (let index = 0; index < word.length; index++) {
    const currentRow = row + rowStep * index;
    const currentColumn = column + columnStep * index;
    const existing = board[currentRow][currentColumn];
    if (existing && existing !== word[index]) return false;
    if (existing === word[index]) crossings++;

    const beforeRow = currentRow - rowStep;
    const beforeColumn = currentColumn - columnStep;
    const afterRow = currentRow + rowStep;
    const afterColumn = currentColumn + columnStep;
    if (index === 0 && board[beforeRow]?.[beforeColumn]) return false;
    if (index === word.length - 1 && board[afterRow]?.[afterColumn]) return false;

    if (!existing) {
      const neighbors = direction === "h"
        ? [[currentRow - 1, currentColumn], [currentRow + 1, currentColumn]]
        : [[currentRow, currentColumn - 1], [currentRow, currentColumn + 1]];
      if (neighbors.some(([neighborRow, neighborColumn]) => board[neighborRow]?.[neighborColumn])) return false;
    }
  }
  return !requireCrossing || crossings > 0;
}

function crosswordPut(board, word, row, column, direction) {
  const rowStep = direction === "v" ? 1 : 0;
  const columnStep = direction === "h" ? 1 : 0;
  for (let index = 0; index < word.length; index++) {
    board[row + rowStep * index][column + columnStep * index] = word[index];
  }
  return { word, row, column, direction };
}

function buildCrossword() {
  const eligibleWords = SOPA_WORDS.filter(item => normalizeWord(item[0]).length <= 11);
  if (eligibleWords.length < 10) {
    throw new Error("Se necesitan al menos 10 palabras de 11 letras o menos para generar el crucigrama.");
  }
  const candidates = elegir(eligibleWords, 10).map(item => ({ item, word: normalizeWord(item[0]) }));
  for (let attempt = 0; attempt < 120; attempt++) {
    const board = Array.from({ length: crosswordSize }, () => Array(crosswordSize).fill(""));
    const placements = [];
    const ordered = barajar([...candidates]).sort((a, b) => b.word.length - a.word.length);
    const first = ordered[0].word;
    placements.push(crosswordPut(board, first, Math.floor(crosswordSize / 2), Math.floor((crosswordSize - first.length) / 2), "h"));
    let pending = ordered.slice(1);

    while (pending.length > 0) {
      const remaining = [];
      let placedWord = false;
      for (const candidate of barajar(pending)) {
        const word = candidate.word;
        const options = [];
        for (const placement of placements) {
          for (let wordIndex = 0; wordIndex < word.length; wordIndex++) {
            for (let placedIndex = 0; placedIndex < placement.word.length; placedIndex++) {
              if (word[wordIndex] !== placement.word[placedIndex]) continue;
              const direction = placement.direction === "h" ? "v" : "h";
              const row = placement.row + (placement.direction === "v" ? placedIndex : 0) - (direction === "v" ? wordIndex : 0);
              const column = placement.column + (placement.direction === "h" ? placedIndex : 0) - (direction === "h" ? wordIndex : 0);
              if (crosswordCanPlace(board, word, row, column, direction, true)
                && !options.some(option => option.row === row && option.column === column && option.direction === direction)) {
                options.push({ row, column, direction });
              }
            }
          }
        }

        if (options.length) {
          const option = options[Math.floor(Math.random() * options.length)];
          placements.push(crosswordPut(board, word, option.row, option.column, option.direction));
          placedWord = true;
        } else {
          remaining.push(candidate);
        }
      }
      if (!placedWord) break;
      pending = remaining;
    }

    if (placements.length === candidates.length) {
      crosswordBoard = board;
      crosswordPlacements = placements;
      crosswordTargets = placements.map(placement => candidates.find(item => item.word === placement.word).item);
      return;
    }
  }

  throw new Error("No se pudo generar un crucigrama con las 10 palabras seleccionadas.");
}

function startCrossword() {
  crosswordCurrent = 0;
  crosswordLetters = [];
  crosswordBank = [];
  crosswordUserPositions = [];
  crosswordHintsRemaining = 3;
  buildCrossword();
  renderCrossword();
}

function renderCrossword() {
  app.innerHTML = `<div class="game-panel">
    <div class="game-topbar">
      <span class="badge"><span id="crosswordDone">0</span>/${crosswordTargets.length} palabras encontradas</span>
      <div class="progress-wrap" role="progressbar" aria-label="Progreso del crucigrama" aria-valuemin="0" aria-valuemax="${crosswordTargets.length}" aria-valuenow="0">
        <div class="progress-bar" id="crosswordProgress"></div>
      </div>
      <button class="btn-game danger" type="button" id="reset">↻ Reiniciar</button>
    </div>
    <div class="cross-layout">
      <div>
        <div class="cross-board" id="crosswordBoard" aria-label="Tablero del crucigrama"></div>
        <div class="status-box wordsearch-help">
          <span>Lee la definición y forma la palabra con las letras disponibles.</span>
          <div class="hint-controls">
            <button class="btn-game" type="button" id="crosswordHint">Pista</button>
            <span class="badge" aria-label="Pistas disponibles"><span id="crosswordHintCount">3</span>/3</span>
          </div>
          <span class="hint-message" id="crosswordHintMessage" role="status" aria-live="polite"></span>
        </div>
      </div>
      <aside class="game-panel" style="box-shadow:none;background:#f8fbff">
        <h3>¿Qué palabra es?</h3>
        <p class="crossword-clue" id="crosswordClue"></p>
        <div class="current-word" id="currentWord" aria-label="Letras de tu respuesta"></div>
        <div class="target-info" id="targetInfo"></div>
        <div class="letters-title">Banco de letras</div>
        <div class="letter-pad" id="letterPad"></div>
        <div class="btn-row crossword-controls">
          <button class="btn-game" type="button" id="erase">← Borrar</button>
          <button class="btn-game" type="button" id="shuffle" aria-label="Revolver las letras">Revolver</button>
          <button class="btn-game" type="button" id="check">Comprobar</button>
        </div>
        <h4 class="letters-title">Palabras encontradas</h4>
        <div class="word-list crossword-found-list" id="crosswordFoundList">
          <p class="crossword-empty">Aquí aparecerán las palabras que resuelvas.</p>
        </div>
      </aside>
    </div>
  </div>${endModal("¡Crucigrama completado!", "Has formado todas las palabras del tablero.")}
  <div class="overlay" id="crosswordResetConfirm" aria-hidden="true">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="crosswordResetTitle" aria-describedby="crosswordResetMessage">
      <h3 id="crosswordResetTitle">¿Quieres reiniciar?</h3>
      <p id="crosswordResetMessage"></p>
      <div class="btn-row">
        <button class="btn-game" type="button" id="crosswordCancelReset">Seguir jugando</button>
        <button class="btn-game" type="button" id="crosswordConfirmReset">Reiniciar</button>
      </div>
    </section>
  </div>`;

  const board = document.getElementById("crosswordBoard");
  crosswordBoard.forEach((row, rowIndex) => row.forEach((letter, columnIndex) => {
    const cell = document.createElement("div");
    cell.className = `cross-cell${letter ? "" : " black"}`;
    if (letter) cell.dataset.position = `${rowIndex},${columnIndex}`;
    board.appendChild(cell);
  }));

  document.getElementById("reset").addEventListener("click", confirmCrosswordReset);
  document.getElementById("crosswordCancelReset").addEventListener("click", closeCrosswordReset);
  document.getElementById("crosswordConfirmReset").addEventListener("click", startCrossword);
  document.getElementById("crosswordResetConfirm").addEventListener("click", event => {
    if (event.target.id === "crosswordResetConfirm") closeCrosswordReset();
  });
  document.getElementById("againBtn").addEventListener("click", startCrossword);
  document.getElementById("erase").addEventListener("click", eraseCrosswordLetter);
  document.getElementById("shuffle").addEventListener("click", shuffleCrosswordLetters);
  document.getElementById("check").addEventListener("click", checkCrosswordWord);
  document.getElementById("crosswordHint").addEventListener("click", useCrosswordHint);
  renderCrosswordTarget();
}

function confirmCrosswordReset() {
  const foundCount = crosswordCurrent;
  const message = foundCount === 0
    ? "Es en serio, ¿te rendirás sin comenzar? ¡Qué triste!"
    : foundCount > 8
      ? "Estás por terminar. ¡Vamos, no te rindas!"
      : "Fue un buen intento. Es mejor saber rendirse para intentarlo después.";
  document.getElementById("crosswordResetMessage").textContent = message;
  const dialog = document.getElementById("crosswordResetConfirm");
  dialog.classList.add("show");
  dialog.setAttribute("aria-hidden", "false");
  document.getElementById("crosswordCancelReset").focus();
}

function closeCrosswordReset() {
  const dialog = document.getElementById("crosswordResetConfirm");
  dialog.classList.remove("show");
  dialog.setAttribute("aria-hidden", "true");
  document.getElementById("reset").focus();
}

function renderCrosswordTarget() {
  const item = crosswordTargets[crosswordCurrent];
  const answer = normalizeWord(item[0]);
  crosswordLetters = Array(answer.length).fill(null);
  crosswordUserPositions = [];
  crosswordBank = [];
  document.getElementById("crosswordClue").textContent = item[1];
  document.getElementById("currentWord").textContent = "_ ".repeat(answer.length).trim();
  document.getElementById("targetInfo").textContent = `Palabra ${crosswordCurrent + 1} de ${crosswordTargets.length} · ${answer.length} letras`;

  const distractors = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"].filter(letter => !answer.includes(letter));
  crosswordBank = barajar([...answer, ...elegir(distractors, Math.min(4, Math.max(2, 8 - answer.length)))])
    .map((letter, id) => ({ id, letter }));
  renderCrosswordLetterBank();
}

function renderCrosswordLetterBank() {
  document.getElementById("letterPad").innerHTML = crosswordBank.map(({ id, letter }) =>
    `<button class="letter-btn${crosswordLetters.includes(id) ? " used" : ""}" type="button" data-index="${id}" aria-label="Letra ${letter}">${letter}</button>`
  ).join("");
  document.getElementById("letterPad").querySelectorAll("[data-index]").forEach(button => {
    button.addEventListener("click", () => {
      const position = crosswordLetters.indexOf(null);
      if (position < 0) {
        showToast("Borra una letra antes de pedir otra pista.");
        playGameSound("wrong");
        return;
      }
      const index = Number(button.dataset.index);
      crosswordLetters[position] = index;
      crosswordUserPositions.push(position);
      button.classList.add("used");
      playGameSound("letter");
      updateCrosswordWord();
    });
  });
}

function updateCrosswordWord() {
  document.getElementById("currentWord").textContent = crosswordLetters
    .map(index => index === null ? "_" : crosswordBank.find(letter => letter.id === index).letter)
    .join(" ");
}

function eraseCrosswordLetter() {
  const position = crosswordUserPositions.pop();
  if (position === undefined) return;
  const index = crosswordLetters[position];
  crosswordLetters[position] = null;
  document.querySelector(`.letter-btn[data-index="${index}"]`)?.classList.remove("used");
  playGameSound("letter");
  updateCrosswordWord();
}

function shuffleCrosswordLetters() {
  crosswordBank = barajar(crosswordBank);
  playGameSound("shuffle");
  renderCrosswordLetterBank();
}

function useCrosswordHint() {
  const message = document.getElementById("crosswordHintMessage");
  if (crosswordHintsRemaining === 0) {
    message.textContent = "Se han agotado todas las pistas.";
    playGameSound("wrong");
    return;
  }

  const position = crosswordLetters.indexOf(null);
  if (position < 0) return;
  const answer = normalizeWord(crosswordTargets[crosswordCurrent][0]);
  const letter = crosswordBank.find(item => item.letter === answer[position] && !crosswordLetters.includes(item.id));
  if (!letter) {
    showToast("Borra una letra incorrecta para poder usar una pista.");
    return;
  }

  crosswordLetters[position] = letter.id;
  crosswordHintsRemaining--;
  document.getElementById("crosswordHintCount").textContent = crosswordHintsRemaining;
  message.textContent = crosswordHintsRemaining === 0 ? "Se han agotado todas las pistas." : "";
  playGameSound("hint");
  renderCrosswordLetterBank();
  updateCrosswordWord();
  showCrosswordHint();
}

function showCrosswordHint() {
  const board = document.getElementById("crosswordBoard");
  const placement = crosswordPlacements[crosswordCurrent];
  const rowStep = placement.direction === "v" ? 1 : 0;
  const columnStep = placement.direction === "h" ? 1 : 0;
  const cells = [];

  for (let index = 0; index < placement.word.length; index++) {
    const row = placement.row + rowStep * index;
    const column = placement.column + columnStep * index;
    const cell = board.querySelector(`.cross-cell[data-position="${row},${column}"]`);
    if (!cell) throw new Error(`No se encontró la celda ${row}, ${column} para una pista.`);
    cells.push(cell);
  }
  animateHintCells(board, cells);
}

function checkCrosswordWord() {
  const answer = normalizeWord(crosswordTargets[crosswordCurrent][0]);
  const attempt = crosswordLetters
    .map(index => index === null ? "" : crosswordBank.find(letter => letter.id === index).letter)
    .join("");
  if (attempt !== answer) {
    playGameSound("wrong");
    showToast("Revisa la definición y el orden de las letras.");
    return;
  }

  const foundCount = crosswordCurrent + 1;
  document.getElementById("crosswordDone").textContent = foundCount;
  const progress = document.getElementById("crosswordProgress");
  progress.style.width = `${foundCount / crosswordTargets.length * 100}%`;
  progress.parentElement.setAttribute("aria-valuenow", String(foundCount));
  const foundWord = document.createElement("div");
  foundWord.className = "word-item";
  foundWord.textContent = `✓ ${crosswordTargets[crosswordCurrent][0]}`;
  document.getElementById("crosswordFoundList").querySelector(".crossword-empty")?.remove();
  document.getElementById("crosswordFoundList").appendChild(foundWord);
  playGameSound("found");
  const placement = crosswordPlacements[crosswordCurrent];
  const rowStep = placement.direction === "v" ? 1 : 0;
  const columnStep = placement.direction === "h" ? 1 : 0;
  for (let index = 0; index < placement.word.length; index++) {
    const row = placement.row + rowStep * index;
    const column = placement.column + columnStep * index;
    const cell = document.querySelector(`.cross-cell[data-position="${row},${column}"]`);
    if (cell) {
      cell.textContent = placement.word[index];
      cell.classList.add("done");
    }
  }

  crosswordCurrent++;
  if (crosswordCurrent === crosswordTargets.length) {
    playGameSound("victory");
    document.getElementById("endModal").classList.add("show");
    showGameCelebration();
  } else {
    renderCrosswordTarget();
    showToast("¡Correcto! La palabra encaja en el tablero.");
  }
}

const clueMap = {
  LENGUA:["🗣️","🌍","💬","📣"], COMUNICACION:["📨","👥","📡","🫱"], COMPRENSION:["📖","🧩","💡","🔍"],
  EXPRESION:["🎨","💭","🎤","🪶"], LECTURA:["📚","👓","📄","🔖"], INFORMATICA:["💻","⌨️","🖱️","🔌"],
  TECNOLOGIA:["⚙️","🔧","📱","🚀"], COMPUTACION:["🖥️","🧮","💾","🖨️"], HERRAMIENTA:["🧰","🔨","🪛","🪚"],
  DIGITAL:["🔢","📲","🛰️","🧬"], MATEMATICA:["➗","📐","📏","🧮"], CONJUNTO:["🧺","🔵","🔺","🟩"],
  NUMEROS:["🔣","🎲","🔟","🧾"], OPERACION:["➕","➖","✖️","🟰"], FUNCION:["📈","🧪","🗺️","🎛️"],
  CONTABILIDAD:["📒","🪙","🧮","🧷"], ACTIVO:["💼","🏠","🚗","💎"], PASIVO:["📑","💳","🧾","📉"],
  PATRIMONIO:["🏦","🏛️","💰","🛡️"], PARTIDA:["🧾","🗃️","📌","🪙"], ADMINISTRACION:["🏢","📋","🗄️","🧑‍💼"],
  ORGANIZACION:["🏬","🧑‍🤝‍🧑","🗂️","🧭"], PROCESO:["🔄","⏳","⚡","🛠️"], RECURSO:["🧩","📦","🪵","🪙"],
  OBJETIVO:["🎯","🏁","🥅","🚩"], LOGICA:["∴","⚖️","🔗","💭"], PROPOSICION:["💬","✅","❔","📝"],
  CONECTOR:["🪢","🔗","🧷","🧱"], INFERENCIA:["🧠","🕵️","🧵","💡"], ARGUMENTO:["🗨️","🧑‍⚖️","📣","🗣️"],
  LIMITE:["↔️","🚧","📍","🔚"], CONTINUIDAD:["〰️","♾️","🛤️","🔁"], MAXIMO:["⬆️","🏔️","🥇","🔝"],
  MINIMO:["⬇️","🐜","🔻","🪫"], ASINTOTA:["📉","📊","📏","〽️"], ESTRUCTURA:["🏗️","🧱","🏛️","🪜"],
  MODELO:["🗂️","🧑‍🎨","🧱","📐"], ENFOQUE:["🔎","📷","🎯","🔭"], COORDINACION:["🤝","🎼","🧑‍🤝‍🧑","🪢"],
  COMPONENTE:["🧱","⚙️","🧩","🧬"], REGISTRO:["📝","📔","🖋️","📅"], ASIENTO:["📓","💺","🪑","🧾"],
  BALANCE:["⚖️","🧘","🏋️","🪙"], DEBE:["⬅️","📥","🫴","📤"], HABER:["➡️","📤","🫳","📥"],
  ECONOMIA:["📊","🏛️","💹","🪙"], MICROECONOMIA:["🛒","🧑‍🍳","🏪","🧑‍💼"], ACTIVIDAD:["🏭","🛠️","🏃","⚒️"],
  PRODUCCION:["🧵","📦","🏭","🚚"], MERCADO:["🛍️","🏷️","🧺","🛒"]
};

let guessWords = [];
let guessRound = 0;
let guessAnswer = [];
let guessLocked = false;
let guessBank = [];
let guessHintCount = 3;
let guessFoundWords = [];
let guessAdvanceTimer;

function selectGuessWords() {
  const candidates = barajar([...SOPA_WORDS]);
  const clueSets = new Map(candidates.map(item => {
    const clues = clueMap[normalizeWord(item[0])];
    if (!clues || clues.length !== 4) {
      throw new Error(`La palabra ${item[0]} no tiene cuatro ilustraciones configuradas.`);
    }
    return [item, new Set(clues)];
  }));
  const findSequence = maxSharedClues => {
    const sequence = [];
    const search = remaining => {
      if (sequence.length === 10) return true;
      const options = barajar(remaining.filter(item => {
        if (!sequence.length) return true;
        const previous = clueSets.get(sequence[sequence.length - 1]);
        const shared = [...clueSets.get(item)].filter(clue => previous.has(clue)).length;
        return shared <= maxSharedClues;
      }));
      for (const item of options) {
        sequence.push(item);
        if (search(remaining.filter(candidate => candidate !== item))) return true;
        sequence.pop();
      }
      return false;
    };
    return search(candidates) ? [...sequence] : null;
  };
  return findSequence(0) || findSequence(1) ||
    (() => { throw new Error("No se pudo crear una secuencia de 10 palabras con imágenes variadas."); })();
}

function startGuessWord() {
  clearTimeout(guessAdvanceTimer);
  guessAdvanceTimer = null;
  guessWords = selectGuessWords();
  guessRound = 0;
  guessAnswer = [];
  guessLocked = false;
  guessHintCount = 3;
  guessFoundWords = [];
  renderGuessRound();
}

function renderGuessRound() {
  guessAnswer = [];
  guessLocked = false;
  const item = guessWords[guessRound];
  const answer = normalizeWord(item[0]);
  const clues = clueMap[answer];
  const distractors = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"].filter(letter => !answer.includes(letter));
  guessBank = barajar([...answer, ...elegir(distractors, Math.min(5, Math.max(3, 10 - answer.length)))])
    .map((letter, id) => ({ id, letter }));

  app.innerHTML = `<div class="game-panel">
    <div class="game-topbar">
      <span class="badge"><span id="guessFoundCount">${guessFoundWords.length}</span>/${guessWords.length} palabras encontradas</span>
      <div class="progress-wrap" role="progressbar" aria-label="Progreso de palabras encontradas" aria-valuemin="0" aria-valuemax="${guessWords.length}" aria-valuenow="${guessFoundWords.length}">
        <div class="progress-bar" id="guessProgress" style="width:${guessFoundWords.length / guessWords.length * 100}%"></div>
      </div>
      <button class="btn-game danger" type="button" id="reset">↻ Reiniciar</button>
    </div>
    <div class="guess-layout">
      <div>
        <div class="clue-images" aria-label="Ilustraciones relacionadas con la palabra">
          ${clues.map(clue => `<div class="clue-card"><div class="clue-art" aria-hidden="true">${clue}</div></div>`).join("")}
        </div>
        <section class="game-panel guess-clue-panel">
          <h3>Definición</h3>
          <p class="guess-definition">${item[1]}</p>
        </section>
        <div class="status-box wordsearch-help">
          <span>Lee la definición y organiza las letras para descubrir la palabra.</span>
          <div class="hint-controls">
            <button class="btn-game" type="button" id="guessHint">Pista</button>
            <span class="badge" aria-label="Pistas disponibles"><span id="guessHintCount">${guessHintCount}</span>/3</span>
          </div>
          <span class="hint-message" id="guessHintMessage" role="status" aria-live="polite"></span>
        </div>
      </div>
      <aside class="game-panel" style="box-shadow:none;background:#f8fbff">
        <h3>Forma la palabra</h3>
        <div class="answer-slots" id="answerSlots">${answer.split("").map(() => '<div class="answer-slot"></div>').join("")}</div>
        <div class="guess-letters" id="guessLetters"></div>
        <div class="btn-row crossword-controls">
          <button class="btn-game" type="button" id="erase">← Borrar</button>
          <button class="btn-game" type="button" id="guessShuffle" aria-label="Revolver las letras">Revolver</button>
          <button class="btn-game" type="button" id="check">Comprobar</button>
        </div>
        <h4 class="letters-title">Palabras encontradas</h4>
        <div class="word-list crossword-found-list" id="guessFoundList">
          ${guessFoundWords.length ? guessFoundWords.map(word => `<div class="word-item">✓ ${word[0]}</div>`).join("") : '<p class="crossword-empty">Aquí aparecerán las palabras que resuelvas.</p>'}
        </div>
      </aside>
    </div>
  </div>
  <div class="overlay" id="guessResetConfirm" aria-hidden="true">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="guessResetTitle" aria-describedby="guessResetMessage">
      <h3 id="guessResetTitle">¿Quieres reiniciar?</h3>
      <p id="guessResetMessage"></p>
      <div class="btn-row">
        <button class="btn-game" type="button" id="guessCancelReset">Seguir jugando</button>
        <button class="btn-game" type="button" id="guessConfirmReset">Reiniciar</button>
      </div>
    </section>
  </div>${endModal("¡Muy bien!", "Has completado todas las palabras de esta partida.")}`;

  document.getElementById("reset").addEventListener("click", confirmGuessReset);
  document.getElementById("guessCancelReset").addEventListener("click", closeGuessReset);
  document.getElementById("guessConfirmReset").addEventListener("click", startGuessWord);
  document.getElementById("guessResetConfirm").addEventListener("click", event => {
    if (event.target.id === "guessResetConfirm") closeGuessReset();
  });
  document.getElementById("againBtn").addEventListener("click", startGuessWord);
  document.getElementById("erase").addEventListener("click", eraseGuessLetter);
  document.getElementById("guessShuffle").addEventListener("click", shuffleGuessLetters);
  document.getElementById("check").addEventListener("click", checkGuessAnswer);
  document.getElementById("guessHint").addEventListener("click", useGuessHint);
  renderGuessLetterBank();
}

function confirmGuessReset() {
  const foundCount = guessFoundWords.length;
  const message = foundCount === 0
    ? "Es en serio, ¿te rendirás sin comenzar? ¡Qué triste!"
    : foundCount > 8
      ? "Estás por terminar. ¡Vamos, no te rindas!"
      : "Fue un buen intento. Es mejor saber rendirse para intentarlo después.";
  document.getElementById("guessResetMessage").textContent = message;
  const dialog = document.getElementById("guessResetConfirm");
  dialog.classList.add("show");
  dialog.setAttribute("aria-hidden", "false");
  document.getElementById("guessCancelReset").focus();
}

function closeGuessReset() {
  const dialog = document.getElementById("guessResetConfirm");
  dialog.classList.remove("show");
  dialog.setAttribute("aria-hidden", "true");
  document.getElementById("reset").focus();
}

function renderGuessLetterBank() {
  document.getElementById("guessLetters").innerHTML = guessBank.map(({ id, letter }) =>
    `<button class="guess-letter${guessAnswer.includes(id) ? " used" : ""}" type="button" data-index="${id}" aria-label="Letra ${letter}">${letter}</button>`
  ).join("");
  document.getElementById("guessLetters").querySelectorAll("[data-index]").forEach(button => {
    button.addEventListener("click", () => {
      if (guessLocked || guessAnswer.length >= normalizeWord(guessWords[guessRound][0]).length) return;
      const index = Number(button.dataset.index);
      guessAnswer.push(index);
      button.classList.add("used");
      playGameSound("letter");
      updateGuessAnswer();
    });
  });
}

function updateGuessAnswer() {
  const answerSlots = document.querySelectorAll("#answerSlots .answer-slot");
  answerSlots.forEach((slot, index) => {
    const letterIndex = guessAnswer[index];
    slot.textContent = letterIndex === undefined ? "" : guessBank.find(letter => letter.id === letterIndex).letter;
    slot.classList.toggle("filled", letterIndex !== undefined);
  });
}

function eraseGuessLetter() {
  if (guessLocked) return;
  const index = guessAnswer.pop();
  if (index === undefined) return;
  renderGuessLetterBank();
  playGameSound("letter");
  updateGuessAnswer();
}

function shuffleGuessLetters() {
  if (guessLocked) return;
  guessBank = barajar(guessBank);
  playGameSound("shuffle");
  renderGuessLetterBank();
}

function useGuessHint() {
  const message = document.getElementById("guessHintMessage");
  if (guessHintCount === 0) {
    message.textContent = "Se han agotado todas las pistas.";
    playGameSound("wrong");
    return;
  }
  if (guessLocked) return;

  const answer = normalizeWord(guessWords[guessRound][0]);
  const position = guessAnswer.length;
  if (position >= answer.length) {
    showToast("Borra una letra antes de pedir otra pista.");
    playGameSound("wrong");
    return;
  }

  const used = new Set(guessAnswer);
  const letter = guessBank.find(item => item.letter === answer[position] && !used.has(item.id));
  if (!letter) throw new Error(`No se encontró la letra ${answer[position]} para la pista.`);
  guessAnswer.push(letter.id);
  guessHintCount--;
  document.getElementById("guessHintCount").textContent = guessHintCount;
  message.textContent = guessHintCount === 0 ? "Se han agotado todas las pistas." : "";
  playGameSound("hint");
  renderGuessLetterBank();
  updateGuessAnswer();
  const slot = document.querySelectorAll("#answerSlots .answer-slot")[position];
  animateHintCells(document.getElementById("answerSlots"), [slot]);
}

function checkGuessAnswer() {
  if (guessLocked) return;
  const answer = normalizeWord(guessWords[guessRound][0]);
  const attempt = guessAnswer.map(index => guessBank.find(letter => letter.id === index).letter).join("");
  if (attempt !== answer) {
    playGameSound("wrong");
    showToast("Aún no. Prueba otra combinación de letras.");
    return;
  }

  guessLocked = true;
  playGameSound("found");
  guessFoundWords.push(guessWords[guessRound]);
  const foundCount = guessFoundWords.length;
  document.getElementById("guessFoundCount").textContent = foundCount;
  const progress = document.getElementById("guessProgress");
  progress.style.width = `${foundCount / guessWords.length * 100}%`;
  progress.parentElement.setAttribute("aria-valuenow", String(foundCount));
  document.getElementById("guessFoundList").querySelector(".crossword-empty")?.remove();
  const foundWord = document.createElement("div");
  foundWord.className = "word-item";
  foundWord.textContent = `✓ ${guessWords[guessRound][0]}`;
  document.getElementById("guessFoundList").appendChild(foundWord);
  showToast("¡Correcto! Has descubierto la palabra.");
  guessAdvanceTimer = setTimeout(() => {
    guessAdvanceTimer = null;
    guessRound++;
    if (guessRound === guessWords.length) {
      playGameSound("victory");
      document.getElementById("endModal").classList.add("show");
      showGameCelebration();
    } else {
      renderGuessRound();
    }
  }, 600);
}

let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
let quizLives = 3;
let quizHintUsed = false;
let quizTimerInterval;
let quizDeadline;
const quizTimeLimit = 10;
let quizPausedRemainingMs = quizTimeLimit * 1000;

function renderQuizStart() {
  app.innerHTML = `<section class="game-panel quiz-card quiz-start-panel">
    <div class="game-kicker">¿Listo para comenzar?</div>
    <h3>Tu reto de 10 preguntas</h3>
    <p>Responde preguntas aleatorias sobre conceptos de las materias del plan académico. Tendrás 10 segundos para responder cada pregunta y 3 vidas.</p>
    <button class="btn-game" type="button" id="startQuiz">Iniciar juego</button>
  </section>`;
  document.getElementById("startQuiz").addEventListener("click", startQuiz);
}

function startQuiz() {
  clearInterval(quizTimerInterval);
  if (SOPA_WORDS.length < 10) throw new Error("El banco del quiz necesita al menos 10 conceptos.");
  // Cada pregunta usa un concepto distinto y tres distractores del mismo banco temático.
  quizQuestions = elegir(SOPA_WORDS, 10).map(word => {
    const choices = barajar([
      word,
      ...elegir(SOPA_WORDS.filter(candidate => candidate !== word), 3)
    ]);
    return {
      prompt: word[1],
      options: choices.map(choice => choice[0]),
      answer: choices.indexOf(word)
    };
  });
  quizIndex = 0;
  quizScore = 0;
  quizLives = 3;
  quizPausedRemainingMs = quizTimeLimit * 1000;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  quizAnswered = false;
  quizHintUsed = false;
  const item = quizQuestions[quizIndex];
  app.innerHTML = `<div class="game-panel quiz-card">
    <div class="quiz-status-row">
      <span class="badge">Pregunta ${quizIndex + 1} de ${quizQuestions.length}</span>
      <div class="progress-wrap" role="progressbar" aria-label="Preguntas respondidas correctamente" aria-valuemin="0" aria-valuemax="${quizQuestions.length}" aria-valuenow="${quizScore}">
        <div class="progress-bar" id="quizProgress" style="width:${quizScore / quizQuestions.length * 100}%"></div>
      </div>
      <span class="badge" id="quizAnsweredCount">${quizScore}/${quizQuestions.length} correctas</span>
      <span class="quiz-lives" id="quizLives" aria-label="${quizLives} vidas">${"♥".repeat(quizLives)}<span>${"♡".repeat(3 - quizLives)}</span></span>
      <button class="btn-game danger" type="button" id="quizReset">↻ Reiniciar</button>
    </div>
    <div class="quiz-timer-row">
      <span>Tiempo para responder</span>
      <div class="quiz-timer" role="progressbar" aria-label="Tiempo restante" aria-valuemin="0" aria-valuemax="${quizTimeLimit}" aria-valuenow="${quizTimeLimit}">
        <div class="quiz-timer-fill" id="quizTimerFill"></div>
      </div>
      <strong id="quizTimerText">${quizTimeLimit}s</strong>
    </div>
    <section class="quiz-question-panel">
      <div class="question">${item.prompt}</div>
    </section>
    <div class="options">${item.options.map((option, index) => `<button class="option-btn" type="button" data-index="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join("")}</div>
    <div class="quiz-actions">
      <div class="quiz-feedback" id="quizFeedback" role="status" aria-live="polite"></div>
      <button class="btn-game" type="button" id="quizHint">Pista</button>
      <button class="btn-game" type="button" id="nextQuestion" hidden>Siguiente →</button>
    </div>
  </div>
  <div class="overlay" id="quizResetConfirm" aria-hidden="true">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="quizResetTitle" aria-describedby="quizResetMessage">
      <h3 id="quizResetTitle">¿Quieres reiniciar?</h3>
      <p id="quizResetMessage"></p>
      <div class="btn-row">
        <button class="btn-game" type="button" id="quizCancelReset">Seguir jugando</button>
        <button class="btn-game" type="button" id="quizConfirmReset">Reiniciar</button>
      </div>
    </section>
  </div>`;

  document.querySelectorAll(".option-btn").forEach(button => {
    button.addEventListener("click", () => answerQuizQuestion(Number(button.dataset.index)));
  });
  document.getElementById("nextQuestion").addEventListener("click", nextQuizQuestion);
  document.getElementById("quizHint").addEventListener("click", useQuizHint);
  document.getElementById("quizReset").addEventListener("click", confirmQuizReset);
  document.getElementById("quizCancelReset").addEventListener("click", closeQuizReset);
  document.getElementById("quizConfirmReset").addEventListener("click", startQuiz);
  document.getElementById("quizResetConfirm").addEventListener("click", event => {
    if (event.target.id === "quizResetConfirm") closeQuizReset();
  });
  startQuizTimer();
}

function startQuizTimer(durationMs = quizTimeLimit * 1000) {
  clearInterval(quizTimerInterval);
  // El plazo absoluto evita que un intervalo lento extienda los 10 segundos disponibles.
  quizDeadline = Date.now() + durationMs;
  updateQuizTimer();
  quizTimerInterval = setInterval(updateQuizTimer, 100);
}

function updateQuizTimer() {
  if (quizAnswered) return;
  const remainingMs = Math.max(0, quizDeadline - Date.now());
  const remainingSeconds = remainingMs / 1000;
  const fill = document.getElementById("quizTimerFill");
  const text = document.getElementById("quizTimerText");
  const progress = fill?.parentElement;
  if (!fill || !text || !progress) {
    clearInterval(quizTimerInterval);
    return;
  }
  fill.style.width = `${remainingMs / (quizTimeLimit * 1000) * 100}%`;
  fill.classList.toggle("urgent", remainingSeconds <= 3);
  text.textContent = `${Math.ceil(remainingSeconds)}s`;
  progress.setAttribute("aria-valuenow", remainingSeconds.toFixed(1));
  if (remainingMs === 0) handleQuizMiss();
}

function useQuizHint() {
  if (quizAnswered || quizHintUsed) return;
  const correctIndex = quizQuestions[quizIndex].answer;
  const incorrectOptions = [...document.querySelectorAll(".option-btn")]
    .filter((_, index) => index !== correctIndex);
  const keptWrong = elegir(incorrectOptions, 1)[0];
  incorrectOptions
    .filter(button => button !== keptWrong)
    .forEach(button => {
      button.disabled = true;
      button.classList.add("eliminated");
    });
  quizHintUsed = true;
  document.getElementById("quizHint").disabled = true;
  playGameSound("hint");
}

function answerQuizQuestion(selectedIndex) {
  if (quizAnswered) return;
  quizAnswered = true;
  clearInterval(quizTimerInterval);
  const item = quizQuestions[quizIndex];
  const buttons = document.querySelectorAll(".option-btn");
  buttons[selectedIndex].classList.add(selectedIndex === item.answer ? "correct" : "wrong");
  buttons.forEach(button => { button.disabled = true; });
  document.getElementById("quizHint").disabled = true;

  const feedback = document.getElementById("quizFeedback");
  if (selectedIndex === item.answer) {
    quizScore++;
    buttons[item.answer].classList.add("correct");
    feedback.textContent = "Correcto";
    updateQuizProgress();
    playGameSound("found");
    document.getElementById("nextQuestion").hidden = false;
  } else {
    buttons[item.answer].classList.add("correct");
    feedback.textContent = "Incorrecto";
    loseQuizLife();
    playGameSound("wrong");
    document.getElementById("nextQuestion").hidden = false;
  }
}

function updateQuizProgress() {
  document.getElementById("quizAnsweredCount").textContent = `${quizScore}/${quizQuestions.length} correctas`;
  const progress = document.getElementById("quizProgress");
  progress.style.width = `${quizScore / quizQuestions.length * 100}%`;
  progress.parentElement.setAttribute("aria-valuenow", String(quizScore));
}

function loseQuizLife() {
  quizLives--;
  const lives = document.getElementById("quizLives");
  lives.innerHTML = `${"♥".repeat(quizLives)}<span>${"♡".repeat(3 - quizLives)}</span>`;
  lives.setAttribute("aria-label", `${quizLives} ${quizLives === 1 ? "vida" : "vidas"}`);
}

function handleQuizMiss() {
  if (quizAnswered) return;
  quizAnswered = true;
  clearInterval(quizTimerInterval);
  const item = quizQuestions[quizIndex];
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(button => { button.disabled = true; });
  buttons[item.answer].classList.add("correct");
  document.getElementById("quizHint").disabled = true;
  document.getElementById("quizFeedback").textContent = "Incorrecto";
  loseQuizLife();
  playGameSound("wrong");
  // La respuesta correcta permanece visible hasta que el jugador decida continuar.
  document.getElementById("nextQuestion").hidden = false;
}

function confirmQuizReset() {
  const message = quizIndex === 0 && quizScore === 0 && quizLives === 3
    ? "¿Quieres comenzar una nueva partida?"
    : quizLives === 1
      ? "Te queda una vida. ¿Quieres abandonar esta partida y empezar de nuevo?"
      : "Tu avance y las vidas actuales se perderán. ¿Quieres reiniciar?";
  document.getElementById("quizResetMessage").textContent = message;
  if (!quizAnswered) {
    // Congelar el tiempo restante mientras el usuario decide si reinicia.
    quizPausedRemainingMs = Math.max(0, quizDeadline - Date.now());
    quizDeadline = Date.now() + quizPausedRemainingMs;
    clearInterval(quizTimerInterval);
  }
  const dialog = document.getElementById("quizResetConfirm");
  dialog.classList.add("show");
  dialog.setAttribute("aria-hidden", "false");
  document.getElementById("quizCancelReset").focus();
}

function closeQuizReset() {
  const dialog = document.getElementById("quizResetConfirm");
  dialog.classList.remove("show");
  dialog.setAttribute("aria-hidden", "true");
  document.getElementById("quizReset").focus();
  if (!quizAnswered) {
    if (quizPausedRemainingMs === 0) handleQuizMiss();
    else startQuizTimer(quizPausedRemainingMs);
  }
}

function nextQuizQuestion() {
  clearInterval(quizTimerInterval);
  if (quizLives === 0 || quizIndex === quizQuestions.length - 1) {
    finishQuiz();
    return;
  }
  quizIndex++;
  renderQuizQuestion();
}

function finishQuiz() {
  clearInterval(quizTimerInterval);
  const percentage = quizScore / quizQuestions.length * 100;
  const message = percentage >= 90
    ? "¡Excelente dominio del tema!"
    : percentage >= 70
      ? "Muy buen resultado."
      : "Buen intento. Repasa los conceptos y vuelve a jugar.";

  app.innerHTML = `<div class="game-panel quiz-card" style="text-align:center">
    <div class="game-kicker">Partida terminada</div>
    <h3>Resultado final</h3>
    <div class="result-score">${quizScore}<span>/${quizQuestions.length}</span></div>
    <p class="quiz-result-lives">Vidas restantes: ${"♥".repeat(quizLives)}${"♡".repeat(3 - quizLives)}</p>
    <p>${message}</p>
    <div class="status-box">Las preguntas se eligieron al azar entre 50 conceptos de las materias del plan académico. Solo los aciertos cuentan como preguntas respondidas.</div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn-game" type="button" id="again">Volver a jugar</button>
      <a class="btn-game" href="Juegos Educativos.html">Salir del juego</a>
    </div>
  </div>`;
  document.getElementById("again").addEventListener("click", startQuiz);
}

if (["sopa", "crucigrama", "adivina", "quiz"].includes(gameType)) startGame();
else throw new Error(`Tipo de juego desconocido: ${gameType}`);
