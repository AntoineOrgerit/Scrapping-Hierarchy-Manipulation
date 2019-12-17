from pyvis.network import Network
import json
import webbrowser
import bs4
import os


def getTitleContent(json_elem):
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


with open('diagram.json') as json_file:
    data = json.load(json_file)
    
    net = Network(800, 800)
    nodes = data[1]["Nodes"]
    edges = data[2]["Arcs"]
    
    for node in nodes:
        # print(node)
        index = node["Index"]
        
        label = index
        if node["Ext"]["Count"] == 1:
            label = node["Ext"]["Names"][0]
        
        x = node["Coordinate"]["XCoor"]
        y = node["Coordinate"]["YCoor"]
        
        title = "<p>Extent: " + getTitleContent(node["Ext"]) + "</p><p>Intent: " + getTitleContent(node["Int"]) + "</p>"
        
        net.add_node(index, label=label, x=x, y=y, title=title)
    
    for edge in edges:
        # print(edge)
        net.add_edge(edge["S"]["Index"], edge["D"]["Index"], physics=False)
    
    net.toggle_drag_nodes(False)
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
        "multiselect": true,
        "navigationButtons": true
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
    
    webbrowser.open('file://' + os.path.realpath("mygraph.html"), new=2)
