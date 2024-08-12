const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'banner_app',
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Get the current banner settings
app.get('/api/banner', (req, res) => {
    const sql = 'SELECT * FROM banner_settings LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result.length > 0 ? result[0] : null);
    });
});

// Add or update the banner settings
app.post('/api/banner', (req, res) => {
    const { description, timer, link, isVisible } = req.body;

    const selectSql = 'SELECT * FROM banner_settings LIMIT 1';
    db.query(selectSql, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            // If a banner exists, update it
            const updateSql = 'UPDATE banner_settings SET description = ?, timer = ?, link = ?, isVisible = ? WHERE id = ?';
            db.query(updateSql, [description, timer, link, isVisible, result[0].id], (err, result) => {
                if (err) throw err;
                res.send({ status: 'Banner settings updated' });
            });
        } else {
            // If no banner exists, insert a new one
            const insertSql = 'INSERT INTO banner_settings (description, timer, link, isVisible) VALUES (?, ?, ?, ?)';
            db.query(insertSql, [description, timer, link, isVisible], (err, result) => {
                if (err) throw err;
                res.send({ status: 'New banner created' });
            });
        }
    });
});

const PORT = 8086;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
