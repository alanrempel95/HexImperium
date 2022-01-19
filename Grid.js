/**
 * A Grid is the model of the playfield containing hexes
 * @constructor
 */
//fuck off eslint
/*global HT*/
HT.Grid = function (startX, startY, width, height) {
	"use strict";
	this.Hexes = [];
	//setup a dictionary for use later for assigning the X or Y CoOrd (depending on Orientation)
	var HexagonsByXOrYCoOrd = {}, //Dictionary<int, List<Hexagon>>
        row = 0,
        y = 0,
        col = 0,
        offset = 0.0,
        x = offset,
        hexId,
        h,
        pathCoOrd = col,
        coOrd1,
        coOrd2,
        hexagonsByXOrY,
        i,
        hx2;
	while (y + HT.Hexagon.Static.HEIGHT <= height) {
        col = 0;
        offset = 0.0;
		if (row % 2 === 1) {
			if (HT.Hexagon.Static.ORIENTATION === HT.Hexagon.Orientation.Normal) {
				offset = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE) / 2 + HT.Hexagon.Static.SIDE;
            } else {
				offset = HT.Hexagon.Static.WIDTH / 2;
            }
			col = 1;
		}
		
		x = offset;
		while (x + HT.Hexagon.Static.WIDTH <= width) {
            hexId = this.GetHexId(row, col);
			h = new HT.Hexagon(hexId, x + startX, y + startY);
			
			pathCoOrd = col;
			if (HT.Hexagon.Static.ORIENTATION === HT.Hexagon.Orientation.Normal) {
				h.PathCoOrdX = col;//the column is the x coordinate of the hex, for the y coordinate we need to get more fancy
            } else {
				h.PathCoOrdY = row;
				pathCoOrd = row;
			}
			
			this.Hexes.push(h);
			
			if (!HexagonsByXOrYCoOrd[pathCoOrd]) {
				HexagonsByXOrYCoOrd[pathCoOrd] = [];
            }
			HexagonsByXOrYCoOrd[pathCoOrd].push(h);

			col += 2;
			if (HT.Hexagon.Static.ORIENTATION === HT.Hexagon.Orientation.Normal) {
				x += HT.Hexagon.Static.WIDTH + HT.Hexagon.Static.SIDE;
            } else {
                x += HT.Hexagon.Static.WIDTH;
            }
		}
		row += 1;
		if (HT.Hexagon.Static.ORIENTATION === HT.Hexagon.Orientation.Normal) {
			y += HT.Hexagon.Static.HEIGHT / 2;
        } else {
			y += (HT.Hexagon.Static.HEIGHT - HT.Hexagon.Static.SIDE) / 2 + HT.Hexagon.Static.SIDE;
        }
	}

	//finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
	for (coOrd1 in HexagonsByXOrYCoOrd) {
        if (HexagonsByXOrYCoOrd.hasOwnProperty(coOrd1)) {
            hexagonsByXOrY = HexagonsByXOrYCoOrd[coOrd1];
            coOrd2 = Math.floor(coOrd1 / 2) + (coOrd1 % 2);
            for (i in hexagonsByXOrY) {
                if (hexagonsByXOrY.hasOwnProperty(i)) {
                    hx2 = hexagonsByXOrY[i];//Hexagon
                    if (HT.Hexagon.Static.ORIENTATION === HT.Hexagon.Orientation.Normal) {
                        hx2.PathCoOrdY = coOrd2 += 1;
                    } else {
                        hx2.PathCoOrdX = coOrd2 += 1;
                    }
                }
            }
        }
	}
};

HT.Grid.Static = {Letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};

HT.Grid.prototype.GetHexId = function (row, col) {
	"use strict";
    var letterIndex = row,
        letters = "";
	while (letterIndex > 25) {
		letters = HT.Grid.Static.Letters[letterIndex % 26] + letters;
		letterIndex -= 26;
	}
		
	return HT.Grid.Static.Letters[letterIndex] + letters + (col + 1);
};

/**
 * Returns a hex at a given point
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexAt = function (p) {
	//find the hex that contains this point
    "use strict";
	var myHex, i;
    for (i = 0; i < this.Hexes.length; i += 1) {
        myHex = this.Hexes[i];
        //console.log("X:" + myHex.PathCoOrdX + ", Y:" + myHex.PathCoOrdY);
        if (myHex.Contains(p)) {
            return myHex;
        }
	}
	return null;
};

HT.Grid.prototype.GetHexByCoord = function (PathCoordX, PathCoordY) {
	//find the hex at these grid coordinates - AR 2021
    "use strict";
	var hx;
    for (hx in this.Hexes) {
        if (this.Hexes.hasOwnProperty(hx)) {
            if (this.Hexes[hx].PathCoOrdX === PathCoordX && this.Hexes[hx].PathCoOrdY === PathCoordY) {
                return this.Hexes[hx];
            }
        }
	}
	return null;
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {number}
 */
HT.Grid.prototype.GetHexDistance = function (h1, h2) {
	"use strict";
    //a good explanation of this calc can be found here:
	//http://playtechs.blogspot.com/2007/04/hex-grids.html
	var deltaX,
        deltaY;
    deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
	deltaY = h1.PathCoOrdY - h2.PathCoOrdY;
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexById = function (id) {
	"use strict";
    var i;
    for (i in this.Hexes) {
        if (this.Hexes.hasOwnProperty(i)) {
            if (this.Hexes[i].Id === id) {
                return this.Hexes[i];
            }
        }
	}
	return null;
};