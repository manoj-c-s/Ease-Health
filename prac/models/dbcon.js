const mysql =require('mysql');

let db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'nodejs'
});
db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("mysql connected.....");
    }
});


module.exports = db ;