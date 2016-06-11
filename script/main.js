/* GRADIENT */

/*
var colors = new Array(
    [62, 35, 255], [45, 175, 230], [255, 35, 98], [45, 175, 230], [255, 0, 255], [255, 35, 98]);

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0, 1, 2, 3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient() {

    if ($ === undefined) return;

    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];

    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

    $('#gradient').css({
        background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
    }).css({
        background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
    });

    step += gradientSpeed;
    if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        //pick two new target color indices
        //do not pick the same as the current one
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;

    }
}

setInterval(updateGradient, 20);


*/

/* ########## END GRADIENT ############### */





// #############################
// # DECLARATION DES FONCTIONS #
// # ET INITIALISATION VARIABL #
// #############################


/* ########## INITIALISATION ########## */
var score;
var generation;

var queenBar;
var kingBar;
var synchroBar = [];

var critterKing;
var critterQueen;
var kingChild;
var queenChild;

var boost;
var upgrade;

var usineTerre;
var usineTransportTerre;
var usineEau;
var usineTransportEau;

var usineStockEau;
var usineStockTerre;

function Usine(type, stat) {
    this.type = type;
    this.stat = stat;
    this.workers = [];
    this.level = 1;
    this.productionNum = 0;

    this.findPlace = function (critter) {
        var value = critter[this.stat];
        for (i = 0; i < this.level; i++) {
            if (this.workers[i] == undefined) return i;
        }
        return -1
    }; // NON TROUVE DONNE -1, SINON RENVOIE LA PLACE
    this.findBestPlace = function (critter) {        
        var value = critter[this.stat];
        for (i = 0; i < this.level; i++) {
            if (this.workers[i] != undefined && this.workers[i] < value) {
                return i;
            }
        }
        return -1;
    }
    this.replaceWorker = function (place, critter) {
        this.workers[place] = critter[this.stat]
        if (typeof critter.king == "object") deleteKingChild()
        if (typeof critter.queen == "object" ) deleteQueenChild();
    };
    this.update = function () {
        for (i = 0; i < 10; i++) {
            if (i < this.level) {
                $('#' + this.type + i).show();
                if (this.workers[i] != null) {
                    $('#' + this.type + i).text(this.workers[i]);
                } else {
                    $('#' + this.type + i).text('0');
                }
            } else {
                $('#' + this.type + i).hide();
            }
        }
        this.updateProduction();

    };
    this.upgrade = function () {
        if (score > Math.pow(10, (this.level))) {
            score -= Math.pow(10, (this.level));
            this.level++;
            updateData();
            updateTooltip();
        }
    };
    this.production = function () {
        var sum = 0;
        for (i = 0; i < this.level; i++) {
            if (isNaN(this.workers[i]) == false) {
                sum += this.workers[i];
            }
        }
        this.productionNum = sum / 10;
    };
    this.updateProduction = function () {
        this.production();
        $('#production-' + this.type).text(this.productionNum + ' / s');
    };
}

function Army() {
    this.soldiers = [];
    this.level = 1;

    this.findPlace = function (critter) {
        var score = critter.score
        var place = -1;

        for (i = 0; i < this.level; i++) {
            if (this.soldiers[i] == undefined) return i;
        }

        var minScore = this.soldiers[0].score;

        for (i = 0; i < this.level; i++) {
            if (this.soldiers[i] != undefined && this.soldiers[i].score < minScore) {
                minScore = this.soldiers[i].score
                place = i
            }
        }
        return place;

    }
    this.replaceSoldier = function (place, critter) {
        this.soldiers[place] = critter
        this.soldiers[place].level = 1

        if (typeof critter.king == "object") deleteKingChild()
        if (typeof critter.queen == "object" ) deleteQueenChild();

        this.update()
        console.log(this.soldiers)
    }
    this.sortTab = function () {
        this.soldiers.sort(function(a, b){
            if ( a.level == b.level ) return b.score - a.score
            return b.level - a.level
        })
    }
    this.update = function () {
        this.sortTab()
        for (i = 0; i < 10; i++) {
            if (i < this.level) {
                $('#army' + i).show();
                if (this.soldiers[i] != undefined) {
                    $('#army' + i + 'Level').text(this.soldiers[i].level)
                    $('#army' + i + 'Score').text(this.soldiers[i].score)
                    $('#army' + i + 'Vita').text(this.soldiers[i].vita)
                    $('#army' + i + 'Force').text(this.soldiers[i].force)
                    $('#army' + i + 'Agi').text(this.soldiers[i].agi)
                    $('#army' + i + 'Morsure').text(this.soldiers[i].morsure)
                    $('#army' + i + 'Piqure').text(this.soldiers[i].piqure)
                } else {
                    $('#army' + i + 'Level').text("")
                    $('#army' + i + 'Score').text("")
                    $('#army' + i + 'Vita').text("")
                    $('#army' + i + 'Force').text("")
                    $('#army' + i + 'Agi').text("")
                    $('#army' + i + 'Morsure').text("")
                    $('#army' + i + 'Piqure').text("")
                }

            } else {
                $('#army' + i).hide();
            }
        }
    }
    this.upgrade = function () {
        if (score > Math.pow(10, (this.level))) {
            score -= Math.pow(10, (this.level));
            this.level++;
            updateData();
            this.update()
            updateTooltip();
        }
    }
}

function Map() {
    this.data = {

        empty: true, 

        width: 0,
        height: 0,

        row: [],

        mound: {},
        ennemyMound: {},

        coord: {
            mound: [],
            ennemyMound: []
        }
    }

    this.self = this
    this.init = function () {
        this.linkMap()
        this.placeMound()
        this.placeEnnemyMound()
        this.useCoord()
        this.show()
    }

    this.linkMap = function () {
        for (var i=0; i<this.data.height; i++){
            this.data.row[i] = []
            for (var j=0; j<this.data.width; j++){

                this.data.row[i][j] = {
                    tile: $('#row'+i+'>#col'+j)
                }

            }
        }
    }
    this.placeMound = function () {
        if (Object.getOwnPropertyNames(this.data.mound).length === 0) {
            var x = Math.floor(Math.random() * this.data.width)
            var y = Math.floor(Math.random() * this.data.height)

            this.data.coord.mound = [x,y]
        }
    }
    this.placeEnnemyMound = function () {
        if (Object.getOwnPropertyNames(this.data.ennemyMound).length === 0) {
            var coord = this.distanceToMound()
            var x = coord[0]
            var y = coord[1]

            this.data.coord.ennemyMound = [x,y]
        }
    }
    this.distanceToMound = function () {
        var mX = this.data.coord.mound[0]
        var mY = this.data.coord.mound[1]
        
        console.log("mX:"+mX+"  mY:"+mY)
        var x,y,deltaX,deltaY

        do {
            x = Math.floor(Math.random() * this.data.width)
            y = Math.floor(Math.random() * this.data.height)
            
            deltaX = Math.abs(x - mX)
            deltaY = Math.abs(y - mY)
            console.log("x: "+x+"__y: "+y+"__dX: "+deltaX+"__dY: "+deltaY+"__add: "+(deltaX+deltaY))
        } while (deltaX+deltaY < 7 )
        return [x,y]
    }

    this.useCoord = function () {
        this.data.mound = this.data.row[this.data.coord.mound[0]][this.data.coord.mound[1]]
        this.data.ennemyMound = this.data.row[this.data.coord.ennemyMound[0]][this.data.coord.ennemyMound[1]]
    }
    this.show = function () {
        this.data.mound.tile.text("mound")
        this.data.ennemyMound.tile.text("ennemyMound")
    }
}
function initGame() {
    score = 10000;
    //    score = 0;
    generation = 0;

    queenBar = 0;
    kingBar = 0;

    critterKing = {
        vita: 5,
        force: 5,
        agi: 5,
        morsure: 5,
        piqure: 5,
        score: 5
    };
    critterQueen = {
        vita: 5,
        force: 5,
        agi: 5,
        morsure: 5,
        piqure: 5,
        score: 5
    };

    kingChild = [];
    queenChild = [];

    boost = 5;
    upgrade = 0;

    usineTerre = new Usine("terre", "force");
    usineTransportTerre = new Usine("transportTerre", "morsure");
    usineEau = new Usine("eau", "agi");
    usineTransportEau = new Usine("transportEau", "piqure");

    army = new Army();

    map = new Map();

    usineStockEau = 0;
    usineStockTerre = 0;

    updateData();
}

/* ########## OUVERTURE PAGE ########## */

function checkPage() {
    var state = localStorage.getItem("save");
    if (state != null) {
        loadGame();
    }
}

/* ########## TIMER ########## */

var lastUpdate = new Date().getTime();
setInterval(function () {
    var thisUpdate = new Date().getTime();
    var diff = (thisUpdate - lastUpdate);
    diff = Math.round(diff / 100);
    updateGame(diff);
    lastUpdate = thisUpdate;
}, 100);

var autoSave = new Date().getTime();
setInterval(function () {
    var thisSave = new Date().getTime();
    var diff = (thisSave - autoSave);
    diff = Math.round(diff / 100);
    saveGame(diff);
    autoSave = thisSave;
}, 60000)


/* ########## GESTION DE LA SAUVEGARDE ########## */

// Creation des fonctions
function saveGame() {
    var save = {
        score: score,
        generation: generation,
        critterKing: critterKing,
        critterQueen: critterQueen,
        kingChild: kingChild,
        queenChild: queenChild,
        boost: boost,
        upgrade: upgrade,

        usineStockEau: usineStockEau,
        usineStockTerre: usineStockTerre,

        workersEau: usineEau.workers,
        levelEau: usineEau.level,
        workersTerre: usineTerre.workers,
        levelTerre: usineTerre.level,
        workersTransportEau: usineTransportEau.workers,
        levelTransportEau: usineTransportEau.level,
        workersTransportTerre: usineTransportTerre.workers,
        levelTransportTerre: usineTransportTerre.level,

        armySoldier: army.soldiers,
        armyLevel: army.level,

        mapData: map.data
    };

    //    console.log("sauvegarde : ");
    //    console.log(save);

    localStorage.setItem("save", JSON.stringify(save));
    //    console.log(localStorage.getItem("save"));
    $(document).ready(function () {
        $('.savePop').fadeIn('fast');
        $('.savePop').delay(1000).fadeOut('slow');
    });
}

function loadGame() {
    var savegame = JSON.parse(localStorage.getItem("save"));
    console.log(savegame);
    if (typeof savegame.score !== "undefined") score = savegame.score;
    if (typeof savegame.generation !== "undefined") generation = savegame.generation;
    if (typeof savegame.critterKing !== "undefined") critterKing = savegame.critterKing;
    if (typeof savegame.critterQueen !== "undefined") critterQueen = savegame.critterQueen;
    if (typeof savegame.kingChild !== "undefined") kingChild = savegame.kingChild;
    if (typeof savegame.queenChild !== "undefined") queenChild =
        savegame.queenChild;
    if (typeof savegame.boost !== "undefined") boost = savegame.boost;
    if (typeof savegame.upgrade !== "undefined") upgrade = savegame.upgrade;

    if (typeof savegame.usineStockEau !== "undefined") usineStockEau = savegame.usineStockEau;
    if (typeof savegame.usineStockTerre !== "undefined") usineStockTerre = savegame.usineStockTerre;


    if (typeof savegame.workersEau !== "undefined") usineEau.workers = savegame.workersEau;
    if (typeof savegame.levelEau !== "undefined") usineEau.level = savegame.levelEau;
    if (typeof savegame.workersTerre !== "undefined") usineTerre.workers = savegame.workersTerre;
    if (typeof savegame.levelTerre !== "undefined") usineTerre.level = savegame.levelTerre;
    if (typeof savegame.workersTransportTerre !== "undefined") usineTransportTerre.workers = savegame.workersTransportTerre;
    if (typeof savegame.levelTransportTerre !== "undefined") usineTransportTerre.level = savegame.levelTransportTerre;
    if (typeof savegame.workersTransportEau !== "undefined") usineTransportEau.workers = savegame.workersTransportEau;
    if (typeof savegame.levelTransportEau !== "undefined") usineTransportEau.level = savegame.levelTransportEau;

    if (typeof savegame.armySoldier !== "undefined") army.soldiers = savegame.armySoldier
    if (typeof savegame.armyLevel !== "undefined") army.level = savegame.armyLevel

    if (typeof savegame.mapData !== "undefined") map.data = savegame.mapData

    updateData();
    updateUpgrade();
    army.update();
    createTable(8,8);
}

function deleteGame() {
    localStorage.removeItem("save");
    initGame();
    updateData();
    updateUpgrade();
    army.update();
}

//Lier aux boutons
$(document).ready(function () {
    $('.save').click(saveGame);
    $('.load').click(loadGame);
    $('.delete').click(deleteGame);
});




/* ########## CREER UN CRITTER ########## */

function makeStat(a, b) {
    // MOYENNE
    var c;

    c = Math.ceil((a + b) / 2);
    e = (a + b) / 2;
    if (c != e) {
        if (Math.round(Math.random()) == 1) {
            c--;
        }
    }

    // AJOUTE OU RETIRE LA VALEUR
    var random = Math.random() - 0.5;
    if (random < -0.2) random = -1;
    if (random > 0.2) random = 1;
    if (random >= -0.2 && random <= 0.2) random = 0;

    // VALEUR A AJOUTER OU RETIRER
    var adding = Math.random() * (c / 20);
    adding = Math.ceil(adding);
    adding = adding * random;

    //RETOUR
    c = c + adding;
    if (c < 1) c = 1;

    return c;
}

function createChild() {
    var king = critterKing;
    var queen = critterQueen;

    var vita = makeStat(king.vita, queen.vita);
    var force = makeStat(king.force, queen.force);
    var agi = makeStat(king.agi, queen.agi);
    var morsure = makeStat(king.morsure, queen.morsure);
    var piqure = makeStat(king.piqure, queen.piqure);

    var score = (vita + force + agi + morsure + piqure) / 5;
    score = Math.round(score * 10) / 10;

    var child = {
        vita: vita,
        force: force,
        agi: agi,
        morsure: morsure,
        piqure: piqure,
        score: score
    };

    var random = Math.round(Math.random());

    var i;

    if (random == 1) {
        child.queen = queen;
        child.queen.queen = null;

        i = nextFreePlace("queen", child);
        if (i != -1) queenChild[i] = child;

        updateQueenChild();

    } //QUEEN
    else {
        child.king = king;
        child.king.king = null;

        i = nextFreePlace("king", child);

        if (i != -1) kingChild[i] = child;

        updateKingChild();
    } //KING
}




/* ########## REMPLACER LES PARENTS ########### */

function setKing() {
    if (kingChild[0] != null) {
        critterKing = kingChild[0];
        kingChild.shift();
        kingBar = 0;
        generation++;
        updateData();
    }
}

function deleteKingChild() {
    kingChild.shift();
    updateData();
}

function setQueen() {
    if (queenChild[0] != null) {
        critterQueen = queenChild[0];
        queenChild.shift();
        queenBar = 0;
        generation++;
        updateData();
    }
}

function deleteQueenChild() {
    queenChild.shift();
    updateData();
}

//Lier aux boutons
$(document).ready(function () {
    $('.promote-queen').click(setQueen);
    $('.promote-king').click(setKing);
    $('.supprimer-critter-queen').click(function (e) {
        if (e.shiftKey == true) {
            queenChild = [];
            updateData;
        } else {
            deleteQueenChild();
        }
    });
    $('.supprimer-critter-king').click(function (e) {
        if (e.shiftKey == true) {
            kingChild = [];
            updateData;
        } else {
            deleteKingChild();
        }
    });
});




/* ########## SELECTION ET PLACEMENT CRITTER ########### */

function decide(type, critter) {
    if (critter.king != null) {
        if (critter[type] > critter.king[type]) {
            return true;
        }
    }

    if (critter.queen != null) {
        if (critter[type] > critter.queen[type]) {
            return true;
        }
    }
}

function nextFreePlace(parent, child) {
    var tab;
    if (parent == "queen") tab = queenChild;
    if (parent == "king") tab = kingChild;

    var place = 0;
    var found = false;

    for (i = 0; i <= upgrade; i++) {
        if (tab[i] == null && found == false) {
            place = i;
            found = true;
        }
    }
    if (found == false) {

        if (tab[upgrade].score < child.score) {
            return upgrade;
        } else {
            return -1;
        }

    } else {
        return place;
    }
} //Retourne la place libre suivante. Si aucune trouvé et que le dernier est mieux que l'enfant actuel, renvoi -1.




/* ########## BOOST ET UPGRADE ########## */

function boosting() {
    if (boost > 1) {
        synchroBar[0] = true;
        synchroBar[1] = true;
        finishBar(false);
        //                boost--;
        boost = Math.round(boost * 10) / 10;
        updateBoost();
        updateData();
    }
}

function upgrading() {
    if (score > nextScore() && upgrade < 10) {
        score -= nextScore();
        upgrade++;
        updateUpgrade();
        updateData();
    }
}

function nextScore() {
    return Math.pow(10, (upgrade + 1));
}

// Lier au bouton
$(document).ready(function () {
    $('.boost').click(function () {
        boosting();
    })
    $('.upgrade').click(function () {
        upgrading();
    });
});




/* ########## KeyPress Shift ########## */

$(document).keydown(function (e) {
    if (e.keyCode == 16) {
        $('.promote-queen, .promote-king').hide();
        $('.worker-queen, .worker-king').text("Tout ouvrier");
        $('.supprimer-critter-queen, .supprimer-critter-king').text("Tout supprimer");
        $('.soldier-king, .soldier-queen').text('Tout soldats')
    }
});

$(document).keyup(function (e) {
    if (e.keyCode == 16) {
        $('.promote-queen, .promote-king').show();
        $('.worker-queen, .worker-king').text("Ouvrier");
        $('.supprimer-critter-queen, .supprimer-critter-king').text("Supprimer");
        $('.soldier-king, .soldier-queen').text('Soldat')
    }
});




/* ########## UPDATE DU JEU ########## */

function updateGame() {
    updateKingBar(kingBar);
    updateQueenBar(queenBar);
}

function updateKingBar(value) {
    if (value < 100) {
        kingBar++;
        value++;
        $('.king-progress').css('width', value + '%').attr('aria-valuenow', value);
    } else {
        synchroBar[0] = true;
        finishBar();
    }
} //GERE L'AFFICHAGE DE LA BAR ROI

function updateQueenBar(value) {
    if (value < 100) {
        queenBar++;
        value++;
        $('.queen-progress').css('width', value + '%').attr('aria-valuenow', value);
    } else {
        synchroBar[1] = true;
        finishBar();
    }
} //GERE L'AFFICHAGE DE LA BAR REINE

function finishBar(bool) {
    if (synchroBar[0] == true && synchroBar[1] == true) {
        synchroBar[0] = false;
        synchroBar[1] = false;
        kingBar = 0;
        queenBar = 0;
        createChild(critterKing, critterQueen);
        if (boost < 10 && bool != false) // Verifie si boost < 10 et si l'ordre ne vient pas de boost
        {
            boost += 0.1;
            boost = Math.round(boost * 10) / 10;
        }
    }
}

function updateData() {
    $(document).ready(function () {

        score = Math.round(score * 10) / 10;
        $('.score').text("Score : " + score);
        $('.generation').text("Génération : " + generation);

        updateKing();
        updateQueen();
        updateKingChild();
        updateQueenChild();
        updateUsine();

        updateBoost();
    });

} // GERE LE SCORE ET LES GENERATIONS + AFFICHAGE GLOBAL

function updateKing() {
    var king = critterKing;
    $('#kingScore').text(king.score);
    $('#kingVita').text(king.vita);
    $('#kingForce').text(king.force);
    $('#kingAgi').text(king.agi);
    $('#kingMorsure').text(king.morsure);
    $('#kingPiqure').text(king.piqure);
} //AFFICHE LE ROI CRITTER

function updateQueen() {
    var queen = critterQueen;
    $('#queenScore').text(queen.score);
    $('#queenVita').text(queen.vita);
    $('#queenForce').text(queen.force);
    $('#queenAgi').text(queen.agi);
    $('#queenMorsure').text(queen.morsure);
    $('#queenPiqure').text(queen.piqure);
} //AFFICHE LA REINE CRITTER

function updateKingChild() {

    sortChild("king");

    for (i = 0; i <= upgrade; i++) {
        if (kingChild[i] != null) {
            //MODIFIE L'AFFICHAGE DE L'ENFANT
            $('#kingChild' + i + 'Score').text(kingChild[i].score);
            $('#kingChild' + i + 'Vita').text(kingChild[i].vita);
            $('#kingChild' + i + 'Force').text(kingChild[i].force);
            $('#kingChild' + i + 'Agi').text(kingChild[i].agi);
            $('#kingChild' + i + 'Morsure').text(kingChild[i].morsure);
            $('#kingChild' + i + 'Piqure').text(kingChild[i].piqure);

            //COLORE LES STATS
            colorKingChild("score", i);
            colorKingChild("vita", i);
            colorKingChild("force", i);
            colorKingChild("agi", i);
            colorKingChild("morsure", i);
            colorKingChild("piqure", i);
        } else {
            $('#kingChild' + i + 'Score').text("");
            $('#kingChild' + i + 'Vita').text("");
            $('#kingChild' + i + 'Force').text("");
            $('#kingChild' + i + 'Agi').text("");
            $('#kingChild' + i + 'Morsure').text("");
            $('#kingChild' + i + 'Piqure').text("");
        }
    }
} //AFFICHE LE 1er ENFANT ROI CRITTER

function updateQueenChild() {

    sortChild("queen");

    for (i = 0; i <= upgrade; i++) {
        if (queenChild[i] != null) {
            $('#queenChild' + i + 'Score').text(queenChild[i].score);
            $('#queenChild' + i + 'Vita').text(queenChild[i].vita);
            $('#queenChild' + i + 'Force').text(queenChild[i].force);
            $('#queenChild' + i + 'Agi').text(queenChild[i].agi);
            $('#queenChild' + i + 'Morsure').text(queenChild[i].morsure);
            $('#queenChild' + i + 'Piqure').text(queenChild[i].piqure);

            colorQueenChild("score", i);
            colorQueenChild("vita", i);
            colorQueenChild("force", i);
            colorQueenChild("agi", i);
            colorQueenChild("morsure", i);
            colorQueenChild("piqure", i);
        } else {
            $('#queenChild' + i + 'Score').text("");
            $('#queenChild' + i + 'Vita').text("");
            $('#queenChild' + i + 'Force').text("");
            $('#queenChild' + i + 'Agi').text("");
            $('#queenChild' + i + 'Morsure').text("");
            $('#queenChild' + i + 'Piqure').text("");
        }
    }
} //AFFICHE LE 1er ENFANT REINE CRITTER

function colorKingChild(stat, i) {
    var majStat = stat.charAt(0).toUpperCase() + stat.substring(1);

    var parent = critterKing[stat];
    var child = kingChild[i][stat];

    if (child > parent) $('#kingChild' + i + majStat).css("color", "#9ace9a");
    if (child < parent) $('#kingChild' + i + majStat).css("color", "red");
    if (child == parent) $('#kingChild' + i + majStat).css("color", "black");
} //Colore

function colorQueenChild(stat, i) {
    var majStat = stat.charAt(0).toUpperCase() + stat.substring(1);

    var parent = critterQueen[stat];
    var child = queenChild[i][stat];

    if (child > parent) $('#queenChild' + i + majStat).css("color", "#9ace9a");
    if (child < parent) $('#queenChild' + i + majStat).css("color", "red");
    if (child == parent) $('#queenChild' + i + majStat).css("color", "black");
} //Colore

function sortChild(parent) {
    var tab;
    if (parent == "queen") tab = queenChild;
    if (parent == "king") tab = kingChild;

    tab.sort(function (a, b) {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return 0;
    });


    if (parent == "queen") queenChild = tab;
    if (parent == "king") kingChild = tab;
}

function updateBoost() {
    $('.boost').text("Boost " + boost + "/10");
}

function updateUpgrade() {
    for (i = 0; i < 10; i++) {
        if (i <= upgrade) {
            $('#queenChild' + i).show();
            $('#kingChild' + i).show();
        } else {
            $('#queenChild' + i).hide();
            $('#kingChild' + i).hide();
        }
    }

    $(document).ready(function () {
        updateTooltip();
    })
}

function updateUsine() {
    usineEau.update();
    usineTerre.update();
    usineTransportEau.update();
    usineTransportTerre.update();
}





/* ################ PARTIE USINE ################## */

/* ############ RELIER LES BOUTONS ############# */
$(document).ready(function () {
    $('.worker-king').click(function (e) {
        if (e.shiftKey == true) {
            setAllWorker2(kingChild[0]);
        } else {
            setWorker2(kingChild[0]);
        }
    });
    $('.worker-queen').click(function (e) {
        if (e.shiftKey == true) {
            setAllWorker2(queenChild[0]);
        } else {
            setWorker2(queenChild[0]);
        }
    });
    $('#upgradeeau').click(function () {
        usineEau.upgrade();
    });
    $('#upgradetransportEau').click(function () {
        usineTransportEau.upgrade();
    });
    $('#upgradeterre').click(function () {
        usineTerre.upgrade();
    });
    $('#upgradetransportTerre').click(function () {
        usineTransportTerre.upgrade();
    });
});

/* ############ DEFINITION DES FONCTIONS ############# */

function setWorker(critter) {
    console.log(typeof critter)
    if (typeof critter !== "undefined") {
        findEmptyPlace(critter);
        updateData();
    }
}
function setAllWorker(critter) {    
    if (typeof critter !== "undefined") {
        setWorker(critter);

        if (typeof critter.king == "object") setAllWorker(kingChild[0]);
        if (typeof critter.queen == "object")setAllWorker(queenChild[0]);
    }
}
function findEmptyPlace(critter) {
    var usineTempo = findBestStat(critter);
    var critterTempo = critter;
    console.log("UsineTempo stat : " + usineTempo.stat);
    if (usineTempo.findPlace(critterTempo) != -1) {
        usineTempo.replaceWorker(usineTempo.findPlace(critterTempo), critter)
    } else if (critter[usineTempo.stat] != 0) {
        var critterDebuff = critterTempo;
        critterDebuff[usineTempo.stat] = 0;
        findEmptyPlace(critterDebuff);
    }
}
function findBestStat(critter) {
    var a, b;

    a = critter.agi;
    b = usineEau;

    if (a < critter.force) {
        a = critter.force;
        b = usineTerre;
    }
    if (a < critter.piqure) {
        a = critter.piqure;
        b = usineTransportEau;
    }
    if (a < critter.morsure) {
        a = critter.morsure;
        b = usineTransportTerre;
    }

    return b;
}


function setWorker2(critter) {
    var found = false
    if (typeof critter !== "undefined") {
        found = findEmptyPlace2(critter)

        if (found == false) {
            found = findBestPlace(critter)

            if (found == false) {
                if (typeof critter.king == "object") deleteKingChild()
                if (typeof critter.queen == "object" ) deleteQueenChild();

            }
        }
    }
}
function setAllWorker2(critter) {
    if (typeof critter !== "undefined") {
        setWorker2(critter);

        if (typeof critter.king == "object") setAllWorker2(kingChild[0]);
        if (typeof critter.queen == "object")setAllWorker2(queenChild[0]);
    }
}
function findEmptyPlace2(critter) {
    if (usineEau.findPlace(critter) != -1 ) {
        usineEau.replaceWorker(usineEau.findPlace(critter), critter)
        return true
    }
    if (usineTerre.findPlace(critter)!= -1 ) {
        usineTerre.replaceWorker(usineTerre.findPlace(critter), critter)
        return true
    }
    if (usineTransportEau.findPlace(critter) != -1 ) {
        usineTransportEau.replaceWorker(usineTransportEau.findPlace(critter), critter)
        return true
    }
    if (usineTransportTerre.findPlace(critter) != -1 ) {
        usineTransportTerre.replaceWorker(usineTransportTerre.findPlace(critter), critter)
        return true
    }
    return false
}
function findBestPlace(critter) {
    if (usineEau.findBestPlace(critter) != -1 ) {
        usineEau.replaceWorker(usineEau.findBestPlace(critter), critter)
        return true
    }
    if (usineTerre.findBestPlace(critter)!= -1 ) {
        usineTerre.replaceWorker(usineTerre.findBestPlace(critter), critter)
        return true
    }
    if (usineTransportEau.findBestPlace(critter) != -1 ) {
        usineTransportEau.replaceWorker(usineTransportEau.findBestPlace(critter), critter)
        return true
    }
    if (usineTransportTerre.findBestPlace(critter) != -1 ) {
        usineTransportTerre.replaceWorker(usineTransportTerre.findBestPlace(critter), critter)
        return true
    }
    return false
}


var stockUpdate = new Date().getTime();
setInterval(function () {
    var thisUpdate = new Date().getTime();
    var diff = (thisUpdate - stockUpdate);
    diff = Math.round(diff / 100);
    updateStock(diff);
    updateCreation(diff);
    updateData();
    stockUpdate = thisUpdate;
}, 1000);

function updateStock() {
    usineStockTerre += usineTerre.productionNum;
    usineStockEau += usineEau.productionNum;

    usineStockTerre = Math.floor(usineStockTerre * 10) / 10;
    usineStockEau = Math.floor(usineStockEau * 10) / 10;

    var prodSecond = (usineTransportEau > usineTransportTerre) ? usineTransportTerre : usineTransportEau;
    prodSecond = Math.round(prodSecond.productionNum * 10) / 10;

    $('#stock-terre>p:last-child').text(usineStockTerre + " (" + Math.round((usineTerre.productionNum - prodSecond) * 10) / 10 + " /s)");
    $('#stock-eau>p:last-child').text(usineStockEau + " (" + Math.round((usineEau.productionNum - prodSecond) * 10) / 10 + " /s)");
}

function updateCreation() {
    var lowerStat = (usineTransportEau > usineTransportTerre) ? usineTransportTerre : usineTransportEau;

    var value = Math.round(lowerStat.productionNum * 10) / 10;
    if (usineStockEau > value && usineStockTerre > value) {
        usineStockEau -= value;
        usineStockTerre -= value;

        score += value;
    }
    $('#creation>p:last-child').text(value + " / s");
}


/* ################ PARTIE ARMY ################## */

/* ############ RELIER LES BOUTONS ############# */
$(document).ready(function () {
    $('.soldier-king').click(function (e) {
        if (e.shiftKey == true) {
            setAllSoldier(kingChild[0]);
        } else {
            setSoldier(kingChild[0]);
        }
    });
    $('.soldier-queen').click(function (e) {
        if (e.shiftKey == true) {
            setAllSoldier(queenChild[0]);
        } else {
            setSoldier(queenChild[0]);
        }
    });

    $('#army-upgrade').click(function () {
        army.upgrade()
    })
});

/* ############ DEFINITION DES FONCTIONS ############# */
function setSoldier(critter) {
    if (typeof critter !== "undefined") {
        var place = army.findPlace(critter)
        army.replaceSoldier(place, critter)
        updateData()
    }
}
function setAllSoldier(critter) {
    if (typeof critter !== "undefined") {
        setSoldier(critter);

        if (typeof critter.king == "object") setAllSoldier(kingChild[0]);
        if (typeof critter.queen == "object")setAllSoldier(queenChild[0]);
    }
}

function createTable(width, height) {

    if(map.data.empty == false) {
        width = map.data.width
        height = map.data.height
    }

    $('#create-table').empty()    
    var table = "";
    for (i=0; i<height; i++){
        var row = '<tr id="row'+i+'" class="classTest">'
        for (j=0; j<width; j++){
            var col = '<td id="col'+j+'" class="classTest"><p>.</p></td>'
            row += col;
        }
        row += '</tr>'
        table += row
    }
    $('#create-table').append(table)

    map.data.height = height
    map.data.width = width
    map.data.empty = false
    map.init()
}

// #######################
// # APPEL DES FONCTIONS #
// #######################

initGame();
checkPage();
$(document).ready(function () {
    setTimeout(function () {
        army.update();
        updateUpgrade();
    }, 100);
});