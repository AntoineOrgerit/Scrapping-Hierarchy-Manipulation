# ProjetWeb3

Projet de l'UE Web 3.0
Articles de presse

## 1. Scrapping

### Installation

Pour exécuter le script de scrapping il faut d'abord installer trois dépendances : 

```shell script
pip install requests
```

```shell script
pip install justext
```

```shell script
pip install BeautifulSoup
```

Il faut obligatoirement créer deux dossier le premier nommé *html* et le second *JT*.

Pour l'utilisation de NERO (https://allgo.inria.fr/app/nero) et donc par extension pour executer le script *app.py*,
il est nécessaire de s'inscrire et d'obtenir un token pour l'API que vous pourrez ensuite modifier dans le script.

### Exécution

Le script de scrapping à deux objectifs :
- Récupération du html de tout les liens contenus dans le fichier *links.json*
- Traitement par jusText pour récupérer le contenu utile à partir des fichiers html

Pour la récupération on utilise simplement une requête GET sur l'ensemble des liens, 
puis on créer des fichiers texte nommés avec les noms des articles.

Il suffit alors d'utiliser l'outil jusText pour lire le contenu des fichiers HTML et d'extraire et d'enregistrer le contenu utile dans un fichier.

Nous avons décider de séparer les deux étapes pour éviter d'avoir a récupérer les fichiers html plusieurs fois. 
Cela permet de gagner en efficacité si des problèmes surviennent sur la partie jusText.

Pour réaliser le scrapping utiliser la commande :

```shell script
python scrapping.py
```

On cherche ensuite à extraire des entités depuis les textes retournés par JustText, on utilise l'API de NERO 
(https://allgo.inria.fr/app/nero) et on met en forme un fichier JSON qui nous servira ensuite pour former la 
hiérarchie des concepts.

Pour réaliser l'extraction des entités utiliser la commande :
```shell script
python app.py
```