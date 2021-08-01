# Objectif
Implémenter et déployer une API REST qui justifie un texte passé en paramètre.

## Contraintes

- La longueur des lignes du texte justifié doit être de 80 caractères.
- L’endpoint doit être de la forme /api/justify et doit retourner un texte justifié suite à une requête POST avec un body de ContentType text/plain
- L’api doit utiliser un mécanisme d’authentification via token unique. En utilisant par exemple une endpoint api/token qui retourne un token d’une requête - POST avec un json body {"email": "foo@bar.com"}.
- Il doit y avoir un rate limit par token pour l’endpoint /api/justify, fixé à 80 000 mots par jour, si il y en a plus dans la journée il faut alors renvoyer une erreur 402 Payment Required.
- Le code doit être déployé sur un url ou une ip public
- Le code doit être rendu sur github
- Langage : Nodejs
- **PAS** d’usage de bibliothèque externe pour la justification

## Bonus
- Les tests, le coverage
- La lisibilité
- La documentation

# Analyse de l'algo

## TextTransform
Un utilitaire contenant une fonction qui reduit le nombre de mots par ligne à moins de 80.

## TextAligmentService
Une classe contenant la fonction qui permet de justifier le text
