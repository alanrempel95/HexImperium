//linter instructions
/*globals HT*/
/* eslint-env browser*/
/* exported drawHexGrid, getHexGridZR, getHexGridWH, changeOrientation, debugHexZR, debugHexWH*/
function findHexWithSideLengthZAndRatio() {
	"use strict";
    var z,
        r,
        r2,
        a,
        b,
        c,
        x,
        y,
        contentDiv,
        width,
        height;
    z = parseFloat(document.getElementById("sideLength").value);
	r = parseFloat(document.getElementById("whRatio").value);
	
	//solve quadratic
	r2 = Math.pow(r, 2);
	a = (1 + r2) / r2;
	b = z / r2;
	c = ((1 - 4.0 * r2) / (4.0 * r2)) * (Math.pow(z, 2));

	x = (-b + Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);
	
	y = ((2.0 * x) + z) / (2.0 * r);
	
	contentDiv = document.getElementById("hexStatus");

	width = ((2.0 * x) + z);
	height = (2.0 * y);
	contentDiv.innerHTML = "Values for Hex: <br /><b>Side Length, z:</b> " + z + "<br /><b>x:</b> " + x + "<br /><b>y:</b> " + y +
		"<br /><b>Width:</b> " + width + "<br /><b>Height: </b>" + height;
	
	HT.Hexagon.Static.WIDTH = width;
	HT.Hexagon.Static.HEIGHT = height;
	HT.Hexagon.Static.SIDE = z;
}

function findHexWithWidthAndHeight() {
	"use strict";
    var width,
        height,
        y,
        a,
        b,
        c,
        z,
        x,
        contentDiv;
    width = parseFloat(document.getElementById("hexWidth").value);
	height = parseFloat(document.getElementById("hexHeight").value);
	
	y = height / 2.0;
	
	//solve quadratic
	a = -3.0;
	b = (-2.0 * width);
	c = (Math.pow(width, 2)) + (Math.pow(height, 2));
	
	z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);
	
	x = (width - z) / 2.0;
	
	contentDiv = document.getElementById("hexStatus");

	contentDiv.innerHTML = "Values for Hex: <br /><b>Width:</b> " + width + "<br /><b>Height: </b>" + height +
		"<br /><b>Side Length, z:</b> " + z + "<br /><b>x:</b> " + x + "<br /><b>y:</b> " + y;
	
	HT.Hexagon.Static.WIDTH = width;
	HT.Hexagon.Static.HEIGHT = height;
	HT.Hexagon.Static.SIDE = z;
}

//AR 6.2.19 added method to change tile heights
function drawHexGrid(tilesWide, tilesHigh, ctx, width, height) {
    "use strict";
    var grid,
        //canvas,
        //ctx,
        h,
        //height,
        //width,
        tileHeight,
        tileHeight2,
        gridHeight,
        gridWidth;
    //canvas = document.getElementById("hexCanvas");
	//ctx = canvas.getContext('2d');
	//height = canvas.height;
    //width = canvas.width;
    //can't believe this worked the first time. trig, still got it - AR 2018
    //comment above is the crowning height of naivete - AR 2021
    tileHeight = height / (tilesHigh + 1 / 2); //limit hex dimensions to fit height
    //tileHeight2 = width / ((1 / Math.sqrt(3) + 1 / 2) * tilesWide + 1 / 2); totally fkn incorrect how did I pass trig - AR 2021
    tileHeight2 = width * 2 * Math.sqrt(3) / (3 * tilesWide + 1); //limit hex dimensions to fit height. 
    tileHeight = Math.trunc(Math.min(tileHeight, tileHeight2), 3); //take controlling dimensions - floating point error is possible here
    HT.Hexagon.Static.HEIGHT = tileHeight;
    HT.Hexagon.Static.WIDTH = HT.Hexagon.Static.HEIGHT * 2 / Math.sqrt(3); //fucking finally it's a goddamned hexagon - AR 2021
    HT.Hexagon.Static.SIDE = HT.Hexagon.Static.HEIGHT / Math.sqrt(3); //only originally correct line in the whole blasted trig section - AR 2021
	//feed HT a smaller grid otherwise it generates extra/not enough
    gridHeight = tileHeight * (tilesHigh + 1.0 / 2.0);
    gridWidth = tileHeight * (3.0 * tilesWide + 1.0) / (2.0 * Math.sqrt(3));
    //draw grid centered on the canvas - grid(StartX, StartY, Width, Height)
    grid = new HT.Grid((width - gridWidth) / 2, (height - gridHeight) / 2, gridWidth, gridHeight);
    ctx.clearRect(0, 0, width, height);
	for (h in grid.Hexes) {
        if (grid.Hexes.hasOwnProperty(h)) {
            grid.Hexes[h].draw(ctx);
        }
	}
    return grid; //this is what we manipulate to play the game
}

function getHexGridZR() {
	"use strict";
    findHexWithSideLengthZAndRatio();
	drawHexGrid();
}

function getHexGridWH() {
	"use strict";
    findHexWithWidthAndHeight();
	drawHexGrid();
}

function changeOrientation() {
    "use strict";
	if (document.getElementById("hexOrientationNormal").checked) {
		HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Orientation.Normal;
	} else {
		HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Orientation.Rotated;
	}
	drawHexGrid();
}

function addHexToCanvasAndDraw(x, y) {
    "use strict";
    var hex, canvas, ctx;
	HT.Hexagon.Static.DRAWSTATS = true;
	hex = new HT.Hexagon(null, x, y);
	
    canvas = document.getElementById("hexCanvas");
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, 800, 600);
	hex.draw(ctx);
}

function debugHexZR() {
    "use strict";
	findHexWithSideLengthZAndRatio();
	addHexToCanvasAndDraw(20, 20);
}

function debugHexWH() {
    "use strict";
	findHexWithWidthAndHeight();
	addHexToCanvasAndDraw(20, 20);
}