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
        if (typeof critter.queen == "object") deleteQueenChild();
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
    this.self = this;
    this.ennemyArmy = [];
    this.soldiers = [];
    this.level = 1;
    this.IDregeneration;
    this.currentBattle;

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
        if (typeof critter.queen == "object") deleteQueenChild();

        this.update()
    }
    this.sortTab = function () {
        this.soldiers.sort(function (a, b) {
            if (a.level == b.level) return b.score - a.score
            return b.level - a.level
        })
    }

    this.update = function () {
        this.sortTab()

        $('#army-level').text('Niveau ' + this.level)

        for (i = 0; i < 10; i++) {
            if (i < this.level && this.soldiers[i] != undefined) {

                $('#army' + i).show();

                var vita = army.soldiers[i].vita;
                var hp = army.soldiers[i].hp;
                percentage = hp * 10 / vita;

                $('#army'+i+' .progress-bar').css('width', percentage + '%').attr('aria-valuenow', hp).attr('aria-valuemax', vita*10).text(Math.round(hp))
                $('#army'+i+' #ATK').text((army.soldiers[i].piqure + army.soldiers[i].morsure)/2)

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

    this.triggerMap = function(){
        $("#battle").fadeOut('fast')
        $("#map").fadeIn('fast')

        $('.wrapper-ennemy-critter').empty()
        $('.wrapper-ally-critter').empty()

        this.update();
        this.regeneration();
    }

    this.triggerBattle = function (clickedObject) {

        this.currentBattle = clickedObject;

        if (this.verifyBattle(this.currentBattle))
        {        
            $("#map").fadeOut('fast')
            $("#battle").fadeIn('fast')

            this.addAllyArmy();
            this.addEnnemyArmy(this.currentBattle.level);

            this.regeneration(false)

            this.battle();
        } else {
            console.log('impossible : '+this.currentBattle.state)
        }
    }

    this.verifyBattle = function(tile) {

        if (tile.state == "unclickable" || tile.state == "mound" || tile.state == "ennemyMound") {
            return false
        }
        if (this.soldiers.length == 0) {
            return false
        }
        return true;
    }

    this.battle = function() {
        var i = 0,j = 0;
        var attack,target;
        var allyTurn = true;

        var IDinterval = setInterval(function () {
            if (army.ennemyArmy.length > 0 && army.soldiers.length > 0) {

                if (allyTurn) {
                    //                    Calcul des degats et de la cible
                    attack = Math.floor((army.soldiers[i].morsure + army.soldiers[i].piqure) / 2);
                    target = getRandomIntInclusive(0,army.ennemyArmy.length-1);

                    //                    Perte de vie sur la cible
                    army.ennemyArmy[target].hp -= attack;

                    if (army.ennemyArmy[target].hp <= 0) {
                        army.unitKilled('ennemy',target);
                        j = 0;
                    } 
                    //                    Augmentation de la valeur de i : critter suivant
                    if (i == army.soldiers.length-1) {i = 0}
                    else { i++ }
                }

                if (allyTurn == false) {
                    //                    Calcul des degats et de la cible
                    attack = army.ennemyArmy[j].attack;
                    target = getRandomIntInclusive(0,army.soldiers.length-1);

                    //                    Perte de vie sur la cible
                    army.soldiers[target].hp -= attack;

                    if (army.soldiers[target].hp <= 0) {
                        army.unitKilled('ally',target)
                        i = 0;
                    };

                    //                    Augmentation de la valeur de j : critter suivant
                    if (j == army.ennemyArmy.length-1) { j = 0 }
                    else { j++ }
                }

                army.battleUpdate();                

                if (allyTurn) {
                    allyTurn = false
                } else {
                    allyTurn = true
                }

            } else {
                if (army.ennemyArmy.length == 0) {

                    console.log('win')
                    map.changeState(army.currentBattle.coord, "clear")
                    map.updateState()
                }
                clearInterval(IDinterval);
                army.triggerMap();
            }
        }, 200)

        }

    this.unitKilled = function(side, position) {
        if (side == 'ally') {
            this.soldiers.splice(position,1);

            for (i = 0; i < this.level; i++) {
                if (this.soldiers[i] == undefined) {
                    $('.wrapper-ally-critter .battle-critter:nth-child('+(i+1)+')').hide()
                }
            }
        }
        if (side == 'ennemy') {
            this.ennemyArmy.splice(position,1);
            $('.wrapper-ennemy-critter .battle-critter:last-child').detach()
        }   
    }
    this.battleUpdate = function() {
        for (i = 0; i < this.soldiers.length; i++) {
            var percentage = this.soldiers[i].hp*10 / this.soldiers[i].vita;
            $('.wrapper-ally-critter .battle-critter:nth-child('+(i+1)+') .progress-bar').css('width', percentage + '%').attr('aria-valuenow', this.soldiers[i].hp).text(Math.round(this.soldiers[i].hp * 10) / 10)
        }
        for (i = 0; i < this.ennemyArmy.length; i++) {
            var percentage = this.ennemyArmy[i].hp*100 / this.ennemyArmy[i].life;
            $('.wrapper-ennemy-critter .battle-critter:nth-child('+(i+1)+') .progress-bar').css('width', percentage + '%').attr('aria-valuenow', this.ennemyArmy[i].hp).text(Math.round(this.ennemyArmy[i].hp * 10) / 10)
        }
    }

    this.addAllyArmy = function () {
        for (i = 0; i < this.soldiers.length; i++) {
            var hp = this.soldiers[i].hp;
            var vita = this.soldiers[i].vita;
            percentage = hp * 10 / vita;

            $('.wrapper-ally-critter').append(
                '<div class="battle-critter">' + '<p class="text-center">∩༼˵☯‿☯˵༽つ¤=[]:::::>  ( ATK : <p id="ATK">'+ (army.soldiers[i].piqure + army.soldiers[i].morsure)/2 +'</p> )</p>' + '<div class="progress">' + '<div class="progress-bar" role="progressbar" aria-valuenow=' + hp + ' aria-valuemin="0" aria-valuemax=' + vita*10 + ' style="width:'+percentage+'%">' + hp + '</div></div>' + '</div>')
        }
    }
    this.addEnnemyArmy = function (level) {
        var tier = Math.ceil(level / 3);

        this.ennemyArmy = []

        for (i = 0; i < tier; i++) {
            this.ennemyArmy[i] = {
                life: Math.floor(Math.random() * (level * 10) + level * 10 + 20)
                , attack: Math.floor(Math.random() * (level) + level + 3)
            }
            this.ennemyArmy[i].hp = this.ennemyArmy[i].life;
            var life = this.ennemyArmy[i].life;
            $('.wrapper-ennemy-critter').append(
                '<div class="battle-critter">' + '<p class="text-center">~~~~~~~[]=¤ԅ(ˊᗜˋ* )੭ </p><p>( ATK : ' + this.ennemyArmy[i].attack + ' )</p>' + '<div class="progress">' + '<div class="progress-bar" role="progressbar" aria-valuenow=' + life + ' aria-valuemin="0" aria-valuemax=' + life + ' style="width:100%">' + life + '</div></div>' + '</div>')
        }

    }

    this.regeneration = function(active=true) {

        if (active == false) {
            clearInterval(army.IDregeneration);
            console.log('regeneration stop')
        } else {
            console.log('regeneration start')
            army.IDregeneration = setInterval(function () {       

                for (var i=0; i<army.level; i++){
                    if(army.soldiers[i] != undefined) {
                        var a = army.soldiers[i];
                        a.hp += a.vita / 10;

                        if ( a.hp/10 >= a.vita ) {
                            a.hp = a.vita*10;                        
                        }
                    }
                }
                army.update();
            },1000)
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
        ennemyMound: {}

    }

    this.self = this

    this.init = function () {

        if (this.data.empty == true) {

            this.linkMap()
            this.placeMound()
            this.placeEnnemyMound()
            this.addLevel()

            this.data.empty = false

        } else {
            this.linkJQuery()
        }

        this.updateState()
    }

    this.linkMap = function () {
        for (var i = 0; i < this.data.height; i++) {
            this.data.row[i] = []
            for (var j = 0; j < this.data.width; j++) {
                this.data.row[i][j] = {
                    tile: $('#row' + i + '>#col' + j)
                    , level: 0
                    , coord: [i, j]
                    , state: "unclickable"
                }
                this.data.row[i][j].tile.attr('onclick', "alerter(this)").css('background-color', '#fff')
            }
        }
    }
    this.linkJQuery = function () {
        for (var i = 0; i < this.data.height; i++) {
            for (var j = 0; j < this.data.width; j++) {
                this.data.row[i][j].tile = $('#row' + i + '>#col' + j)
                this.data.row[i][j].tile.attr('onclick', "alerter(this)").css('background-color', '#fff')
            }
        }
    }
    this.placeMound = function () {
        var x = Math.floor(Math.random() * this.data.width)
        var y = Math.floor(Math.random() * this.data.height)

        this.data.mound = this.data.row[y][x]
        this.data.mound.state = "mound"
    }
    this.placeEnnemyMound = function () {
        var coord = this.createEnnemyMoundCoord()
        var x = coord[0]
        var y = coord[1]

        this.data.ennemyMound = this.data.row[y][x]
        this.data.ennemyMound.state = "ennemyMound"
    }
    this.distanceToMound = function (y, x) {
        var mY = this.data.mound.coord[0]
        var mX = this.data.mound.coord[1]

        var deltaX = Math.abs(x - mX)
        var deltaY = Math.abs(y - mY)

        return deltaX + deltaY
    }
    this.createEnnemyMoundCoord = function (distance) {
        var minDist = Math.floor(this.data.width / 2 + this.data.height / 2 - 1);
        if (typeof distance != 'undefined') {
            minDist = distance;
        }

        console.log('minDist : ' + minDist);
        var x, y, dist

        do {
            x = Math.floor(Math.random() * this.data.width)
            y = Math.floor(Math.random() * this.data.height)

            dist = this.distanceToMound(y, x)

        } while (dist < minDist)
            return [x, y]
            }

    this.transformCoord = function (array) {
        var result;
        result = this.data.row[array[0]][array[1]];

        return result;
    }
    this.updateState = function(){
        for (var i = 0; i < this.data.height; i++) {
            for (var j = 0; j < this.data.width; j++) {

                var emplacement = this.data.row[i][j];

                if(emplacement.state == "mound" || emplacement.state == "clear") {

                    this.color(emplacement);
                    if (emplacement.state == "mound") {
                        emplacement.tile.empty().append('<span class="glyphicon glyphicon-star" aria-hidden="true"></span>')
                    }

                    this.applyToSiblings(emplacement, function(a) {
                        if ( a.state != "ennemyMound" && a.state != "clickableEnnemyMound" && a.state != "mound" && a.state != "clear") {
                            a.state = "clickable"
                            map.color(a)
                            a.tile.text(a.level)
                        } else if (a.state == "ennemyMound" || a.state == "clickableEnnemyMound" ) {
                            a.state = "clickableEnnemyMound"
                            a.tile.empty().append('<span class="glyphicons glyphicons-tint"></span>')
                        } else if (a.state == "clear") {
                            a.tile.text(a.level)
                        }
                    })
                }
            }
        }
    }
    this.changeState = function(array, state){
        var i = array[0];
        var j = array[1];
        this.data.row[i][j].state = state;
    }

    // Applique une fonction a tous les voisins directs
    // ' a ' est la variable qui contient la case centrale
    // ' effet ' est la fonction a appliquer sur les cases voisines, qui sont l'argument passé dans la fonction effet

    this.applyToSiblings = function(a, effet) {
        var i = a.coord[0];
        var j = a.coord[1];

        var right = undefined
        var left = undefined
        var top = undefined
        var bot = undefined

        //Verification si les alentours existe et attribution des cases

        if (i - 1 >= 0) top = this.data.row[i - 1][j]
        if (j + 1 < this.data.width) right = this.data.row[i][j + 1]
        if (i + 1 < this.data.height) bot = this.data.row[i + 1][j]
        if (j - 1 >= 0) left = this.data.row[i][j - 1]

        if (top != undefined) {effet(top)}
        if (right != undefined) {effet(right)}
        if (bot != undefined) {effet(bot)}
        if (left != undefined) {effet(left)}
    }

    this.color = function (coord) {
        var color;
        var maxLevel = Math.floor(this.data.width / 2 + this.data.height / 2);
        color = "rgb(" + greenYellowRed(coord.level, maxLevel) + ")";
        coord.tile.css("background-color", color)
    }
    /*
    this.fBothSiblings = function (f) {
        sibling = 'top';
        f(sibling);
        sibling = 'right';
        f(sibling);
        sibling = 'bot';
        f(sibling);
        sibling = 'left';
        f(sibling);
    }
    */

    this.addLevel = function () {
        var level,square
        for (var i = 0; i < this.data.height; i++) {
            for (var j = 0; j < this.data.width; j++) {
                square = this.data.row[i][j]

                level = this.distanceToMound(square.coord[0], square.coord[1])

                var maxLevel = Math.floor((this.data.width + this.data.height) / 2) - Math.floor((this.data.width * this.data.height) / 100)
                if (level > maxLevel) level = maxLevel
                square.level = level
            }
        }
    }

}

function initGame() {
    score = 10000;
    //    score = 0;
    generation = 0;

    queenBar = 0;
    kingBar = 0;

    critterKing = {
        vita: 5
        , force: 5
        , agi: 5
        , morsure: 5
        , piqure: 5
        , score: 5
    };
    critterQueen = {
        vita: 5
        , force: 5
        , agi: 5
        , morsure: 5
        , piqure: 5
        , score: 5
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

        score: score
        , generation: generation
        , critterKing: critterKing
        , critterQueen: critterQueen
        , kingChild: kingChild
        , queenChild: queenChild
        , boost: boost
        , upgrade: upgrade

        , usineStockEau: usineStockEau
        , usineStockTerre: usineStockTerre

        , workersEau: usineEau.workers
        , levelEau: usineEau.level
        , workersTerre: usineTerre.workers
        , levelTerre: usineTerre.level
        , workersTransportEau: usineTransportEau.workers
        , levelTransportEau: usineTransportEau.level
        , workersTransportTerre: usineTransportTerre.workers
        , levelTransportTerre: usineTransportTerre.level

        , armySoldier: army.soldiers
        , armyLevel: army.level

        , mapData: map.data

    }

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
    army.regeneration();
    createTable(8, 8);
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
        vita: vita
        , hp: vita*10
        , force: force
        , agi: agi
        , morsure: morsure
        , piqure: piqure
        , score: score
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
        if (typeof critter.queen == "object") setAllWorker(queenChild[0]);
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
                if (typeof critter.queen == "object") deleteQueenChild();

            }
        }
    }
}

function setAllWorker2(critter) {
    if (typeof critter !== "undefined") {
        setWorker2(critter);

        if (typeof critter.king == "object") setAllWorker2(kingChild[0]);
        if (typeof critter.queen == "object") setAllWorker2(queenChild[0]);
    }
}

function findEmptyPlace2(critter) {
    if (usineEau.findPlace(critter) != -1) {
        usineEau.replaceWorker(usineEau.findPlace(critter), critter)
        return true
    }
    if (usineTerre.findPlace(critter) != -1) {
        usineTerre.replaceWorker(usineTerre.findPlace(critter), critter)
        return true
    }
    if (usineTransportEau.findPlace(critter) != -1) {
        usineTransportEau.replaceWorker(usineTransportEau.findPlace(critter), critter)
        return true
    }
    if (usineTransportTerre.findPlace(critter) != -1) {
        usineTransportTerre.replaceWorker(usineTransportTerre.findPlace(critter), critter)
        return true
    }
    return false
}

function findBestPlace(critter) {
    if (usineEau.findBestPlace(critter) != -1) {
        usineEau.replaceWorker(usineEau.findBestPlace(critter), critter)
        return true
    }
    if (usineTerre.findBestPlace(critter) != -1) {
        usineTerre.replaceWorker(usineTerre.findBestPlace(critter), critter)
        return true
    }
    if (usineTransportEau.findBestPlace(critter) != -1) {
        usineTransportEau.replaceWorker(usineTransportEau.findBestPlace(critter), critter)
        return true
    }
    if (usineTransportTerre.findBestPlace(critter) != -1) {
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
        if (typeof critter.queen == "object") setAllSoldier(queenChild[0]);
    }
}

function createTable(width, height) {

    if (map.data.empty == false) {
        width = map.data.width
        height = map.data.height
    }

    $('#create-table').empty()
    var table = "";
    for (i = 0; i < height; i++) {
        var row = '<tr id="row' + i + '" class="">'
        for (j = 0; j < width; j++) {
            var col = '<td id="col' + j + '" class=""><p></p></td>'
            row += col;
        }
        row += '</tr>'
        table += row
    }
    $('#create-table').append(table)

    map.data.height = height
    map.data.width = width
    map.init()
}

function alerter(e) {
    var col = $(e).attr('id').slice(3)
    var row = $(e.parentElement).attr('id').slice(3)

    var clickedObject = map.data.row[row][col]

    army.triggerBattle(clickedObject)
}
function greenYellowRed(number, max) {
    number--
    max = max / 2
    var r, g, b;
    if (number < max) {
        r = Math.floor(255 * (number / max))
        g = 255;
    } else {
        r = 255;
        g = Math.floor(255 * ((max - number % max) / max))
    }
    b = 0
    return r + "," + g + "," + b;
}
function getRandomIntInclusive(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
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