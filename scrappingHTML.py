import os
import requests
import json
import justext


# Use a get request on every link of 'links.json' file and save the content into new files
def scrap_html():
    with open('links.json') as json_file:
        links = json.load(json_file)
        for link in links:
            data = requests.get(link)
            article_name = link.split("/")
            print(article_name)

            if not article_name[len(article_name) - 1]:
                new_file_name = "html/" + article_name[len(article_name) - 2] + ".txt"
            else:
                new_file_name = "html/" + article_name[len(article_name) - 1] + ".txt"

            new_file = open(new_file_name, "w", encoding="UTF-8")
            new_file.write(data.text)
            new_file.close()


# Use JusText extractor to only get the useful content
def text_extraction():
    file_list = os.listdir("html")
    for f in file_list:
        filename: str = 'html/' + f
        data = open(filename, "r", encoding="UTF-8", errors="ignore").read()
        paragraphs = justext.justext(data, justext.get_stoplist("French"))
        for paragraph in paragraphs:
            if not paragraph.is_boilerplate:
                new_file_name = "JT/" + f
                new_file = open(new_file_name, "w", encoding="UTF-8")
                new_file.write(paragraph.text)
                new_file.close()


scrap_html()
text_extraction()
