import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("database.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    description TEXT,
    services TEXT,
    stock INTEGER DEFAULT 0
  );

  -- Ensure services and stock columns exist if table was already created
  PRAGMA foreign_keys=off;
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS products_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    description TEXT,
    services TEXT,
    stock INTEGER DEFAULT 0
  );
  INSERT OR IGNORE INTO products_new (id, name, category, price, imageUrl, description, services, stock)
  SELECT id, name, category, price, imageUrl, description, services, IFNULL(stock, 0) FROM products;
  DROP TABLE products;
  ALTER TABLE products_new RENAME TO products;
  COMMIT;
  PRAGMA foreign_keys=on;

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT NOT NULL,
    clientEmail TEXT NOT NULL,
    appointmentDate TEXT NOT NULL,
    appointmentTime TEXT NOT NULL,
    totalPrice TEXT NOT NULL,
    status TEXT DEFAULT 'En attente',
    products TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default data if empty
const settingsCount = db.prepare("SELECT count(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("siteName", "MYMY MAQUILLAGE");
  insertSetting.run("heroTitle", "AMI BEAUTE");
  insertSetting.run("heroSubtitle", "Découvrez des textures innovantes et des couleurs vibrantes qui révèlent votre éclat naturel.");
  insertSetting.run("heroImage", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1920&auto=format&fit=crop");
}

const productCount = db.prepare("SELECT count(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare("INSERT INTO products (name, category, price, imageUrl) VALUES (?, ?, ?, ?)");
  insertProduct.run('Sérum Éclat Absolu', 'Soin', '44.500 FCFA', 'https://images.unsplash.com/photo-1608571423902-369d87195231?q=80&w=800');
  insertProduct.run('Rouge Velours Intense', 'Lèvres', '23.000 FCFA', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800');
  insertProduct.run('Palette Ombres Célestes', 'Yeux', '34.000 FCFA', 'https://images.unsplash.com/photo-1512207128-52591706248d?q=80&w=800');
  insertProduct.run('Fond de Teint Lumière', 'Teint', '29.500 FCFA', 'https://images.unsplash.com/photo-1607599542258-92b372a44a1e?q=80&w=800');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.get("/api/settings", (req, res) => {
    const rows = db.prepare("SELECT * FROM settings").all() as { key: string, value: string }[];
    const settings = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const updates = req.body;
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        upsert.run(key, value);
      }
    });
    transaction(updates);
    res.json({ success: true });
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { name, category, price, imageUrl, description, services, stock } = req.body;
    const info = db.prepare("INSERT INTO products (name, category, price, imageUrl, description, services, stock) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(name, category, price, imageUrl, description || "", services || "", stock || 0);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, category, price, imageUrl, description, services, stock } = req.body;
    db.prepare("UPDATE products SET name = ?, category = ?, price = ?, imageUrl = ?, description = ?, services = ?, stock = ? WHERE id = ?")
      .run(name, category, price, imageUrl, description || "", services || "", stock || 0, id);
    res.json({ success: true });
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Appointment Routes
  app.get("/api/appointments", (req, res) => {
    const appointments = db.prepare("SELECT * FROM appointments ORDER BY createdAt DESC").all();
    res.json(appointments.map((a: any) => ({ ...a, products: JSON.parse(a.products) })));
  });

  app.post("/api/appointments", (req, res) => {
    const { clientName, clientEmail, appointmentDate, appointmentTime, totalPrice, products } = req.body;
    const info = db.prepare(`
      INSERT INTO appointments (clientName, clientEmail, appointmentDate, appointmentTime, totalPrice, products)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(clientName, clientEmail, appointmentDate, appointmentTime, totalPrice, JSON.stringify(products));
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/appointments/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  app.delete("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM appointments WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
