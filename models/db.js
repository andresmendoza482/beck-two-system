import mysql from "mysql";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

connection.connect((err) => {
    if(err) {
        console.log("Hubo un error");
        throw err;
    }else {
        console.log("Conexión exitosa");
    }
});

export default connection;