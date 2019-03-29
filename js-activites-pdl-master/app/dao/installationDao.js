const Activite = require('../model/activite');
const Equipement = require('../model/equipement');
const Installation = require('../model/installation');

/* Load DAO Common functions */
const daoCommon = require('./common/daoCommon');

/**
 * Installation Data Access Object
 */
class InstallationDao {
    constructor() {
        this.common = new daoCommon();
    }

    find(query) {
        let arr = [];
        let sqlParams = {};

        let sqlRequest = "select distinct activites.codeAct, activites.libAct, " +
            "equipements.codeEquip," +
            "installations.codeInst, installations.libInst, installations.libCommune, installations.codePostal, installations.handicap, installations.adresse " +
            "from activites " +
            "inner join equipements on equipements.codeEquip = activites.codeEquip " +
            "inner join installations on installations.codeInst = equipements.codeInst where ";

        for (let i = 0; i < Object.keys(query).length; i++) {
            arr.push(Object.keys(query)[i] + " like \"%" + Object.values(query)[i] + "%\"")
        }

        sqlRequest += arr.join(" and ") + ";";
        
        return this.common.findAllWithParams(sqlRequest, sqlParams).then(rows => {
            let activites = [];

            for (const row of rows) {
                activites.push(
                    new Activite(row.codeAct, row.libAct,
                        new Equipement(row.codeEquip,
                            new Installation(row.codeInst, row.libInst, row.codePostal, row.libCommune, row.handicap, row.adresse))));
            }

            return activites;
        });
    }

    findAll() {
        const sqlRequest = "select distinct activites.codeAct, activites.libAct, " +
            "equipements.codeEquip," +
            "installations.codeInst, installations.libInst, installations.libCommune, installations.codePostal, installations.handicap, installations.adresse " +
            "from activites " +
            "inner join equipements on equipements.codeEquip = activites.codeEquip " +
            "inner join installations on installations.codeInst = equipements.codeInst";

        return this.common.findAll(sqlRequest).then(rows => {
            let activites = [];

            for (const row of rows) {
                activites.push(
                    new Activite(row.codeAct, row.libAct,
                        new Equipement(row.codeEquip,
                            new Installation(row.codeInst, row.libInst, row.codePostal, row.libCommune, row.handicap, row.adresse))));
            }

            return activites;
        });
    }
}

module.exports = InstallationDao;