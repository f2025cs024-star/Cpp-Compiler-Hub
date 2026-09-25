import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const TerminalComponent = ({ socket }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [copied, setCopied] = useState(false);

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
        selectionBackground: 'rgba(0, 212, 255, 0.35)',
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

    // Enable Ctrl+C / Cmd+C copying when text is selected in terminal
    term.attachCustomKeyEventHandler((event) => {
      const isCopy = (event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C');
      if (isCopy && term.hasSelection()) {
        const text = term.getSelection();
        if (text) {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }
        return false; // Prevent xterm from sending \x03
      }

      const isPaste = (event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'V');
      if (isPaste && event.type === 'keydown') {
        navigator.clipboard.readText().then((clipText) => {
          if (clipText && socket) {
            socket.emit('stdin', clipText);
            term.write(clipText);
          }
        }).catch(() => {});
        return false;
      }

      return true;
    });

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

  const handleCopyTerminal = () => {
    const term = xtermRef.current;
    if (!term) return;

    if (term.hasSelection()) {
      const text = term.getSelection();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } else {
      // If no text is selected, copy all visible output in buffer
      let fullText = '';
      const buffer = term.buffer.active;
      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) {
          fullText += line.translateToString(true) + '\n';
        }
      }
      const trimmed = fullText.trimEnd();
      if (trimmed) {
        navigator.clipboard.writeText(trimmed);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    }
  };

  return (
    <div className="glass" style={{ padding: '15px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>
        <span>TERMINAL</span>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            type="button" 
            onClick={handleCopyTerminal} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: copied ? '#00d4ff' : 'inherit', 
              cursor: 'pointer', 
              fontWeight: copied ? '700' : 'normal' 
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button 
            type="button" 
            onClick={() => xtermRef.current?.clear()} 
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>
      </div>
      <div ref={terminalRef} style={{ height: 'calc(100% - 30px)' }} />
    </div>
  );
};

export default TerminalComponent;
