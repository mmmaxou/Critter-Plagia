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

function Usine(type, stat) {
    this.type = type;
    this.stat = stat;
    this.workers = []
    this.level = 0;
    this.findPlace = function(critter) {
        var value = critter[this.stat];
        for( i = 0 ; i < this.level; i++) {
            if(this.workers[i] == undefined) return i;
        }

        for( i = 0 ; i < this.level; i++) {
            if(this.workers[i] != undefined && this.workers[i] < value) {
                return i;
            }
        }

        return -1;
    }; // NON TROUVE DONNE -1, SINON RENVOIE LA PLACE
    this.replaceWorker = function(place, critter) {
        this.workers[place] = critter[this.stat];
    };
    this.update = function() {
        for( i = 0; i < 10 ; i++) {
            if( i < this.level ) {
                $('#'+this.type+i).show();
                $('#'+this.type+i).text(this.workers[i]);
            } else {
                $('#'+this.type+i).hide();
            }
        }

    };
    this.upgrade = function() {
        if (score > Math.pow(10, (this.level+1))) {
            score -= Math.pow(10, (this.level+1));
            this.level++;
            updateData();
        }
        console.log(this);
    };
}

function initGame() {
    score = 0;
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

    var usineTerre = new Usine("terre", "force");
    var usineTransportTerre = new Usine("transportTerre", "piqure");
    var usineEau = new Usine("eau", "agi");
    var usineTransportEau = new Usine("transportEau", "morsure");

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
        upgrade:upgrade,

        workersEau:usineEau.workers,
        levelEau:usineEau.level,
        workersTerre:usineTerre.workers,
        levelTerre:usineTerre.level,
        workersTransportEau:usineTransportEau.workers,
        levelTransportEau:usineTransportEau.level,
        workersTransportTerre:usineTransportTerre.workers,
        levelTransportTerre:usineTransportTerre.level,
    };
    console.log("sauvegarde : ");
    console.log(save);

    localStorage.setItem("save", JSON.stringify(save));
    console.log(localStorage.getItem("save"));
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


    if (typeof savegame.workersEau !== "undefined") usineEau.workers = savegame.workersEau;
    if (typeof savegame.levelEau !== "undefined") usineEau.level = savegame.levelEau;
    if (typeof savegame.workersTerre !== "undefined") usineTerre.workers = savegame.workersTerre;
    if (typeof savegame.levelTerre !== "undefined") usineTerre.level = savegame.levelTerre;
    if (typeof savegame.workersTransportTerre !== "undefined") usineTransportTerre.workers = savegame.workersTransportTerre;
    if (typeof savegame.levelTransportTerre !== "undefined") usineTransportTerre.level = savegame.levelTransportTerre;
    if (typeof savegame.workersTransportEau !== "undefined") usineTransportEau.workers = savegame.workersTransportEau;
    if (typeof savegame.levelTransportEau !== "undefined") usineTransportEau.level = savegame.levelTransportEau;




    updateData();
}

function deleteGame() {
    localStorage.removeItem("save");
    initGame();
}

function deleteTab() {
    for(i = 0; i < upgrade; i++) {
        kingChild[i]=null;
        queenChild[i]=null;
    }
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

        i = nextFreePlace("queen");
        queenChild[i] = child;        

        updateQueenChild();

    }   //QUEEN
    else
    {
        child.king = king;

        i = nextFreePlace("king");
        kingChild[i] = child;

        updateKingChild();
    }   //KING
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
    $('.supprimer-critter-queen').click(deleteQueenChild);
    $('.supprimer-critter-king').click(deleteKingChild);
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

function nextFreePlace(parent) {
    var tab;
    if(parent == "queen") tab = queenChild;
    if(parent == "king")  tab = kingChild;

    var place=0;
    var found=false;

    for( i = 0; i <= upgrade ; i++) {
        if(tab[i] == null && found == false) {
            place = i;
            found = true;
        }
    }
    if(found == false)
        return upgrade;
    return place;
}



/* ########## BOOST ET UPGRADE ########## */

function boosting() {
    if (boost > 1) {
        synchroBar[0] = true;
        synchroBar[1] = true;
        finishBar(false);
        //        boost--;
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
    }
}

function nextScore() {
    return Math.pow(10,(upgrade+1));
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
        score++;
        createChild(critterKing, critterQueen);
        if (boost < 10 && bool != false) // Verifie si boost < 10 et si l'ordre ne vient pas de boost
        {
            boost += 0.1;
            boost = Math.round(boost * 10) / 10;
        }
    }
}

function updateData() {
    $('.score').text("Score : " + score);
    $('.generation').text("Génération : " + generation);

    updateKing();
    updateQueen();
    updateKingChild();
    updateQueenChild();
    updateUsine();

    updateBoost();

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
    if(parent == "queen") tab = queenChild;
    if(parent == "king")  tab = kingChild;

    tab.sort(function (a, b) {
        if(a.score > b.score) return -1;
        if(a.score < b.score) return 1;
        return 0;        
    });


    if(parent == "queen") queenChild = tab;
    if(parent == "king") kingChild = tab;
}

function updateBoost() {
    $('.boost').text("Boost " + boost + "/10");
}

function updateUpgrade() {
    for(i = 0; i < 10; i++) {
        if (i <= upgrade) {
            $('#queenChild'+i).show();
            $('#kingChild'+i).show();
        } else {
            $('#queenChild'+i).hide();
            $('#kingChild'+i).hide();
        }
    }
}

function updateUsine() {
    usineEau.update();
    usineTerre.update();
    usineTransportEau.update();
    usineTransportTerre.update();
}









/* ################ PARTIE USINE ################## */



// CONSTRUCTEUR DE L'USINE

var usineTerre = new Usine("terre", "force");
var usineTransportTerre = new Usine("transportTerre", "piqure");
var usineEau = new Usine("eau", "agi");
var usineTransportEau = new Usine("transportEau", "morsure");

/* ############ RELIER LES BOUTONS ############# */
$(document).ready(function () {
    $('.worker-king').click(function () {
        setWorker("king");
    });
    $('.worker-queen').click(function () {
        setWorker("queen");
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

function setWorker(gender) {
    var critter = gender == "king" ? kingChild[0] : gender == "queen" ? queenChild[0] : "undefined";

    if(typeof critter !== "undefined"){
        
        console.log(critter);

        var place = -1 ;
        var loop = 0;

        // La boucle suivante recherche la meilleure stat, puis regarde dans l'usine correspondante s'il y a de la place. Si oui, l'y ajoute. Si non, met la stat a zéro.
        // La boucle est parcouru 4 fois au maximum

        while(place == -1 && loop < 4) {
            var usine = findBestStat(critter);        
            place = usine.findPlace(critter);
            console.log(place);

            if(place != -1) {
                usine.replaceWorker(place, critter);
            } else {
                critter[usine.stat] = 0;
            }

            loop++;
        }
        if(gender == "king") deleteKingChild();
        if(gender == "queen") deleteQueenChild();
        updateData();
    }
}

function findBestStat(critter) {
    var a,b;

    a = critter.agi;
    b = usineEau;

    if(a < critter.force) {
        a = critter.force;
        b = usineTerre;
    }
    if(a < critter.piqure) {
        a = critter.piqure;
        b = usineTransportTerre;
    }
    if(a < critter.morsure) {
        a = critter.morsure;
        b = usineTransportEau;
    }

    return b;
}


// #######################
// # APPEL DES FONCTIONS #
// #######################

initGame();
checkPage();

$(document).ready(updateUpgrade);