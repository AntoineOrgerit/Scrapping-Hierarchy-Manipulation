# ProjetWeb3

Projet de l'UE Web 3.0
Articles de presse

## 1. Scrapping

### Dépendances

Pour exécuter le script de scrapping il faut d'abord installer deux dépendances : 

```shell script
pip install requests
```

```shell script
pip install justext
```

Il faut obligatoirement créer deux dossier le premier nommé *html* et le second *JT*.

### Guide d'utilisation

Prenez le temps de vous inscrire sur https://allgo.inria.fr/app/nero pour avoir un TOKEN que vous devez changer sur app.py

### Exécution

Le script de scrapping à deux objectifs :
- Récupération du html de tout les liens contenus dans le fichier *links.json*
- Traitement par jusText pour récupérer le contenu utile à partir des fichiers html

Pour la récupération on utilise simplement une requête GET sur l'ensemble des liens, 
puis on créer des fichiers texte nommés avec les noms des articles.

Il suffit alors d'utiliser l'outil jusText pour lire le contenu des fichiers HTML et d'extraire et d'enregistrer le contenu utile dans un fichier.

Nous avons décider de séparer les deux étapes pour éviter d'avoir a récupérer les fichiers html plusieurs fois. 
Cela permet de gagner en efficacité si des problèmes surviennent sur la partie jusText.

### Dependances

pip install BeautifulSoup
pip install requests

## 2. Hierarchie des concepts

À partir du fichier JSON généré, l'utilisation de LatViz (https://latviz.loria.fr/) permet de générer la hiérarchie des concepts (Ganter) et d'exporter cette dernière en tant que graphe au format JSON.

## 3. Manipulation

### Dépendances

```shell script
pip install pyvis
```

```shell script
pip install networkx
```

```shell script
pip install webbrowser
```

```shell script
pip install bs4
```

### Exécution

```shell script
python visualization.py [input_filename]
```
