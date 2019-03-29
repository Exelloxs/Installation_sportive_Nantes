/**
 * Installation Entity (ES6 Class)
 */

class Installation {
    constructor(codeInst, libInst, codePostal, libCommune, handicap, adresse) {
        this.codeInst = codeInst;
        this.libInst = libInst;
        this.codePostal = codePostal;
        this.libCommune = libCommune;
        this.handicap = handicap;
        this.adresse = adresse;
    }
}

module.exports = Installation;
