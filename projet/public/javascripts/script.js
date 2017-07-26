/**
 *Vide le tableau
**/
function clearTable(){
	var table = document.getElementById('tablecontrevenants');
	var rows = document.getElementById("tablecontrevenants").rows.length;
	var i;
	for(i = 1; i < rows; i++){
		table.deleteRow(1);
	}
}

/**
 *Met les informations dans le tableau
**/
function displayTable(contrevenants){
	var table = document.getElementById('tablecontrevenants');
	var properties = ["_id", "proprietaire", "categorie", "etablissement", "adresse", "ville", "description", "date_infraction", "date_jugement", "montant"];
	var i, j, contrevenant, row, cell;
	for(i = 0; i < contrevenants.length; i++){
		contrevenant = contrevenants[i];
		row = document.createElement('tr');
		for(j = 0; j < properties.length; j++){
			cell = document.createElement('td');
			cell.innerHTML = contrevenant[properties[j]];
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
}

/**
 *Fonction AJAX pour afficher le tableau de contrevenants ayant commis une infraction entre deux dates
**/
function retrieveContrevenants() {
	var request = new XMLHttpRequest();
	var url = "/contrevenants?du=" + document.getElementById("form-firstdate").value + "&au=" + document.getElementById("form-seconddate").value;
	var objArray;

	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			objArray = JSON.parse(request.responseText);
			clearTable();
			displayTable(objArray);
		}
	};

	request.send();
}

/**
 *Fonction AJAX qui affiche dans le tableau les infractions d'un contrevenant. 
**/
function retrieveEtablissment() {
	var request = new XMLHttpRequest();
	var url = "/contrevenants/etablissement/" + document.getElementById("deroule").value;
	var objArray;
	
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			objArray = JSON.parse(request.responseText);
			clearTable();
			displayTable(objArray);
		}
	};

	request.send();
}