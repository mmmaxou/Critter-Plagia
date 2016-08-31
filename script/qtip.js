
function updateTooltip() {

    //Interface principal
    $('.upgrade').qtip({
        content: {
            text: "Prix : " + nextScore()
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    })
    $('select').qtip({
        content: {
            text: "Permet de choisir la manière dont les enfants seront triés"
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    })

    $('.stats th:nth-child(1)').qtip({
        content: {
            text: "Le score représente la valeure globale de ton Donger"
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom left',
            at: 'top middle'
        }
    })
    $('.stats th:nth-child(2)').qtip({
        content: {
            text: "La vitalité permet de monter les points de vie des soldats Donger"
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom left',
            at: 'top middle'
        }
    })
    $('.stats th:nth-child(3)').qtip({
        content: {
            text: "La force permet aux Donger de recolter plus de terre"
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom middle',
            at: 'top middle'
        }
    })
    $('.stats th:nth-child(4)').qtip({
        content: {
            text: "L'agilité permet aux Donger de recolter plus d'eau"
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom middle',
            at: 'top middle'
        }
    })
    $('.stats th:nth-child(5)').qtip({
        content: {
            text: "La morsure permet d'augmenter l'attaque des soldats Donger, et permet aux Donger de construire plus vite avec la terre"
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    })
    $('.stats th:nth-child(6)').qtip({
        content: {
            text: "La piqure permet d'augmenter l'attaque des soldats Donger, et permet aux Donger de construire plus vite avec l'eau"
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    })

    //Interface des usines
    $('#upgradeterre').qtip({
        content: {
            text: "Prix : " + Math.pow(10, (usineTerre.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });
    $('#upgradeeau').qtip({
        content: {
            text: "Prix : " + Math.pow(10, (usineEau.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });
    $('#upgradetransportTerre').qtip({
        content: {
            text: "Prix : " + Math.pow(10, (usineTransportTerre.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });
    $('#upgradetransportEau').qtip({
        content: {
            text: "Prix : " + Math.pow(10, (usineTransportEau.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });

    //Interface des armées
    $('#army-upgrade').qtip({
        content: {
            text: "Prix : " + Math.pow(10, (army.level+1))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });
    $('#army-level').qtip({
        content: {
            text: "Taille actuelle : " + army.level
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    })

}  

$('.boost').qtip({
    content: {
        text: "Crée un donger instantanément. Coute 1 boost"
    },
    style: {
        classes: 'qtip-bootstrap qtip-red custom-qtip',
        width: '18em'
    },
    position: {
        my: 'bottom middle',
        at: 'top middle'
    }
});
$('.score').qtip({
    content: {
        text: "Le score augmente en créant des ressources dans l'usine. Le score sert à acheter des UPGRADE sur tes infrastructures."
    },
    style: {
        classes: 'qtip-bootstrap qtip-red',
        width: '18em'

    },
    position: {
        my: 'top middle',
        at: 'bottom middle'
    }
})