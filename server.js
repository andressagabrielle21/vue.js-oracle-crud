const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// INSTALL DOTENV TO PASS USERNAME AND PASSWORD
const dbConfig = {
    user: 'db_user',
    password: 'password',
    connectString: 'localhost/KEY67523'
}

// TO GET DATA
app.get('/employees', async (req, res) => {
    try {
        // AWAIT needs to be inside the ASYNC block
        const conn = await oracledb.getConnection(dbConfig);
        const result = await conn.execute(`SELECT * FROM EMPLOYEES`);

        res.json(result.rows.map((row, item) => ({
            id: row[0], 
            name: row[1],
            date_birth: row[2],
            email: row[3],
            job_title: row[4]
        })));
        await conn.close();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// TO CREATE DATA
app.post('/employees', async(req, res) => {
    const {name, date_birth, email, job_title} = req.body;

    try {
        const conn = await oracledb.getConnection(dbConfig);
        await conn.execute(
            `INSERT INTO EMPLOYEES (name, date_birth, email, job_title) VALUES (:1, :2, :3, :4)`,
            [name, date_birth, email, job_title],
            { autoCommit: true }
        );
        res.sendStatus(201);
        await conn.close();
    } catch (error) {
        res.status(500).send(error.message);
    }
})
