(function($, global) {
	"use strict";

	const parents = new WeakMap();

	function randomString(length=32) {
		let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
		if (! length) length = Math.floor(Math.random() * chars.length);
		let str = '';
		for (let i=0; i<length; i++) str += chars[Math.floor(Math.random() * chars.length)];
		return str;
	}

	function addMoveOnId(target, parent) {
		if (!target.attr("move-on-id")) {
			let id = "move-on-" + randomString();
			target.attr("move-on-id", id);
			let placeholder = $("<move-on-placeholder></move-on-placeholder>").attr("id", id);
			target.before(placeholder);
		}

		if (!parents.has(parent)) parents.set(parent, new Set());
		parents.get(parent).add(target);

		return target.attr("move-on-id");
	}

	function _applyMoveOn(moveOn, size) {
		if (moveOn.attr("move-on-"+size)) {
			if (moveOn.attr("move-on-"+size+"-target")) {
				moveOn.find(moveOn.attr("move-on-"+size+"-target")).each((n, node)=>{
					addMoveOnId($(node), moveOn.get(0));
				});
			} else {
				addMoveOnId(moveOn, moveOn.get(0));
			}
		}
	}

	function applyMoveOn(moveOns=this) {
		moveOns.each((n, node)=>{
			let moveOn = $(node);
			["small", "medium", "large", "xlarge", "xxlarge"].forEach(size=>_applyMoveOn(moveOn, size));
		});

		function moveContent(moveToRef, moveOnTarget) {
			let moveTo = $(moveToRef);
			if (moveTo.length) moveTo.append(moveOnTarget);
		}

		function doMove(event, size, oldSize) {
			moveOns.each((n, node)=>{
				let moveOn = $(node);
				let moveToRef = moveOn.attr("move-on-"+size);

				if (moveToRef) {
					let targetRef = moveOn.attr("move-on-"+size+"-target");
					if (targetRef) {
						moveOn.find(targetRef).each((n, node)=>moveContent(moveToRef, $(node)));
					} else {
						moveContent(moveToRef, moveOn);
					}
				} else {
					if (parents.has(node)) {
						parents.get(node).forEach(target=>{
							let id = target.attr("move-on-id");
							if (id) {
								let placeholder = $("#"+id);
								if (placeholder.length) placeholder.after(target);
							}
						});
					}
				}
			});
		}

		$(global).on('changed.zf.mediaquery', doMove);
		$(document).ready(()=>doMove(undefined, Foundation.MediaQuery.current, undefined));
	}

	$.fn.piyMoveOn = applyMoveOn;

	$(document).ready(
		()=>$("[move-on-small],[move-on-medium],[move-on-large],[move-on-xlarge],[move-on-xxlarge]").piyMoveOn()
	);

})(jQuery || $, window);