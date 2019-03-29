const InstallationDao = require('../dao/installationDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/**
 * Installation Controller
 */
class InstallationController {
    constructor() {
        this.installationDao = new InstallationDao();
        this.common = new ControllerCommon();
    }

    find(req, res) {
        function isEmpty(obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
        let newQuery = {};

        if (req.query.commune && req.query.commune !== '') newQuery.libCommune = req.query.commune;
        if (req.query.code_postal && req.query.code_postal !== '') newQuery.codePostal = req.query.code_postal;
        if (req.query.activite && req.query.activite !== '') newQuery.libAct = req.query.activite;
        if (req.query.handicap && req.query.handicap !== '') {
            if (req.query.handicap == "1") newQuery.handicap = "Oui";
            if (req.query.handicap == "0") newQuery.handicap = "Non";
        }

        if (isEmpty(newQuery)) this.findAll(req, res);
        else {
            this.installationDao.find(newQuery)
                .then(this.common.findSuccess(res))
                .catch(this.common.findError(res));
        }
    }

    findAll(req, res) {
        this.installationDao.findAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    }
}

module.exports = InstallationController;