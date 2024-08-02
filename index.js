import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "2Punit&ive",
  port: 5433,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  let details = await db.query("SELECT * FROM items ORDER BY id ASC");
  var rows = details.rows;
  var items = rows.map(item => item);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;
  db.query("UPDATE items SET title = $1 WHERE id = $2", [itemTitle, itemId]) ;
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const deleteId = req.body.deleteItemId;
  var numInt = parseInt(deleteId);
  db.query("DELETE FROM items WHERE id = $1", [numInt]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
