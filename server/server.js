import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const sqlite = sqlite3.verbose(); 
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 4000;

const db = new sqlite.Database('./products.db', (err) => {
    if (err) console.error('Ошибка подключения к БД:', err.message);
    else console.log('БД успешно подключена');
});

db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL NOT NULL,
        oldPrice REAL,
        currency TEXT DEFAULT '₴',
        image TEXT NOT NULL,
        rating INTEGER CHECK(rating BETWEEN 0 AND 5) DEFAULT 0,
        inStock INTEGER NOT NULL CHECK(inStock IN (0, 1)),
        discount INTEGER CHECK(discount BETWEEN 0 AND 100) DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS product_badges (
        product_id INTEGER,
        badge_id INTEGER,
        PRIMARY KEY (product_id, badge_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
    )`);

    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
            console.error('Ошибка при проверке количества товаров:', err.message);
            return;
        }

        if (row.count === 0) {
            db.run(`INSERT INTO badges (name) VALUES ('hit'), ('new'), ('sale')`, function(err) {
                if (err) return console.error(err.message);

                const insertProduct = db.prepare(`
                    INSERT INTO products (title, price, oldPrice, image, rating, inStock, discount) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

                insertProduct.run("Белое летнее платье миди", 1999, 2499, "https://i.postimg.cc/MT7SdctQ/dress-midi-floral-white-1.jpg", 5, 1, 20,
                    function(err) {
                        if (err) return console.error(err.message);

                        const productId = this.lastID;

                        db.run(`
                            INSERT INTO product_badges (product_id, badge_id) 
                            SELECT ${productId}, id FROM badges WHERE name IN ('hit', 'sale')
                        `);
                    }
                );

                insertProduct.run("Коричневая блуза", 1200, null, "https://i.postimg.cc/pV027jRs/blouse-silk-brown-1.png", 4, 1, null,
                    function(err) {
                        if (err) return console.error(err.message);

                        const productId = this.lastID;

                        db.run(`
                            INSERT INTO product_badges (product_id, badge_id)
                            SELECT ${productId}, id FROM badges WHERE name = 'new'
                        `);
                    }
                );

                insertProduct.run("Бежевая шапка", 700, null, "https://i.postimg.cc/13MGLM7X/hat-knitted-beige-2.png", 3, 0, null,
                    function(err) {
                        if (err) return console.error(err.message);
                    }
                );

                insertProduct.finalize();
            });
        }
    });
});

app.get('/products', (req, res) => {
    const query = `
        SELECT 
            products.*, 
            GROUP_CONCAT(badges.name) AS badges
        FROM products
        LEFT JOIN product_badges ON products.id = product_badges.product_id
        LEFT JOIN badges ON product_badges.badge_id = badges.id
        GROUP BY products.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const formattedRows = rows.map(row => ({
            ...row,
            inStock: Boolean(row.inStock),
            badges: row.badges ? row.badges.split(',') : []
        }));

        res.json(formattedRows);
    });
});

app.listen(PORT);