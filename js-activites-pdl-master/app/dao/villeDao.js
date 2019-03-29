const Activite = require('../model/activite');
const Equipement = require('../model/equipement');
const Installation = require('../model/installation');

/* Load DAO Common functions */
const daoCommon = require('./common/daoCommon');

/**
 * Ville Data Access Object
 */
class VilleDao {
    constructor() {
        this.common = new daoCommon();
    }

    find(query) {
        let arr = [];
        let sqlParams = {};

        let sqlRequest = "select distinct libCommune,codePostal from installations where ";

        for (let i = 0; i < Object.keys(query).length; i++) {
            arr.push(Object.keys(query)[i] + " like \"%" + Object.values(query)[i] + "%\"")
        }

        sqlRequest += arr.join(" and ") + ";";

        return this.common.findAllWithParams(sqlRequest, sqlParams).then(rows => {
            let cities = [];

            for (const row of rows) {
                cities.push(row);
            }

            return cities.filter(obj => obj.codePostal !== "" && obj.libCommune !== "");
        });
    }

    findAll() {
        const sqlRequest = "select distinct libCommune, codePostal from installations";

        return this.common.findAll(sqlRequest).then(rows => {
            let cities = [];

            for (const row of rows) {
                cities.push(row);
            }

            return cities.filter(obj => obj.codePostal !== "" && obj.libCommune !== "");
        });
    }
}

module.exports = VilleDao;