'use strict';

Neo.ToolBase = function() {};

Neo.ToolBase.prototype.startX;
Neo.ToolBase.prototype.startY;
Neo.ToolBase.prototype.init = function(oe) {}
Neo.ToolBase.prototype.kill = function(oe) {}

Neo.ToolBase.prototype.downHandler = function(oe) {
	this.startX = oe.mouseX;
	this.startY = oe.mouseY;
};

Neo.ToolBase.prototype.upHandler = function(oe) {
};

Neo.ToolBase.prototype.moveHandler = function(oe) {
};

Neo.ToolBase.prototype.transformForZoom = function(oe) {
	var ctx = oe.destCanvasCtx;
	ctx.translate(oe.canvasWidth * 0.5, oe.canvasHeight * 0.5);
	ctx.scale(oe.zoom, oe.zoom);
	ctx.translate(-oe.zoomX, -oe.zoomY);
}


/*
-------------------------------------------------------------------------
	Pen2（しぃペインターの鉛筆）
    半透明で塗ってもムラにならない奴
-------------------------------------------------------------------------
*/

Neo.PenTool2 = function() {};
Neo.PenTool2.prototype = new Neo.ToolBase();
Neo.PenTool2.prototype.isUpMove = false;

Neo.PenTool2.prototype.downHandler = function(oe) {
	oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
	this.isUpMove = false;
	var ctx = oe.tempCanvasCtx;
	ctx.save();
	ctx.lineWidth = oe.lineWidth;
	ctx.lineCap = "round";	
	ctx.fillStyle = oe.foregroundColor;

	oe.drawLine2(ctx, oe.mouseX, oe.mouseY, oe.mouseX, oe.mouseY);
	oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
	ctx.restore();
};

Neo.PenTool2.prototype.upHandler = function(oe) {
	//Register undo first;
	oe._pushUndo();
	var ctx = oe.canvasCtx[oe.current];
	ctx.globalAlpha = oe.alpha;
	ctx.drawImage(oe.tempCanvas, 0, 0, oe.canvasWidth, oe.canvasHeight);
	ctx.globalAlpha = 1.0;
	oe.tempCanvasCtx.clearRect(0,0,oe.canvasWidth, oe.canvasHeight);
	oe.updateDestCanvas(0,0,oe.canvasWidth, oe.canvasHeight, true);
	this.drawCursor(oe);
};

Neo.PenTool2.prototype.moveHandler = function(oe) {	
	var ctx = oe.tempCanvasCtx;
	ctx.lineWidth = oe.lineWidth;
	ctx.lineCap = "round";	
	ctx.strokeStyle = oe.foregroundColor;
	oe.drawLine2(ctx, oe.mouseX, oe.mouseY, oe.prevMouseX, oe.prevMouseY);
	oe.updateDestCanvas(0,0,oe.canvasWidth, oe.canvasHeight, true);
};

Neo.PenTool2.prototype.drawCursor = function(oe) {
	var mx = oe.mouseX;
	var my = oe.mouseY;
	var d = oe.lineWidth;
	var ctx = oe.destCanvasCtx;
	ctx.save();
		this.transformForZoom(oe)
		ctx.lineWidth = oe.lineWidth;
		ctx.lineCap = "round";	
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "";
		ctx.lineWidth = 1/oe.zoom;
		ctx.globalAlpha = 1;
		oe.drawEllipse(ctx, mx+1/oe.zoom-d*0.5, my+1/oe.zoom-d*0.5, d, d, true, false);
		ctx.strokeStyle = "#ffffff";
		oe.drawEllipse(ctx, mx-d*0.5, my-d*0.5, d, d, true, false);
	ctx.restore();
}

Neo.PenTool2.prototype.upMoveHandler = function(oe) {
	this.isUpMove = true;
	oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
	this.drawCursor(oe);
}
Neo.PenTool2.prototype.rollOverHandler= function(oe) {}

Neo.PenTool2.prototype.rollOutHandler= function(oe) {
	if(!oe.isMouseDown && !oe.isMouseDownRight){
		oe.tempCanvasCtx.clearRect(0,0,oe.canvasWidth, oe.canvasHeight);
		oe.updateDestCanvas(0,0,oe.canvasWidth, oe.canvasHeight, true);
	}
}

/*
-------------------------------------------------------------------------
	Pen（鉛筆）
-------------------------------------------------------------------------
*/

Neo.PenTool = function() {};
Neo.PenTool.prototype = new Neo.ToolBase();
Neo.PenTool.prototype.isUpMove = false;

Neo.PenTool.prototype.downHandler = function(oe) {
	oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
	this.isUpMove = false;
	var ctx = oe.tempCanvasCtx;
	ctx.save();
	ctx.lineWidth = oe.lineWidth;
	ctx.lineCap = "round";	
	ctx.fillStyle = oe.foregroundColor;

	if (oe.alpha >= 1) oe.drawLine(ctx, oe.mouseX, oe.mouseY, oe.mouseX, oe.mouseY);
	oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
	ctx.restore();
};

Neo.PenTool.prototype.upHandler = function(oe) {
	//Register undo first;
	oe._pushUndo();
	var ctx = oe.canvasCtx[oe.current];
	ctx.globalAlpha = oe.alpha;
	ctx.drawImage(oe.tempCanvas, 0, 0, oe.canvasWidth, oe.canvasHeight);
	ctx.globalAlpha = 1.0;
	oe.tempCanvasCtx.clearRect(0,0,oe.canvasWidth, oe.canvasHeight);
	oe.updateDestCanvas(0,0,oe.canvasWidth, oe.canvasHeight, true);
	this.drawCursor(oe);
};

Neo.PenTool.prototype.moveHandler = function(oe) {	
	var ctx = oe.tempCanvasCtx;
	ctx.lineWidth = oe.lineWidth;
	ctx.lineCap = "round";	
	ctx.strokeStyle = oe.foregroundColor;
	oe.drawLine(ctx, oe.mouseX, oe.mouseY, oe.prevMouseX, oe.prevMouseY);
	oe.updateDestCanvas(0,0,oe.canvasWidth, oe.canvasHeight, true);
};

Neo.PenTool.prototype.drawCursor = function(oe) {
    var mx = oe.mouseX;
    var my = oe.mouseY;
    var d = oe.lineWidth;
    var ctx = oe.destCanvasCtx;
    ctx.save();
    this.transformForZoom(oe)
    ctx.lineWidth = oe.lineWidth;
    ctx.lineCap = "round";	
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "";
    ctx.lineWidth = 1/oe.zoom;
    ctx.globalAlpha = 1;
    oe.drawEllipse(ctx, mx+1/oe.zoom-d*0.5, my+1/oe.zoom-d*0.5, d, d, true, false);
    ctx.strokeStyle = "#ffffff";
    oe.drawEllipse(ctx, mx-d*0.5, my-d*0.5, d, d, true, false);
    ctx.restore();
}

Neo.PenTool.prototype.upMoveHandler = function(oe) {
    this.isUpMove = true;
    oe.updateDestCanvas(0, 0, oe.canvasWidth, oe.canvasHeight, true);
    this.drawCursor(oe);
}
Neo.PenTool.prototype.rollOverHandler= function(oe) {}

Neo.PenTool.prototype.rollOutHandler= function(oe) {
	if (!oe.isMouseDown && !oe.isMouseDownRight){
		oe.tempCanvasCtx.clearRect(0,0,oe.canvasWidth, oe.canvasHeight);
		oe.updateDestCanvas(0,0,oe.canvasWidth, oe.canvasHeight, true);
	}
}


/*
-------------------------------------------------------------------------
	Hand（スクロール）
-------------------------------------------------------------------------
*/

Neo.HandTool = function() {};
Neo.HandTool.prototype = new Neo.ToolBase();
Neo.HandTool.prototype.isUpMove = false;

Neo.HandTool.prototype.downHandler = function(oe) {
	oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);

	this.isDrag = true;
	this.startX = oe.mouseX;
	this.startY = oe.mouseY;
};

Neo.HandTool.prototype.upHandler = function(oe) {
    this.isDrag = false;
    oe.popTool();
};

Neo.HandTool.prototype.moveHandler = function(oe) {	
    if (this.isDrag) {
        var zoomX = oe.zoomX;
        var zoomY = oe.zoomY;
        var dx = this.startX - oe.mouseX;
        var dy = this.startY - oe.mouseY;
        oe.setZoomPosition(zoomX + dx, zoomY + dy);
    }
};

Neo.HandTool.prototype.rollOutHandler= function(oe) {};
Neo.HandTool.prototype.upMoveHandler = function(oe) {}
Neo.HandTool.prototype.rollOverHandler= function(oe) {}


/*
-------------------------------------------------------------------------
	Fill（塗り潰し）
-------------------------------------------------------------------------
*/

Neo.FillTool = function() {};
Neo.FillTool.prototype = new Neo.ToolBase();
Neo.FillTool.prototype.isUpMove = false;

Neo.FillTool.prototype.downHandler = function(oe) {
    oe._pushUndo();
	oe.tempCanvasCtx.clearRect(0, 0, oe.canvasWidth, oe.canvasHeight);
    oe.fill(oe.mouseX, oe.mouseY, oe.canvasCtx[oe.current]);
};

Neo.FillTool.prototype.upHandler = function(oe) {
};

Neo.FillTool.prototype.moveHandler = function(oe) {	
};

Neo.FillTool.prototype.rollOutHandler= function(oe) {};
Neo.FillTool.prototype.upMoveHandler = function(oe) {}
Neo.FillTool.prototype.rollOverHandler= function(oe) {}


/*
-------------------------------------------------------------------------
	Dummy（何もしない時）
-------------------------------------------------------------------------
*/

Neo.DummyTool = function() {};
Neo.DummyTool.prototype = new Neo.ToolBase();
Neo.DummyTool.prototype.isUpMove = false;

Neo.DummyTool.prototype.downHandler = function(oe) {
};

Neo.DummyTool.prototype.upHandler = function(oe) {
    oe.popTool();
};

Neo.DummyTool.prototype.moveHandler = function(oe) {};
Neo.DummyTool.prototype.upMoveHandler = function(oe) {}
Neo.DummyTool.prototype.rollOverHandler= function(oe) {}
Neo.DummyTool.prototype.rollOutHandler= function(oe) {}


