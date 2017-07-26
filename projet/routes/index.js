var express = require('express');
var mongodb = require('mongodb');
var db = require('./db');
var raml2html = require('raml2html');
var jsonschema = require('jsonschema');
var schemas = require('./schemas');
var router = express.Router();

/**
 *Retourne le bon chiffre selon le mois (string).
**/
function findMonth(month){
	var res;
	switch(month){
		case "janvier":
			res = "01";
			break;
		case "février":
			res = "02";
			break;
		case "mars":
			res = "03";
			break;
		case "avril":
			res = "04";
			break;
		case "mai":
			res = "05";
			break;
		case "juin":
			res = "06";
			break;
		case "juillet":
			res = "07";
			break;
		case "août":
			res = "08";
			break;
		case "septembre":
			res = "09";
			break;
		case "octobre":
			res = "10";
			break;
		case "novembre":
			res = "11";
			break;
		default:
			res = "12";
	}
	return res;
}

/**
 *Change le nom de la clé _id pour etablissement.
**/
function changeKeyId(liste){
	var i;
	for(i = 0; i < liste.length; i++){
		liste[i].etablissement = liste[i]['_id'];
		delete liste[i]._id;
	}
	return liste;
}

/**
 *Ouvre la collection inspection.
**/
function openCollection(callback){
	db.getConnection(function(err, db){ 
		db.collection('inspection', function (err, collection) {
			if (err) {
				res.sendStatus(500);
			} else {
				callback(null,collection);
			}
		});
	});
}

/**
 *Retourne une liste de contrevenants avec le nombre d'infraction commis en ordre décroissant.
**/
function getListeCount(callback){
	openCollection(function (err, collection){
		collection.aggregate([{$group : {_id: "$etablissement", count: {$sum : 1}}},
		{$sort: {"count": -1}}],function (err, listeObjet) {
			if (err) {
				res.sendStatus(500);
			} else {
				listeObjet = changeKeyId(listeObjet);
				callback(null,listeObjet);
			}
		});
	});
}

/**
 *La page d'acceuil
**/
router.get('/', function(req, res, next) {
	openCollection(function (err, collection){
		collection.distinct("etablissement", function (err, listeObjet){
			if(err) {
				res.sendStatus(500);
			} else {
				res.render('index', {liste: listeObjet});
			}
		});
	});
});

/**
 *La page RAML
**/
router.get('/doc', function(req, res, next) {
	var config = raml2html.getDefaultConfig(false);
	var onError = function (err) {
		console.log(err);
		res.sendStatus(500);
	};
	var onSuccess = function(html) {
		res.send(html);
	};
	raml2html.render("routes/doc/index.raml", config).then(onSuccess, onError);
});

/**
 *Affiche la liste des contrevenants dont la date d'infraction est entre du à au
**/
router.get('/contrevenants', function(req, res, next) {
	var listeRes = [], splitDate, dateIso, i;
	openCollection(function (err, collection){
		collection.find().toArray(function (err, listeObjet) {
			if (err) {
				res.sendStatus(500);
			} else {
				//convertit les dates en ISO 8601 et s'ils se trouvent entre du et au, on met l'objet dans listeRes.
				for(i=0; i<listeObjet.length; i++){
					splitDate = (listeObjet[i].date_infraction).split(" ");
					splitDate[1] = findMonth(splitDate[1]);
					dateIso = splitDate[2].concat("-",splitDate[1],"-",splitDate[0]);
					if(dateIso <= req.query.au && dateIso >= req.query.du){
						listeRes.push(listeObjet[i]);
					}
				}
				res.json(listeRes);
			}
		});
	});
});

/**
 *Affiche les infractions d'un contrevenant
**/
router.get('/contrevenants/etablissement/:etablissement', function(req, res, next){
	openCollection(function (err, collection){
		collection.find({etablissement: req.params.etablissement}).toArray(function (err, listeObjet) {
			if (err) {
				res.sendStatus(500);
			} else if (listeObjet.length === 0) {
				res.sendStatus(404);
			} else {
				res.json(listeObjet);
			}
		});
	});
});

/**
 *Retourne la liste en json.
**/
router.get('/contrevenants/nombres-infractions/json', function(req, res, next) {
	getListeCount(function(err, data) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.json(data);
		}
	});
});

/**
 *Retourne la liste en xml.
**/
router.get('/contrevenants/nombres-infractions/xml', function(req, res, next) {
	getListeCount(function(err, data) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.header("Content-Type", "application/xml");
			res.render('xml', {liste_etablissement: data});
		}
	});
});

/**
 *Formulaire avec les champs que l'on peut modifier
**/
router.get('/contrevenants-form/:id', function(req, res, next) {
	openCollection(function (err, collection){
		collection.find({_id: new mongodb.ObjectId(req.params.id)}).toArray(function (err, objet) {
			if (err) {
				res.sendStatus(500);
			} else if (result.result.n == 0) {
				res.sendStatus(404);
			} else {
				res.render('form', {etablissement: objet});
			}
		});
	});
});

/**
 *Effectue la modification.
**/
router.put('/contrevenants-form/:id', function(req, res, next) {
	var result = jsonschema.validate(req.body, schemas.updateContrevenant);
	if (result.errors.length > 0) {
		res.status(400).json(result);
	} else {
		openCollection(function (err, collection){
			collection.update({_id: new mongodb.ObjectId(req.params.id)}, {$set:req.body}, function(err, result) {
				if (err) {
					res.sendStatus(500);
				} else if (result.result.n === 0) {
					res.sendStatus(404);
				} else {
					res.send(200);
				}
			});
		});
	}
});

module.exports = router;
