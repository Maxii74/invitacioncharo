/* ============================================================
   CHARI'S 20 — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1) CUENTA REGRESIVA EN TIEMPO REAL
     Fecha objetivo: 8 de agosto de 2026, 00:00 hs (inicio del día)
     ---------------------------------------------------------- */
  const TARGET_DATE = new Date('2026-08-08T00:00:00');

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  const pad = (n) => String(Math.max(n, 0)).padStart(2, '0');

  let prev = { d: null, h: null, m: null, s: null };

  function popIfChanged(el, value, prevValue) {
    el.textContent = pad(value);
    if (prevValue !== null && prevValue !== value) {
      el.classList.remove('pop');
      // force reflow so the animation can restart
      void el.offsetWidth;
      el.classList.add('pop');
    }
  }

  function updateCountdown() {
    const now = new Date();
    let diff = TARGET_DATE - now;

    if (diff < 0) diff = 0;

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins  = Math.floor((diff / (1000 * 60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    popIfChanged(elDays, days, prev.d);
    popIfChanged(elHours, hours, prev.h);
    popIfChanged(elMins, mins, prev.m);
    popIfChanged(elSecs, secs, prev.s);

    prev = { d: days, h: hours, m: mins, s: secs };
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ----------------------------------------------------------
     2) CONFIRMAR ASISTENCIA → WHATSAPP
     ---------------------------------------------------------- */
    const WHATSAPP_NUMBER = '5492477359024'; // Código país + número, sin + ni espacios
  const WHATSAPP_MESSAGE = 'Hola Charii, confirmo mi asistencia a tu cumplee';

  const confirmLink = document.getElementById('confirm-link');
  if (confirmLink) {
    const base = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}`
      : `https://wa.me/`;
    confirmLink.href = `${base}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  }

  /* ----------------------------------------------------------
     3) COPIAR ALIAS
     ---------------------------------------------------------- */
  const ALIAS = 'CHAROROSELL.MP';
  const copyBtn = document.getElementById('copy-alias');
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(ALIAS);
      showToast('Alias copiado ✔');
    } catch (err) {
      // Fallback para navegadores sin soporte de Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = ALIAS;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Alias copiado ✔');
      } catch (e) {
        showToast('No se pudo copiar el alias');
      }
      document.body.removeChild(textarea);
    }
  });

  /* ----------------------------------------------------------
     4) REVEAL SECUENCIAL — cada bloque aparece al cargar la página
     ---------------------------------------------------------- */
  const blocks = document.querySelectorAll('.block[data-anim]');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startDelay = prefersReducedMotion ? 0 : 180;
  const staggerDelay = prefersReducedMotion ? 0 : 560;

  if (prefersReducedMotion) {
    blocks.forEach((block) => block.classList.add('is-visible'));
  } else {
    blocks.forEach((block, index) => {
      setTimeout(() => {
        block.classList.add('is-visible');
      }, startDelay + (index * staggerDelay));
    });
  }
});
