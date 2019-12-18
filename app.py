# -*- coding: utf-8 -*-
import os
import json
import time
import requests
from bs4 import BeautifulSoup

#Obtenir son propre token en s'inscrivant sur le site de Nero
token = "45ddf7ec81cd816d7a5db52970398cb9"

# requete POST qui permet d'avoir un identidaint de l'url https://allgo.inria.fr/api/v1/jobs/ID
def first_request(file_name):
    cmd = "curl -H 'Authorization: Token token={0}' -X POST -F job[webapp_id]=2 -F job[param]="" -F job[queue]=standard -F files[0]=@JT/{1} https://allgo.inria.fr/api/v1/jobs".format(token, file_name)
    output = os.popen(cmd).read()
    json_output = json.loads(output)
    identifiant = json_output['id']
    return identifiant

# requete GET qui permet d'avoir l'url traité par Nero https://allgo.inria.fr/datastore/667/2/example_nero.txt
def second_request(id, filename):
    cmd = "curl -H 'Authorization: Token token={0}' -X GET https://allgo.inria.fr/api/v1/jobs/{1}".format(token, id)
    output = os.popen(cmd).read()
    json_output = json.loads(output)

    filename = filename[:-4] #pour enlever le .txt a la fin
    nero = "{0}_nero.txt".format(filename) #et avoir filename_nero.txt
    url_nero = json_output[str(id)][nero]
    print(json_output)
    return url_nero

#Lecture des fichiers JT

# JT = os.listdir("JT")
JT = ["www.lefigaro.fr.txt", "voiture-a-hydrogene-un-record-de-distance-et-un-debut-de-filiere-industrielle_6020706_3234.html.txt", "you-and-mr-jones-le-groupe-de-brandtech-de-david-jones-devient-une-licorne-20191210.txt"] # à utiliser pendant les tests

entitees = ["org", "time", "fonc", "pers"] # On définit nos entitées

# Le fichier Json
jsonFile = [] # [ firstObject ,secondObject ]
firstObject = {}
secondObject = {}
secondObject["Data"] = []

# fct qui permet de determiner l'indicateur de chaque attributs
def Indicateurs(attrX):
    Inds = []
    i = 0
    for attributs in firstObject["Params"]["AttrNames"]:
        # print(attributs, attrA)
        if attributs in attrX:
            Inds.append(i)
        i += 1
    return Inds

for filename in JT:
    
    objet = [filename]
    myAttr = []
    
    id = first_request(filename)
    time.sleep(5)
    #Traitement avec NERO
    url = second_request(id, filename) # return url_nero
    data = requests.get(url)
    html_doc = data.text #contenu html de la requete ex: <org> Macron </org> <time>en deux mille vingt-deux </time>
    # print(html)
    #Traitement avec BeautifulSoup pour extraire les objets et les attributs
    soup = BeautifulSoup(html_doc, 'html.parser')
    for e in entitees:
        attributes = soup.find_all(e)
        for attr in attributes:
            if attr.name not in myAttr:
                myAttr.append(str(attr.name))
            
            if attr.get_text() not in myAttr:
                myAttr.append(str(attr.get_text()))
    
    #Construction du JSON adapté à Lattice Editor
    
    print(objet)
    print(myAttr)
    # premiere insertion
    if not bool(firstObject):
        firstObject["ObjNames"] = objet
        firstObject["Params"] = { "AttrNames" : myAttr}
    else:
        #enrichissement du json
        firstObject["ObjNames"].append(objet)
        #Ajout des attributs
        for attr2 in myAttr:
            if attr2 not in firstObject["Params"]["AttrNames"]:
                firstObject["Params"]["AttrNames"].append(attr2)
    
    inds = Indicateurs(myAttr)
    count = len(inds)
    print(count)
    secondObject["Data"].append({"Count": len(inds), "Inds": inds})

jsonFile.append(firstObject)
Count = len(secondObject["Data"])
secondObject["Count"] = Count
jsonFile.append(secondObject)

# print(jsonFile)
with open("jsonResult.json", "w", encoding="UTF-8") as outfile:
    json.dump(jsonFile, outfile)
