var canvas = document.getElementsByTagName("canvas")[0];
var interactionsMenu = document.createElement("div");
interactionsMenu.style.border = "black 1px solid";
interactionsMenu.style.width = "150px";
interactionsMenu.style.display = "inline-block";
interactionsMenu.style.marginLeft = "10px";
interactionsMenu.style.padding = "10px";

var redrawButton = document.createElement("button");
redrawButton.innerHTML = "Redraw";
redrawButton.style.width = "100%";
redrawButton.addEventListener("click", function(e) {
	e.preventDefault();
	network.redraw();
	network.fit();
});
interactionsMenu.appendChild(redrawButton);

var superconceptsButton = document.createElement("button");
superconceptsButton.innerHTML = "Highlight superconcepts";
superconceptsButton.style.width = "100%";
superconceptsButton.style.marginTop = "10px";
superconceptsButton.classList.add("nodeButton");
superconceptsButton.style.display = "none";
superconceptsButton.addEventListener("click", function(e) {
	e.preventDefault();
	console.log("Highlight superconcepts!");
	console.log(clicked);
	console.log(network);
	var clickedNode = nodes.get(clicked);
	clickedNode.color = {
		border : '#FF6347',
		background : '#FFA500',
		highlight : {
			border : '#FF4500',
			background : '#FF8C00'
		},
		hover : {
			border : '#FF4500',
			background : '#FF8C00'
		}
	}
	nodes.update(clickedNode);
	console.log(nodes);
});
interactionsMenu.appendChild(superconceptsButton);

canvas.parentNode.parentNode.parentNode.insertBefore(interactionsMenu,
		canvas.nextSiblings);

var clicked = null;

network.on("click", function(event) {
	console.log(event);
	if (event.nodes.length != 1) {
		clicked = null;
		var buttonsToHide = document.getElementsByClassName("nodeButton");
		for (var i = 0; i < buttonsToHide.length; i++) {
			buttonsToHide[i].style.display = "none";
		}
		network.redraw();
	} else {
		clicked = event.nodes[0];
		var buttonsToShow = document.getElementsByClassName("nodeButton");
		for (var i = 0; i < buttonsToShow.length; i++) {
			buttonsToShow[i].style.display = "block";
		}
	}
});