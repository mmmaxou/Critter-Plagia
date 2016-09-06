<!DOCTYPE HTML>
<html lang="">

    <head>
        <meta charset="UTF-8">
        <title>Critter Plagia</title>

        <script src="script/jquery-2.2.4.min.js"></script>
        <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
        <!--        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">        -->

        <!--        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>-->
        <script src="bootstrap/js/bootstrap.min.js"></script>
        <!--        <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>-->


        <link rel="stylesheet" type="text/css" href="css/reset.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/style768.css">

        <link type="text/css" rel="stylesheet" href="css/jquery.qtip.css" />

        <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,900&subset=latin,latin-ext" rel="stylesheet" type="text/css">

    </head>

    <body>
        <div id="gradient" />

        <!-- TAB DECLARATION -->

        <div class="container-fluid mainbar">
            <ul class="nav nav-pills nav-justified">
                <li class="active"><a data-toggle="pill" href="#home">Salle aux Dongers</a></li>
                <li><a data-toggle="pill" href="#usine">Usine</a></li>
                <li><a data-toggle="pill" href="#army">Armée</a></li>
            </ul>
        </div>


        <!-- SCORE BAR -->

        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-md-2 col-md-offset-5 alert alert-info">
                    <div class="text-center">
                        <b><p class="generation">Géneration : 0</p></b>
                        <b><p class="score">Score : 0</p></b>
                    </div>
                </div>
            </div>
        </div>


        <!-- TAB CONTENT -->

        <?php 
        function newChildTab($parent,$id) {
            include 'tab-child.php';
        }

        function newUsineTab($number,$type) {
            for($i = 0; $i < $number; $i++) {
                echo '<td id="'.$type.''.$i.'">0</td>';
            }
        }
        function newArmyTab() {
            for ( $i = 0; $i < 10 ; $i++ ) {
                include 'tab-army.php';
            }
        }

        ?>

        <div class="tab-content">

            <!--            ##### PARTIE PRINCIPALE #####-->


            <div id="home" class="tab-pane fade-in active">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-10 col-sm-offset-1 col-xs-12 jumbotron text-center">
                            <p>La salle aux dongers permet de developper les capacités de tes Dongers.</p>
                            <p>Les enfants ont des caractéristiques qui dépendent du Roi et de la Reine.</p>
                            <p>Selectionne les Dongers qui ont les meilleures capacités pour devenir Roi ou Reine et ainsi augmenter la puissance de la lignée.</p>
                        </div>

                    </div>
                    <div class="wrapper-queen">
                        <div class="container col-lg-6 col-xs-12 well well-lg queen">
                            <div class="row">
                                <h1>Reine</h1>
                            </div>
                            <div class="row text-center">
                                <button type="button" class="btn btn-info boost">Boost 9/10</button>
                                <button type="button" class="btn btn-info upgrade">Upgrade</button>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead class="stats">
                                            <tr>
                                                <th>Score</th>
                                                <th>Vitalité</th>
                                                <th>Force</th>
                                                <th>Agilité</th>
                                                <th>Morsure</th>
                                                <th>Piqure</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th id="queenScore">5</th>
                                                <th id="queenVita">5</th>
                                                <th id="queenForce">5</th>
                                                <th id="queenAgi">5</th>
                                                <th id="queenMorsure">5</th>
                                                <th id="queenPiqure">5</th>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div class="progress">
                                    <div class="queen-progress progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:40%"></div>
                                </div>
                            </div>
                            <div class="row">
                                <h2>Enfants</h2>
                            </div>
                            <div class="row text-center">
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info worker-queen" style="border:none">Ouvrier</button>
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info promote-queen" style="border:none">Reine</button>
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info supprimer-critter-queen" style="border:none">Supprimer</button>
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info soldier-queen" style="border:none">Soldat</button>
                                <div class="form-group col-xs-12 col-sm-2" id="tri1">
                                    <select class="form-control">
                                        <option>Score</option>
                                        <option>Mutation</option>
                                        <option>Vitalité</option>
                                        <option>Force</option>
                                        <option>Agilité</option>
                                        <option>Morsure</option>
                                        <option>Piqure</option>
                                        <option>Base</option>
                                        <option>Bonus</option>
                                        <option>Variance</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered parent-table">
                                        <thead class="stats">
                                            <tr>
                                                <th>Score</th>
                                                <th>Vitalité</th>
                                                <th>Force</th>
                                                <th>Agilité</th>
                                                <th>Morsure</th>
                                                <th>Piqure</th>
                                            </tr>
                                        </thead>
                                        <?php 
                                        for($i = 0; $i < 10; $i++){
                                            newChildTab("queen",$i);
                                        }
                                        ?>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="wrapper-king">
                        <div class="container col-lg-6 col-xs-12 well well-lg king">
                            <div class="row">
                                <h1>Roi</h1>
                            </div>
                            <div class="row text-center">
                                <button type="button" class="btn btn-info boost">Boost 9/10</button>
                                <button type="button" class="btn btn-info upgrade">Upgrade</button>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered parent-table">
                                        <thead class="stats">
                                            <tr>
                                                <th>Score</th>
                                                <th>Vitalité</th>
                                                <th>Force</th>
                                                <th>Agilité</th>
                                                <th>Morsure</th>
                                                <th>Piqure</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th id="kingScore">5</th>
                                                <th id="kingVita">5</th>
                                                <th id="kingForce">5</th>
                                                <th id="kingAgi">5</th>
                                                <th id="kingMorsure">5</th>
                                                <th id="kingPiqure">5</th>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div class="progress">
                                    <div class="king-progress progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:40%"></div>
                                </div>
                            </div>
                            <div class="row">
                                <h2>Enfants</h2>
                            </div>
                            <div class="row text-center">
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info worker-king" style="border:none">Ouvrier</button>
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info promote-king" style="border:none">Roi</button>
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info supprimer-critter-king" style="border:none">Supprimer</button>
                                <button type="button" class="col-xs-12 col-sm-2 btn btn-info soldier-king" style="border:none">Soldat</button>
                                <div class="form-group col-xs-12 col-sm-2" id="tri2">
                                    <select class="form-control">
                                        <option>Score</option>
                                        <option>Mutation</option>
                                        <option>Vitalité</option>
                                        <option>Force</option>
                                        <option>Agilité</option>
                                        <option>Morsure</option>
                                        <option>Piqure</option>
                                        <option>Base</option>
                                        <option>Bonus</option>
                                        <option>Variance</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead class="stats">
                                            <tr>
                                                <th>Score</th>
                                                <th>Vitalité</th>
                                                <th>Force</th>
                                                <th>Agilité</th>
                                                <th>Morsure</th>
                                                <th>Piqure</th>
                                            </tr>
                                        </thead>
                                        <?php 
                                        for($i = 0; $i < 10; $i++){
                                            newChildTab("king",$i);
                                        }
                                        ?>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!--            ###### PARTIE USINE  -->

            <div id="usine" class="tab-pane fade-in">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-10 col-sm-offset-1 col-xs-12 jumbotron text-center">
                            <p>L'usine te permet de créer de la boue afin d'augmenter ton score.</p>
                            <p>La force permet de recolter de la terre et l'Agilité permet de recolter de l'eau.</p>
                            <p>Les ouvriers combinent l'eau et la terre pour augmenter ton score.</p>
                            <p>Plus les Dongers qui travaillent dans l'usine sont puissants, et plus ta production sera rapide.</p>
                        </div>
                    </div>
                    <div class="row">
                        <div id="wrapper-terre">
                            <div class="container col-md-6 col-xs-12 well well-lg terre">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Terre</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradeterre">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2 id="production-terre">25 / s</h2>
                                    </div>
                                </div>
                                <div class="row table-reponsive">
                                    <table class="table table-bordered text-center">
                                        <tr>
                                            <th>Force</th>
                                            <?php newUsineTab(10,"terre") ?>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div id="wrapper-eau">
                            <div class="container col-md-6 col-xs-12 well well-lg eau">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Eau</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradeeau">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2 id="production-eau">25 / s</h2>
                                    </div>
                                </div>
                                <div class="row table-reponsive">
                                    <table class="table table-bordered text-center">
                                        <tr>
                                            <th>Agilité</th>
                                            <?php newUsineTab(10,"eau") ?>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div id="wrapper-transportTerre">
                            <div class="container col-md-6 col-xs-12 well well-lg transportTerre">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Ouvrier Terre</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradetransportTerre">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2 id="production-transportTerre">25 / s</h2>
                                    </div>
                                </div>
                                <div class="row table-reponsive">
                                    <table class="table table-bordered text-center">
                                        <tr>
                                            <th>Morsure</th>
                                            <?php newUsineTab(10,"transportTerre") ?>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div id="wrapper-transportEau">
                            <div class="container col-md-6 col-xs-12 well well-lg transportEau">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Ouvrier Eau</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradetransportEau">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2 id="production-transportEau">25 / s</h2>
                                    </div>
                                </div>
                                <div class="row table-reponsive">
                                    <table class="table table-bordered text-center">
                                        <tr>
                                            <th>Piqure</th>
                                            <?php newUsineTab(10,"transportEau") ?>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row usine-creation">
                        <div class="col-xs-offset-0 col-xs-12 col-sm-offset-2 col-sm-8 col-lg-offset-1 col-lg-2 col-md-offset-2 col-md-3 well" id="stock-terre">
                            <p>Stock de Terre :</p>
                            <p></p>
                        </div>
                        <div class="col-xs-offset-0 col-xs-12 col-sm-offset-2 col-sm-8 col-lg-offset-1 col-lg-2 col-md-offset-2 col-md-3 well" id="stock-eau">
                            <p>Stock d'Eau :</p>
                            <p></p>
                        </div>
                        <div class="col-xs-offset-0 col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 col-lg-offset-1 col-lg-4 well" id="creation">
                            <p>Creation :</p>
                            <p> / s</p>
                        </div>
                    </div>
                </div>
            </div>


            <!--            ####### PARTIE ARMY ######-->

            <div id="army" class="tab-pane fade-in">
                <div class="container-fluid" id="map">
                    <div class="col-sm-10 col-sm-offset-1 col-xs-12 jumbotron text-center">
                        <p>Developpe ton armée pour conquérir le royaume Donger.</p>
                        <p>Augmente le niveau pour augmenter la taille de ton armée.</p>
                    </div>
                    <div class="wrapper-army">
                        <div class="container col-lg-6 col-xs-12 well well-lg army">
                            <div class="row text-center">
                                <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                    <h1>Armée</h1>
                                </div>
                                <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                    <h2 id="army-level">Niveau 1</h2>
                                </div>
                                <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                    <button class="btn btn-info btn-block" id="army-upgrade">Upgrade</button>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <?php newArmyTab(); ?>
                            </div>
                        </div>
                    </div>
                    <div class="wrapper-map">
                        <div class="container col-lg-6 col-xs-12 well well-lg war">
                            <div class="row text-center">
                                <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                    <h1>Guerre</h1>
                                </div>
                                <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                    <h2 id="map-level">Niveau 1</h2>
                                </div>
                                <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton disabled">
                                    <button class="btn btn-info btn-block disabled" id="map-upgrade" aria-disabled="true" onclick="map.levelUp()">Continuer</button>
                                </div>
                            </div>
                            <br/>
                            <div class="row table-responsive">
                                <table class="table">
                                    <tbody id='create-table'>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class="container-fluid" id="battle" style="display:none;">
                    <div class="wrapper-battle well well-lg">
                        <div class="row">
                            <h2>Combat</h2>
                        </div>
                        <div class="row">
                            <div class="col-sm-6 wrapper-ally-critter"></div>
                            <div class="col-sm-6 wrapper-ennemy-critter"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>



        <!-- SAVE BAR -->

        <div class="container-fluid save-bar">
            <div class="row text-center">
                <div class="col-xs-8 col-xs-offset-2 col-sm-offset-0 col-sm-2">
                    <button type="button" class="btn btn-info btn-block save">Save</button>
                </div>
                <div class="col-xs-8 col-xs-offset-2 col-sm-offset-0 col-sm-2">
                    <button type="button" class="btn btn-info btn-block load">Load</button>
                </div>
                <div class="col-xs-8 col-xs-offset-2 col-sm-offset-0 col-sm-2">
                    <button type="button" class="btn btn-info btn-block delete">Delete data</button>
                </div>
                <div class="col-xs-8 col-xs-offset-2 col-sm-offset-0 col-sm-2" style="color:white;">
                    <p>Appuyez sur <b>SHIFT</b> pour voir plus d'options</p>
                </div>
                <div class="col-xs-8 col-xs-offset-2 col-sm-offset-2 col-sm-2" style="color:white;">
                    <p>Version 1.0</p>
                </div>
                <div class="col-xs-offset-3 col-xs-6 col-md-offset-4 col-md-4 well savePop">
                    <p>Game Saved</p>
                </div>
                <div class="col-xs-offset-3 col-xs-6 col-md-offset-4 col-md-4 well infoPop" style="display:none;">
                    <p></p>
                </div>
            </div>
        </div>

        <!-- INFO BAR -->



        <script type="text/javascript" src="script/jquery.qtip.js"></script>

        <script type="text/javascript" src="script/main.js"></script>
        <script type="text/javascript" src="script/qtip.js"></script>


    </body>

</html>