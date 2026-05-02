/**
 * Copy/Paste controls for xterm + better focus on touch devices.
 * Requires window.__NEXCPP_XTERM (set by patched bundle after Terminal opens).
 */
(function () {
  var BTN_STYLE =
    'background:rgba(255,255,255,.08);border:1px solid rgba(48,54,61,.55);color:inherit;border-radius:6px;padding:4px 10px;font:inherit;font-size:0.75rem;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent';

  function getTerminalGlass() {
    var panels = document.querySelectorAll('.glass');
    for (var i = 0; i < panels.length; i++) {
      var g = panels[i];
      if (g.querySelector('.xterm') && g.textContent.indexOf('TERMINAL') !== -1) return g;
    }
    return null;
  }

  function injectButtons() {
    var glass = getTerminalGlass();
    if (!glass) return;
    var header = glass.children[0];
    if (!header || header.textContent.indexOf('TERMINAL') === -1) return;
    var btnWrap = null;
    for (var j = 0; j < header.children.length; j++) {
      var ch = header.children[j];
      if (ch.querySelector && ch.querySelector('button')) {
        btnWrap = ch;
        break;
      }
    }
    if (!btnWrap || btnWrap.querySelector('[data-nexcpp="term-paste"]')) return;

    function mk(label, attr, handler) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('data-nexcpp', attr);
      b.style.cssText = BTN_STYLE;
      b.addEventListener('click', function (ev) {
        ev.preventDefault();
        handler();
      });
      return b;
    }

    btnWrap.appendChild(
      mk('Copy', 'term-copy', function () {
        var term = window.__NEXCPP_XTERM;
        if (!term || typeof term.getSelection !== 'function') return;
        var text = term.getSelection();
        if (!text) return;
        navigator.clipboard.writeText(text).catch(function () {});
      })
    );

    btnWrap.appendChild(
      mk('Paste', 'term-paste', function () {
        var term = window.__NEXCPP_XTERM;
        if (!term || typeof term.paste !== 'function') return;
        navigator.clipboard.readText().then(function (text) {
          if (text) {
            term.focus();
            term.paste(text);
          }
        }).catch(function () {});
      })
    );
  }

  document.addEventListener(
    'pointerdown',
    function (e) {
      var x = e.target.closest && e.target.closest('.xterm');
      if (!x) return;
      var ta = x.querySelector('.xterm-helper-textarea');
      if (ta) {
        requestAnimationFrame(function () {
          try {
            ta.focus({ preventScroll: true });
          } catch (_) {
            ta.focus();
          }
        });
      }
    },
    true
  );

  setInterval(injectButtons, 600);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButtons);
  } else {
    injectButtons();
  }
})();
