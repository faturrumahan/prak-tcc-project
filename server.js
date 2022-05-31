// @ts-check
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express");

const { Client } = require("pg");
const mysql = require('mysql');
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const client = new Client({
  password: "root",
  user: "root",
  host: "postgres",
});

const postconnection = mysql.createPool({
  host: "mysql_db",
  port: 3306,
  user: "root",
  password: "root",
  database: "mysql_db2"
});

app.use(express.static("public"));

//show user
app.get("/users", async (req, res) => {
  const results = await client
    .query("SELECT * FROM users")
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

//show specific user
app.get("/users/you", async (req, res) => {
  const id = req.body.id;

  const results = await client
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

//add user
app.post("/users", async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  const results = await client
    .query("INSERT INTO users(email, username, password) VALUES ($1,$2,$3)", [email, username, password])
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

//edit user
app.put("/users", async (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const password = req.body.password;

  const results = await client
    .query("UPDATE users SET email = $1, password = $2 WHERE id = $3", [email, password, id])
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

//delete user
app.delete("/users", async (req, res) => {
  const id = req.body.id;

  const results = await client
    .query("DELETE FROM users WHERE id = $1", [id])
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

//show all post
app.get('/posts', (req, res) => {
  const sqlQuery = "SELECT * FROM posts"

  postconnection.query(sqlQuery, (err, result) => {
      if (err) {
          console.log(err)
      }
      else {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.send(result)
      }
  });
});

//show specific post from a user
app.get('/posts/you', (req, res) => {
  const username = req.body.username;

  const sqlQuery = "SELECT * FROM posts where username = ?"

  postconnection.query(sqlQuery, username, (err, result) => {
      if (err) {
          console.log(err)
      }
      else {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.send(result)
      }
  });
});

//create a post
app.post('/posts', (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const username = req.body.username;

  const sqlQuery = "INSERT INTO posts (title, description, username) VALUE (?,?,?)";
  postconnection.query(sqlQuery, [title, description, username], (err, result) => {
      if (err) {
          console.log(err)
      }
      else {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
          res.send(result)
      }
  });
});

//delete a post
app.delete('/posts', (req, res) => {
  const id = req.body.id;

  const sqlQuery = "DELETE FROM posts WHERE id = ?"
  postconnection.query(sqlQuery, id, (err, result) => {
      if (err) {
          console.log(err)
      }
      else {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
          res.send(result)
      }
  });
});

(async () => {
  await client.connect();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 300);
  reject("oops");
});

myPromise.then(() => {
  console.log("hello");
});
