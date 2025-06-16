const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;
const db = new sqlite3.Database("./db.sqlite");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // atau atur storage sendiri

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Buat tabel jika belum ada
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT,
      quote TEXT,
      image TEXT,
      details TEXT
    )
  `);
});

// Ambil semua member
app.get("/api/members", (req, res) => {
  db.all("SELECT * FROM members", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/members", upload.single("image"), (req, res) => {
  const { id, name, quote, details } = req.body;
  const imagePath = req.file.path;
  // simpan data sesuai kebutuhan kamu
});

// Tambah member
app.post("/api/members", (req, res) => {
  const { id, name, quote, image, details } = req.body;
  db.run(
    "INSERT INTO members (id, name, quote, image, details) VALUES (?, ?, ?, ?, ?)",
    [id, name, quote, image, details],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Member ditambahkan" });
    }
  );
});

// Update member
app.put("/api/members/:id", (req, res) => {
  const { name, quote, image, details } = req.body;
  db.run(
    "UPDATE members SET name=?, quote=?, image=?, details=? WHERE id=?",
    [name, quote, image, details, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Member diupdate" });
    }
  );
});

// Hapus member
app.delete("/api/members/:id", (req, res) => {
  db.run("DELETE FROM members WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Member dihapus" });
  });
});

app.get("/", (req, res) => {
  res.redirect("/login.html");
});


app.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});