const ActiviteDao = require('../dao/activiteDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/**
 * Activite Controller
 */
class ActiviteController {
    constructor() {
        this.activiteDao = new ActiviteDao();
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

        if (req.query.nom && req.query.nom !== '') newQuery.libAct = req.query.nom;

        if (isEmpty(newQuery)) this.findAll(req, res);
        else {
            this.activiteDao.find(newQuery)
                .then(this.common.findSuccess(res))
                .catch(this.common.findError(res));
        }
    }

    findAll(req, res) {
        this.activiteDao.findAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    }
}

module.exports = ActiviteController;