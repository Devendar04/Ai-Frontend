import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

export function Terminal({ xtermRef }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1a1b26',
        foreground: '#a9b1d6',
        cursor: '#c0caf5',
        selection: '#33467C',
        black: '#32344a',
        blue: '#7aa2f7',
        cyan: '#449dab',
        green: '#9ece6a',
        purple: '#ad8ee6',
        red: '#f7768e',
        white: '#787c99',
        yellow: '#e0af68',
      },
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('\x1b[1;34mWelcome to the Terminal\x1b[0m');
    term.write('\x1b[1;32m$ \x1b[0m');

    term.onKey(({ key, domEvent }) => {
      const char = domEvent.key;

      if (char === 'Enter') {
        term.write('\r\n\x1b[1;32m$ \x1b[0m');
      } else if (domEvent.key === 'Backspace') {
        // Limit deletion past prompt
        if (term._core.buffer.x > 2) {
          term.write('\b \b');
        }
      } else {
        term.write(key);
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    if (xtermRef) {
      xtermRef.current = term;
    }

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [xtermRef]);

  return (
    <div className="h-full bg-gray-900 mb-14">
      <div ref={terminalRef} className="h-full" />
    </div>
  );
}
