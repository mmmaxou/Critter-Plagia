
function updateTooltip() {

    $('.upgrade').qtip({
        content: {
            text: nextScore()
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });

    $('#upgradeterre').qtip({
        content: {
            text: Math.pow(10, (usineTerre.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });

    $('#upgradeeau').qtip({
        content: {
            text: Math.pow(10, (usineEau.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });

    $('#upgradetransportTerre').qtip({
        content: {
            text: Math.pow(10, (usineTransportTerre.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });

    $('#upgradetransportEau').qtip({
        content: {
            text: Math.pow(10, (usineTransportEau.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });
    
    $('#army-upgrade').qtip({
        content: {
            text: Math.pow(10, (army.level))
        },
        style: { classes: 'qtip-bootstrap qtip-red'},
        position: {
            my: 'bottom right',
            at: 'top middle'
        }
    });

}

$('.boost').qtip({
        content: {
            text: "Crée un enfant instantanément "+"Coute 1 boost"
        },
        style: {
            classes: 'qtip-bootstrap qtip-red',
            width: '18em'
        },
        position: {
            my: 'bottom middle',
            at: 'top middle'
        }
    });