
import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
import mysql from 'mysql2';
import * as bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from './middleware/authMiddleware.js';
import { requireAdmin } from './middleware/adminMiddleware.js';
import { assignMatches } from './services/matchService.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('Missing JWT_SECRET in environment. Set it in .env before starting the server.');
  process.exit(1);
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zvezek12',
  database: 'secret_match'
})

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.use(express.json());

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// REGISTRACIJA

app.post('/users/register', async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO uporabniki (name, email, password) VALUES (?, ?, ?)`;

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'User already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).send({
        message: `User registered: ${name}`,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }


})


// LOGIN

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({message: "All fields are required"});

  const sql = "SELECT * FROM uporabniki WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = result[0];

    try{
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch)
        return res.status(401).json({ message: 'Wrong password!' });

      //JWT token
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        jwtSecret,
        { expiresIn: '1h' },
      );

      res.status(200).json({
        message: 'Logged in',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Login error: ", err);
      res.status(500).json({ message: 'Server error' });
    }
  })
})

// JOIN MATCH

app.post('/match/join', authenticateToken, (req, res) => {
  const userID = req.user.id;

  const checkSql = "SELECT eventJoined FROM uporabniki WHERE id = ?";
  const updateSql = "UPDATE uporabniki SET eventJoined = true WHERE id = ?";

  db.query(checkSql, [userID], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error: ", checkErr);
      return res.status(500).json({ message: 'Database error' });
    }

    if (checkResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (checkResult[0].eventJoined) {
      return res.status(400).json({ message: "User already joined" });
    }

    db.query(updateSql, [userID], (updateErr) => {
      if (updateErr) {
        console.error("Database error: ", updateErr);
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(200).json({ message: 'Match user joined' });
    });
  });
})

// MATCH ASSIGN

app.post('/match/assign',authenticateToken, requireAdmin, async (req, res) => {
  try{
    const totalPairs = await assignMatches(db);

    res.status(200).json({
      message: "Pairs succsesfuly assigned",
      totalPairs
    });
  } catch (err) {
    if (err.message === "Not enough users")
      return res.status(400).json({ message: err.message });

    console.error(err);
    res.status(500).json({ message: 'Match assignment failed' });
  }
})

app.post('/match/view', authenticateToken, async (req, res) => {

})