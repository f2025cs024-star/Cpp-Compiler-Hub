import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalComponent = ({ socket }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 14,
      theme: {
        background: '#0d1117',
        foreground: '#f0f6fc',
        cursor: '#00d4ff',
        selectionBackground: 'rgba(0, 212, 255, 0.3)',
      },
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln('\x1b[1;36mC++ Compiler Hub Interactive Terminal\x1b[0m');
    term.writeln('Press "Run" to start execution.\r\n');

    // Handle incoming data from server
    if (socket) {
      socket.on('stdout', (data) => term.write(data));
      socket.on('stderr', (data) => term.write(`\x1b[31m${data}\x1b[0m`));
    }

    // Handle user typing in terminal
    term.onData((data) => {
      if (socket) {
        if (data === '\r') {
          socket.emit('stdin', '\n');
          term.write('\r\n');
        } else if (data === '\x7f') { // Backspace
          socket.emit('stdin', '\b');
          term.write('\b \b');
        } else {
          socket.emit('stdin', data);
          term.write(data);
        }
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      if (socket) {
        socket.off('stdout');
        socket.off('stderr');
      }
    };
  }, [socket]);

  return (
    <div className="glass" style={{ padding: '15px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>
        <span>TERMINAL</span>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => xtermRef.current?.clear()} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Clear</button>
        </div>
      </div>
      <div ref={terminalRef} style={{ height: 'calc(100% - 30px)' }} />
    </div>
  );
};

export default TerminalComponent;
