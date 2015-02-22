/* Modified from... */
/************************************************************************************************************
	Textarea maxlength
	Copyright (C) November 2005  DTHMLGoodies.com, Alf Magne Kalleland

	This library is free software; you can redistribute it and/or
	modify it under the terms of the GNU Lesser General Public
	License as published by the Free Software Foundation; either
	version 2.1 of the License, or (at your option) any later version.

	This library is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public
	License along with this library; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

	Dhtmlgoodies.com., hereby disclaims all copyright interest in this script
	written by Alf Magne Kalleland.

	Alf Magne Kalleland, 2010
	Owner of DHTMLgoodies.com

	************************************************************************************************************/


	/* Variables to modify for customization */
	// Adapt for grid!
	var boxSizeArray = [4,4,4,3,7]; // Array indicating how many items there's room for in the different lists
	
	var  verticalSpaceBetweenListItems = 3 // pixels between <li>'s; smae value or higher as margin bottom in CSS

	var indicateDestinationByUseOfArrow = false;

	var cloneSourceItems = false; // for copying instead of cutting

	var cloneAllowDuplicates = false; // if cloning, allows multiple instances inside a small box


	/* Internal use variables */
	var dragDropTopContainer = false;
	var dragTimer = -1;
	var dragContentObj = false;
	var contentToBeDragged = false; // Reference to dragged <li>
	var contentToBeDragged_src = false; // Reference to parent before drag
	var contentToBeDragged_next = false; // Reference to next sibling
	var destinationObj = false; // Reference to <ul> or <li> where dropped
	var dragDropIndicator = false; // Reference to small arrow indicating where will be dropped
	var ulPositionArray = newArray();
	var mouseoverObj = false; // Reference to highlighted <div>

	var MSIE = navigator.userAgent.indexOf('MSIE') >= 0 ? true : false; // Whether internet explorer?
	var navigatorVersion = navigator.appVersion.replace(/.*?MSIE (\d\.\d).*/g,'$1')/1;

	// Position of small arrow
	var arrow_offsetX = -5;
	var arrow_offsetY = 0;

	if (!MSIE || navigatorVersion > 6) {
		// Firefox
		arrow_offsetX = -6;
		arrow_offsetY = -13;
	}

	var indicateDestinationBox = false;

	function getTopPos(inputObj) {
		var returnValue = inputObj.offsetTop;
		while((inputObj = inputObj.offsetParent) != null) {
			if (inputObj.tagName != 'HTML') returnValue += inputObj.offsetTop;
		}
		return returnValue;
	}

	function getLeftPos(inputObj) {
		var returnValue = inputObj.offsetLeft;
		while((inputObj = inputObj.offsetParent) != null) {
			if (inputObj.tagName != 'HTML') returnValue += inputObj.offsetLeft;
		}
		return returnValue;
	}

	function cancelEvent() {
		return false;
	}

	// Mouse button is pressed down on a <li>
	function initDrag(e) {
		if (document.all) e = event;
		var st = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		var sl = Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);

		dragTimer = 0;
		dragContentObj.style.left = e.clientX + sl + 'px';
		dragContentObj.style.top = e.clientY + st + 'px';
		contentToBeDragged = this;
		contentToBeDragged_src = this.parentNode;
		contentToBeDragged_next = false;
		if (this.nextSibling) {
			contentToBeDragged_next = this.nextSibling;
			if (!this.tagName && contentToBeDragged_next.nextSibling)
				contentToBeDragged_next = contentToBeDragged_next.nextSibling;
		}
		timerDrag();
		return false;
	}

	function timerDrag() {
		if (dragTimer >=0 && dragTimer < 10) {
			dragTimer++;
			setTimeout('timerDrag()', 10);
			return;
		}

		// Otherwise dragTimer == 10

		// Cloning! Maybe this would go better in initDrag?
		if (cloneSourceItems && contentToBeDragged.parentNode.id=='allItems') {
			newitem = contentToBeDragged.cloneNode(true);
			newItem.onmousedown = contentToBeDragged.onmousedown;
			contentToBeDragged = newItem;
		}
		dragContentObj.style.display='block';
		dragContentObj.appendChild(contentToBeDragged);
	}

	function moveDragContent(e) {
		if (dragTimer < 10) {
			if (contentToBeDragged) {
				if (contentToBeDragged_next) {
					contentToBeDragged_src.insertBefore(contentToBeDragged, contentToBeDragged_next);
				} else {

				}
			}
		}
	}


	/* Get array of classes and change when you're taking them (part of the struct) */

	/* Matt's unanswered questions:
		- What's offsetTop, offsetLeft, and offsetParent?
		- initDrag
			- what does "if (document.all) e = event;" do?
			- what is document.documentElement?
			- what's e.clientX?
			- when is tagName false?
		- timerDrag
			- what's dragContentObj, and when is it first set to an object?
			- what's an item's .onmousedown?
		-

	*/






