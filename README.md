# ProjetWeb3

Projet de l'UE Web 3.0

Articles de presse

## 1. Scrapping

### Dépendances

Pour exécuter le script de scrapping, il faut d'abord installer trois dépendances : 

```shell script
pip install requests
```

```shell script
pip install justext
```

```shell script
pip install BeautifulSoup
```

Il faut également créer deux dossiers : le premier nommé *html* et le second *JT*.

Pour l'utilisation de NERO (https://allgo.inria.fr/app/nero) et donc par extension pour executer le script *app.py*,
il est nécessaire de s'inscrire et d'obtenir un token pour l'API qui est à modifier dans le script.

### Exécution

Le script de scrapping à deux objectifs :
- Récupération du html de tout les liens contenus dans le fichier *links.json*
- Traitement par jusText pour récupérer le contenu utile à partir des fichiers html

Pour la récupération on utilise simplement une requête GET sur l'ensemble des liens, 
puis on créer des fichiers texte nommés avec les noms des articles.

Il suffit alors d'utiliser l'outil jusText pour lire le contenu des fichiers HTML et d'extraire et d'enregistrer le contenu utile dans un fichier.

Nous avons décider de séparer les deux étapes pour éviter d'avoir a récupérer les fichiers html plusieurs fois. 
Cela permet de gagner en efficacité si des problèmes surviennent sur la partie jusText.

Pour réaliser le scrapping, utiliser la commande suivante :

```shell script
python scrapping.py
```

On cherche ensuite à extraire des entités depuis les textes retournés par JustText, on utilise l'API de NERO 
(https://allgo.inria.fr/app/nero) et on met en forme un fichier JSON qui nous servira ensuite pour former la 
hiérarchie des concepts avec LatViz.

Pour réaliser l'extraction des entités, utiliser la commande suivante :
```shell script
python app.py
```

## 2. Hierarchie des concepts

À partir du fichier JSON généré, l'utilisation de LatViz (https://latviz.loria.fr/) permet de générer la hiérarchie des concepts (Ganter) et d'exporter cette dernière en tant que graphe au format JSON.

## 3. Manipulation

Les dépendances suivantes sont nécessaires à la génération de la vue de manipulation de la hiérarchie des concepts :

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

Le script *visualization.py* permet de générer l'interface de manipulation de la hiérarchie des concepts à partir d'un fichier JSON issu de LatViz.
Une page HTML est ouverte à l'issue de l'exécution et offre différentes fonctionnalités de manipulation à l'utilisateur.

Pour générer l'interface de manipulation, utiliser la commande suivante :
```shell script
python visualization.py [input_filename]
```
De base le fichier JSON utilisé est *diagram.json*, mais il est également possible de spécifier un autre nom de fichier par le biais de l'option *input_filename*.