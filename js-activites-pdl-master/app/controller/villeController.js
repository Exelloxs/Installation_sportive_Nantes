const VilleDao = require('../dao/villeDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/**
 * Ville Controller
 */
class VilleController {
    constructor() {
        this.villeDao = new VilleDao();
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

        if (isEmpty(newQuery)) this.findAll(req, res);
        else {
            this.villeDao.find(newQuery)
                .then(this.common.findSuccess(res))
                .catch(this.common.findError(res));
        }
    }

    findAll(req, res) {
        this.villeDao.findAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    }
}

module.exports = VilleController;