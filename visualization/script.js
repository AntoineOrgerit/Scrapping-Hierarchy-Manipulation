var canvas;
var interactionsMenu;

function initializeUI() {
	canvas = document.getElementsByTagName("canvas")[0];
	interactionsMenu = document.createElement("div");
	interactionsMenu.style.border = "black 1px solid";
	interactionsMenu.style.width = "150px";
	interactionsMenu.style.display = "inline-block";
	interactionsMenu.style.marginLeft = "10px";
	interactionsMenu.style.padding = "10px";
	addButtons();
	canvas.parentNode.parentNode.parentNode.insertBefore(interactionsMenu,
			canvas.nextSiblings);
}

function addButtons() {
	addButtonToMenu("Redraw", false, redraw);
	addButtonToMenu("Highlight superconcepts", true, highlightSuperconcepts);
	addButtonToMenu("Highligh subconcepts", true, highlightSubConcepts)
}

function addButtonToMenu(title, isNodeButton, onClick) {
	if (title != null && typeof title == "string") {
		var button = document.createElement("button");
		button.innerHTML = title;
		button.style.width = "100%";
		if (isNodeButton != null && isNodeButton == true) {
			button.style.marginTop = "10px";
			button.classList.add("nodeButton");
			button.style.display = "none";
		}
		if (onClick != null && typeof onClick == "function") {
			button.addEventListener("click", onClick);
		}
		interactionsMenu.appendChild(button);
	}
}


// colors

var highlightColorsNode = {
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
	};

var defaultColorsNode = {
		border : '#3683EA',
		background : '#97C2FC',
		highlight : {
			border : '#2B7CE9',
			background : '#D2E5FF'
		},
		hover : {
			border : '#2B7CE9',
			background : '#D2E5FF'
		}
	};

var highlightColorsEdge = {
		color : "#FF4500",
		highlight : '#FF4500',
		hover : '#FF4500'
};

var defaultColorsEdge = {
		color : "#6DA5F0",
		highlight : "#2B7CE9",
		hover : "#2B7CE9"
};

function colorAllDefault() {
	for (var i=0; i<network.body.nodeIndices.length; i++) {
		var node = nodes.get(i);
		node.color = defaultColorsNode;
		nodes.update(node);
	}
	for (var j=0; j<network.body.edgeIndices.length; j++) {
		var edge = edges.get(network.body.edgeIndices[j]);
		edge.color = defaultColorsEdge;
		edges.update(edge);
	}
	network.redraw();
}


// buttons actions

function redraw(e) {
	e.preventDefault();
	network.fit();
}

function highlightSuperconcepts(e) {
	e.preventDefault();
	colorAllDefault();
	updateConcepts(clicked, true);
	network.redraw();
}

function highlightSubConcepts(e) {
	e.preventDefault();
	colorAllDefault();
	updateConcepts(clicked, false);
	network.redraw();
}

function updateConcepts(nodeId, shouldBeSuperconcepts) {
	var node = nodes.get(nodeId);
	node.color = highlightColorsNode;
	nodes.update(node);
	edges.forEach(function(edge) {
		if(shouldBeSuperconcepts) {
			if (edge.to == nodeId) {
				edge.color = highlightColorsEdge;
				edges.update(edge);
				updateConcepts(edge.from, shouldBeSuperconcepts);
			}
		} else {
			if (edge.from == nodeId) {
				edge.color = highlightColorsEdge;
				edges.update(edge);
				updateConcepts(edge.to, shouldBeSuperconcepts);
			}
		}
	});
}

// general launch

initializeUI();

colorAllDefault();

var clicked = null;

network.on("click", function(event) {
	console.log(event);
	if (event.nodes.length != 1) {
		clicked = null;
		var buttonsToHide = document.getElementsByClassName("nodeButton");
		for (var i = 0; i < buttonsToHide.length; i++) {
			buttonsToHide[i].style.display = "none";
		}
		colorAllDefault();
	} else {
		clicked = event.nodes[0];
		var buttonsToShow = document.getElementsByClassName("nodeButton");
		for (var i = 0; i < buttonsToShow.length; i++) {
			buttonsToShow[i].style.display = "block";
		}
	}
});