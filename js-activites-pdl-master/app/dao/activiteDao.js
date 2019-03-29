const Activite = require('../model/activite');
const Equipement = require('../model/equipement');
const Installation = require('../model/installation');

/* Load DAO Common functions */
const daoCommon = require('./common/daoCommon');

/**
 * Activite Data Access Object
 */
class ActiviteDao {
    constructor() {
        this.common = new daoCommon();
    }

    find(query) {
        let arr = [];
        let sqlParams = {};

        let sqlRequest = "select distinct activites.libAct from activites where ";

        for (let i = 0; i < Object.keys(query).length; i++) {
            arr.push(Object.keys(query)[i] + " like \"%" + Object.values(query)[i] + "%\"")
        }

        sqlRequest += arr.join(" and ") + ";";
        
        return this.common.findAllWithParams(sqlRequest, sqlParams).then(rows => {
            let activites = [];

            for (const row of rows) {
                activites.push(row);
            }

            return activites;
        });
    }

    findAll() {
        const sqlRequest = "select distinct activites.libAct from activites";

        return this.common.findAll(sqlRequest).then(rows => {
            let activites = [];

            for (const row of rows) {
                activites.push(row);
            }

            return activites;
        });
    }
}

module.exports = ActiviteDao;