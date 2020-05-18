// let's create a simple graph:
var xmlUrl = 'https://at-lab.nl/feed.wotd.xml'
var xmlParser = require('xml-js');

var $ = require('jquery');
var https = require('https');
var concat = require('concat-stream');
var HTMLParser = require('node-html-parser');

var createGraph = require('ngraph.graph');
var graph = createGraph();
var layout = require('ngraph.forcelayout')(graph);
let path = require('ngraph.path');
let pathFinder = path.aStar(graph);

graph.addNode("origin","hidden"); //Origin node where we can stick all the other things sprouting. This way the layout engine works...

https.get(xmlUrl, function(resp) {

    resp.on('error', function(err) {
      console.log('Error while reading', err);
    });

    resp.on('end', function(){
    	console.log('Finished downloading');
    	beginRender();
    	// layoutGraph();
    });

    resp.pipe(concat(function(buffer) {
      var xmlString = buffer.toString();
      var xmlJson =  xmlParser.xml2js(xmlString, {compact: true, spaces: 4});
      for (var element of xmlJson.rss.channel.item) {
      	
      	var root = $('<output>').append($.parseHTML(element.description._text));
      	// console.log(element.description._text);
      	// console.log(root);
      	
      	var topics = Array();
      	$("ul > li",root).each(function(index) {
		    var current = $(this).clone();
		    current.find('ul').remove();
		    // console.log(index + ":" + current.text().trim() );
		    topics.push(current.text().trim())
		});

		graph.beginUpdate();
		var rootNode = topics[0]; //rootNode for current topic
		graph.addNode(rootNode);
		graph.addLink("origin",rootNode)
		//Don't color the link, and don't render the origin node.

		topics.splice(0,1); //start at 0 and remove 1 element from array, permanently changes array
		for (var each of topics) {
			// console.log(each);
			graph.addNode(each);
			graph.addLink(rootNode, each);
		}
		graph.endUpdate();
      }
    }));

});





var renderGraph = require('ngraph.pixel');

var renderer;


function renderNode(node) {
	// console.log(node.id);
	if (node.data === 'hidden') return {size:0,color:0}; 

	let foundPath = pathFinder.find("origin", node.id);
	// console.log(foundPath.length);

	return {
		color: 0xFF00FF | 0,
		size: 25 - 1.5*(foundPath.length**2)
	};
}

function renderLink(link) {
	if (link.fromId == 'origin') return {fromColor: 0xFFFFFF, toColor: 0xFFFFFF};
	return {
		fromColor: 0xFFFFFF,
		toColor: 0x000000
	};
}

function layoutGraph() {
	for (var i = 0; i < 20; ++i) {
	  layout.step();
	}
}


function beginRender() {
	renderer = renderGraph(graph, {
	container: document.querySelector('.container'),
	  link: renderLink,
	  node: renderNode,
	  is3d: true,
	  clearAlpha: 0.5,
	  physics: {
	    springLength : 120,
	    springCoeff : 0.1022,
	    gravity: +1.2,
	    theta : 1.8,
	    dragCoeff : 0.015,
	    // timeStep: 0.1
	  }
	});

	renderer.on('nodeclick', function(node) {
  console.log('Clicked on ' + JSON.stringify(node));
});

}


