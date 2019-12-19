/** ----- UI ELEMENTS ----- * */

var canvas;
var interactionsMenu;

/**
 * Allows to initialize the left side UI of the web page.
 */
function initializeUI() {
	// retrieving canvas element
	canvas = document.getElementsByTagName("canvas")[0];
	// initializing interaction menu
	interactionsMenu = document.createElement("div");
	interactionsMenu.style.border = "black 1px solid";
	interactionsMenu.style.width = "400px";
	interactionsMenu.style.display = "inline-block";
	interactionsMenu.style.marginLeft = "10px";
	interactionsMenu.style.padding = "10px";
	// adding elements to interaction
	addButtons();
	addInfos();
	// adding interaction menu to the web page
	canvas.parentNode.parentNode.parentNode.insertBefore(interactionsMenu,
			canvas.nextSiblings);
}

/**
 * Allows to add the different buttons of the UI.
 */
function addButtons() {
	addButtonToMenu("Redraw", false, fit);
	addButtonToMenu("Highlight superconcepts", true, highlightSuperconcepts);
	addButtonToMenu("Highligh subconcepts", true, highlightSubConcepts)
}

/**
 * Allows to add the informations box concerning a concept to the UI.
 */
function addInfos() {
	var infos = document.createElement("div");
	infos.innerHTML = "<p style='margin: 1em 0 0 0; font-weight: bold'>Extent:</p><p id='extent_data' style='margin: 0 0 0 0'></p><p style='margin: 1em 0 0 0; font-weight: bold'>Intent:</p><p id='intent_data' style='margin: 0 0 0 0'></p>";
	infos.classList.add("nodeInteractionElement");
	infos.style.display = "none";
	interactionsMenu.appendChild(infos);
}

/**
 * Allows to add a button to the UI.
 * 
 * @param title
 *            the text to appear in the button
 * @param isNodeButton
 *            a boolean indicating if the button is a specific action linked to
 *            a node selection in the graph
 * @param onClick
 *            the action to perform on click of the button
 */
function addButtonToMenu(title, isNodeButton, onClick) {
	if (title != null && typeof title == "string") {
		var button = document.createElement("button");
		button.innerHTML = title;
		button.style.width = "100%";
		// adding styles if necessary
		if (isNodeButton != null && isNodeButton == true) {
			button.style.marginTop = "10px";
			button.classList.add("nodeInteractionElement");
			button.style.display = "none";
		}
		// adding action if provided
		if (onClick != null && typeof onClick == "function") {
			button.addEventListener("click", onClick);
		}
		interactionsMenu.appendChild(button);
	}
}

/** ----- COLORS HANDLING ----- * */

// color for node highlight
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

// default node color
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

// color for edge highlight
var highlightColorsEdge = {
	color : "#FF4500",
	highlight : '#FF4500',
	hover : '#FF4500'
};

// default edge color
var defaultColorsEdge = {
	color : "#6DA5F0",
	highlight : "#2B7CE9",
	hover : "#2B7CE9"
};

/**
 * Allows to color all elements of the FCA representation to its original
 * values.
 */
function colorAllDefault() {
	// coloring nodes
	for (var i = 0; i < network.body.nodeIndices.length; i++) {
		var node = nodes.get(i);
		node.color = defaultColorsNode;
		nodes.update(node);
	}
	// coloring edges
	for (var j = 0; j < network.body.edgeIndices.length; j++) {
		var edge = edges.get(network.body.edgeIndices[j]);
		edge.color = defaultColorsEdge;
		edges.update(edge);
	}
	network.redraw();
}

/** ----- INFOS HANDLING ----- * */

/**
 * Allows to clear the informations box concerning a concept.
 */
function clearInfos() {
	document.getElementById("extent_data").innerText = "";
	document.getElementById("intent_data").innerText = "";
}

/**
 * Allows to insert the informations box concerning a concept.
 * 
 * @param nodeId
 *            the ID of the node for which to insert the informations
 */
function insertInfos(nodeId) {
	var node_title = nodes.get(nodeId).title;
	document.getElementById("extent_data").innerText = node_title
			.match(new RegExp("Extent: (.*)</p><p>"))[1];
	document.getElementById("intent_data").innerText = node_title
			.match(new RegExp("Intent: (.*)</p>"))[1];
}

/** ----- BUTTONS ACTIONS HANDLING ----- * */

/**
 * Allows to fit the FCA back to its original dimensions.
 * 
 * @param e
 *            the event object at the origin of the action
 */
function fit(e) {
	e.preventDefault();
	network.fit();
}

/**
 * Allows to highlight the superconcepts of a selected node.
 * 
 * @param e
 *            the event object at the origin of the action
 */
function highlightSuperconcepts(e) {
	e.preventDefault();
	colorAllDefault();
	updateConcepts(clicked, true);
	network.redraw();
}

/**
 * Allows to highlight the subconcepts of a selected node.
 * 
 * @param e
 *            the event object at the origin of the action
 */
function highlightSubConcepts(e) {
	e.preventDefault();
	colorAllDefault();
	updateConcepts(clicked, false);
	network.redraw();
}

/**
 * Allows to update the concepts representation in the UI.
 * 
 * @param nodeId
 *            the ID of the selected node from which to update the concepts
 * @param shouldBeSuperconcepts
 *            true if the concepts representation to update have to be
 *            superconcepts, false if they have to be subconcepts
 */
function updateConcepts(nodeId, shouldBeSuperconcepts) {
	var node = nodes.get(nodeId);
	node.color = highlightColorsNode;
	nodes.update(node);
	// checking each edge of the node
	var nodeEdges = network.body.nodes[nodeId].edges;
	nodeEdges.forEach(function(nodeEdge) {
		var edge = edges.get(nodeEdge.id);
		// updating superconcepts or subconcepts
		if (shouldBeSuperconcepts) {
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

/** ----- FCA HANDLING ----- */

var clicked = null;

// handling click events on the FCA representation
network.on("click", function(event) {
	// if we are not click only on node, update all to base settings
	if (event.nodes.length != 1) {
		clicked = null;
		var buttonsToHide = document
				.getElementsByClassName("nodeInteractionElement");
		for (var i = 0; i < buttonsToHide.length; i++) {
			buttonsToHide[i].style.display = "none";
		}
		clearInfos();
		colorAllDefault();
	} else {
		// updating clicked node and executing depending actions
		clicked = event.nodes[0];
		insertInfos(clicked);
		var buttonsToShow = document
				.getElementsByClassName("nodeInteractionElement");
		for (var i = 0; i < buttonsToShow.length; i++) {
			buttonsToShow[i].style.display = "block";
		}
	}
});

/** ----- EXECUTE BASE CODE ----- * */

initializeUI();
colorAllDefault();