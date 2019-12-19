from pyvis.network import Network
import json
import webbrowser
import bs4
import os
import sys


def get_title_content(json_elem):
    """ Allows to generate a title content for a given json element json_elem.
    """
    title_content = ""
    if json_elem["Count"] > 0:
        if json_elem["Count"] > 10:
            for i in range(10):
                title_content = title_content + json_elem["Names"][i] + ", "
            title_content = title_content + "..."
        else:
            for i in range(json_elem["Count"] - 1):
                title_content = title_content + json_elem["Names"][i] + ", "
            title_content = title_content + json_elem["Names"][json_elem["Count"] - 1]
    return title_content


def get_label(node_index, extent, nodes, edges):
    """ Allows to generate a label content for a given node node_index based on its extent, FCA nodes and FCA edges.
    """
    label = ""
    for obj in extent:
        is_in_subconcept = False
        for edge in edges:
            if edge["S"]["Index"] == node_index and obj in nodes[edge["D"]["Index"]]["Ext"]["Names"]:
                is_in_subconcept = True
        if not is_in_subconcept:
            if label == "":
                label = obj
            else:
                label = label + ", " + obj
    if label == "":
        label = " "
    else:
        if len(label) > 150:
            label = label[:150]
    return label


def add_nodes_edges(net, nodes, edges):
    """ Returns the given net with added nodes.
    """
    for node in nodes:
        index = node["Index"]
        label = get_label(index, node["Ext"]["Names"], nodes, edges)
        x = node["Coordinate"]["XCoor"]
        y = node["Coordinate"]["YCoor"]
        title = "<p>Extent: " + get_title_content(node["Ext"]) + "</p><p>Intent: " + get_title_content(node["Int"]) + "</p>"
        net.add_node(index, label=label, x=x, y=y, title=title)
    for edge in edges:
        net.add_edge(edge["S"]["Index"], edge["D"]["Index"], physics=False)
    return net


def write_file(net):
    """ Allows to write the generated FCA net in a web page with the necessary options.
    """
    net.set_options("""{
      "nodes": {
        "fixed": {
          "x": true,
          "y": true
        }
      },
      "edges": {
        "color": {
          "inherit": true
        },
        "smooth": {
          "forceDirection": "none"
        }
      },
      "interaction": {
        "dragNodes": false,
        "hover": true,
        "multiselect": true
      },
      "physics": {
        "enabled": false,
        "minVelocity": 0.75
      }
    }""")
    
    net.write_html("mygraph.html")
    
    with open("mygraph.html") as inf:
        txt = inf.read()
        soup = bs4.BeautifulSoup(txt, features="lxml")
    
    script = soup.new_tag("script")
    script.attrs["type"] = "text/javascript"
    script.attrs["src"] = "./script.js"
    soup.body.append(script)
    
    with open("mygraph.html", "w") as outf:
        outf.write(str(soup))

        
def open_in_browser():
    """ Allows to open the generated file in browser.
    """
    webbrowser.open('file://' + os.path.realpath("mygraph.html"), new=2)


def main(file_name):
    """ Main function generating the FCA in a web page based on the file file_name.
    """
    with open(file_name) as json_file:
        data = json.load(json_file)
    net = Network(700, 1000)
    nodes = data[1]["Nodes"]
    edges = data[2]["Arcs"]
    net = add_nodes_edges(net, nodes, edges)
    write_file(net)
    open_in_browser()

    
if __name__ == "__main__":
    if len(sys.argv) == 1:
        main('diagram.json')
    else:
        main(sys.argv[1])
