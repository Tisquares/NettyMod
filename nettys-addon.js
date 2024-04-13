"# NettyMod" 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

elements.death_star = {
    color:  ["#49413F", "#3B2F2F"],
    category: "weapons", 
    behavior: [
    "XX|XX|XX",
    "XX|XX|BO AND M1",
    "XX|XX|XX",
    ],
 tick:function(pixel){
     createPixel ("blaster", pixel.x, pixel.y+10) 
    },
   tempHigh: 3000,
   stateHigh: "plasma",
   state: "solid",
  };
  elements.flying_bomber = {
    color: "#8583c9",
    category: "weapons",
    behavior: behaviors.FLY,
    state: "solid",
     tick: function(pixel) {
    if (Math.random() < 1) {createPixel("bomb", pixel.x, pixel.y+1);}
     },
  };
  elements.super_missile = {
    color: ["", "#E1DFDF"], // The color slot is supposed to be empty lol
    category: "weapons",
    behavior: [
      "XX|M1|XX",
      "XX|XX|XX",
      "XX|CR:flash|XX",
    ],
    tick: function(pixel) {
      for (var i = 0; i < squareCoords.length; i++) {
                var coord = squareCoords[i];
                var x = pixel.x+coord[0];
                var y = pixel.y+coord[1];
     if (isEmpty(x, y, true) && !isEmpty(x, y)) {
            explodeAt(pixel.x, pixel.y, 25, "plasma");
     }
    }
   },
  };
  elements.energy_wave = {
  color: "#F1FF00",
  category: "weapons",
  behavior: [
    "DL|XX|DL",
    "M1 AND BO AND DL|EX:25>lightning%0.25|DL",
    "DL|XX|DL",
  ],
tick: function(pixel) {
   createPixel("flash", pixel.x-1, pixel.y)
   createPixel("energy_wave", pixel.x-1, pixel.y)
},
 };
 elements.the_spread = {
  color: ["#5B0470", "#7E0434"],
  category: "weapons",
  behavior: [
    "CH:uranium>the_spread|CH:uranium>the_spread|CH:uranium>the_spread",
    "CH:uranium>the_spread|XX|CH:uranium>the_spread",
    "CH:uranium>the_spread|CH:uranium>the_spread|CH:uranium>the_spread",
     ],
     tick: function(pixel) {
      if (Math.random() < 0.10) {
        createPixel("cld_spread", pixel.x-Math.floor(Math.random())*35, pixel.y-50)
        createPixel("lightning", pixel.x-Math.floor(Math.random())*35, pixel.y-50)
      }
     // Generates a storm
     },
   reactions: {
    "dirt": { elem1: "the_spread", elem2: "the_spread"},
    "lightning": { elem1: "explosion", elem2: "lightning"},
   }
};
// Cloud Generator for spread
elements.cld_spread = {
   color: "#FFFFFF",
   temp: 9999,
   tick: function(pixel) {
    explodeAt(pixel.x, pixel.y, 25, "rad_cloud")
    deletePixel(pixel.x, pixel.y);
},
   tempHigh: 8000,
   hidden: true,
   stateHigh: "plasma"
};
elements.instafreeze = {
  color: ["#50D6EC", "#091761", "#9FFEFF"],
  category: "weapons",
  behavior: behaviors.SUPERFLUID,
  temp: -1e+27,
  tick: function(pixel) {
     if (Math.floor(Math.random())*35 < 5) {
      createPixel("permafrost", pixel.x-1, pixel.y)
      createPixel("permafrost", pixel.x+1, pixel.y)
      createPixel("permafrost", pixel.x, pixel.y-1)
      createPixel("permafrost", pixel.x, pixel.y+1)
     }
},
    breakInto: "ice_nine",
    
};
elements.the_sickness = {
  color: ["#FFFFFF", "#F0EFEF", "#5F1C74"],
  category: "weapons",
  behavior: behaviors.LIQUID,
  tick: function(pixel) {     // *if not pixel below is empty, create a stalk and delete itself*
    if (!isEmpty(pixel.x, pixel.y+1)) {
      createPixel("sickness_stalk", pixel.x, pixel.y-1)
      deletePixel(pixel.x, pixel.y)
    }
  },
};

elements.sickness_stalk = {
  color: "#FFFFFF",
  hidden: true,
  behavior: behaviors.WALL,
  tick: function(pixel) {
    if ( pixel.toGrow === undefined ) {
      pixel.toGrow = Math.floor(Math.random())*30
    }
    if ( pixel.toGrow && isEmpty(pixel.x, pixel.y-1) ) {
      createPixel("sickness_stalk", pixel.x, pixel.y-1)
      pixelMap[pixel.x][pixel.y-1].toGrow = pixel.toGrow-1
    }
  else {
        // do when its done growing (toGrow is 0)
        createPixel("sickness_spore", pixel.x, pixel.y-1)
   }
  },
};
elements.sickness_spores = {
  color: "#F0EFEF",
  hidden: true,
  behavior: behaviors.WALL, 
  reactions: {
        "fire": { elem1: "fire", elem2: "the_sickness" },
  },
};

elements.heavenly_ray = {
    color: ["#FFFF00", "#FFFFFF", "#7FFFD4"],
    reactions: {
        "uranium": { elem1: "ultra_uranium", elem2: "bless" },
        "dirt": { elem1: "plasma", elem2: "bless" },
        "sand": { elem1: "plasma", elem2: "bless" },
        "mud": { elem1: "plasma", elem2: "bless" },
        "water": { elem1: "plasma", elem2: "bless" },
    },
    tick: function (pixel) {
        var x = pixel.x;
        for (var y = pixel.y; y < height; y++) {
            if (outOfBounds(x, y)) {
                break;
            }
            if (isEmpty(x, y)) {
                if (Math.random() > 0.05) { continue }
                createPixel("flash", x, y);
                pixelMap[x][y].color = ["#FFFF00", "#FFFFFF", "#7FFFD4"];
                pixelMap[x][y].temp = 3500;
            }
            else {
                if (elements[pixelMap[x][y].element].isGas) { continue }
                if (elements[pixelMap[x][y].element].id === elements.heavenly_ray.id) { break }
                deletePixel(pixel.x, pixel.y - 1);
                pixelTempCheck(pixelMap[x][y]);
                break;
            }
            deletePixel(pixel.x, pixel.y);
        }


    },
    temp: 100000,
    category: "weapons",
    state: "gas",
    density: 1,
    excludeRandom: true,
    noMix: true

};

elements.crawl = {
    color: ["#800080", "#FFA500"],
    behavior: [
        "XX|CH:crawl|XX",
        "CH:crawl|EX:60>plasma,plasma,plasma,plasma,radiation,rad_steam%0.01|CH:crawl",
        "M2|M1 AND CH:crawl|M2",
    ],
    state: "solid",
    temp: 9000,
    reactions: {
        "super_powder": { elem1: "ultra_uranium", elem2: "null" },
    }
};

var placed = false

elements.time_bomb = {
    color: "#f00000",
    behavior: behaviors.STURDYPOWDER,
    state: "solid",
    category: "weapons",
    tick: function (pixel) {
        if (placed == false) {
            placed = true
            start = pixelTicks
        }
        console.log("placed:" + placed)
        console.log("start:" + start)
        console.log("tickslived:" + pixelTicks)
        if (pixelTicks == start + 100) {
            changePixel(pixel, "explosion")
            sleep(1000).then(() => { placed = false })
        }
    }
};

elements.flying_bomber = {
    color: "#8583c9",
    behavior: behaviors.FLY,
    state: "solid",
    tick: function(pixel) {
        if (Math.random() < 0.01) {createPixel("bomb", pixel.x, pixel.y+10);}
    },
    hardness: 1,
    tempHigh: 9000,
    stateHigh: "magma",
    density: 4000,
 };

 elements.bouncy_bomb = {
    color: ["#736F6E", "#625D5D"],
    category: "weapons",
    state: "solid",
    hidden: true,
    tick: function (pixel) {
        // Ask tisqbisque or modding channel with questions
        if (pixel.start === pixelTicks) { // init starting values
            pixel.bounce_y = pixel.y + 10; // by default can't bounce back up to starting
            pixel.bounce = 0; // if even, going down. odd, going up
        }

        if(pixel.bounce_y > 87) { // temporary, in the future bounce_y can change depending on pixel.y and current bounce count
            pixel.bounce_y = 86;
        }

        // Bouncing
        if (pixel.bounce % 2 === 0 && !tryMove(pixel, pixel.x, pixel.y + 1)) { // if unable to keep going down
            pixel.bounce++;
            tryMove(pixel,pixel.x,pixel.y-1); // bounce up
        }

        if (pixel.bounce % 2 === 1 && (!tryMove(pixel, pixel.x, pixel.y - 1) || pixel.y <= pixel.bounce_y) ) { // if unable to keep going up
            pixel.bounce++;
            pixel.bounce_y += 10; // change bounce height..
            tryMove(pixel,pixel.x,pixel.y+1); // bounce down
        }

        // Explode after set # bounces, may explode on peak height if # odd
        if (pixel.bounce > 10) {
            explodeAt(pixel.x, pixel.y, 20, "plasma");
        }
    },
};

elements.super_powder = {
    color: ["#000000", "#C0C0C0"],
    behavior: [
        "XX|DL|XX",
        "DL|EX:20%15>plasma,plasma,radiation,fire,rad_cloud|DL" ,
        "M2|DL AND M1|M2",
    ],
    category: "weapons",
    state: "solid",
    temp: 98000,
};

elements.crawl = {
    color: ["#800080", "#FFA500"],
    behavior: [
        "XX|CH:crawl|XX",
        "CH:crawl|EX:60>plasma,plasma,plasma,plasma,radiation,rad_steam%0.01|CH:crawl",
        "M2|M1 AND CH:crawl|M2"
    ],
    state: "solid",
    temp: 9000,
    reactions: {
        "super_powder": { elem1: "ultra_uranium", elem2: "null"},
    }
};

elements.ultra_uranium = {
    color: ["#50C878" , "#4F7942"],
    behavior: [
        "XX|XX|XX",
        "XX|DL%5|XX",
        "M2%25|M1%25|M2%25",
    ],
    category: "weapons",
    state: "solid",
    temp: 9999999999999999,
    hardness: 1,
};

elements.mega_beam = {
    color: ["#DFFF00" , "#00FFFF"],
    tick: function(pixel) {
        var x = pixel.x;
        for (var y = pixel.y; y < height; y++) {
            if (outOfBounds(x, y)) {
                break;
            }
            if (isEmpty(x, y)) {
                if (Math.random() > 0.05) { continue }
                createPixel("flash", x, y);
                pixelMap[x][y].color = "#DFFF00";
                pixelMap[x][y].temp = 9800;
            }
            else {
                if (elements[pixelMap[x][y].element].isGas) { continue }
                if (elements[pixelMap[x][y].element].id === elements.mega_beam.id) { break }
                pixelMap[x][y].temp += 9800;
                pixelTempCheck(pixelMap[x][y]);
                break;
            }
        }
        deletePixel(pixel.x-1, pixel.y-1);
        deletePixel(pixel.x+1, pixel.y+1);
        if ( pixelTicks - pixel.start > 1) {
            deletePixel(pixel.x, pixel.y)
        }
        doHeat(pixel);
    },
    temp: 9800,
    category: "weapons",
    state: "gas",
    density: 1,
    excludeRandom: true,
    noMix: true
};

elements.fire_tornado = {
    color: ["#FF8C00","#FFDF00","#E41B17"],
    tick: function(pixel) {
        if (pixel.stage) {
            var coords = circleCoords(pixel.x,pixel.y,pixel.stage);
            var coords = rectCoords(Math.floor(pixel.x-pixel.stage/2),pixel.y-pixel.stage,Math.floor(pixel.x+pixel.stage/2),pixel.y);
            if (pixel.stage >= pixel.mag) {
                deletePixel(pixel.x,pixel.y);
                return;
            }
            coords.forEach(function(coord){
                var x = coord.x;
                var y = coord.y;
                if (!isEmpty(x,y,true)) {
                    var p = pixelMap[x][y];
                    if (p.element === "fire_tornado") { return }
                    if (elements[p.element].breakInto) {
                        if (Math.random() < (elements[p.element].hardness || 1) * 0.1) {
                            breakPixel(p);
                        }
                    }
                    if (!elements[p.element].movable) { return }
                    if (!p.del && Math.random() < 0.1) { tryMove(p,p.x,p.y-1); }
                }
                else if (isEmpty(x,y)) {
                    createPixel(pixel.clone,x,y);
                }
            })
            pixel.stage++;
        }
        else if (!tryMove(pixel,pixel.x,pixel.y+1)) {
            if (!isEmpty(pixel.x,pixel.y+1,true)) {
                var elem = pixelMap[pixel.x][pixel.y+1].element;
                if (elem === "fire_tornado") { return }
                if (elements[elem].state !== "gas") { pixel.clone = "fire"; }
                else { pixel.clone = elem; }
            }
            else {
                pixel.clone = "fire";
            }
            // random 10 to 20
            pixel.mag = Math.floor(Math.random() * 10) + 20;
            pixel.stage = 1;
        }
    },
    category: "weapons",
    state: "liquid",
    maxSize: 1,
    density: 997,
    cooldown: defaultCooldown,
    excludeRandom: true,
};
