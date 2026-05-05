const CompilerService = require('../services/compiler.service');

module.exports = (io, socket) => {
    socket.on('run', async (data) => {
        const { code, language, slug } = data;
        
        if (!code) {
            return socket.emit('stderr', 'Error: No code provided.\n');
        }

        if (slug) {
            const programController = require('../controllers/programController');
            programController.incrementRunCount(slug);
        }

        try {
            await CompilerService.runCode(code, socket);
        } catch (err) {
            console.error('Execution error:', err);
            socket.emit('stderr', 'Internal Server Error during execution.\n');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
};
