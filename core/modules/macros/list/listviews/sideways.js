/*\
title: $:/core/modules/macros/list/listviews/sideways.js
type: application/javascript
module-type: listview

Views the list as a sideways linear sequence

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

function SidewaysListView(listMacro) {
	this.listMacro = listMacro;
	// Prepare the list frame
	var listFrame = this.listMacro.listFrame,
		listFrameDomNode = listFrame.domNode;
	// Prepare any list elements
	for(var t=0; t<this.listMacro.list.length; t++) {
		var index = this.listMacro.findListElementByTitle(0,this.listMacro.list[t]);
		if(index !== undefined) {
			var listElement = listFrame.children[index];
			$tw.utils.setStyle(listElement.domNode,[
				{verticalAlign: "top"},
				{display: "inline-block"}
			]);
		}
	}
}

SidewaysListView.prototype.navigateTo = function(historyInfo) {
	var listElementIndex = this.listMacro.findListElementByTitle(0,historyInfo.title),
		listElementNode = this.listMacro.listFrame.children[listElementIndex],
		targetElement = listElementNode.domNode;
	// Scroll the node into view
	var scrollEvent = document.createEvent("Event");
	scrollEvent.initEvent("tw-scroll",true,true);
	targetElement.dispatchEvent(scrollEvent);
};

SidewaysListView.prototype.insert = function(index) {
	var listElementNode = this.listMacro.listFrame.children[index],
		targetElement = listElementNode.domNode;
	// Set up the initial position of the element
	$tw.utils.setStyle(targetElement,[
		{verticalAlign: "top"},
		{display: "inline-block"},
		{transition: "none"},
		{opacity: "0.0"}
	]);
	var	currWidth = targetElement.offsetWidth + parseInt(window.getComputedStyle(targetElement).marginLeft,10);
	$tw.utils.setStyle(targetElement,[
		{marginRight: (-currWidth) + "px"}
	]);
	$tw.utils.forceLayout(targetElement);
	// Transition to the final position
	$tw.utils.setStyle(targetElement,[
		{transition: "opacity " + $tw.config.preferences.animationDurationMs + " ease-out, " +
					"margin-right " + $tw.config.preferences.animationDurationMs + " ease-in-out"},
		{opacity: "1.0"},
		{marginRight: ""}
	]);
};

SidewaysListView.prototype.remove = function(index) {
	var listElementNode = this.listMacro.listFrame.children[index],
		targetElement = listElementNode.domNode,
		currWidth = targetElement.offsetWidth + parseInt(window.getComputedStyle(targetElement).marginLeft,10);
	// Attach an event handler for the end of the transition
	targetElement.addEventListener($tw.utils.convertEventName("transitionEnd"),function(event) {
		if(targetElement.parentNode) {
			targetElement.parentNode.removeChild(targetElement);
		}
	},false);
	// Animate the closure
	$tw.utils.setStyle(targetElement,[
		{transition: ""},
		{opacity: "1.0"},
		{marginRight: "0px"}
	]);
	$tw.utils.forceLayout(targetElement);
	$tw.utils.setStyle(targetElement,[
		{transition: "opacity " + $tw.config.preferences.animationDurationMs + " ease-out, " +
					"margin-right " + $tw.config.preferences.animationDurationMs + " ease-in-out"},
		{opacity: "0.0"},
		{marginRight: (-currWidth) + "px"}
	]);
	// Returning true causes the DOM node not to be deleted
	return true;
};

exports.sideways = SidewaysListView;

})();
