const app = document.getElementById("app");
const gameType = document.body.dataset.game;
const toastElement = document.getElementById("toast");

let category = "";
let toastTimer;
let gameAudioContext;

function playGameSound(sound) {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return;
  if (!gameAudioContext) gameAudioContext = new AudioContextConstructor();
  if (gameAudioContext.state === "suspended") gameAudioContext.resume();

  const melodies = {
    letter: [[880, 0, 0.045]],
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

function showEndModal(title, message, onAgain) {
  app.insertAdjacentHTML("beforeend", endModal(title, message));
  document.getElementById("againBtn").addEventListener("click", onAgain);
  document.getElementById("endModal").classList.add("show");
}

function startGame() {
  if (gameType === "sopa") startWordSearch();
  else {
    category = elegir(Object.keys(UNA_WORDS), 1)[0];
    if (gameType === "crucigrama") startCrossword();
    if (gameType === "adivina") startGuessWord();
    if (gameType === "quiz") startQuiz();
  }
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
  </div>${endModal("¡Reto completado!", "Has encontrado todas las palabras. Puedes iniciar una nueva partida con otros términos.")}`;

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
  board.addEventListener("pointerover", updateWordSelection);
  document.getElementById("reset").addEventListener("click", startWordSearch);
  document.getElementById("againBtn").addEventListener("click", startWordSearch);
  document.getElementById("wordSearchHint").addEventListener("click", useWordSearchHint);
  document.getElementById("wordReveal").addEventListener("click", event => {
    if (event.target.closest("#continueWordSearch")) continueWordSearch();
  });
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
  const boardBounds = board.getBoundingClientRect();
  for (let index = 0; index < wordLength; index++) {
    const row = placement.row + placement.rowStep * index;
    const column = placement.column + placement.columnStep * index;
    const cell = board.querySelector(`.ws-cell[data-row="${row}"][data-column="${column}"]`);
    if (!cell) throw new Error(`No se encontró la celda ${row}, ${column} para una pista.`);

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
    showWordSearchCelebration();
  }
}

function showWordSearchCelebration() {
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
  if (!document.getElementById("wordReveal").hidden) return;
  const cell = event.target.closest(".ws-cell");
  if (!cell) return;
  event.preventDefault();
  selecting = true;
  selectionStart = [Number(cell.dataset.row), Number(cell.dataset.column)];
  activeCells = [selectionStart];
  lastSoundingCell = `${selectionStart[0]},${selectionStart[1]}`;
  playGameSound("letter");
  paintWordSelection();
}

function updateWordSelection(event) {
  if (!selecting) return;
  const cell = event.target.closest(".ws-cell");
  if (!cell) return;
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

function paintWordSelection() {
  document.querySelectorAll(".ws-cell.selecting").forEach(cell => cell.classList.remove("selecting"));
  activeCells.forEach(([row, column]) => {
    document.querySelector(`.ws-cell[data-row="${row}"][data-column="${column}"]`)?.classList.add("selecting");
  });
}

function finishWordSelection() {
  if (!selecting) return;
  selecting = false;
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

let crosswordTargets = [];
let crosswordPlacements = [];
let crosswordBoard = [];
let crosswordCurrent = 0;
let crosswordLetters = [];
let crosswordSolved = new Set();
const crosswordSize = 17;

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
  const candidates = elegir(UNA_WORDS[category], 8);
  for (let attempt = 0; attempt < 10; attempt++) {
    const board = Array.from({ length: crosswordSize }, () => Array(crosswordSize).fill(""));
    const placements = [];
    const first = normalizeWord(candidates[0][0]);
    if (first.length > crosswordSize) continue;
    placements.push(crosswordPut(board, first, 8, Math.floor((crosswordSize - first.length) / 2), "h"));

    for (const candidate of candidates.slice(1)) {
      const word = normalizeWord(candidate[0]);
      const options = [];
      for (const placement of placements) {
        for (let wordIndex = 0; wordIndex < word.length; wordIndex++) {
          for (let placedIndex = 0; placedIndex < placement.word.length; placedIndex++) {
            if (word[wordIndex] !== placement.word[placedIndex]) continue;
            const direction = placement.direction === "h" ? "v" : "h";
            const row = placement.row + (placement.direction === "v" ? placedIndex : 0) - (direction === "v" ? wordIndex : 0);
            const column = placement.column + (placement.direction === "h" ? placedIndex : 0) - (direction === "h" ? wordIndex : 0);
            if (crosswordCanPlace(board, word, row, column, direction, true)) options.push({ row, column, direction });
          }
        }
      }

      if (options.length) {
        const option = options[Math.floor(Math.random() * options.length)];
        placements.push(crosswordPut(board, word, option.row, option.column, option.direction));
      }
    }

    if (placements.length >= 4) {
      crosswordBoard = board;
      crosswordPlacements = placements;
      crosswordTargets = placements.map(placement => candidates.find(item => normalizeWord(item[0]) === placement.word));
      return;
    }
  }

  throw new Error("No se pudo generar un crucigrama con suficientes cruces.");
}

function startCrossword() {
  crosswordCurrent = 0;
  crosswordLetters = [];
  crosswordSolved = new Set();
  buildCrossword();
  renderCrossword();
}

function renderCrossword() {
  app.innerHTML = `<div class="game-panel">
    <div class="game-topbar">
      <span class="badge">📚 ${categoryName(category)}</span>
      <span class="badge"><span id="crosswordDone">0</span>/${crosswordTargets.length} palabras</span>
      <button class="btn-game danger" type="button" id="reset">↻ Reiniciar</button>
    </div>
    <div class="cross-layout">
      <div>
        <div class="cross-board" id="crosswordBoard" style="grid-template-columns:repeat(${crosswordSize},36px)"></div>
        <div class="status-box">Forma la palabra objetivo con las letras disponibles para completar el tablero.</div>
      </div>
      <aside class="game-panel" style="box-shadow:none;background:#f8fbff">
        <h3>Palabra objetivo</h3>
        <div class="current-word" id="currentWord"></div>
        <div class="target-info" id="targetInfo"></div>
        <div class="letters-title">Banco de letras</div>
        <div class="letter-pad" id="letterPad"></div>
        <div class="btn-row" style="justify-content:center;margin-top:15px">
          <button class="btn-game light" type="button" id="erase">← Borrar</button>
          <button class="btn-game gold" type="button" id="check">Comprobar</button>
        </div>
        <div class="word-list" id="targetList"></div>
      </aside>
    </div>
  </div>${endModal("¡Crucigrama completado!", "Has formado todas las palabras del tablero.")}`;

  const board = document.getElementById("crosswordBoard");
  crosswordBoard.forEach((row, rowIndex) => row.forEach((letter, columnIndex) => {
    const cell = document.createElement("div");
    cell.className = `cross-cell${letter ? "" : " black"}`;
    if (letter) cell.dataset.position = `${rowIndex},${columnIndex}`;
    board.appendChild(cell);
  }));

  document.getElementById("reset").addEventListener("click", startCrossword);
  document.getElementById("againBtn").addEventListener("click", startCrossword);
  document.getElementById("erase").addEventListener("click", eraseCrosswordLetter);
  document.getElementById("check").addEventListener("click", checkCrosswordWord);
  document.getElementById("targetList").innerHTML = crosswordTargets.map((word, index) =>
    `<div class="word-item${crosswordSolved.has(index) ? " found" : ""}">▸ ${word[0]}</div>`
  ).join("");
  renderCrosswordTarget();
}

function renderCrosswordTarget() {
  const item = crosswordTargets[crosswordCurrent];
  const answer = normalizeWord(item[0]);
  crosswordLetters = [];
  document.getElementById("currentWord").textContent = "_ ".repeat(answer.length).trim();
  document.getElementById("targetInfo").textContent = `Palabra ${crosswordCurrent + 1} de ${crosswordTargets.length} · ${answer.length} letras`;

  const distractors = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"].filter(letter => !answer.includes(letter));
  const bank = barajar([...answer, ...elegir(distractors, Math.min(4, Math.max(2, 8 - answer.length)))]);
  document.getElementById("letterPad").innerHTML = bank.map((letter, index) =>
    `<button class="letter-btn" type="button" data-index="${index}">${letter}</button>`
  ).join("");

  document.getElementById("letterPad").querySelectorAll("[data-index]").forEach(button => {
    button.addEventListener("click", () => {
      if (crosswordLetters.length >= answer.length) return;
      crosswordLetters.push(Number(button.dataset.index));
      button.classList.add("used");
      updateCrosswordWord(bank);
    });
  });
}

function updateCrosswordWord(bank) {
  const answer = crosswordTargets[crosswordCurrent][0];
  const letters = crosswordLetters.map(index => bank[index]);
  document.getElementById("currentWord").textContent = `${letters.join(" ")}${" _".repeat(Math.max(0, normalizeWord(answer).length - letters.length))}`;
}

function eraseCrosswordLetter() {
  const lastIndex = crosswordLetters.pop();
  if (lastIndex === undefined) return;
  document.querySelector(`.letter-btn[data-index="${lastIndex}"]`)?.classList.remove("used");
  const bank = [...document.querySelectorAll(".letter-btn")].map(button => button.textContent);
  updateCrosswordWord(bank);
}

function checkCrosswordWord() {
  const answer = normalizeWord(crosswordTargets[crosswordCurrent][0]);
  const bank = [...document.querySelectorAll(".letter-btn")].map(button => button.textContent);
  if (crosswordLetters.map(index => bank[index]).join("") !== answer) {
    showToast("Revisa el orden de las letras e inténtalo otra vez.");
    return;
  }

  crosswordSolved.add(crosswordCurrent);
  document.getElementById("crosswordDone").textContent = crosswordSolved.size;
  document.querySelectorAll("#targetList .word-item")[crosswordCurrent]?.classList.add("found");
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
    document.getElementById("endModal").classList.add("show");
  } else {
    renderCrosswordTarget();
    showToast("¡Correcto! La palabra encaja en el tablero.");
  }
}

const clueMap = {
  TECLADO:["⌨️","🔤","🖥️","✍️"], MOUSE:["🖱️","➡️","🖥️","👆"], MONITOR:["🖥️","🎞️","👀","🔆"],
  PROCESADOR:["🧠","⚡","🧩","💻"], MEMORIA:["💾","🧠","📦","💻"], INTERNET:["🌐","📡","🔗","💻"],
  NAVEGADOR:["🧭","🌐","🔎","📄"], ARCHIVO:["📄","🗂️","💾","📁"], CARPETA:["📁","🗂️","📄","🗃️"],
  SERVIDOR:["🗄️","🌐","🔗","💻"], RED:["🔗","🌐","📡","💻"], SOFTWARE:["⚙️","💻","🧩","▶️"],
  HARDWARE:["🧩","⌨️","🖥️","🔌"], ALGORITMO:["🧮","🔢","➡️","🧠"], CODIGO:["</>","💻","🔤","🧩"],
  PROGRAMA:["🧾","▶️","💻","⚙️"], DATOS:["🔢","📊","💾","🗃️"], SEGURIDAD:["🛡️","🔐","🔒","💻"],
  CONTRASENA:["🔐","🔑","🛡️","👤"], VIRUS:["🦠","⚠️","💻","🛡️"], NUBE:["☁️","🌐","💾","📱"],
  USB:["🔌","💾","💻","↔️"], TABLETA:["📱","👆","🖥️","✏️"], WIFI:["📶","📡","🌐","📱"],
  PIXEL:["🔳","🖼️","🖥️","🔍"], ROBOTICA:["🤖","⚙️","🧠","🔧"], SUSTANTIVO:["📚","🏷️","👤","📖"],
  ADJETIVO:["🎨","✨","📝","🔤"], VERBO:["🏃","⚡","➡️","📝"], ADVERBIO:["⏱️","📍","➡️","🔤"],
  PRONOMBRE:["👤","🔄","🗣️","📝"], ARTICULO:["📖","🏷️","🔤","📝"], ORACION:["💬","📝","🔤","📖"],
  SUJETO:["🙋","👤","🎯","📝"], PREDICADO:["💬","➡️","📝","🎯"], SINONIMO:["🔄","🟰","📚","🔤"],
  ANTONIMO:["↔️","⚖️","🔤","🔀"], HOMONIMO:["🔤","👯","🗣️","❓"], PARONIMO:["🔡","🔀","👯","📚"],
  METAFORA:["🌙","✨","🪶","🎭"], SIMIL:["⚖️","🔗","🪞","🗣️"], HIPERBOLE:["📣","⬆️","😲","🎭"],
  PERSONIFICACION:["🧸","👤","🐾","🎭"], POESIA:["🪶","📜","❤️","🎵"], NOVELA:["📕","📖","👥","🏞️"],
  CUENTO:["📗","🦊","📖","✨"], FABULA:["🦊","🐢","📖","💡"], LEYENDA:["🏰","🌙","📜","✨"],
  DIALOGO:["🗣️","💬","👥","↔️"], PARRAFO:["📄","📝","🔤","📚"], TEXTO:["📜","📝","📖","💬"],
  ACENTO:["🔊","🗣️","📢","🔤"], TILDE:["´","🔤","✍️","📖"], DIPTONGO:["🔗","🗣️","🔤","👄"],
  HIATO:["✂️","🔤","🗣️","↔️"], ORTOGRAFIA:["✍️","📚","🔤","✅"]
};

let guessWords = [];
let guessRound = 0;
let guessAnswer = [];
let guessLocked = false;

function startGuessWord() {
  guessWords = elegir(UNA_WORDS[category], 5);
  guessRound = 0;
  renderGuessRound();
}

function renderGuessRound() {
  guessAnswer = [];
  guessLocked = false;
  const item = guessWords[guessRound];
  const answer = normalizeWord(item[0]);
  const clues = clueMap[answer] || [item[2] || "💡", "🔎", "📚", "🧩"];
  const distractors = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"].filter(letter => !answer.includes(letter));
  const bank = barajar([...answer, ...elegir(distractors, Math.min(5, Math.max(3, 10 - answer.length)))]);

  app.innerHTML = `<div class="game-panel">
    <div class="game-topbar">
      <span class="badge">📚 ${categoryName(category)}</span>
      <span class="badge">Ronda ${guessRound + 1}/${guessWords.length}</span>
      <button class="btn-game danger" type="button" id="reset">↻ Reiniciar</button>
    </div>
    <div class="guess-layout">
      <div>
        <div class="clue-images">${clues.map((clue, index) => `<div class="clue-card"><div class="clue-art">${clue}</div><span class="clue-label">PISTA VISUAL ${index + 1}</span></div>`).join("")}</div>
        <div class="status-box">Las pistas apuntan al mismo concepto. Usa las letras para descubrirlo.</div>
      </div>
      <aside class="game-panel" style="box-shadow:none;background:#f8fbff">
        <h3>Tu respuesta</h3>
        <div class="answer-slots" id="answerSlots">${answer.split("").map(() => '<div class="answer-slot"></div>').join("")}</div>
        <div class="guess-letters" id="guessLetters">${bank.map((letter, index) => `<button class="guess-letter" type="button" data-index="${index}">${letter}</button>`).join("")}</div>
        <div class="btn-row" style="justify-content:center;margin-top:17px">
          <button class="btn-game light" type="button" id="erase">← Borrar</button>
          <button class="btn-game gold" type="button" id="check">Comprobar</button>
        </div>
      </aside>
    </div>
  </div>`;

  document.getElementById("guessLetters").querySelectorAll("[data-index]").forEach(button => {
    button.addEventListener("click", () => {
      if (guessLocked || guessAnswer.length >= answer.length) return;
      guessAnswer.push(Number(button.dataset.index));
      button.classList.add("used");
      updateGuessAnswer(bank);
    });
  });
  document.getElementById("erase").addEventListener("click", () => {
    if (guessLocked) return;
    const index = guessAnswer.pop();
    if (index === undefined) return;
    document.querySelector(`.guess-letter[data-index="${index}"]`)?.classList.remove("used");
    updateGuessAnswer(bank);
  });
  document.getElementById("check").addEventListener("click", () => checkGuessAnswer(bank));
  document.getElementById("reset").addEventListener("click", startGuessWord);
}

function updateGuessAnswer(bank) {
  const answerSlots = document.querySelectorAll("#answerSlots .answer-slot");
  answerSlots.forEach((slot, index) => {
    const letterIndex = guessAnswer[index];
    slot.textContent = letterIndex === undefined ? "" : bank[letterIndex];
    slot.classList.toggle("filled", letterIndex !== undefined);
  });
}

function checkGuessAnswer(bank) {
  if (guessLocked) return;
  const answer = normalizeWord(guessWords[guessRound][0]);
  const attempt = guessAnswer.map(index => bank[index]).join("");
  if (attempt !== answer) {
    showToast("Aún no. Prueba otra combinación de letras.");
    return;
  }

  guessLocked = true;
  showToast("¡Correcto! Has descubierto la palabra.");
  setTimeout(() => {
    guessRound++;
    if (guessRound === guessWords.length) {
      app.innerHTML = "";
      showEndModal("¡Muy bien!", "Has completado todas las palabras visuales de esta partida.", startGuessWord);
    } else {
      renderGuessRound();
    }
  }, 600);
}

let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function startQuiz() {
  quizQuestions = elegir(QUIZ[category], 10);
  quizIndex = 0;
  quizScore = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  quizAnswered = false;
  const item = quizQuestions[quizIndex];
  app.innerHTML = `<div class="game-panel quiz-card">
    <div class="game-topbar">
      <span class="badge">📚 ${categoryName(category)}</span>
      <span class="badge">Pregunta ${quizIndex + 1} de ${quizQuestions.length}</span>
      <div class="progress-wrap"><div class="progress-bar" style="width:${quizIndex / quizQuestions.length * 100}%"></div></div>
    </div>
    <div class="question-meta"><span>Dificultad · Media</span><span>⭐ ${quizScore} puntos</span></div>
    <div class="question">${item[0]}</div>
    <div class="options">${item[1].map((option, index) => `<button class="option-btn" type="button" data-index="${index}">${String.fromCharCode(65 + index)}. ${option}</button>`).join("")}</div>
    <div class="quiz-feedback" id="quizFeedback">Selecciona una de las cuatro opciones.</div>
    <div class="btn-row" style="justify-content:flex-end;margin-top:15px"><button class="btn-game gold" type="button" id="nextQuestion" hidden>Siguiente →</button></div>
  </div>`;

  document.querySelectorAll(".option-btn").forEach(button => {
    button.addEventListener("click", () => answerQuizQuestion(Number(button.dataset.index)));
  });
  document.getElementById("nextQuestion").addEventListener("click", nextQuizQuestion);
}

function answerQuizQuestion(selectedIndex) {
  if (quizAnswered) return;
  quizAnswered = true;
  const item = quizQuestions[quizIndex];
  const buttons = document.querySelectorAll(".option-btn");
  buttons[selectedIndex].classList.add(selectedIndex === item[2] ? "correct" : "wrong");

  const feedback = document.getElementById("quizFeedback");
  if (selectedIndex === item[2]) {
    quizScore++;
    feedback.innerHTML = `<strong>¡Correcto!</strong> ${item[3]}`;
  } else {
    buttons[item[2]].classList.add("correct");
    feedback.innerHTML = `<strong>No era esa.</strong> La respuesta correcta es <b>${item[1][item[2]]}</b>. ${item[3]}`;
  }
  document.getElementById("nextQuestion").hidden = false;
}

function nextQuizQuestion() {
  quizIndex++;
  if (quizIndex < quizQuestions.length) {
    renderQuizQuestion();
    return;
  }
  finishQuiz();
}

function finishQuiz() {
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
    <p>${message}</p>
    <div class="status-box">Las preguntas se seleccionaron al azar y no se repitieron durante esta partida.</div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn-game gold" type="button" id="again">Volver a jugar</button>
      <a class="btn-game" href="Juegos Educativos.html">Salir del juego</a>
    </div>
  </div>`;
  document.getElementById("again").addEventListener("click", startQuiz);
}

if (["sopa", "crucigrama", "adivina", "quiz"].includes(gameType)) startGame();
else throw new Error(`Tipo de juego desconocido: ${gameType}`);
