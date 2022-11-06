const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const bodyParser = require('body-parser');
const _DATABASE_FILE = './database.db';

function touchDBFileIfNotExists() {
    if(!fs.existsSync(_DATABASE_FILE)) {
        fs.openSync(_DATABASE_FILE, 'w');
    }
}
let db: any = null;
const app = express();
function initializeDatabase() {
    db = new sqlite3.Database(_DATABASE_FILE);
}

function configureExpress() {
    app.use(bodyParser.json());

    app.get("/user", async (req: any, res: any) => {
        console.log('chamada em user')
        res.send(await getAllUsers());
    })

    app.post("/user", async (req: any, res: any) => {
        console.log('salvando user');
        await insertUser(req.body.email, req.body.password);
        res.send({success: true});
    })


    app.listen(5000, () => {
        console.log("~> listening on 5000");
    })
}

function initDatabaseStructure() {
    return new Promise((r, rj) => {
        db.run(`CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(255), password VARCHAR(255));`, (result: any, error: any) => {
            if(!error) {
                r(result);
            } else {
                rj(error);
            }
        });
    });
}

function insertUser(email: string, password: string) {
    return new Promise((r, rj) => {
        db.run(`INSERT INTO user (id, email,password) VALUES (null,?,?)`,[email, password], (result: any, error: any) => {
            if(error) {
                rj(error);
            } else {
                console.log('add ok')
                //console.log(result)
                r(result);
            }
        })
    });
}

function getAllUsers() {
    return new Promise((r, rj) => {
        db.all(`SELECT * FROM user`, (error: any, result: any) => {
            if(error) {
                rj(error);
            } else {
                r(result.map((user: any) => ({
                    email: user.email,
                    password: user.password
                })));
            }
        });
    });
}

async function init() {
    touchDBFileIfNotExists();
    initializeDatabase();
    await initDatabaseStructure();
    configureExpress();
}

(async () => {
    await init();
})();
