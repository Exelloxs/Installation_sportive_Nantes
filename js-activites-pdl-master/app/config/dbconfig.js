/* Load modules */
let sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv');
const parse = require('csv-parse');

/*
 * Database configuration
 */

/* Load database file (Creates file if not exists) */
const db = new sqlite3.Database('./app/database.db');

// Activation des contraintes d'intégrité
db.get("PRAGMA foreign_keys = ON")

const createInstallations = function () {
    return new Promise(function (resolve, reject) {
        const sqlRequest = "CREATE TABLE IF NOT EXISTS installations (" +
            "codeInst TEXT NOT NULL, " +
            "libInst TEXT NOT NULL, " +
            "codePostal TEXT NOT NULL, " +
            "libCommune TEXT NOT NULL, " +
            "handicap TEXT NOT NULL, " +
            "adresse TEXT NOT NULL, " +
            "PRIMARY KEY (codeInst))";

        db.run(sqlRequest, [], (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Table installations créée");
                resolve(this);
            }
        });
    })
};

const createEquipement = function () {
    return new Promise(function (resolve, reject) {
        const sqlRequest = "CREATE TABLE IF NOT EXISTS equipements (" +
            "codeEquip TEXT NOT NULL," +
            "codeInst TEXT NOT NULL," +
            "PRIMARY KEY (codeEquip)," +
            "FOREIGN KEY (codeInst) REFERENCES installations(codeInst))";

        db.run(sqlRequest, [], (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Table equipements créée");
                resolve(this);
            }
        });
    });
};

const createActivite = function () {
    return new Promise(function (resolve, reject) {
        const sqlRequest = "CREATE TABLE IF NOT EXISTS activites (" +
            "codeAct TEXT NOT NULL," +
            "libAct TEXT NOT NULL," +
            "codeEquip TEXT NOT NULL," +
            "PRIMARY KEY (codeAct, codeEquip)," +
            "FOREIGN KEY (codeEquip) REFERENCES equipements(codeEquip))";
        db.run(sqlRequest, [], (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Table activites créée");
                resolve(this);
            }
        });
    });
};

const populateInstallation = function () {
    return new Promise(function (resolve, reject) {
        const fileName = 'data/234400034_004-010_fiches-installations-rpdl_small.csv';
        const stream = fs.createReadStream(fileName, {encoding: 'utf8'});

        const parser = parse({
            delimiter: ';',
            columns: header =>
                header.map(column => column.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gmi, "_").replace(/\s+/g, '_').toLowerCase())
        });

        parser.on('readable', function () {
            let row;

            while (row = this.read()) {
                const sqlRequest = "INSERT OR IGNORE into installations (codeInst, libInst, codePostal, libCommune, handicap, adresse) " +
                    "VALUES ($codeInst, $libInst, $codePostal, $libCommune, $handicap, $adresse)";
                const sqlParams = {
                    $codeInst: row.numero_de_l_installation,
                    $libInst: row.nom_usuel_de_l_installation,
                    $codePostal: String(row.code_postal),
                    $libCommune: String(row.nom_de_la_commune),
                    $handicap: String(row.accessibilite_handicapes_a_mobilite_reduite),
                    $adresse: String([row.numero_de_la_voie, row.nom_de_la_voie, row.nom_du_lieu_dit].join(" ").trim())
                };

                db.run(sqlRequest, sqlParams, function (err) {
                    if (err)
                        console.log(err);
                });
            }
        });


        stream.pipe(parser);

        parser.on('finish', function () {
            console.log("Table installations remplie");
            resolve(this);
        });

        parser.on("error", (err) => {
            console.log(err);
            reject(err);
        });
    })
};

const populateEquipement = function () {
    return new Promise(function (resolve, reject) {
        const fileName = 'data/234400034_004-011_fiches-equipements-rpdl_small.csv';
        const stream = fs.createReadStream(fileName, {encoding: 'utf8'});

        const parser = parse({
            delimiter: ';',
            columns: header =>
                header.map(column => column.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gmi, "_").replace(/\s+/g, '_').toLowerCase())
        });

        parser.on('readable', function () {
            let row;

            while (row = this.read()) {
                const sqlRequest = "INSERT OR IGNORE into equipements (codeEquip, codeInst) " +
                    "VALUES ($codeEquip, $codeInst)";
                const sqlParams = {
                    $codeEquip: row.numero_de_la_fiche_equipement,
                    $codeInst: row.numero_de_l_installation
                };

                db.run(sqlRequest, sqlParams, function (err) {
                    if (err)
                        console.log(err);
                });
            }
        });


        stream.pipe(parser);

        parser.on('finish', function () {
            console.log("Table equipements remplie");
            resolve(this);
        });

        parser.on("error", (err) => {
            console.log(err);
            reject(err);
        });

    })
}

const populateActivite = function () {
    return new Promise(function (resolve, reject) {
        const fileName = 'data/234400034_004-009_activites-des-fiches-equipements-rpdl_small.csv';
        const stream = fs.createReadStream(fileName, {encoding: 'utf8'});

        const parser = parse({
            delimiter: ';',
            columns: header =>
                header.map(column => column.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gmi, "_").replace(/\s+/g, '_').toLowerCase())
        });

        parser.on('readable', function () {
            let row;

            while (row = this.read()) {
                const sqlRequest = "INSERT OR IGNORE into activites (codeAct, libAct, codeEquip) " +
                    "VALUES ($codeAct, $libAct, $codeEquip)";
                const sqlParams = {
                    $codeAct: row.activite_code,
                    $libAct: row.activite_libelle,
                    $codeEquip: row.numero_de_la_fiche_equipement
                };


                db.run(sqlRequest, sqlParams, function (err) {
                    if (err) {
                        console.log(err);
                        console.log(sqlRequest, sqlParams.$activiteCode, sqlParams.$activiteLibelle, sqlParams.$numeroDeLaFicheEquipement);
                    }
                });
            }
        });


        stream.pipe(parser);

        parser.on('finish', function () {
            console.log("Table activites remplie");
            resolve(this);
        });

        parser.on("error", (err) => {
            console.log(err);
            reject(err);
        });

    })
};

const init = function () {
    db.serialize(() => {
        console.log("Création des tables et importation des données");
        createInstallations().then(
            () => createEquipement()
        ).then(
            () => createActivite()
        ).then(
            () => populateInstallation()
        ).then(
            () => populateEquipement()
        ).then(
            () => populateActivite()
        ).then(() => console.log("Les tables ont été créées et remplies")).catch((err) => console.log(err));
    });
};

module.exports = {
    init: init,
    db: db
};

