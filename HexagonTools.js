var HT = HT || {};
/**
 * A Point is simply x and y coordinates
 * @constructor
 */
HT.Point = function (x, y) {
    "use strict";
	this.X = x;
	this.Y = y;
};

/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
HT.Rectangle = function (x, y, width, height) {
	"use strict";
    this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
};

/**
 * A Line is x and y start and x and y end
 * @constructor
 */
HT.Line = function (x1, y1, x2, y2) {
	"use strict";
    this.X1 = x1;
	this.Y1 = y1;
	this.X2 = x2;
	this.Y2 = y2;
};

/**
 * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
 * @constructor
 */
HT.Hexagon = function (id, x, y) {
	"use strict";
    this.Points = [];//Polygon Base
    this.Neighbors = []; //adjacent hexes
    this.FurtherNeighbors = []; //within two tiles
    this.TerrainType = "land"; //land or water
    this.estate = ""; //town, port, capital
    this.isOccupied = false; //is army here
	var x1 = null,
        y1 = null,
        rColor = 0,
        gColor = 0,
        bColor = 0,
        rMax = 100,
        rMin = 50,
        gMax = 200,
        gMin = 150,
        bMax = 100,
        bMin = 50,
        yellowOffset = 70;
	if (HT.Hexagon.Static.ORIENTATION === HT.Hexagon.Orientation.Normal) {
		x1 = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE) / 2;
		y1 = (HT.Hexagon.Static.HEIGHT / 2);
		this.Points.push(new HT.Point(x1 + x, y));
		this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, y));
		this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
		this.Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, HT.Hexagon.Static.HEIGHT + y));
		this.Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
		this.Points.push(new HT.Point(x, y1 + y));
	} else {
		x1 = (HT.Hexagon.Static.WIDTH / 2);
		y1 = (HT.Hexagon.Static.HEIGHT - HT.Hexagon.Static.SIDE) / 2;
		this.Points.push(new HT.Point(x1 + x, y));
		this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
		this.Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + HT.Hexagon.Static.SIDE + y));
		this.Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
		this.Points.push(new HT.Point(x, y1 + HT.Hexagon.Static.SIDE + y));
		this.Points.push(new HT.Point(x, y1 + y));
	}
	
	this.Id = id;
	
	this.x = x;
	this.y = y;
	this.x1 = x1;
	this.y1 = y1;
	
	this.TopLeftPoint = new HT.Point(this.x, this.y);
	this.BottomRightPoint = new HT.Point(this.x + HT.Hexagon.Static.WIDTH, this.y + HT.Hexagon.Static.HEIGHT);
	this.MidPoint = new HT.Point(this.x + (HT.Hexagon.Static.WIDTH / 2), this.y + (HT.Hexagon.Static.HEIGHT / 2));
	
	this.P1 = new HT.Point(x + x1, y + y1);
	
	this.selected = false;
    
    //assign bounded random colors
    rColor = Math.floor(Math.random() * (rMax - rMin)) + rMin;
    gColor = Math.floor(Math.random() * (gMax - gMin)) + gMin;
    bColor = Math.floor(Math.random() * (bMax - bMin)) + bMin;
    this.fillColorLand = "rgb(" + rColor + ", " + gColor + ", " + bColor + ")";
    this.fillColorLandSelected = "rgb(" + (rColor + yellowOffset) + ", " + (gColor + yellowOffset) + ", " + bColor + ")";
    
    rColor = Math.floor(Math.random() * (rMax - rMin)) + rMin;
    gColor = Math.floor(Math.random() * (bMax - bMin)) + bMin;
    bColor = Math.floor(Math.random() * (gMax - gMin)) + gMin;
    this.fillColorWater = "rgb(" + rColor + ", " + gColor + ", " + bColor + ")";
    this.fillColorWaterSelected = "rgb(" + (rColor + yellowOffset) + ", " + (gColor + yellowOffset) + ", " + bColor + ")";
    
    this.fillColor = this.fillColorLand; //default to land
};
	
/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.draw = function (ctx) {
    "use strict";
	var i = 1,
        p,
        occupiedOffset = 10,
        occupiedOffset2 = 0;
    //if (!this.selected) {
    ctx.strokeStyle = "grey";
    //} else {
		//ctx.strokeStyle = "black";
    //}
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(this.Points[0].X, this.Points[0].Y);
	for (i = 1; i < this.Points.length; i += 1) {
		p = this.Points[i];
		ctx.lineTo(p.X, p.Y);
	}
	ctx.closePath();
	ctx.stroke();
    
    if (this.TerrainType === "land") {
        if (this.selected) { //I should really learn how to layer things - AR 2021
            this.fillColor = this.fillColorLandSelected;
        } else {
            this.fillColor = this.fillColorLand;
        }
    } else { //water
        if (this.selected) {
            this.fillColor = this.fillColorWaterSelected;
        } else {
            this.fillColor = this.fillColorWater;
        }
    }
    //AR 6/2/19
    ctx.fillStyle = this.fillColor;
    ctx.fill();
	
    //ID has different grid system than PathCoords. Nothing could be more confusing than displaying both of these.
	//if (this.Id) {
		//draw text for debugging
		//ctx.fillStyle = "black";
		//ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		//ctx.textAlign = "center";
		//ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		//ctx.fillText(this.Id, this.MidPoint.X, this.MidPoint.Y);
	//}
	
    //AR 5.14.21 draw estates offset if they're occupied
    if (this.isOccupied) {
        occupiedOffset2 = occupiedOffset;
    } else {
        occupiedOffset2 = 0;
    }
    
    //AR 4.27.21 draw cities, capitals, and ports
    if (this.estate === "town") {
        ctx.beginPath();
        ctx.arc(this.MidPoint.X + occupiedOffset2, this.MidPoint.Y + occupiedOffset2, 7, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }
    
    //AR 4.27.21 draw cities, capitals, and ports
    if (this.estate === "capital") {
        ctx.beginPath();
        ctx.arc(this.MidPoint.X + occupiedOffset2, this.MidPoint.Y + occupiedOffset2, 15, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }
    
    //AR 4.27.21 draw cities, capitals, and ports
    if (this.estate === "port") {
        ctx.beginPath();
        ctx.arc(this.MidPoint.X + occupiedOffset2, this.MidPoint.Y + occupiedOffset2, 20, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.lineWidth = 0;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }
    
	if (this.PathCoOrdX !== null && this.PathCoOrdY !== null && typeof (this.PathCoOrdX) !== "undefined" && typeof (this.PathCoOrdY) !== "undefined") {
		//draw co-ordinates for debugging
		ctx.fillStyle = "black";
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("(" + this.PathCoOrdX + "," + this.PathCoOrdY + ")", this.MidPoint.X, this.MidPoint.Y);
	}
	
	if (HT.Hexagon.Static.DRAWSTATS) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		//draw our x1, y1, and z
		ctx.beginPath();
		ctx.moveTo(this.P1.X, this.y);
		ctx.lineTo(this.P1.X, this.P1.Y);
		ctx.lineTo(this.x, this.P1.Y);
		ctx.closePath();
		ctx.stroke();
		
		ctx.fillStyle = "black";
		ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "left";
		ctx.textBaseline = 'middle';
		//var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
		ctx.fillText("z", this.x + this.x1 / 2 - 8, this.y + this.y1 / 2);
		ctx.fillText("x", this.x + this.x1 / 2, this.P1.Y + 10);
		ctx.fillText("y", this.P1.X + 2, this.y + this.y1 / 2);
		ctx.fillText("z = " + HT.Hexagon.Static.SIDE, this.P1.X, this.P1.Y + this.y1 + 10);
		ctx.fillText("(" + this.x1.toFixed(2) + "," + this.y1.toFixed(2) + ")", this.P1.X, this.P1.Y + 10);
	}
};

/**
 * Returns true if the x,y coordinates are inside this hexagon
 * @this {HT.Hexagon}
 * @return {boolean}
 */
HT.Hexagon.prototype.isInBounds = function (x, y) {
    "use strict";
	return this.Contains(new HT.Point(x, y));
};
	

/**
 * Returns true if the point is inside this hexagon, it is a quick contains
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.isInHexBounds = function (p) {
    "use strict";
	if (this.TopLeftPoint.X < p.X && this.TopLeftPoint.Y < p.Y && p.X < this.BottomRightPoint.X && p.Y < this.BottomRightPoint.Y) {
        return true;
    }
	return false;
};

//grabbed from:
//http://www.developingfor.net/c-20/testing-to-see-if-a-point-is-within-a-polygon.html
//and
//http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#The%20C%20Code
/**
 * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.Contains = function (p) {
    "use strict";
	var isIn = false,
        i = 0,
        j = 0,
        iP,
        jP,
        tY,
        boundCheck = false;
    boundCheck = this.isInHexBounds(p);
	if (boundCheck) {
        isIn = true;
		//console.log("X:" + this.PathCoOrdX + ", Y:" + this.PathCoOrdY);
        for (i = 0; i < 6; i += 1) {
            j = i + 1;
            if (j === 6) {
                j = 0; //reset
            }
            iP = this.Points[i];
			jP = this.Points[j];
            //evaluate what Y would be if it were on the perimeter
            tY = (iP.Y - jP.Y) / (iP.X - jP.X) * (p.X - iP.X) + iP.Y;
            if (i === 0 || i === 1 || i === 5) {
                //top half of hexagon
                if (tY > p.Y) {
                    isIn = false;
                }
            } else {
                //bottom half of hexagon
                if (tY < p.Y) {
                    isIn = false;
                }
            }
        }
//        for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i += 1) {
//			iP = this.Points[i];
//			jP = this.Points[j];
//			if ((((iP.Y <= p.Y) && (p.Y < jP.Y)) || ((jP.Y <= p.Y) && (p.Y < iP.Y))) &&	(p.Y < (jP.X - iP.X) * (p.Y - iP.Y) / (jP.Y - iP.Y) + iP.X)) {
//				isIn = !isIn;
//			}
//		}
	}
	return isIn;
};


HT.Hexagon.Orientation = {
	Normal: 0,
	Rotated: 1
};

HT.Hexagon.Static = {HEIGHT: 91.14378277661477,
                     WIDTH: 91.14378277661477,
                     SIDE: 50.0,
                     ORIENTATION: HT.Hexagon.Orientation.Normal,
                     DRAWSTATS: false};//hexagons will have 25 unit sides for now

HT.Hexagon.prototype.findNeighbors = function (myGrid) {
    //find six adjacent neighbors
    "use strict";
    var myLocX,
        myLocY;
    myLocX = this.PathCoOrdX;
    myLocY = this.PathCoOrdY;
    //top left
    this.Neighbors[0] = myGrid.GetHexByCoord(myLocX - 1, myLocY - 1);
    //top
    this.Neighbors[1] = myGrid.GetHexByCoord(myLocX, myLocY - 1);
    //top right
    this.Neighbors[2] = myGrid.GetHexByCoord(myLocX + 1, myLocY);
    //bottom right
    this.Neighbors[3] = myGrid.GetHexByCoord(myLocX + 1, myLocY + 1);
    //bottom
    this.Neighbors[4] = myGrid.GetHexByCoord(myLocX, myLocY + 1);
    //bottom left
    this.Neighbors[5] = myGrid.GetHexByCoord(myLocX - 1, myLocY);
    
    return this.Neighbors;
};

HT.Hexagon.prototype.findFurtherNeighbors = function (myGrid) {
    //find 12 penadjacent neighbors
    "use strict";
    var myLocX,
        myLocY;
    //indexed clockwise from top left - must be redundant to accomodate null Neighbors
    if (this.Neighbors[0] !== null) {
        myLocX = this.Neighbors[0].PathCoOrdX;
        myLocY = this.Neighbors[0].PathCoOrdY;
        this.FurtherNeighbors[11] = myGrid.GetHexByCoord(myLocX - 1, myLocY);
        this.FurtherNeighbors[0] = myGrid.GetHexByCoord(myLocX - 1, myLocY - 1);
        this.FurtherNeighbors[1] = myGrid.GetHexByCoord(myLocX, myLocY - 1);
    }
    if (this.Neighbors[1] !== null) {
        myLocX = this.Neighbors[1].PathCoOrdX;
        myLocY = this.Neighbors[1].PathCoOrdY;
        this.FurtherNeighbors[1] = myGrid.GetHexByCoord(myLocX - 1, myLocY - 1);
        this.FurtherNeighbors[2] = myGrid.GetHexByCoord(myLocX, myLocY - 1);
        this.FurtherNeighbors[3] = myGrid.GetHexByCoord(myLocX + 1, myLocY);
    }
    if (this.Neighbors[2] !== null) {
        myLocX = this.Neighbors[2].PathCoOrdX;
        myLocY = this.Neighbors[2].PathCoOrdY;
        this.FurtherNeighbors[3] = myGrid.GetHexByCoord(myLocX, myLocY - 1);
        this.FurtherNeighbors[4] = myGrid.GetHexByCoord(myLocX + 1, myLocY);
        this.FurtherNeighbors[5] = myGrid.GetHexByCoord(myLocX + 1, myLocY + 1);
    }
    if (this.Neighbors[3] !== null) {
        myLocX = this.Neighbors[3].PathCoOrdX;
        myLocY = this.Neighbors[3].PathCoOrdY;
        this.FurtherNeighbors[5] = myGrid.GetHexByCoord(myLocX + 1, myLocY);
        this.FurtherNeighbors[6] = myGrid.GetHexByCoord(myLocX + 1, myLocY + 1);
        this.FurtherNeighbors[7] = myGrid.GetHexByCoord(myLocX, myLocY + 1);
    }
    if (this.Neighbors[4] !== null) {
        myLocX = this.Neighbors[4].PathCoOrdX;
        myLocY = this.Neighbors[4].PathCoOrdY;
        this.FurtherNeighbors[7] = myGrid.GetHexByCoord(myLocX + 1, myLocY + 1);
        this.FurtherNeighbors[8] = myGrid.GetHexByCoord(myLocX, myLocY + 1);
        this.FurtherNeighbors[9] = myGrid.GetHexByCoord(myLocX - 1, myLocY);
    }
    if (this.Neighbors[5] !== null) {
        myLocX = this.Neighbors[5].PathCoOrdX;
        myLocY = this.Neighbors[5].PathCoOrdY;
        this.FurtherNeighbors[9] = myGrid.GetHexByCoord(myLocX, myLocY + 1);
        this.FurtherNeighbors[10] = myGrid.GetHexByCoord(myLocX - 1, myLocY);
        this.FurtherNeighbors[11] = myGrid.GetHexByCoord(myLocX - 1, myLocY - 1);
    }
};