const express = require('express');
const app = express();
const port = 3333;
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("verifica.db");
let tmp1, tmp2;

//invio dei dati del biglietto
app.get('/biglietto/:id', (req, res) => {
    db.all(`SELECT * FROM biglietto WHERE id = (?)`, req.params.id, (error, rows) => {
        if(error){
            console.log(error.message);
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "data": rows
        }
        res.status(200).send(response);
    });
});

//informazioni di uscita e prezzo del biglietto
app.put('/biglietto/:id', (req, res) => {
    //generazione data/ora di uscita
    tmp2 = Date.now();
    console.log(tmp2);
    //calcolo del prezzo a 10 cent al secondo
    let pf = ((tmp2 - tmp1)/1000)*0.1;
    //riduzione del prezzo a 2 cifre decimali
    pf = pf.toFixed(2);
    console.log(pf);
    //trasformazione data/ora di ingresso in stringa
    let usc = new Date(tmp2).toString();
    db.run(`UPDATE biglietto SET uscita = (?), costo = (?) WHERE id = (?)`, [usc, pf, req.params.id], (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1
        }
        res.status(201).send(response);
    });
});

//cancellazione del biglietto
app.delete('/biglietto/:id', (req, res) => {
    db.run(`DELETE FROM biglietto WHERE id = (?)`, req.params.id, (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1
        }
        res.status(200).send(response);
    });
});

//parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

//creazione biglietto con orario di ingresso
app.post('/biglietto', (req, res) => {
    //generazione id random come stringa
    const id = Math.random().toString().replace("0.", "");
    console.log(id);
    //generazione data/ora di ingresso
    tmp1 = Date.now();
    console.log(tmp1);
    //trasformazione data/ora di ingresso in stringa
    let ing = new Date(tmp1).toString();
    db.run(`INSERT INTO biglietto (id, ingresso) VALUES (?, ?)`, [id, ing], (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "id": id
        }
        res.status(201).send(response);
    });
});

//server in ascolto
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});