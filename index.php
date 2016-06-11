<!DOCTYPE HTML>
<html lang="">

    <head>
        <meta charset="UTF-8">
        <title>Critter Plagia</title>
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
        <link rel="stylesheet" type="text/css" href="css/reset.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/style768.css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,900&subset=latin,latin-ext" rel="stylesheet" type="text/css">
    </head>

    <body>
        <div id="gradient" />

        <!-- TAB DECLARATION -->

        <div class="container-fluid mainbar">
            <ul class="nav nav-pills nav-justified">
                <li class="active"><a data-toggle="pill" href="#home">Couvoir Royal</a></li>
                <li><a data-toggle="pill" href="#usine">Usine</a></li>
                <li class="disabled"><a data-toggle="pill" href="#">#Disabled</a></li>
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
        ?>

        <div class="tab-content">

            <!--            ##### PARTIE PRINCIPALE #####-->

            <div id="home" class="tab-pane fade-in active">
                <div class="container-fluid">
                    <div class="wrapper-queen">
                        <div class="container col-lg-6 col-xs-12 well well-lg queen">
                            <div class="row">
                                <h1>Reine</h1>
                            </div>
                            <div class="row">
                                <div class="col-xs-6 col-xs-offset-0 col-sm-2 col-sm-offset-8">
                                    <button type="button" class="btn btn-info   boost">Boost 9/10</button>
                                </div>
                                <div class="col-xs-6 col-sm-2">
                                    <button type="button" class="btn btn-info   upgrade">Upgrade</button>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
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
                                <button type="button" class="btn btn-info worker-queen" style="border:none">Ouvrier</button>
                                <button type="button" class="btn btn-info promote-queen" style="border:none">Reine</button>
                                <button type="button" class="btn btn-info supprimer-critter-queen" style="border:none">Supprimer</button>
                            </div>
                            <br />
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
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
                            <div class="row">
                                <div class="col-xs-6 col-xs-offset-0 col-sm-2 col-sm-offset-8">
                                    <button type="button" class="btn btn-info boost">Boost 9/10</button>
                                </div>
                                <div class="col-xs-6 col-sm-2">
                                    <button type="button" class="btn btn-info upgrade">Upgrade</button>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
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
                                <button type="button" class="btn btn-info worker-king" style="border:none">Ouvrier</button>
                                <button type="button" class="btn btn-info  promote-king" style="border:none">Roi</button>
                                <button type="button" class="btn btn-info  supprimer-critter-king" style="border:none">Supprimer</button>
                            </div>
                            <br />
                            <div class="row">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
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
                        <div class="wrapper-terre">
                            <div class="container col-md-6 col-xs-12 well well-lg terre">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Terre</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradeterre">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2>25 / s</h2>
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
                        <div class="wrapper-eau">
                            <div class="container col-md-6 col-xs-12 well well-lg eau">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Eau</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradeeau">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2>25 / s</h2>
                                    </div>
                                </div>
                                <div class="row table-reponsive">
                                    <table class="table table-bordered text-center">
                                        <tr>
                                            <th>Vitalité</th>
                                            <?php newUsineTab(10,"eau") ?>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="wrapper-transportTerre">
                            <div class="container col-md-6 col-xs-12 well well-lg transportTerre">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Transport Terre</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradetransportTerre">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2>25 / s</h2>
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
                        <div class="wrapper-transportEau">
                            <div class="container col-md-6 col-xs-12 well well-lg transportEau">
                                <div class="row text-center">
                                    <div class="col-lg-6 col-sm-6 col-xs-12 col-md-12">
                                        <h1>Transport Eau</h1>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6 bouton">
                                        <button class="btn btn-info btn-block" id="upgradetransportEau">Upgrade</button>
                                    </div>
                                    <div class="col-lg-3 col-sm-3 col-xs-6 col-md-6">
                                        <h2>25 / s</h2>
                                    </div>
                                </div>
                                <div class="row table-reponsive">
                                    <table class="table table-bordered text-center">
                                        <tr>
                                            <th>Vitalité</th>
                                            <?php newUsineTab(10,"transportEau") ?>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row usine-creation">
                        <div class="col-xs-offset-0 col-xs-12 col-sm-offset-2 col-sm-8 col-lg-offset-1 col-lg-2 col-md-offset-2 col-md-3 well">
                            <p>Stock de Terre : 25</p>
                        </div>
                        <div class="col-xs-offset-0 col-xs-12 col-sm-offset-2 col-sm-8 col-lg-offset-1 col-lg-2 col-md-offset-2 col-md-3 well">
                            <p>Stock d'Eau : 25</p>
                        </div>
                        <div class="col-xs-offset-0 col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 col-lg-offset-1 col-lg-4 well">
                            <p>Creation : 25 / s</p>
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
                <div class="col-xs-offset-3 col-xs-6 col-md-offset-4 col-md-4 well savePop">
                    <p>Game Saved</p>
                </div>
            </div>
        </div>
        
        
        
        <script type="text/javascript" src="script/main.js"></script>        
        
    </body>

</html>