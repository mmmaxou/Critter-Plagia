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

var usineCursor = [0,0];

var admin = false;
var gameSpeed = 2;

var timer;

var mapMutation;


function Gene(id, stat, expression, name, value) {
    this.id = id;
    this.trait = stat;
    this.expression = expression;
    this.name = name;
    this.value = value;
}

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
    this.checkBetter = function ( critter , tour) {
        log(this.workers[ usineCursor[1] ] + "  " + critter[this.stat] )
        var replaced = false

        if ( this.workers[ usineCursor[1] ] < critter[this.stat] ) {

            this.replaceWorker( usineCursor[1] , critter )
            log("replaced : " + this.stat +" : "+ usineCursor[1] + " | tour : " + tour)
            replaced = true

        }

        usineCursor[1]++;
        if (usineCursor[1] >= (this.workers.length)) {
            usineCursor[1] = 0
            usineCursor[0]++
            usineCursor[0] = usineCursor[0]%4
        }

        if (replaced) {
            return true
        } else {
            return false
        }

    }
    this.replaceWorker = function (place, critter) {
        this.workers[place] = critter[this.stat]
        if (typeof critter.king == "object") deleteKingChild()
        if (typeof critter.queen == "object") deleteQueenChild();
        this.update()
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
        this.productionNum = fixNumber(sum / 10);
    };
    this.updateProduction = function () {
        this.production();
        if ($('#production-' + this.type).text() != this.productionNum + ' / s' ) {
            $('#production-' + this.type).text(this.productionNum + ' / s');
        }
    };
    this.getProduction = function() {
        return this.productionNum
    }
}

function Army() {
    this.self = this;
    this.ennemyArmy = [];
    this.soldiers = [];
    this.level = 0;
    this.IDregeneration;
    this.currentBattle = false;

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

        if ($('#army-level').text() != 'Niveau ' + this.level) {
            $('#army-level').text('Niveau ' + this.level)
        }

        for (i = 0; i < 10; i++) {
            if (i < this.level && this.soldiers[i] != undefined) {

                $('#army' + i).show();

                var vita = army.soldiers[i].vita;
                var hp = army.soldiers[i].hp;
                percentage = hp * 10 / vita;

                $('#army'+i+' .progress-bar').css('width', percentage + '%').attr('aria-valuenow', hp).attr('aria-valuemax', vita*10).text(fixNumber(hp))
                $('#army'+i+' #ATK').text(fixNumber((army.soldiers[i].piqure + army.soldiers[i].morsure)/2))

            } else {
                $('#army' + i).hide();
            }
        }
    }
    this.upgrade = function () {
        if (score > Math.pow(10, (this.level+1))) {
            score -= Math.pow(10, (this.level+1));
            this.level++
            this.update()
            updateTooltip();
            if (this.level == 1) {
                createTable(8,8)
            }
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
        }
    }

    this.verifyBattle = function(tile) {

        if (tile.state == "unclickable"){
            infoPop("Tu ne peut pas encore combattre ici. Combat d'abord les cases colorées")
            return false
        }
        if (tile.state == "mound") {
            infoPop("C'est ta base")
            return false
        }
        if (tile.state == "mound" || tile.state == "ennemyMound" || tile.state == "clear") {
            return false
        }    
        if (this.soldiers.length == 0) {
            infoPop("Il te faut une armée pour combattre. Transforme des enfants en soldats dans la salle aux Dongers")
            return false
        }
        return true;
    }

    this.battle = function() {
        var i = 0,j = 0;
        var attack,target;
        var allyTurn = true;
        var butin = this.ennemyArmy[0].life

        var IDinterval = setInterval(function () {
            if (army.ennemyArmy.length > 0 && army.soldiers.length > 0) {
                if ( admin == true ) {
                    target = getRandomIntInclusive(0,army.ennemyArmy.length-1);
                    army.unitKilled('ennemy',target)
                    j = 0
                }

                if (allyTurn) {
                    for (i=0; i<army.soldiers.length; i++) {
                        //                    Calcul des degats et de la cible
                        attack = Math.floor((army.soldiers[i].morsure + army.soldiers[i].piqure) / 2);
                        target = getRandomIntInclusive(0,army.ennemyArmy.length-1);

                        //                    Perte de vie sur la cible
                        if (typeof army.ennemyArmy[target] !== "undefined") {
                            army.ennemyArmy[target].hp -= attack;
                        }

                        if (army.ennemyArmy[target].hp <= 0) {
                            army.unitKilled('ennemy',target);
                            j = 0;
                        }  
                    }
                }

                if (allyTurn == false) {
                    for (j=0; j<army.ennemyArmy.length; j++) {
                        //                    Calcul des degats et de la cible
                        attack = army.ennemyArmy[j].attack;
                        target = getRandomIntInclusive(0,army.soldiers.length-1);

                        //                    Perte de vie sur la cible
                        army.soldiers[target].hp -= attack;

                        if (army.soldiers[target].hp <= 0) {
                            army.unitKilled('ally',target)
                            i = 0;
                        }
                    }
                }
                army.battleUpdate();  

                if (allyTurn) {
                    allyTurn = false
                } else {
                    allyTurn = true
                }

            } else { // COMBAT TERMINÉ
                if (army.ennemyArmy.length == 0) {

                    if ( army.currentBattle.state == "clickableEnnemyMound") {
                        map.transformCoord(map.data.ennemyMound.coord) == "clearedEnnemyMound"
                        map.addButton()
                    }
                    infoPop("Bataille gagnée. Butin : " + butin)
                    score += butin
                    map.changeState(army.currentBattle.coord, "clear")
                    map.updateState()
                }
                clearInterval(IDinterval);
                army.currentBattle = false;
                army.triggerMap();
            }
        }, 500*gameSpeed)

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
            percentage = fixNumber(hp * 10 / vita);
            hp = fixNumber(hp)

            $('.wrapper-ally-critter').append(
                '<div class="battle-critter">' + '<p class="text-center">∩༼˵☯‿☯˵༽つ¤=[]:::::>  ( ATK : <p id="ATK">'+ fixNumber((army.soldiers[i].piqure + army.soldiers[i].morsure)/2) +'</p> )</p>' + '<div class="progress">' + '<div class="progress-bar" role="progressbar" aria-valuenow=' + hp + ' aria-valuemin="0" aria-valuemax=' + vita*10 + ' style="width:'+percentage+'%">' + hp + '</div></div>' + '</div>')
        }
    }
    this.addEnnemyArmy = function (level) {
        var tier = Math.ceil(level / 3);

        this.ennemyArmy = []

        for (i = 0; i < tier; i++) {
            this.ennemyArmy[i] = {
                life: this.getHp(map.data.level, level)
                , attack: this.getAtk(map.data.level, level)
            }
            this.ennemyArmy[i].hp = this.ennemyArmy[i].life;
            var life = this.ennemyArmy[i].life;
            $('.wrapper-ennemy-critter').append(
                '<div class="battle-critter">' + '<p class="text-center">~~~~~~~[]=¤ԅ(ˊᗜˋ* )੭ </p><p>( ATK : ' + this.ennemyArmy[i].attack + ' )</p>' + '<div class="progress">' + '<div class="progress-bar" role="progressbar" aria-valuenow=' + life + ' aria-valuemin="0" aria-valuemax=' + life + ' style="width:100%">' + life + '</div></div>' + '</div>')
        }

    }
    this.getHp = function(i,j) {
        var hp
        hp = Math.random() * (j * 10) + j * 10 + 20 + //Varie en fonction des lv Donger
            (Math.random()-0.5)*2*25*Math.pow(1.25, i) + // +/-
            (100*Math.pow(1.6, i)-100) +//Varie en fonction des lv Map
            (i*j*Math.pow(1.5,i)) + //Varie en fonction de lvMap * lvDonger
            (200/(i+1)*i)
        hp = Math.round(hp)
        return hp
    }
    this.getAtk = function(i,j) {
        var atk        
        atk = Math.floor(Math.random() * j + j + 3) +
            (Math.random()-0.5)*2*2.5*Math.pow(1.25, i) + // +/-
            (10*Math.pow(1.6, i)-10) +//Varie en fonction des lv Map
            (i*j*Math.pow(1.1,i)) + //Varie en fonction de lvMap * lvDonger
            (20/(i+1)*i)
        atk = Math.round(atk)
        return atk
    }

    this.regeneration = function(active=true) {

        if (active == false) {
            clearInterval(army.IDregeneration);
        } else {
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
        ennemyMound: {},
        level: 0

    }
    this.map = [
        [8,8],
        [11,6],
        [9,9],
        [17,5],
        [5,4],
        [17,6],
        [10,10],
        [11,9],
        [4,5],
        [12,10],
        [8,8],
        [9,7],
        [7,10],
        [8,9],
        [11,11],
        [6,9],
        [8,7]
    ]

    this.self = this

    this.init = function () {

        if (this.data.empty == true) {

            this.linkMap()
            this.placeMound()
            this.placeEnnemyMound()
            this.addLevel()

            this.data.empty = false
            saveGame()

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
        //        this.data.ennemyMound = this.transformCoord(this.data.ennemyMound.coord)
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
        this.transformCoord(this.data.ennemyMound.coord).level += 2
    }
    this.distanceToMound = function (y, x) {
        var mY = this.data.mound.coord[0]
        var mX = this.data.mound.coord[1]

        var deltaX = Math.abs(x - mX)
        var deltaY = Math.abs(y - mY)

        return deltaX + deltaY
    }
    this.createEnnemyMoundCoord = function (distance) {
        var minDist = Math.floor(this.data.width / 2 + this.data.height / 2);
        if (typeof distance != 'undefined') {
            minDist = distance;
        }

        var x, y, dist

        do {
            x = Math.floor(Math.random() * this.data.width)
            y = Math.floor(Math.random() * this.data.height)

            dist = this.distanceToMound(y, x)

        } while (dist < minDist)
            return [x, y]
            }
    this.update = function() {

        $('#map-level').text('Niveau ' + (this.data.level+1))

        if ( this.data.ennemyMound.coord !== undefined) {
            if ( this.transformCoord(this.data.ennemyMound.coord).state == "clear" || this.transformCoord(this.data.ennemyMound.coord).state == "clearedEnnemyMound" ) 
            {
                this.addButton()
            }
        }


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
                            map.color(a)
                            a.state = "clickableEnnemyMound"
                            a.tile.empty().append('<span class="glyphicon glyphicon-exclamation-sign"></span>')
                        } else if (a.state == "clear") {
                            a.tile.text("")
                        }
                    })
                }
            }
        }
        updateTooltip()
    }
    this.changeState = function(array, state){
        var i = array[0];
        var j = array[1];
        this.data.row[i][j].state = state;
    }
    this.addButton = function(){
        $('#map-upgrade').attr('aria-disabled', false).toggleClass('disabled', false)
    }
    this.levelUp = function(){
        if ($('#map-upgrade').attr('aria-disabled') == "false" ) {
            if (confirm("Si vous acceptez, le niveau de la carte va être augmenté et vous ne pourrez plus accéder à la carte actuelle")) {
                var level = map.data.level + 1
                map.data = {

                    empty: true,
                    width: 0,
                    height: 0,
                    row: [],
                    mound: {},
                    ennemyMound: {},
                    level:level

                }

                $('#map-upgrade').attr('aria-disabled', "true").toggleClass('disabled', true)
                $('#map-level').text('Niveau' + (this.data.level+1))
                createTable();
            }
        }
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
    score = 0;
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


    mapMutation = [
        new Gene(001, "vita", "recessive", "I'm not always a mutation. But when I am, I buff you", 0),
        new Gene(002, "vita", "recessive", "4HEAD HP", 0),
        new Gene(003, "vita", "recessive", "Coeur de Weeaboo", 0),
        new Gene(004, "vita", "recessive", "Corpulence de MrDestructoid", 0),
        new Gene(005, "vita", "recessive", "Philosoraptor Brain", 0),
        new Gene(006, "vita", "recessive", "The Flying Spaghetti Monster", 0),
        new Gene(101, "force", "recessive", "Force de Doge", 0),
        new Gene(102, "force", "recessive", "Muscles d'un VoHiYo", 0),
        new Gene(103, "force", "recessive", "Face is the place", 0),
        new Gene(104, "force", "recessive", "GachiGASM body", 0),
        new Gene(105, "force", "recessive", "Rage Comics Incomming", 0),
        new Gene(106, "force", "recessive", "THIS IS SPARTAAAAAA", 0),
        new Gene(201, "agi", "recessive", "Agilité de Nyan Cat", 0),
        new Gene(202, "agi", "recessive", "KREYGASM", 0),
        new Gene(203, "agi", "recessive", "HotPokket Speed", 0),
        new Gene(204, "agi", "recessive", "DOOMGuy Speed", 0),
        new Gene(205, "agi", "recessive", "Agilité de Keyboard Cat", 0),
        new Gene(206, "agi", "recessive", "Epic FAIL", 0),
        new Gene(301, "morsure", "recessive", "Morsure du Kappa", 0),
        new Gene(302, "morsure", "recessive", "Dents de WutFace", 0),
        new Gene(303, "morsure", "recessive", "Morsure SMORC", 0),
        new Gene(304, "morsure", "recessive", "mmmmh, NotLikeThis", 0),
        new Gene(305, "morsure", "recessive", "Charlie Sheen Face", 0),
        new Gene(306, "morsure", "recessive", "The RICKROLL", 0),
        new Gene(401, "piqure", "recessive", "Dard de PogChamp", 0),
        new Gene(402, "piqure", "recessive", "Attaque de PJSalt", 0),
        new Gene(403, "piqure", "recessive", "BibleThump pointu", 0),
        new Gene(404, "piqure", "recessive", "Kill the animals, save the frames", 0),
        new Gene(405, "piqure", "recessive", "Trololo song", 0),
        new Gene(406, "piqure", "recessive", "Haters gonna Hate", 0),
    ]


    startTimer()
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

function startTimer() {
    clearInterval(timer)

    var lastUpdate = new Date().getTime();

    timer = setInterval(function () {
        var thisUpdate = new Date().getTime();
        var diff = (thisUpdate - lastUpdate);
        diff = Math.round(diff / 100);
        updateGame(diff);
        lastUpdate = thisUpdate;
    }, 100*gameSpeed);
}

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

        , adminMode: admin
        , gameSpeed: gameSpeed

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

    if (typeof savegame.adminMode !== "undefined") admin = savegame.adminMode
    if (typeof savegame.gameSpeed !== "undefined") gameSpeed = savegame.gameSpeed

    updateData();
    updateUpgrade();
    army.update();
    army.regeneration();
    $(document).ready(function () {
        createTable();
    })
}

function deleteGame() {
    localStorage.removeItem("save");
    initGame();
    updateData();
    updateUpgrade();
    army.update();
    location.reload()
}

function setAdmin() {
    admin = true
    score =+ 10000
    //    gameSpeed = 0.01    
    startTimer()
}

//Lier aux boutons
$(document).ready(function () {
    $('.save').click(saveGame);
    $('.load').click(loadGame);
    $('.delete').click(deleteGame);
});


/* ########## AFFICHAGE ########## */

function infoPop(message) {

    $('.infoPop').empty().append(message).fadeIn("fast").delay(1000).fadeOut('slow');

}
function log(obj) {
    console.log(obj)
}


/* ########## CREER UN CRITTER ########## */

function makeStat(a, b) {
    
    /*
    if (isNaN(a)) a = 1
    if (isNaN(b)) b = 1

    // MOYENNE
    var c, e;

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

    //BOOSTED AJOUT
    var boost = critterBoost(c)

    var diff = Math.abs(c-i)        
    if (diff > i/25 && c >= 100) {
        c = i + i/25
    }

    //RETOUR
    c = c + adding + boost;
    if (c < 1) c = 1;
    */
    
    var min = Math.min(a,b)
    var max = Math.max(a,b)
    
    if ( min >= 2 ) min = Math.floor( min - min/100 )
    max = Math.ceil( max + max/100)
    
    var value = Math.floor(Math.random() * (max - min +1)) + min;
    
    return value;
}

function createChild() {
    var king = critterKing;
    var queen = critterQueen;

    var vita = makeStat(king.vitaBase, queen.vitaBase);
    var force = makeStat(king.forceBase, queen.forceBase);
    var agi = makeStat(king.agiBase, queen.agiBase);
    var morsure = makeStat(king.morsureBase, queen.morsureBase);
    var piqure = makeStat(king.piqureBase, queen.piqureBase);

    var child = {

        vita: vita
        , hp: vita*10
        , force: force
        , agi: agi
        , morsure: morsure
        , piqure: piqure
        , score: 0

        , vitaBase: vita
        , forceBase: force
        , agiBase: agi
        , morsureBase: morsure
        , piqureBase: piqure

        , vitaBonus: 0
        , forceBonus: 0
        , agiBonus: 0
        , morsureBonus: 0
        , piqureBonus: 0

        , mutation: []
        , newMutation : false
        , variance: 0

    };

    parentMutation(king, queen, child)
    if ( randomTestOutOf100(1) ) {
        critterMutation(child);
    }

    calculateTotalStat(child)

    calculateVariance(child)

    var i, random = Math.round(Math.random());
    if (random == 1) {
        child.queen = queen;
        child.queen.queen = null;

        i = nextFreePlace("queen", child);
        if (i != -1) queenChild[i] = child;
        if (i == -1) {

            queenChild.push(child)
            sortChild("queen")
            queenChild.pop()

        }
        updateQueenChild();

    } //QUEEN
    else {
        child.king = king;
        child.king.king = null;

        i = nextFreePlace("king", child);
        if (i != -1) kingChild[i] = child
        if (i == -1) {

            kingChild.push(child)
            sortChild("king")
            kingChild.pop()

        }

        updateKingChild();
    } //KING

    /*
    if ( admin == true ) {
        if(kingChild[0].score > king.score) {
            setKing()
        }
        if(queenChild[0].score > queen.score) {
            setQueen()
        }
    }
    */
}

function critterBoost(value) {
    var x = Math.ceil(Math.random()*100)
    var boost = 0
    if ( x==100 ) {
        boost = value / 15
        boost -= Math.pow(boost,1.15)/20
        boost = Math.ceil(boost)
        boost++
    }
    return (boost)
}
function critterMutation(child) {

    var mutation = mapMutation[ Math.floor( Math.random()*(mapMutation.length) ) ]

    if( child.mutation.some(function(item){return item.id == mutation.id}) == false ) {
        child.mutation.push(mutation);
        child.newMutation = true
    } 

}
function parentMutation(king, queen, child) {

    if ( king.mutation != undefined || king.mutation != undefined ) {
        var i, gene = {}, proba = [], a, heritage

        if ( king.mutation != undefined ) {
            for ( i=0 ; i < king.mutation.length ; i++ ) {
                if ( gene[king.mutation[i].id] == undefined ) {
                    gene[king.mutation[i].id] = []
                }
                gene[king.mutation[i].id].push(king.mutation[i])
            }
        }

        if ( queen.mutation != undefined ) {
            for ( i=0 ; i < queen.mutation.length ; i++ ) {
                if ( gene[queen.mutation[i].id] == undefined ) {
                    gene[queen.mutation[i].id] = []
                }
                gene[queen.mutation[i].id].push(queen.mutation[i])
            }
        }

        for (var mutation in gene) {
            heritage = gene[mutation][0].expression
            if (gene[mutation][1] != undefined) {
                heritage = heritage + "," + gene[mutation][1].expression
            }

            a = getMutationProbabilityAndValue(mutation, heritage, gene[mutation])
            proba.push(a)
        }
        //    log(gene)
        //    log(proba)

        for ( i=0 ; i<proba.length ; i++ ) {

            if ( proba[i][1] != "none" ) {
                child.mutation.push(mapMutation.find(function(a){
                    return a.id == this[0]
                },proba[i]))
                child.mutation[child.mutation.length-1].expression = proba[i][1]
                child.mutation[child.mutation.length-1].value = proba[i][2]
                var trait = proba[i][3] + "Bonus"
                child[trait] += proba[i][2]
            }
        }
    }
}
function getMutationProbabilityAndValue(mutation, heritage, array){
    var result = [mutation], c

    if ( heritage == "recessive" && randomTestOutOf100(25)) {
        result.push("recessive")
    }
    else if ( heritage == "dominant" && randomTestOutOf100(50)) {
        if (randomTestOutOf100(25)) result.push("recessive")
        else result.push("dominant")
            }
    else if ( heritage == "recessive,recessive" && randomTestOutOf100(50)) {
        if (randomTestOutOf100(50)) result.push("recessive")
        else result.push("dominant")
            }
    else if ( heritage == "recessive,dominant" && randomTestOutOf100(75)) {
        if (randomTestOutOf100(50)) result.push("recessive")
        else result.push("dominant")
            }
    else if ( heritage == "dominant,recessive" && randomTestOutOf100(75)) {
        if (randomTestOutOf100(50)) result.push("recessive")
        else result.push("dominant")
            }
    else if ( heritage == "dominant,dominant") {result.push("dominant")}
    else result.push("none")

    if(result[1] == "dominant") {

        c = makeStat( array[0].value, array[1].value)

    } else { c = 0 }

    result.push(c)
    result.push(array[0].trait)

    return result
}

function calculateTotalStat(child) {

    child.vita = getValue(child.vitaBase, child.vitaBonus)
    child.force = getValue(child.forceBase, child.forceBonus)
    child.agi = getValue(child.agiBase, child.agiBonus)
    child.morsure = getValue(child.morsureBase, child.morsureBonus)
    child.piqure = getValue(child.piqureBase, child.piqureBonus)

    child.score = fixNumber((child.vita + child.force + child.agi + child.morsure + child.piqure) / 5);
}
function getValue(base, bonus){
    var value = fixNumber(base + ( base * (bonus/100) ))

    if (isNaN(value)) { value = base }

    return value
}

function calculateVariance(child) {
    var moyenne = fixNumber((child.vita + child.force + child.agi + child.morsure + child.piqure)/5)
    var variance = Math.pow(child.vita - moyenne, 2) + Math.pow(child.force - moyenne, 2)+ Math.pow(child.agi - moyenne, 2) + Math.pow(child.morsure - moyenne, 2) + Math.pow(child.piqure - moyenne, 2)
    variance = fixNumber(variance / 5)
    child.variance = variance;
}

/* ########## REMPLACER LES PARENTS ########### */

function setKing() {
    if (kingChild[0] != null) {
        critterKing = kingChild[0];
        kingChild.shift();
        kingBar = 0;
        generation++;
        updateKing();
        updateKingChild()
    }
}

function deleteKingChild() {
    kingChild.shift();
    updateKingChild();
}

function setQueen() {
    if (queenChild[0] != null) {
        critterQueen = queenChild[0];
        queenChild.shift();
        queenBar = 0;
        generation++;
        updateQueen();
        updateQueenChild()
    }
}

function deleteQueenChild() {
    queenChild.shift();
    updateQueenChild();
}

//Lier aux boutons
$(document).ready(function () {
    $('.promote-queen').click(setQueen);
    $('.promote-king').click(setKing);
    $('.supprimer-critter-queen').click(function (e) {
        if (e.shiftKey == true) {
            queenChild = [];
            updateQueenChild()
        } else {
            deleteQueenChild();
        }
    });
    $('.supprimer-critter-king').click(function (e) {
        if (e.shiftKey == true) {
            kingChild = [];
            updateKingChild()
        } else {
            deleteKingChild();
        }
    });
});




/* ########## SELECTION ET PLACEMENT CRITTER ########### */

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
        return -1;
    } else {
        return place;
    }
} //Retourne la place libre suivante. Si aucune trouvé et que le dernier est mieux que l'enfant actuel, renvoi -1.




/* ########## BOOST ET UPGRADE ########## */

function boosting() {
    if (boost >= 1) {
        synchroBar[0] = true;
        synchroBar[1] = true;
        finishBar(false);
        if (admin == false) boost--
        boost = Math.round(boost * 10) / 10;
        updateBoost();
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




/* ########## Tri ########## */
$(document).ready(function () {
    $('#tri1 select').change(function () {
        $('#tri2 select').val($('#tri1 select').val())
        updateKingChild()
        updateQueenChild()
    })
    $('#tri2 select').change(function () {
        $('#tri1 select').val($('#tri2 select').val())
        updateKingChild()
        updateQueenChild()
    })
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
        if ( admin == false) {
            $('.king-progress').css('width', value + '%').attr('aria-valuenow', value);
        }
    } else {
        synchroBar[0] = true;
        finishBar();
    }
} //GERE L'AFFICHAGE DE LA BAR ROI

function updateQueenBar(value) {
    if (value < 100) {
        queenBar++;
        value++;
        if ( admin == false ) {
            $('.queen-progress').css('width', value + '%').attr('aria-valuenow', value);
        }
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
            updateBoost()
        }
    }
}

function updateData() {
    $(document).ready(function () {

        updateScore()
        updateKing();
        updateQueen();
        updateKingChild();
        updateQueenChild();
        updateUsine();
        map.update()

        updateBoost();
    });

} // GERE LE SCORE ET LES GENERATIONS + AFFICHAGE GLOBAL

function updateScore() {
    score = fixNumber(score);
    if ($('.score').text() != "Score : " + score ) {
        $('.score').text("Score : " + score);
    }
    if ($('.generation').text() != "Génération : " + generation ) {
        $('.generation').text("Génération : " + generation);
    }
}

function updateKing() {
    var king = critterKing;
    $('#kingScore').text(king.score);
    $('#kingVita').text(king.vita);
    $('#kingForce').text(king.force);
    $('#kingAgi').text(king.agi);
    $('#kingMorsure').text(king.morsure);
    $('#kingPiqure').text(king.piqure);

    if ( king.mutation != undefined ) {
        if ( king.mutation.length > 0) {
            updateMutation('king')
        }
    }
    
    $('#kingScore').qtip({
        content: {
            text: "Variance du Donger : " + critterKing.variance
        },
        style: { classes: 'qtip-bootstrap'},
        position: {
            my: 'bottom left',
            at: 'top middle'
        }
    })
} //AFFICHE LE ROI CRITTER
function updateQueen() {
    var queen = critterQueen;
    $('#queenScore').text(queen.score);
    $('#queenVita').text(queen.vita);
    $('#queenForce').text(queen.force);
    $('#queenAgi').text(queen.agi);
    $('#queenMorsure').text(queen.morsure);
    $('#queenPiqure').text(queen.piqure);

    if ( queen.mutation != undefined ) {
        if ( queen.mutation.length > 0 ) {
            updateMutation('queen')
        }
    }

    $('#queenScore').qtip({
        content: {
            text: "Variance du Donger : " + critterQueen.variance
        },
        style: { classes: 'qtip-bootstrap'},
        position: {
            my: 'bottom left',
            at: 'top middle'
        }
    })
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

            if ( kingChild[i].mutation != undefined ) {
                if ( kingChild[i].mutation.length > 0 ) {
                    updateMutation('kingChild', i)
                }
            }

            $('#kingChild' + i + 'Score').qtip({
                content: {
                    text: "Variance du Donger : " + kingChild[i].variance
                },
                style: { classes: 'qtip-bootstrap'},
                position: {
                    my: 'bottom left',
                    at: 'top middle'
                }
            })

        } else {
            $('#kingChild' + i + 'Score').text("");
            $('#kingChild' + i + 'Vita').text("");
            $('#kingChild' + i + 'Force').text("");
            $('#kingChild' + i + 'Agi').text("");
            $('#kingChild' + i + 'Morsure').text("");
            $('#kingChild' + i + 'Piqure').text("");

            $('#kingChild' + i + 'Score').qtip("destroy", true);
            $('#kingChild' + i + 'Vita').qtip("destroy", true);
            $('#kingChild' + i + 'Force').qtip("destroy", true);
            $('#kingChild' + i + 'Agi').qtip("destroy", true);
            $('#kingChild' + i + 'Morsure').qtip("destroy", true);
            $('#kingChild' + i + 'Piqure').qtip("destroy", true);
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

            if ( queenChild[i].mutation != undefined ) {
                if ( queenChild[i].mutation.length > 0 ) {
                    updateMutation('queenChild', i)
                }
            }

            $('#queenChild' + i + 'Score').qtip({
                content: {
                    text: "Variance du Donger : " + queenChild[i].variance
                },
                style: { classes: 'qtip-bootstrap'},
                position: {
                    my: 'bottom left',
                    at: 'top middle'
                }
            })

        } else {
            $('#queenChild' + i + 'Score').text("");
            $('#queenChild' + i + 'Vita').text("");
            $('#queenChild' + i + 'Force').text("");
            $('#queenChild' + i + 'Agi').text("");
            $('#queenChild' + i + 'Morsure').text("");
            $('#queenChild' + i + 'Piqure').text("");

            $('#queenChild' + i + 'Score').qtip("destroy", true);
            $('#queenChild' + i + 'Vita').qtip("destroy", true);
            $('#queenChild' + i + 'Force').qtip("destroy", true);
            $('#queenChild' + i + 'Agi').qtip("destroy", true);
            $('#queenChild' + i + 'Morsure').qtip("destroy", true);
            $('#queenChild' + i + 'Piqure').qtip("destroy", true);
        }
    }
} //AFFICHE LE 1er ENFANT REINE CRITTER

function updateMutation(parent , place="null") {
    if ( parent == "kingChild" ) critter = kingChild[place]
    if ( parent == "queenChild" ) critter = queenChild[place]
    if ( parent == "king" ) critter = critterKing
    if ( parent == "queen" ) critter = critterQueen

    var i, tour = critter.mutation.length
    var totalMutation = {
        vita: 0,
        force: 0,
        agi: 0,
        morsure: 0,
        piqure: 0
    }
    for ( i=0 ; i<tour ; i++ ) {
        totalMutation[critter.mutation[i].trait]++ 
    }

    var append, html
    if ( totalMutation.vita != 0 ) {
        append = getAppendMutation(totalMutation.vita, critter, "vita")
        html = getHtmlMutation(critter, "vita")

        if ( place != "null" ) {
            $('#'+parent+place+'Vita').append(append).after(html).qtip({
                content: {
                    text: $('#'+parent+place+'Vita').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
        else {
            $('#'+parent+'Vita').append(append).css('color', 'black').after(html).qtip({
                content: {
                    text: $('#'+parent+'Vita').next().html() 
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
    }
    if ( totalMutation.force != 0 ) {
        append = getAppendMutation(totalMutation.force, critter, "force")
        html = getHtmlMutation(critter, "force")

        if ( place != "null" ) {
            $('#'+parent+place+'Force').append(append).after(html).qtip({
                content: {
                    text: $('#'+parent+place+'Force').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
        else {
            $('#'+parent+'Force').append(append).css('color', 'black').after(html).qtip({
                content: {
                    text: $('#'+parent+'Force').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }


    }
    if ( totalMutation.agi != 0 ) {
        append = getAppendMutation(totalMutation.agi, critter, "agi")
        html = getHtmlMutation(critter, "agi")

        if ( place != "null" ) {
            $('#'+parent+place+'Agi').append(append).after(html).qtip({
                content: {
                    text: $('#'+parent+place+'Agi').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
        else {
            $('#'+parent+'Agi').append(append).css('color', 'black').after(html).qtip({
                content: {
                    text: $('#'+parent+'Agi').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
    }
    if ( totalMutation.morsure != 0 ) {
        append = getAppendMutation(totalMutation.morsure, critter, "morsure")
        html = getHtmlMutation(critter, "morsure")

        if ( place != "null" ) {
            $('#'+parent+place+'Morsure').append(append).after(html).qtip({
                content: {
                    text: $('#'+parent+place+'Morsure').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
        else {
            $('#'+parent+'Morsure').append(append).css('color', 'black').after(html).qtip({
                content: {
                    text: $('#'+parent+'Morsure').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
    }
    if ( totalMutation.piqure != 0 ) {
        append = getAppendMutation(totalMutation.piqure, critter, "piqure")
        html = getHtmlMutation(critter, "piqure")

        if ( place != "null" ) {
            $('#'+parent+place+'Piqure').append(append).after(html).qtip({
                content: {
                    text: $('#'+parent+place+'Piqure').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
        else {
            $('#'+parent+'Piqure').append(append).css('color', 'black').after(html).qtip({
                content: {
                    text: $('#'+parent+'Piqure').next().html()
                },
                style: { 
                    classes: 'custom-qtip qtip-bootstrap'
                },
                position: {
                    my: 'bottom middle',
                    at: 'top middle'
                }
            }).next().remove()
        }
    }
}
function getHtmlMutation(critter, stat) { 
    var html, i, mut, parentMutation, style

    html = '<div class="hidden text-center"><h2>Mutations</h2>'
    /*
    for (i=0; i<tour; i++) {
        mut = critter.mutation[i]
        html = html + '<table class="table table-responsive table-hover table-bordered text-center"><tbody><tr><th>Nom</th><td>'+mut.name+'</td></tr><tr><th>Effet</th><td>+ '+mut.value+'</td></tr><tr><th colspan="2">'+mut.expression+'</th></tr></tbody></table>'
    }
*/
    critter.mutation.forEach(function(item){

        if ( item.trait == stat ) {

            if ( critterQueen != undefined) parentMutation = critterQueen.mutation
            if ( critterKing != undefined) parentMutation = critterKing.mutation

            if ( parentMutation != undefined ) {
                parentMutation = parentMutation.find(function(parentItem){
                    return parentItem.id == item.id
                })
            }

            if ( parentMutation != undefined ) {

                if ( item.value < parentMutation.value ) {style = "color:red"}
                else if ( item.value == parentMutation.value ) {style = "color:black"}
                else {style = "color:#9ace9a"}

            } else { style = "color:black"}

            html = html + '<table class="table table-responsive table-hover table-bordered text-center"><tbody><tr><th>Nom</th><td>'+item.name+'</td></tr><tr><th>Effet</th><td><p style="'+style+';">+ '+item.value+'%</p></td></tr><tr><th colspan="2" style="text-transform:capitalize;">'+item.expression+'</th></tr></tbody></table>'
        }
    })

    html = html + '</div>'

    return html
}
function getAppendMutation(number, critter, stat) {
    var append, style, value=0, parentStat=stat+"Bonus";
    
    for ( var mutation of critter.mutation ) {
        if ( mutation.trait == stat ) value += mutation.value
    }
    
    if ( critter.king != undefined ) {
        if ( value > critterKing[parentStat] ) {
            style = "color:#9ace9a;"
        } else if ( value < critterKing[parentStat] ) {
            style = "color:red;"
        } else {
            style = "color:black;"
        }
    }
    if ( critter.queen != undefined ) {
        if ( value > critterQueen[parentStat] ) {
            style = "color:#9ace9a;"
        } else if ( value < critterQueen[parentStat] ) {
            style = "color:red;"
        } else {
            style = "color:black;"
        }
    }
    
    if ( critter.newMutation == true ) {
        append = '<p class="mutation"><span class="glyphicon glyphicon-star" aria-hidden="true"></span>'+number+' mutation(s)<span class="glyphicon glyphicon-star" aria-hidden="true"></span></p>'
    } else {
        append = '<p class="mutation" style="'+style+'">'+number+' mutation(s)</p>'
    }
    return append
}

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
    var tab, stat
    if (parent == "queen") tab = queenChild;
    if (parent == "king") tab = kingChild;

    var type = $('#tri1 select').val()

    switch ( type ) {
        case "Score" :
            stat = "score";
            break;
        case "Vitalité" :
            stat = "vita";
            break;
        case "Force" :
            stat = "force";
            break;
        case "Agilité" :
            stat = "agi";
            break;
        case "Morsure" :
            stat = "morsure";
            break;
        case "Piqure" :
            stat = "piqure";
            break;
        case "Mutation":
            stat = "mutation"
            break;
        case "Variance":
            stat = "variance"
            break;
        default :
            stat = "score";

    }
    tab.sort(function (a, b) {


        if (stat == "mutation") {
            if (a.mutation.length > b.mutation.length ) {return -1; }
            else if (a.mutation.length < b.mutation.length ) {return 1; }
            else {
                if (a.score > b.score) return -1;
                if (a.score < b.score) return 1;
                return 0;
            }
        }
        if (stat == "variance") {
            var temp = a
            a = b
            b = temp
        }

        if (a[stat] > b[stat]) return -1;
        if (a[stat] < b[stat]) return 1;
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

function setWorker2(critter) {
    var found = false
    if (typeof critter !== "undefined") {
        found = findEmptyPlace2(critter)

        if (found == false) {
            found = findBestPlace2(critter)

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
    updateKingChild()
    updateQueenChild()
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

function findBestPlace2(critter) {
    var found = false, usine, i, tour=0 , size
    size = usineEau.level + usineTerre.level + usineTransportEau.level + usineTransportTerre.level
    do {
        tour++
        switch ( usineCursor[0] ) {
            case 0 :
                usine = usineTerre;
                break;
            case 1 :
                usine = usineEau;
                break;
            case 2 :
                usine = usineTransportTerre;
                break;
            case 3 :
                usine = usineTransportEau;
                break;            
        }
        found = usine.checkBetter(critter, tour)

        if (found) return true

            } while ( found == false && tour <= size)

                log("not Replaced")
                return false

}



var stockUpdate = new Date().getTime();
setInterval(function () {
    var thisUpdate = new Date().getTime();
    var diff = (thisUpdate - stockUpdate);
    diff = Math.round(diff / 100);
    updateStock(diff);
    updateScore()
    stockUpdate = thisUpdate;
}, 1000);

function updateStock() {

    //Augmente le stock d'eau et terre    
    usineStockTerre += usineTerre.getProduction();
    usineStockEau += usineEau.getProduction();


    //Actualise le stock et le rend joli
    usineStockTerre = fixNumber(usineStockTerre);
    usineStockEau = fixNumber(usineStockEau);


    //Calcul du transport minimum
    var minTransport = fixNumber( Math.min(usineTransportEau.getProduction(), usineTransportTerre.getProduction()))

    //Calcul le minimum entre transport et recolte
    terre = usineTerre.getProduction() - minTransport
    eau = usineEau.getProduction() - minTransport

    //Augmentation du score si il y a assez de ressources
    if (usineStockEau >= minTransport && usineStockTerre >= minTransport) {

        usineStockEau -= minTransport;
        usineStockTerre -= minTransport;

        score += minTransport;
    }

    //Affichage
    if ( usineStockEau > minTransport && usineStockTerre > minTransport ) {    
        $('#stock-terre>p:last-child').text(fixNumber(usineStockTerre) + " (" + fixNumber(terre) + " /s)");
        $('#stock-eau>p:last-child').text(fixNumber(usineStockEau) + " (" + fixNumber(eau) + " /s)");

        if ( $('#creation>p:last-child').text() != fixNumber(minTransport) + " / s" ) {
            $('#creation>p:last-child').text(fixNumber(minTransport) + " / s");
        }

    } else {

        var min = fixNumber( Math.min(usineEau.getProduction(), usineTerre.getProduction()))

        $('#stock-terre>p:last-child').text(fixNumber(usineStockTerre) + " (" + fixNumber(usineTerre.getProduction() - min) + " /s)");
        $('#stock-eau>p:last-child').text(fixNumber(usineStockEau) + " (" + fixNumber(usineEau.getProduction() - min) + " /s)");

        if ( $('#creation>p:last-child').text() != fixNumber(minTransport) + " / s" ) {    

            $('#creation>p:last-child').text(fixNumber(min) + " / s");
        }

    }
}


/* ################ PARTIE ARMY ################## */

/* ############ RELIER LES BOUTONS ############# */
$(document).ready(function () {
    $('.soldier-king').click(function (e) {
        if (army.currentBattle == false) {
            if (e.shiftKey == true) {
                setAllSoldier(kingChild[0]);
            } else {
                setSoldier(kingChild[0]);
            }
        }
    });
    $('.soldier-queen').click(function (e) {
        if (army.currentBattle == false) {
            if (e.shiftKey == true) {
                setAllSoldier(queenChild[0]);
            } else {
                setSoldier(queenChild[0]);
            }
        }
    });

    $('#army-upgrade').click(function () {
        army.upgrade()
    })
});

/* ############ DEFINITION DES FONCTIONS ############# */
function setSoldier(critter) {
    log("clickedSoldier")
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
function createTable() {

    var width, height;

    width = map.map[map.data.level][0]
    height = map.map[map.data.level][1]

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


function testNumber() {
    var i,j,hp,atk
    for (i=0; i < 10; i++) {
        log("tier "+i)
        for (j=1; j<10 ; j++) {
            hp = Math.random() * (j * 10) + j * 10 + 20 + //Varie en fonction des lv Donger
                (Math.random()-0.5)*2*25*Math.pow(1.25, i) + // +/-
                (100*Math.pow(1.6, i)-100) +//Varie en fonction des lv Map
                (i*j*Math.pow(1.5,i)) + //Varie en fonction de lvMap * lvDonger
                (200/(i+1)*i)
            hp = Math.round(hp)

            atk = Math.floor(Math.random() * j + j + 3) +
                (Math.random()-0.5)*2*2.5*Math.pow(1.25, i) + // +/-
                (10*Math.pow(1.6, i)-10) +//Varie en fonction des lv Map
                (i*j*Math.pow(1.1,i)) + //Varie en fonction de lvMap * lvDonger
                (20/(i+1)*i)
            atk = Math.round(atk)
            log("hp : "+hp+" atk : "+atk)
        }        
    }
}
function testCritter() {
    var i, random, adding, c

    for ( var i = 0; i < 1500; i++) {

        c = i

        // AJOUTE OU RETIRE LA VALEUR
        random = Math.random() - 0.5;
        if (random < -0.2) random = -1;
        if (random > 0.2) random = 1;
        if (random >= -0.2 && random <= 0.2) random = 0;

        // VALEUR A AJOUTER OU RETIRER
        adding = Math.random() * (c / 25);  
        adding = Math.ceil(adding);
        adding = adding * random;

        var boost = critterBoost(c)

        //RETOUR
        c = c + adding + boost;

        var diff = Math.abs(c-i)        
        if (diff > i/25) {
            c = i + i/25
        }

        if (adding != 0 && i%10 == 0) {
            log(i+" : "+c+" ( " + boost + " ) + ( "+ diff +" )")
        }

    }
}



function randomTestOutOf100(number) {
    if ( Math.random()*100 <= number ) return true
    else return false
        }
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function fixNumber(a) {
    return Math.round(a * 10) / 10
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