				INF4375 - Paragdimes des échanges Internet - Projet de session - Automne 2016
				
Contact:
Nom: Sophia Tran
Code Permanent: TRAS26589201
Email: sophiatran92@outlook.com

Description:
Le projet consiste à récupérer les données sur l'inspection des aliments - contrevenants de la Ville de Montréal
(http://donnees.ville.montreal.qc.ca/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml)
puis offrir des services à partir de ces données. Ces données sont les informations sur les établissements ayant reçu des constats d'infractions
lors d'inspections alimentaires.

Technologies requis:
- Node.js 6.5 ou plus
- express.js 4 ou plus
- MongoDB 3.2 ou plus
- HTML5

Mode d'utilisation:

A1:
Pour récupérer les données du site de la ville de Montréal, il faut aller dans le dossier tpinf4375 sur la console et avec mongodb démarré, 
écrire node xmlgetter.js.

A2:
Les données seront récupérées automatiquement à chaque jour à minuit.

Pour utiliser les services REST, dans la console, allez dans tpinf4375/projet et tapez npm start.

A3:
Vous pouvez accéder à la documentation RAML sur http://localhost:3000/doc

A4:
Un service REST permet d'obtenir la liste de contrevenants ayant commis une ou plusieurs infractions entre deux dates spécifiées en
paramètres selon le format ISO 8601. La liste retournée sera en format JSON. 
ex: http://localhost:3000/contrevenants?du=2014-01-02&au=2015-10-12

A5:
Sur la page d'acceuil (http://localhost:3000/ ), il y a un formulaire qui permet de faire la même chose en A4 sauf que la liste sera affichée
dans un tableau.

A6:
Sur la page d'acceuil (http://localhost:3000/ ), il y a une liste déroulante qui permet d'afficher dans un tableau toutes les infractions
commis par le contrevenant sélectionné.

C1:
Un service REST permet de recevoir une liste de contrevenants avec le nombres d'infractions commis par chacun d'entre eux. Cette liste sera en
ordre décroissant et en format JSON. Vous pouvez l'accéder sur  http://localhost:3000/nombres-infractions/json

C2:
Un autre service fait la même chose qu'en C1 mais retourne la liste en format XML. Elle est sur  http://localhost:3000/nombre-infraction/xml

D1:
Vous pouvez modifier l'état d'un contrevenant en allant sur http://localhost:3000/contrevenants-form/:id où :id est le _id du contrevenant.
Il y aura un formulaire où vous pouvez changer les champs que vous souhaitez et l'enregistrer.