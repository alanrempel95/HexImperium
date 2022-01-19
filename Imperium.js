/* eslint-env browser*/
/*globals drawHexGrid*/
/* exported handleMouse, changeMap, randomMap*/
var Imperium = {
    tilesWide: 20, //number of tiles across
    tilesHigh: 11, //number of tiles tall
    win: false, //did the human win,
    gameGrid: null,
    land_list: [],
    town_list: [],
    canvas: null,
    ctx: null,
    startup: true,
    debugP: null,
    mouseY: 0,
    mouseX: 0,
    mapNumber: 0,
    seed: 446842, //starting seed is map number
    towns: ["Abu Dhabi", "Abuja", "Accra", "Addis Ababa", "Algiers", "Amman", "Amsterdam", "Ankara", "Antananarivo", "Apia", "Ashgabat", "Asmara", "Astana", "Asunción", "Athens", "Baghdad", "Baku", "Bamako", "Bangkok", "Bangui", "Banjul", "Basseterre", "Beijing", "Beirut", "Belgrade", "Belmopan", "Berlin", "Bern", "Bishkek", "Bissau", "Bogotá", "Brasília", "Bratislava", "Brazzaville", "Bridgetown", "Brussels", "Bucharest", "Budapest", "Buenos Aires", "Bujumbura", "Cairo", "Canberra", "Cape Town", "Caracas", "Castries", "Chisinau", "Conakry", "Copenhagen", "Cotonou", "Dakar", "Damascus", "Dhaka", "Dili", "Djibouti", "Dodoma", "Doha", "Dublin", "Dushanbe", "Delhi", "Freetown", "Funafuti", "Gabarone", "Georgetown", "Guatemala City", "Hague", "Hanoi", "Harare", "Havana", "Helsinki", "Honiara", "Hong Kong", "Islamabad", "Jakarta", "Jerusalem", "Kabul", "Kampala", "Kathmandu", "Khartoum", "Kyiv", "Kigali", "Kingston", "Kingstown", "Kinshasa", "Kuala Lumpur", "Kuwait City", "La Paz", "Liberville", "Lilongwe", "Lima", "Lisbon", "Ljubljana", "Lobamba", "Lomé", "London", "Luanda", "Lusaka", "Luxembourg", "Madrid", "Majuro", "Malé", "Managua", "Manama", "Manila", "Maputo", "Maseru", "Mbabane", "Melekeok", "Mexico City", "Minsk", "Mogadishu", "Monaco", "Monrovia", "Montevideo", "Moroni", "Moscow", "Muscat", "Nairobi", "Nassau", "Naypyidaw", "N\'Djamena", "New Delhi", "Niamey", "Nicosia", "Nouakchott", "Nuku\'alofa", "Nuuk", "Oslo", "Ottawa", "Ouagadougou", "Palikir", "Panama City", "Paramaribo", "Paris", "Phnom Penh", "Podgorica", "Prague", "Praia", "Pretoria", "Pyongyang", "Quito", "Rabat", "Ramallah", "Reykjavík", "Riga", "Riyadh", "Rome", "Roseau", "San José", "San Marino", "San Salvador", "Sanaá", "Santiago", "Santo Domingo", "Sao Tomé", "Sarajevo", "Seoul", "Singapore", "Skopje", "Sofia", "South Tarawa", "St. George\'s", "St. John\'s", "Stockholm", "Sucre", "Suva", "Taipei", "Tallinn", "Tashkent", "Tbilisi", "Tegucigalpa", "Teheran", "Thimphu", "Tirana", "Tokyo", "Tripoli", "Tunis", "Ulaanbaatar", "Vaduz", "Valletta", "Victoria", "Vienna", "Vientiane", "Vilnius", "Warsaw", "Washington", "Wellington", "Windhoek", "Yamoussoukro", "Yaoundé", "Yerevan", "Zagreb", "Zielona Góra", "Poznań", "Wrocław", "Gdańsk", "Szczecin", "Łódź", "Białystok", "Toruń", "St. Petersburg", "Turku", "Örebro", "Chengdu", "Wuppertal", "Frankfurt", "Düsseldorf", "Essen", "Duisburg", "Magdeburg", "Bonn", "Brno", "Tours", "Bordeaux", "Nice", "Lyon", "Stara Zagora", "Milan", "Bologna", "Sydney", "Venice", "New York", "Barcelona", "Zaragoza", "Valencia", "Seville", "Graz", "Munich", "Birmingham", "Naples", "Cologne", "Turin", "Marseille", "Leeds", "Kraków", "Palermo", "Genoa", "Stuttgart", "Dortmund", "Rotterdam", "Glasgow", "Málaga", "Bremen", "Sheffield", "Antwerp", "Plovdiv", "Thessaloniki", "Kaunas", "Lublin", "Varna", "Ostrava", "Iaşi", "Katowice", "Cluj-Napoca", "Timişoara", "Constanţa", "Pskov", "Vitebsk", "Arkhangelsk", "Novosibirsk", "Samara", "Omsk", "Chelyabinsk", "Ufa", "Volgograd", "Perm", "Kharkiv", "Odessa", "Donetsk", "Dnipropetrovsk", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "Dallas", "Detroit", "Indianapolis", "San Francisco", "Atlanta", "Austin", "Vermont", "Toronto", "Montreal", "Vancouver", "Gdynia", "Edmonton"]
};

function randFromSeed(n) {
    //random number generator from mapNumber-based seed
    "use strict";
    var randomResult;
    Imperium.seed = (Imperium.seed * 9301 + 49297) % 233280;
    randomResult = Math.floor(Imperium.seed / 233280 * n);
    //console.log("Random: " + randomResult);
    return randomResult;
}

function drawTerrain() {
    "use strict";
    //clear older arrays?
    Imperium.gameGrid = null;
    Imperium.land_list = [];
    Imperium.town_list = [];
    Imperium.canvas = document.getElementById("hexCanvas");
    Imperium.ctx = Imperium.canvas.getContext('2d');
    
    document.getElementById("MapInput").value = Imperium.seed;
    
    //function to draw the terrain
    var height = Imperium.canvas.height,
        width = Imperium.canvas.width,
        hx = 0,
        nx = 0,
        landAdjacent = 0,
        waterAdjacent = 0,
        myNeighbor,
        myFurtherNeighbor,
        skipRand = 0,
        ix = 0, //counter
        tcnt = 0, //estate density? town count?
        jx = 0, //counter
        created = false, //bool for trying to create estates
        attempts = 0, //counter of trials
        isOk = false, //good place for a city
        nt = 0; //random number
    Imperium.gameGrid = drawHexGrid(Imperium.tilesWide, Imperium.tilesHigh, Imperium.ctx, width, height);
    Imperium.debugP = document.getElementById("debug1");
    
    //generate neighbors
    for (hx in Imperium.gameGrid.Hexes) {
        myNeighbor = Imperium.gameGrid.Hexes[hx].findNeighbors(Imperium.gameGrid);
        myFurtherNeighbor = Imperium.gameGrid.Hexes[hx].findFurtherNeighbors(Imperium.gameGrid);
    }
    
    //burn some rand calls to match Hex Empire
    skipRand = randFromSeed(6);
    skipRand = randFromSeed(6);
    skipRand = randFromSeed(2);
    skipRand = randFromSeed(2);
    skipRand = randFromSeed(4);
    
    //assign initial archipelago
    hx = 0;
    for (hx in Imperium.gameGrid.Hexes) {
        Imperium.gameGrid.Hexes[hx].TerrainType = randFromSeed(10) <= 1 ? "land" : "water";
    }
    
    //capitals must be land
    Imperium.gameGrid.GetHexByCoord(1, 3).TerrainType = "land";
    Imperium.gameGrid.GetHexByCoord(1, 3).estate = "capital";
    Imperium.gameGrid.GetHexByCoord(1, 11).TerrainType = "land";
    Imperium.gameGrid.GetHexByCoord(1, 11).estate = "capital";
    Imperium.gameGrid.GetHexByCoord(18, 11).TerrainType = "land";
    Imperium.gameGrid.GetHexByCoord(18, 11).estate = "capital";
    Imperium.gameGrid.GetHexByCoord(18, 19).TerrainType = "land";
    Imperium.gameGrid.GetHexByCoord(18, 19).estate = "capital";
    
    //"fill in" seas with neighboring land but only assign boolean
    hx = 0;
    for (hx in Imperium.gameGrid.Hexes) {
        nx = 0;
        for (nx in Imperium.gameGrid.Hexes[hx].Neighbors) {
            if (Imperium.gameGrid.Hexes[hx].Neighbors[nx] !== null) {
                if (Imperium.gameGrid.Hexes[hx].Neighbors[nx].TerrainType === "land") {
                    landAdjacent += 1;
                }
            }
        }
        if (landAdjacent >= 1) {
            Imperium.gameGrid.Hexes[hx].shouldBeLand = true; //do I need to declare this?
        }
        landAdjacent = 0;
    }
    
    //fill in seas for real
    hx = 0;
    for (hx in Imperium.gameGrid.Hexes) {
        if (Imperium.gameGrid.Hexes[hx].shouldBeLand) {
            Imperium.gameGrid.Hexes[hx].TerrainType = "land";
        }
    }
    
    //check for totally isolated lakes
    hx = 0;
    for (hx in Imperium.gameGrid.Hexes) {
        nx = 0;
        if (Imperium.gameGrid.Hexes[hx].TerrainType === "water") {
            for (nx in Imperium.gameGrid.Hexes[hx].Neighbors) {
                if (Imperium.gameGrid.Hexes[hx].Neighbors[nx] !== null) {
                    if (Imperium.gameGrid.Hexes[hx].Neighbors[nx].TerrainType === "water") {
                        waterAdjacent += 1;
                    }
                }
            }
            if (waterAdjacent === 0) {
                Imperium.gameGrid.Hexes[hx].shouldBeLand = true; //do I need to declare this?
            }
            waterAdjacent = 0;
        }
    }
    
    //fill in lakes for real
    hx = 0;
    for (hx in Imperium.gameGrid.Hexes) {
        if (Imperium.gameGrid.Hexes[hx].shouldBeLand) {
            Imperium.gameGrid.Hexes[hx].TerrainType = "land";
        }
    }
    
    //get list of lands
    hx = 0;
    for (hx in Imperium.gameGrid.Hexes) {
        if (Imperium.gameGrid.Hexes[hx].TerrainType === "land") {
            Imperium.land_list.push(Imperium.gameGrid.Hexes[hx]);
        }
    }
    
    //generate estates
    hx = 0;
    nx = 0;

    for (ix = 0; ix < Imperium.land_list.length; ix += 1) {
        tcnt = Math.floor(Imperium.land_list.length / 10) + 1; //number of estates?
        for (jx = 0; jx < tcnt; jx += 1) {
            created = false;
            attempts = 0;
            while (!created && attempts < 1) {
                attempts += 1;
                nt = randFromSeed(Imperium.land_list.length);
                isOk = false;
                if (Imperium.land_list[nt].estate === "") {
                    //check each neighbor to make sure it's isn't beachfront
                    isOk = true;
                    for (nx in Imperium.land_list[nt].Neighbors) {
                        if (Imperium.land_list[nt].Neighbors[nx] !== null) {
                            if (Imperium.land_list[nt].Neighbors[nx].TerrainType === "water") {
                                isOk = false;
                            }
                            if (Imperium.land_list[nt].Neighbors[nx].estate !== "") {
                                isOk = false;
                            }
                        }
                    }
                }
                if (isOk && Math.random() < 0.018) {
                    Imperium.land_list[nt].estate = "town";
                    Imperium.town_list.push(Imperium.land_list[nt]);
                    created = true;
                }
            }
        }
    }
}

function handleMouse(e) {
    //function to return corrected mouse position
    //https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    "use strict";
    var bound,
        x,
        y;
    bound = Imperium.canvas.getBoundingClientRect();

    x = e.clientX - bound.left - Imperium.canvas.clientLeft;
    y = e.clientY - bound.top - Imperium.canvas.clientTop;
        
    Imperium.mouseX = x;
    Imperium.mouseY = y;
}

function changeMap() {
    //handles when "change map" button is pressed
    "use strict";
    var mapNo;
    Imperium.startup = true;
    mapNo = document.getElementById("MapInput").value;
    Imperium.mapNumber = mapNo;
    Imperium.seed = Imperium.mapNumber;
}

function randomMap() {
    //handles when "random map" button is pressed
    "use strict";
    var mapNo;
    Imperium.startup = true;
    mapNo = Math.floor(Math.random() * 1000000);
    document.getElementById("MapInput").value = mapNo;
    Imperium.mapNumber = mapNo;
    Imperium.seed = Imperium.mapNumber;
}

function shuffle(a) {
    //rearranges elements of an array
    "use strict";
    var i = 0,
        rn = 0,
        temp;
    for (i = 0; i < a.length; i += 1) {
        temp = a[i];
        rn = randFromSeed(a.length);
        a[i] = a[rn];
        a[rn] = temp;
    }
}

function canWalk(tile1, tile2, avoidEstate, avoidWater) {
    //function returning boolean determining whether army can travel
    //tile1, tile2 are hexes. avoidEstate array of text ["town"]; avoidWater boolean
    "use strict";
    var i = 0;
    for (i = 0; i < avoidEstate.length; i += 1) {
        if (tile2.estate === avoidEstate[i]) {
            return false; //avoid tile2 if it has an unwanted estate
        }
    }
    if (!avoidWater) {
        return true;
    }
    if (tile1.TerrainType === "water" && tile2.TerrainType === "water") {
        return true;
    }
    if (tile1.TerrainType === "land" && tile2.TerrainType === "land") {
        return true;
    }
    if (tile1.TerrainType === "water" && tile2.TerrainType === "land") {
        return true;
    }
    if (tile1.estate === "port" && tile2.TerrainType === "water") {
        return true;
    }
    return false;
}

function reDraw() {
    "use strict";
    var hx = 0,
        myPoint = {X: 0, Y: 0}, //I don't understand OOP
        hoverHex = null;
    myPoint.X = Imperium.mouseX;
    myPoint.Y = Imperium.mouseY;

    Imperium.debugP.innerHTML = "Coordinate: (" + Imperium.mouseX + ", " + Imperium.mouseY + ")";
    
    for (hx in Imperium.gameGrid.Hexes) {
        Imperium.gameGrid.Hexes[hx].selected = false;
        Imperium.gameGrid.Hexes[hx].draw(Imperium.ctx);
    }
    
    hoverHex = Imperium.gameGrid.GetHexAt(myPoint);
    if (hoverHex !== null) {
        for (hx in hoverHex.Neighbors) {
            if (hoverHex.Neighbors[hx] !== null) {
                hoverHex.Neighbors[hx].selected = true;
                hoverHex.Neighbors[hx].draw(Imperium.ctx);
            }
        }
        for (hx in hoverHex.FurtherNeighbors) {
            if (hoverHex.FurtherNeighbors[hx] !== null) {
                hoverHex.FurtherNeighbors[hx].selected = true;
                hoverHex.FurtherNeighbors[hx].draw(Imperium.ctx);
            }
        }
    }
}

function gameLoop() {
    "use strict";
    if (Imperium.startup) {
        drawTerrain();
        Imperium.startup = false;
    }
    reDraw();
    window.requestAnimationFrame(gameLoop);
}

//set up and then start game loop
window.requestAnimationFrame(gameLoop);