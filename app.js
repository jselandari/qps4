/* ============================================================
   qPS4 · Lógica de la aplicación
   ------------------------------------------------------------
   Para modificar:
   - Cortes de FR / TAMSI por edad → tablas FR_CUT y TAMSI_CUT
   - Fórmula del TAMSI             → función calcularTAMSI()
   - Textos de interpretación      → función recalcular()
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Tablas de corte por rango etario ---------- */

  // Frecuencia respiratoria: score = 1 si FR > corte
  const FR_CUT = {
    "1m_11m":  55,
    "1a_2a":   47,
    "3a_5a":   33,
    "6a_11a":  25,
    "12a_17a": 21
  };

  // TAMSI: score = 1 si TAMSI > corte
  const TAMSI_CUT = {
    "1m_11m":  2.64,
    "1a_2a":   2.29,
    "3a_5a":   1.96,
    "6a_11a":  1.68,
    "12a_17a": 1.54
  };

  // Texto de ayuda que aparece debajo del campo FR
  const FR_HINT = {
    "1m_11m":  "Corte: > 55 rpm",
    "1a_2a":   "Corte: > 47 rpm",
    "3a_5a":   "Corte: > 33 rpm",
    "6a_11a":  "Corte: > 25 rpm",
    "12a_17a": "Corte: > 21 rpm"
  };

  /* ---------- 2. Referencias al DOM ---------- */

  const $ = (id) => document.getElementById(id);

  const edadSel    = $("edad");
  const mentSel    = $("mentacion");
  const frInput    = $("fr");
  const frHint     = $("frHint");
  const frError    = $("frError");
  const fcInput    = $("fc");
  const tamInput   = $("tam");
  const tempInput  = $("temperatura");
  const rellenoSel = $("relleno");

  const tamsiBox   = $("tamsiBox");
  const tamsiValue = $("tamsiValue");
  const tamsiCut   = $("tamsiCut");

  const totalScore  = $("totalScore");
  const totalInterp = $("totalInterp");

  const cMent    = $("cMent");
  const cFR      = $("cFR");
  const cTAMSI   = $("cTAMSI");
  const cRelleno = $("cRelleno");

  /* ---------- 3. Helpers ---------- */

  function parseNum(v) {
    if (v === "" || v === null || v === undefined) return NaN;
    const n = Number(String(v).replace(",", "."));
    return isFinite(n) ? n : NaN;
  }

  function fmt(n, dec) {
    return n.toLocaleString("es-AR", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });
  }

  /* ---------- 4. Cálculo del TAMSI ---------- */
  // TAMSI = [FC − 10 × (T° axilar − 37)] / TAM
  // La temperatura axilar se usa tal cual, sin correcciones.

  function calcularTAMSI() {
    const fc   = parseNum(fcInput.value);
    const tam  = parseNum(tamInput.value);
    const temp = parseNum(tempInput.value); // temperatura axilar

    if (!isFinite(fc) || !isFinite(tam) || !isFinite(temp) || tam <= 0) {
      return NaN;
    }
    return (fc - 10 * (temp - 37)) / tam;
  }

  /* ---------- 5. Actualizar hint de FR ---------- */

  function actualizarFRHint() {
    const r = edadSel.value;
    frHint.textContent = (r && FR_HINT[r])
      ? FR_HINT[r]
      : "Seleccioná primero el rango etario.";
  }

  /* ---------- 6. Recalcular y renderizar todo ---------- */

  function recalcular() {
    const rango = edadSel.value;

    // (a) Sensorio
    const mentScore = mentSel.value === "" ? null : Number(mentSel.value);

    // (b) Frecuencia respiratoria
    let frScore = null;
    let frValido = false;
    if (rango && frInput.value !== "") {
      const fr = parseNum(frInput.value);
      if (isFinite(fr) && fr >= 0) {
        frValido = true;
        frScore = fr > FR_CUT[rango] ? 1 : 0;
      }
    }
    frError.classList.toggle("show", frInput.value !== "" && !frValido);

    // (c) TAMSI
    const tamsi = calcularTAMSI();
    let tamsiScore = null;
    if (isFinite(tamsi) && rango) {
      tamsiScore = tamsi > TAMSI_CUT[rango] ? 1 : 0;
      tamsiBox.classList.toggle("elevated", tamsiScore === 1);
      tamsiValue.textContent = fmt(tamsi, 2);
      tamsiCut.textContent =
        "Corte para " + rango.replace("_", "–") + ": " +
        fmt(TAMSI_CUT[rango], 2) +
        (tamsiScore === 1 ? "  →  ELEVADO" : "  →  normal");
    } else if (isFinite(tamsi)) {
      tamsiBox.classList.remove("elevated");
      tamsiValue.textContent = fmt(tamsi, 2);
      tamsiCut.textContent = "Seleccioná el rango etario para comparar con el corte.";
    } else {
      tamsiBox.classList.remove("elevated");
      tamsiValue.textContent = "—";
      tamsiCut.textContent = "Ingresá FC, TAM y temperatura axilar";
    }

    // (d) Relleno capilar
    const rellenoScore = rellenoSel.value === "" ? null : Number(rellenoSel.value);

    // ---- Render criterios ----
    pintarCriterio(cMent,    mentScore);
    pintarCriterio(cFR,      frScore);
    pintarCriterio(cTAMSI,   tamsiScore);
    pintarCriterio(cRelleno, rellenoScore);

    // ---- Total ----
    const items = [mentScore, frScore, tamsiScore, rellenoScore];
    const completos = items.filter((x) => x !== null).length;
    const total = items.reduce((a, b) => a + (b === null ? 0 : b), 0);

    if (completos === 4) {
      totalScore.textContent = total;
      if (total === 0) {
        totalInterp.textContent = "Score 0 · Sin criterios positivos";
        totalScore.style.color = "#e8f5e9";
      } else if (total <= 2) {
        totalInterp.textContent = "Score " + total + " · Screening positivo leve/moderado";
        totalScore.style.color = "#ffe082";
      } else {
        totalInterp.textContent = "Score " + total + " · Screening positivo alto (≥ 3)";
        totalScore.style.color = "#ffccbc";
      }
    } else {
      totalScore.textContent = "—";
      totalInterp.textContent = "Faltan " + (4 - completos) + " criterio(s) por completar";
      totalScore.style.color = "#fff";
    }
  }

  function pintarCriterio(el, score) {
    el.textContent = score === null ? "—" : score;
    el.className = "score " + (score === null ? "" : "s" + score);
  }

  /* ---------- 7. Reset ---------- */

  function reset() {
    edadSel.value    = "";
    mentSel.value    = "";
    frInput.value    = "";
    fcInput.value    = "";
    tamInput.value   = "";
    tempInput.value  = "";
    rellenoSel.value = "";
    frError.classList.remove("show");
    actualizarFRHint();
    recalcular();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- 8. Eventos ---------- */

  ["change", "input"].forEach((evt) => {
    edadSel.addEventListener(evt, () => { actualizarFRHint(); recalcular(); });
    mentSel.addEventListener(evt, recalcular);
    frInput.addEventListener(evt, recalcular);
    fcInput.addEventListener(evt, recalcular);
    tamInput.addEventListener(evt, recalcular);
    tempInput.addEventListener(evt, recalcular);
    rellenoSel.addEventListener(evt, recalcular);
  });

  $("resetBtn").addEventListener("click", reset);

  /* ---------- 9. Init ---------- */

  actualizarFRHint();
  recalcular();

  /* ---------- 10. Registro del Service Worker ---------- */

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch((err) => {
        console.warn("SW no registrado:", err);
      });
    });
  }
})();