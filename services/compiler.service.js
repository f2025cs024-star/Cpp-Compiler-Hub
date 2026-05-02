const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const TEMP_DIR = path.join(__dirname, '../temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

const MAX_SOURCE_BYTES = Number(process.env.MAX_SOURCE_BYTES) || 400 * 1024;
const COMPILE_TIMEOUT_MS = Number(process.env.COMPILE_TIMEOUT_MS) || 60 * 1000;
const EXEC_TIMEOUT_MS = Number(process.env.EXEC_TIMEOUT_MS) || 5 * 60 * 1000;

class CompilerService {
    static async runCode(code, socket) {
        const buf = Buffer.byteLength(code || '', 'utf8');
        if (buf > MAX_SOURCE_BYTES) {
            socket.emit('stderr', `\r\n\x1b[1;31m[Source too large (max ${MAX_SOURCE_BYTES} bytes)]\x1b[0m\r\n`);
            return { success: false, error: 'Source too large' };
        }

        const id = randomUUID();
        const filename = `${id}.cpp`;
        const filepath = path.join(TEMP_DIR, filename);
        const exeSuffix = process.platform === 'win32' ? '.exe' : '';
        const executable = path.join(TEMP_DIR, `${id}${exeSuffix}`);

        fs.writeFileSync(filepath, code);

        return new Promise((resolve) => {
            // Compilation Phase
            socket.emit('stdout', '\x1b[1;34m[1/2] Compiling C++17...\x1b[0m\r\n');
            
            const compile = spawn('g++', [
                '-std=c++17',
                '-O2',
                '-Wall',
                filepath,
                '-o',
                executable
            ], { stdio: ['ignore', 'pipe', 'pipe'] });

            const compileTimer = setTimeout(() => {
                compile.kill('SIGKILL');
                socket.emit('stderr', '\r\n\x1b[1;31m[Compilation timed out]\x1b[0m\r\n');
            }, COMPILE_TIMEOUT_MS);

            let stderr = '';
            compile.stderr.on('data', (data) => {
                stderr += data.toString();
                socket.emit('stderr', data.toString());
            });

            compile.on('close', (code) => {
                clearTimeout(compileTimer);
                if (code !== 0) {
                    if (code !== null) {
                        socket.emit('stderr', `\r\n\x1b[1;31m[Compilation Failed with exit code ${code}]\x1b[0m\r\n`);
                    }
                    this.cleanup(filepath, executable);
                    return resolve({ success: false, error: 'Compilation Error' });
                }

                socket.emit('stdout', '\x1b[1;32m[2/2] Execution Started...\x1b[0m\r\n');
                
                // Execution Phase
                const start = Date.now();
                const child = spawn(executable, { stdio: ['pipe', 'pipe', 'pipe'] });

                // Handle STDIN from socket
                const stdinHandler = (data) => {
                    if (child.stdin.writable) {
                        child.stdin.write(data);
                    }
                };
                socket.on('stdin', stdinHandler);

                child.stdout.on('data', (data) => {
                    socket.emit('stdout', data.toString());
                });

                child.stderr.on('data', (data) => {
                    socket.emit('stderr', data.toString());
                });

                const timeout = setTimeout(() => {
                    child.kill('SIGKILL');
                    socket.emit('stderr', '\r\n\x1b[1;31m[Execution timed out]\x1b[0m\r\n');
                }, EXEC_TIMEOUT_MS);

                child.on('close', (exitCode) => {
                    clearTimeout(timeout);
                    const duration = (Date.now() - start) / 1000;
                    socket.emit('stdout', `\r\n\x1b[1;36m\r\n=== Execution Finished (${duration}s) ===\x1b[0m\r\n`);
                    socket.off('stdin', stdinHandler);
                    this.cleanup(filepath, executable);
                    resolve({ success: true, exitCode, duration });
                });
            });
        });
    }

    static cleanup(filepath, executable) {
        try {
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            if (fs.existsSync(executable)) fs.unlinkSync(executable);
        } catch (e) {
            console.error('Cleanup error:', e);
        }
    }
}

module.exports = CompilerService;
