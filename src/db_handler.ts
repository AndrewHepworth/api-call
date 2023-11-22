const sqlite3 = require('sqlite3').verbose();
import { sqlite3 } from "sqlite3";

class WeatherDatabase {
    db : any;
    constructor() {
        this.SetDB();
        this.SetDB();
    }

    SetDB = () => {

        this.db = new sqlite3.Database('./db/weather.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: { message: any}) => {
            if (err) {
            return console.error(err.message);
            }
            console.log('Connected to the in-memory SQlite database.');
        });
    }

    Serialize = () => {
        this.db.serialize(() => {
            this.db.run("CREATE TABLE if not exists weather (id INTEGER PRIMARY KEY, entry TEXT);");
            const stmt = this.db.prepare("INSERT INTO weather (entry) values (?)");

        });
    }    

    InsertQuery = (body: string) => {
        return new Promise((resolve, reject) => {
        this.db.run("INSERT INTO weather (entry) values (?)",[body],  (err: any) => {
            if (err) {
            reject(err);
            } else {
            resolve(true);
            }
        });
        });
    }
    
    GetQuery = (body: string) => {
        const arr = body.split(" ");
        return new Promise((resolve, reject) => {
        var content = this.db.get("SELECT * FROM weather WHERE id = ?",[arr[1]],  (err: any, row: unknown ) => {
            if (err) {
            reject(err);
            } else {
            resolve(row);
            }
        });
        });
    }
}
export default WeatherDatabase;