module.exports = {
	updateContrevenant: {
		"type": "object",
		"required": true,
		"properties": {
			"proprietaire": {
				"type": "string",
				"required": false
			},
			"categorie": {
				"type": "string",
				"required": false
			},
			"etablissement": {
				"type": "string",
				"required": false
			},
			"adresse": {
				"type": "string",
				"required": false
			},
			"ville": {
				"type": "string",
				"required": false
			},
			"description": {
				"type": "string",
				"required": false
			},
			"date_infraction": {
				"type": "string",
				"required": false
			},
			"date_jugement": {
				"type": "string",
				"required": false
			},
			"montant": {
				"type": "string",
				"required": false
			}
		}
	}
};