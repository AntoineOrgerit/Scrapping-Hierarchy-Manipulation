from pyvis.network import Network
import json

def getTitleContent(json_elem):
    title_content = ""
    if json_elem["Count"] > 0:
        if json_elem["Count"] > 10:
            for i in range(10):
                title_content = title_content + json_elem["Names"][i] + ", "
            title_content = title_content + "..."
        else:
            for i in range(json_elem["Count"] - 2):
                title_content = title_content + json_elem["Names"][i] + ", "
            title_content = title_content + json_elem["Names"][json_elem["Count"] - 1]
    return title_content


with open('diagram.json') as json_file:
    data = json.load(json_file)
    
    net = Network(800, 800)
    nodes = data[1]["Nodes"]
    edges = data[2]["Arcs"]
    
    for node in nodes:
        #print(node)
        index = node["Index"]
        
        label = index
        if node["Ext"]["Count"] == 1:
            label = node["Ext"]["Names"][0]
        
        x = node["Coordinate"]["XCoor"]
        y = node["Coordinate"]["YCoor"]
        
        title = "<p>Extent: " + getTitleContent(node["Ext"]) + "</p><p>Intent: " + getTitleContent(node["Int"]) + "</p>"
        
        net.add_node(index, label=label, x=x, y=y, title=title)
    
    for edge in edges:
        #print(edge)
        net.add_edge(edge["S"]["Index"], edge["D"]["Index"], physics=False)
    
    net.toggle_drag_nodes(False)
    net.show("mygraph.html")
