//modules requis
var http = require("http");
var parser = require('xml2json');
var mongo = require("mongodb");
var cron = require('node-cron');
var iconv = require("iconv-lite");

//pars le serveur
var server = new mongo.Server("localhost", 27017);

//pars la base de données inf4375
var db = new mongo.Db("inf4375", server, {safe:true});

//lien où se trouve les données de contrevenants
var link = {
		hostname: "donnees.ville.montreal.qc.ca",
        path: '/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants'
};

//importe les données automatiquement à minuit
cron.schedule('0 0 * * *', function(){
	//cherche les données à l'adresse link
	var req = http.get(link, function(res) {
		var xml = '';
		res.on('data', function(chunk) {
			xml += iconv.decode(chunk, "ISO-8859-1");
		});
		res.on('end', function() {
			//convertit le xml en json
			var jsonString = parser.toJson(xml);
			var objJson = JSON.parse(jsonString);
			//ouvre la base de données
			db.open(function (err, db) {
				if (err) {
					console.log("Impossible d'ouvrir une connexion sur la base de données.", err);
				} else {
					//ouvre la collection inspection
					db.collection("inspection", function (err, collection) {
						if (err) {
							console.log("Erreur avec la base de données.", err);
							db.close();
						} else {
							//vide la collection
							collection.remove({});
							//insère les nouvelles données dans la collection
							collection.insert(objJson.contrevenants.contrevenant, function (err, result) {
								if (err) {
									console.log("Erreur lors de l'insertion.", err);
								}
								console.log("Contenu stocké dans la collection inspection de la base de données inf4375");
								db.close();
							});
						}
					});
				}	
			});
		})
	}).on('error', function (e) {
		console.log('problem with request: ' + e.message);
	});
});