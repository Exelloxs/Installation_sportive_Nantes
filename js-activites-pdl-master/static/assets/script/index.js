const Bus = new Vue({});

Vue.component("commune-autocomplete", {
    data: function() {
        return {
            model: null,
            communes: [],
        }
    },
    methods: {
        getCommunes() {
            fetch("http://localhost:3000/api/ville/")
                .then(response => response.json())
                .then(response => {
                    for (const row of response) {
                        const show = row.libCommune + " - " + row.codePostal;
                        const id = row.libCommune + "." + row.codePostal;
                        this.communes.push({ libCommune: row.libCommune, codePostal: row.codePostal, id: id, show: show })
                    }
                });
        },
        postdata() {
            Bus.$emit('postCommune', { commune: this.model.libCommune, codePostal: this.model.codePostal });
        },
    },
    created() {
        this.getCommunes();
        Bus.$on('clear', () => this.model = null);
    },
    template: "<v-flex xs12 sm12 md6><v-autocomplete @input=\"postdata\" v-model=\"model\" :items=\"communes\" item-text=\"show\" item-value=\"id\" label=\"Commune ou code postal\" hide-no-data hide-selected persistent-hint color=\"blue accent-2\" return-object></v-autocomplete></v-flex>",
});

Vue.component("activite-autocomplete", {
    data: function() {
        return {
            model: null,
            activites: [],
        }
    },
    methods: {
        getActivites() {
            fetch("http://localhost:3000/api/activite/")
                .then(response => response.json())
                .then(response => {
                    for (const row of response) {
                        this.activites.push({ libAct: row.libAct });
                    }
                });
        },
        postdata() {
            Bus.$emit('postActivite', { activite: this.model.libAct });
        },
    },
    created() {
        this.getActivites();
        Bus.$on('clear', () => this.model = null);
    },
    template: "<v-flex xs12 sm12 md6><v-autocomplete @input=\"postdata\" v-model=\"model\" :items=\"activites\" item-text=\"libAct\" item-value=\"libAct\" label=\"Activité\" hide-no-data hide-selected persistent-hint color=\"blue accent-2\" return-object></v-autocomplete></v-flex>",
});

Vue.component("handicap-checkbox", {
    data: function() {
        return {
            model: null,
        }
    },
    methods: {
        postdata() {
            Bus.$emit('postHandicap', { handicap: this.model });
        },
    },
    created() {
        Bus.$on('clear', () => this.model = null);
    },
    template: "<v-checkbox v-model=\"model\" @change=\"postdata\" label=\"Accès pour personnes à mobilité réduite\" color=\"blue accent-2\"></v-checkbox>",
});

Vue.component("button-clear", {
    data: function() {
        return {}
    },
    methods: {
        clear() {
            Bus.$emit('clear', null);
        }
    },
    template: "<v-btn color=\"blue accent-2\" v-on:click=\"clear\">Vider les champs</v-btn>",
})

Vue.component("button-search", {
    data: function() {
        return {
            commune: "",
            codePostal: "",
            activite: "",
            handicap: "",
            installations: [],
        }
    },
    created() {
        Bus.$on('postCommune', (selected) => {
            this.commune = selected.commune ? selected.commune : "";
            this.codePostal = selected.codePostal ? selected.codePostal : "";
        });
        Bus.$on('postActivite', (selected) => {
            this.activite = selected.activite ? selected.activite : "";
        });
        Bus.$on('postHandicap', (selected) => {
            this.handicap = selected.handicap ? "1" : "0";
        });
        Bus.$on('clear', () => {
            this.commune = "";
            this.codePostal = "";
            this.activite = "";
            this.handicap = "";
            this.installations = [];
        });
    },
    methods: {
        search() {
            this.installations = [];
            fetch("http://localhost:3000/api/installation?commune=" + this.commune + "&code_postal=" + this.codePostal + "&activite=" + this.activite + "&handicap=" + this.handicap)
                .then(response => response.json())
                .then(response => {
                    for (const row of response) {
                        this.installations.push({ libAct: row.libAct, libInst: row.equip.inst.libInst, adresse: row.equip.inst.adresse, codePostal: row.equip.inst.codePostal, libCommune: row.equip.inst.libCommune, handicap: row.equip.inst.handicap, codeInst: row.equip.inst.codeInst });
                    }
                });
            Bus.$emit('postInstallations', { installations: this.installations });
        }
    },
    template: "<v-flex xs12 sm12 md12 align-content-center><v-btn color=\"blue accent-2\" v-on:click=\"search\">Rechercher</v-btn></v-flex>",
});

Vue.component("custom-table", {
    data: function() {
        return {
            model: null,
            installations: [],
            headers: [
                { text: 'Activité', value: 'libAct' },
                { text: 'Installation', value: 'libInst' },
                { text: 'Adresse', sortable: false, value: 'adresse' },
                { text: 'Code Postal', value: 'codePostal' },
                { text: 'Commune', value: 'libCommune' },
                { text: 'Accès pour personnes à mobilité réduite', value: 'handicap' }
            ],
        }
    },
    created() {
        Bus.$on('postInstallations', (selected) => {
            this.installations = selected.installations;
        });
        Bus.$on('clear', () => {
            this.installations = [];
            this.model = null;
        });
    },
    template: "<v-data-table :headers=\"headers\" :items=\"installations\" class=\"ml-4 mr-4 elevation-1\"><template v-slot:items=\"props\"><tr><td>{{ props.item.libAct }}</td><td>{{ props.item.libInst }}</td><td class=\"installation-adresse\">{{ props.item.adresse }}</td><td>{{ props.item.codePostal }}</td><td>{{ props.item.libCommune }}</td><td class=\"text-xs-right\">{{ props.item.handicap }}</td></tr></template></v-data-table>",
});

Vue.component("custom-form", {
    data: function() {
        return {}
    },
    template: "<v-form><v-container fluid><v-layout row wrap><commune-autocomplete></commune-autocomplete><activite-autocomplete></activite-autocomplete><handicap-checkbox></handicap-checkbox><v-flex xs12 sm12 md12><button-search></button-search><button-clear></button-clear></v-flex></v-layout></v-container><custom-table></custom-table></v-form>",
});

new Vue({
    el: "#app"
});