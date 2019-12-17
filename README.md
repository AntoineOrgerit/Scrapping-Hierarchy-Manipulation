# ProjetWeb3

Projet de l'UE Web 3.0
Articles de presse

## 1. Scrapping

### Installation

Pour exécuter le script de scrapping il faut d'abord installer deux dépendances : 

```shell script
pip install requests
```

```shell script
pip install justext
```

Il faut obligatoirement créer deux dossier le premier nommé *html* et le second *JT*.

### Exécution

Le script de scrapping à deux objectifs :
- Récupération du html de tout les liens contenus dans le fichier *links.json*
- Traitement par jusText pour récupérer le contenu utile à partir des fichiers html

Pour la récupération on utilise simplement une requête GET sur l'ensemble des liens, 
puis on créer des fichiers texte nommés avec les noms des articles.

Il suffit alors d'utiliser l'outil jusText pour lire le contenu des fichiers HTML et d'extraire et d'enregistrer le contenu utile dans un fichier.

Nous avons décider de séparer les deux étapes pour éviter d'avoir a récupérer les fichiers html plusieurs fois. 
Cela permet de gagner en efficacité si des problèmes surviennent sur la partie jusText.