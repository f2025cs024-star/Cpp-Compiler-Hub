const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

exports.createProgram = async (req, res) => {
    const { title, code, language, is_public } = req.body;
    const slug = uuidv4().slice(0, 8);

    try {
        const result = db.prepare('INSERT INTO programs (slug, user_id, title, code, language, is_public) VALUES (?, ?, ?, ?, ?, ?)')
            .run(slug, req.user.id, title, code, language || 'cpp', is_public ? 1 : 0);
        
        res.json({ id: result.lastInsertRowid, slug, title });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getPrograms = async (req, res) => {
    try {
        const programs = db.prepare('SELECT * FROM programs WHERE user_id = ? ORDER BY updated_at DESC').all(req.user.id);
        res.json(programs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getProgramBySlug = async (req, res) => {
    try {
        const program = db.prepare('SELECT p.*, u.username FROM programs p JOIN users u ON p.user_id = u.id WHERE p.slug = ?').get(req.params.slug);
        if (!program) return res.status(404).json({ msg: 'Program not found' });
        res.json(program);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.updateProgram = async (req, res) => {
    const { title, code, is_public } = req.body;
    try {
        const program = db.prepare('SELECT * FROM programs WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
        if (!program) return res.status(401).json({ msg: 'Not authorized' });

        db.prepare('UPDATE programs SET title = ?, code = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(title || program.title, code || program.code, is_public !== undefined ? (is_public ? 1 : 0) : program.is_public, req.params.id);
        
        res.json({ msg: 'Program updated' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.deleteProgram = async (req, res) => {
    try {
        const result = db.prepare('DELETE FROM programs WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
        if (result.changes === 0) return res.status(401).json({ msg: 'Not authorized or not found' });
        res.json({ msg: 'Program deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const programs = db.prepare(`
            SELECT p.id, p.title, p.slug, p.run_count, u.username 
            FROM programs p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.is_public = 1 
            ORDER BY p.run_count DESC 
            LIMIT 10
        `).all();
        res.json(programs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.incrementRunCount = (slug) => {
    try {
        db.prepare('UPDATE programs SET run_count = run_count + 1 WHERE slug = ?').run(slug);
    } catch (err) {
        console.error('Error incrementing run count:', err);
    }
};
