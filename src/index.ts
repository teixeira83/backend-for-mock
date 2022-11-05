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

async function init() {
    touchDBFileIfNotExists();
    initializeDatabase();
    await initDatabaseStructure();
    configureExpress();
}


(async () => {
    await init();
})();
