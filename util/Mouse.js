/**
	This file provides high level mechanisms for mouse event listeners
	as well as abstracting away browser differences.
**/
define(["util/PointerLock"], function(PointerLock) {
	//Listeners for mouse down and mouse up
	//Index 0 is left, 1 is right and 2 is middle
	var downListeners = [[], [], []];
	var upListeners = [[], [], []];
	//Interval IDs used for clearInterval
	var intervalIds = [];
	
	var downListener = function(e) {
		//If we're not currently locked we should ignore the event
		if(!PointerLock.pointerLockElement()) return;
		//Call listeners waiting on the down event on this mouse button
		downListeners[e.which-1].forEach(function(element) {
			//If an interval is specified we should call the listener continuously
			if(element.interval !== undefined) {
				var intervalID = setInterval(element.callback, element.interval);
				intervalIds[element.id] = intervalID;
			}
			element.callback();
		});
	};
	
	var upListener = function(e) {
		if(!PointerLock.pointerLockElement()) return;
		upListeners[e.which-1].forEach(function(element) {
			//If we're doing a continuous call from a setInterval
			if(intervalIds[element.id] !== "undefined") {
				clearInterval(intervalIds[element.id]);
				delete intervalIds[element.id];
			}
			element.callback();
		});
	};
	
	document.addEventListener("mousedown", downListener, false);
	document.addEventListener("mouseup", upListener, false);

	var stringToWhich = {
		left: 0,
		middle: 1,
		right: 2
	};
	
	var id = 0;
	return {
		on: function(which, down, up, cont) {
			downListeners[stringToWhich[which]].push({
				callback: down,
				interval: cont,
				id: id
			});
			
			upListeners[stringToWhich[which]].push({
				callback: up,
				id: id
			});
			++id;
		}
	};
});