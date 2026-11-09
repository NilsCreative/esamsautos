/* €SAM Auto's: werkplaats-keuzehulp. Teksten staan in het HTML-blok (data-attributen), niet hier. */
(function () {
  function init(root) {
    if (root.dataset.esamInit) return;
    root.dataset.esamInit = '1';
    var kaarten = Array.prototype.slice.call(root.querySelectorAll('.esam-dienst'));
    var tip = root.querySelector('.esam-tip');
    var tipTekst = tip ? tip.querySelector('p') : null;
    var tipKnop = tip ? tip.querySelector('.esam-tip-b') : null;
    var som = root.querySelector('.esam-wp-sum');
    var wa = root.querySelector('.esam-wp-wa');
    var leeg = som ? som.textContent : '';
    var nummer = root.getAttribute('data-wa') || '31630108755';
    var tipActie = null;

    function aan(k) {
      var el = root.querySelector('.esam-dienst[data-k="' + k + '"]');
      return !!(el && el.getAttribute('aria-pressed') === 'true');
    }
    function zet(k, v) {
      var el = root.querySelector('.esam-dienst[data-k="' + k + '"]');
      if (el) el.setAttribute('aria-pressed', v ? 'true' : 'false');
    }
    function lijst(a) {
      return a.length > 1 ? a.slice(0, -1).join(', ') + ' en ' + a[a.length - 1] : (a[0] || '');
    }
    function update() {
      var gekozen = kaarten.filter(function (k) { return k.getAttribute('aria-pressed') === 'true'; });
      var titels = gekozen.map(function (k) { var t = k.querySelector('.esam-dienst-t'); return t ? t.textContent.trim() : ''; });
      var namen = gekozen.map(function (k) { return k.getAttribute('data-naam') || ''; });
      if (som) som.textContent = gekozen.length ? 'Gekozen: ' + titels.join(', ') : leeg;

      var apk = aan('apk'), kb = aan('kb'), gb = aan('gb'), ban = aan('ban');
      var t = null;
      if (apk && !kb && !gb) t = 'kb';
      else if (!apk && (kb || gb || ban)) t = 'apk';
      else if (apk && (kb || gb) && !ban) t = 'ban';
      if (tip) {
        if (t) {
          tipTekst.textContent = root.getAttribute('data-tip-' + t) || '';
          tipKnop.textContent = root.getAttribute('data-knop-' + t) || '';
          tipActie = t;
          tip.hidden = false;
        } else {
          tip.hidden = true;
          tipActie = null;
        }
      }
      var msg = 'Hoi Esam, ik wil graag een afspraak maken ' + (namen.length ? 'voor ' + lijst(namen) + '.' : 'in de werkplaats.') + ' Mijn kenteken is: ';
      if (wa) wa.href = 'https://wa.me/' + nummer + '?text=' + encodeURIComponent(msg);
    }
    kaarten.forEach(function (k) {
      k.addEventListener('click', function () {
        var key = k.getAttribute('data-k');
        var nu = k.getAttribute('aria-pressed') !== 'true';
        k.setAttribute('aria-pressed', nu ? 'true' : 'false');
        if (nu && key === 'kb') zet('gb', false);
        if (nu && key === 'gb') zet('kb', false);
        update();
      });
    });
    if (tipKnop) tipKnop.addEventListener('click', function () {
      if (tipActie === 'kb') zet('gb', false);
      if (tipActie) zet(tipActie, true);
      update();
    });
    update();
  }
  /* Mobiele onderbalk wijkt zolang de knoppen in de hero in beeld zijn, zodat ze elkaar niet overlappen. */
  function balk() {
    var bar = document.querySelector('.esam-mbar-sec'), knoppen = document.querySelector('.esam-hero .esam-btnrow');
    if (!bar || !knoppen || bar.dataset.esamInit || !('IntersectionObserver' in window)) return;
    bar.dataset.esamInit = '1';
    new IntersectionObserver(function (e) { bar.classList.toggle('esam-mbar-weg', e[0].isIntersecting); }, { threshold: 0.15 }).observe(knoppen);
  }
  function start() {
    Array.prototype.forEach.call(document.querySelectorAll('.esam-wp'), init);
    balk();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('elementor/frontend/init', function () {
    if (window.elementorFrontend && elementorFrontend.hooks) {
      elementorFrontend.hooks.addAction('frontend/element_ready/html.default', function () { start(); });
    }
  });
})();
