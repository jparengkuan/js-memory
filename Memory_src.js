/**
 * FJ Parengkuan (2019)
 */
var startTijd, totaalTijd = 0,
    aantalTijden = 0,
    gemiddeldeTijd = 0;
// StartTijd is de tijd dat het huidige spel begonnen is.
// Totaaltijd is de som van de tijd van alle gespeelde spelletjes, aantaltijden is het aantal spelletjes
var firstCard, secondCard;
// De eerste en tweede kaart die zijn omgedraaid.
var karakter;
// Het teken dat op de achterkant van de kaart getoond wordt
var intervalID, tijdID;
// De ID's voor de timeouts voor het terugdraaien van de kaarten en het bijwerken van de tijdweergave

var speelveld = document.getElementById("speelveld");
var scoreLijst = document.getElementById("topscores");
var speeltijd = document.getElementById("gemiddeld");
var gevonden;


var vindTijd;
var timerBalk;
var timerBalkWidth;

var toontijd;

var speelSeconden;

var timer;

var timefield = document.getElementById("tijd");

var AantalGevonden = 0;

var cards = [];
var gemiddeldeTijd;
var aantalTijden;

var seconden;

var numberOfCards;
// Aantal kaarten op het bord

var openKaarten;

var numberOfCardsLeft;
// Aantal kaarten dat nog op het bord ligt
var topScores = [{
    name: "Barack Obama",
    time: 200
},
    {
        name: "Bernie Sanders",
        time: 300
    },
    {
        name: "Hillary Clinton",
        time: 400
    },
    {
        name: "Jeb Bush",
        time: 500
    },
    {
        name: "Donald Trump",
        time: 600
    }
];


function initGame(size) {
    initVars(size);
    vulSpeelveld(size);
    showScores();
}

function initVars(size) {


    //Speelseconden timer
    speelSeconden = 0;

    toontijd = 5;
    vindTijd = null;

    timerBalk = document.getElementById("timeLeft");
    let style = getComputedStyle(timerBalk);
    let width = style.getPropertyValue("width");

    console.log("Width: " + width);

    timerBalkWidth = width.substr(0, 3);

    console.log(timerBalkWidth);

    //reset de speeltijd
    timefield.innerText = "0";
    seconden = 0;
    window.clearInterval(timer);
    timer = null;

    //reset Gemiddelde speeltijd
    gemiddeldeTijd = 0;

    // Initialiseer alle benodigde variabelen en de velden op het scherm

    //reset gemiddele tijd
    gemiddeldeTijd = 0;
    aantalTijden = 0;

    setTijden();


    var speelveld = document.getElementById("speelveld");
    var scoreLijst = document.getElementById("topscores");
    var speeltijd = document.getElementById("gemiddeld");
    gevonden = document.getElementById("gevonden");

    karakter = document.getElementById("character").value;

    //reset aantalGevonden kaarten
    AantalGevonden = 0;
    gevonden.innerText = AantalGevonden;


    //Reset de content van het speelveld
    speelveld.innerHTML = "";

    //reset de scoreLijst
    scoreLijst.innerHTML = "";

    openKaarten = 0;

    //Reset de cardsArray
    cards = [];

}

function vulSpeelveld(size) {
    // Bouw de size x size table speelveld op. Elk <td> element van de tabel
    // moet een karakter toegewezen worden. Hiervoor kan de nextletter functie
    // gebruikt worden. Ook moet de eventlistener cardClicked aan de cell gekoppeld worden
    // en de opmaak juist gezet worden.

    let cellCount = 0;

    var uniekeLetter = nextLetter(size);

    for (i = 1; i <= size; i++) {
        let row = speelveld.insertRow();
        for (j = 1; j <= size; j++) {


            let cell = row.insertCell();

            //Voeg de juiste kleur toe aan cell
            cell.className = "inactive";

            //Voeg de juiste character toe
            cell.innerText = karakter;

            //voeg een id waarde toe aan de kaart zodat we hem later kunnen indentificeren
            cell.setAttribute("value", cellCount);


            //voeg een eventListener toe
            cell.addEventListener("click", function (event) {

                let card = event.target;
                cardClicked(card);

            });


            //Voeg een unieke letter toe aan de cell
            //Deze word opgeslagen in de cards array


            cards.push(uniekeLetter());

            //Increment de cell count
            cellCount++;

        }


    }


}

function showScores(reDraw) {
    // Vul het topscore lijstje op het scherm.

    // Check of de lijst al op het scherm is getoond anders doe niks




    //Sorteer array met objecten bij tijd
    topScores.sort(function (a, b) {
        return a.time - b.time;
    });

    //als er meerdere scores zijn verwijderd de speler met de slechtste tijd
    let aantalScores = topScores.length;

    if(aantalScores > 5)
    {
        topScores.pop();
    }

    if (reDraw == true) {
        scoreLijst.innerHTML = "";
        setTijden(reDraw = true);

    }



    topScores.forEach(function (score) {

        var node = document.createElement("LI");
        var textnode = document.createTextNode(score.name + " : " + score.time);
        node.appendChild(textnode);

        scoreLijst.appendChild(node);

    });


}

function setTijden(reDraw) {
    // bereken de verlopen tijd, de gemiddlede tijd en het verschil tussen
    // de huidige speeltijd en de gemiddelde tijd en vul de elementen in de HTML.
    // Vul ook het aantal gevonden kaarten

    //Gemiddelde tijd
    let somTijden = 0;
    let aantal = 0;

    if (reDraw = true) {
        speeltijd.innerText = "";
    }

    //Itereer door de Topscores array en tel alle tijden bij elkaar op
    topScores.forEach(function (score) {
        aantal++;
        somTijden += score.time;
    });


    //Bereken de gemiddelde tijd
    gemiddeldeTijd = Math.floor(somTijden / aantal);

    //Update gemiddelde tijd op het scherm
    speeltijd.innerText = gemiddeldeTijd + " seconden";


}

function getSeconds() {
    // Een functie om de Systeemtijd in seconden in plaats van miliseconden
    // op te halen. Altijd handig.
}

var nextLetter = function (size) {
    var letterArray = "AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ".substring(0, size * size).split('');
    var idx = 0;
    letterArray = shuffle(letterArray);
    return function () {
        var letter = letterArray[idx++];
        return letter;
    }
};

function cardClicked(card) {


    checkStarttijd();
    checkDerdeKaart();
    var draaiKaartOm = turnCard(card);
    if (draaiKaartOm == 2) {
        checkKaarten();
    }
}

function playTimer() {
    timerBalkWidth = timerBalkWidth - 37;
    timerBalk.style.width = timerBalkWidth + "px";

    if (firstCard.innerText != secondCard.innerText && timerBalkWidth == 0) {
        deactivateCards();
    }
}


function resetVindTimer() {
    timerBalk.style.width = "185px";
    timerBalkWidth = "185";

    window.clearInterval(vindTijd);
    vindTijd = null;
}

function checkStarttijd() {
    // Controleer of de startijd van het spel gezet is, i.e. het spel al gestart was.
    // Als dat niet zo is doe dat nu, en start de timeOut voor het bijhouden van de tijd.
}

function checkDerdeKaart() {
    // Controleer of het de derde kaart is die wordt aangeklikt.
    // Als dit zo is kunnen de geopende kaarten gedeactiveerd (gesloten) worden.

}

function turnCard(card) {
    // Draai de kaart om. Dit kan alleen als de kaart nog niet geopend of gevonden is.
    // Geef ook aan hoeveel kaarten er nu zijn omgedraaid en return dit zodat in de
    //


    // Bij een eerste klik op een kaart, word voor het eerst deze functie aangeroepen
    // Vandaar dat het aantal openkaarten nog steeds 0 is. In werkelijkheid is dit
    // natuurlijk niet zo


    if (openKaarten == 0) {
        firstCard = card;

        if (timer == null) {

            timer = window.setInterval(updateTime, 1000);
        }
    }

    if (openKaarten == 1) {
        if (vindTijd == null) {


            vindTijd = window.setInterval(playTimer, 1000);
        }

        secondCard = card;
    }


    if (openKaarten == 2) {
        return 2;
    } else if (card.className == "active" || (card.className == "found")) {} else {

        let cardValue = card.getAttribute("value");
        card.innerText = cards[cardValue];
        card.className = "active";

        openKaarten++;
    }


}

function deactivateCards() {

    // Functie om de twee omgedraaide kaarten weer terug te draaien

    firstCard.innerText = karakter;
    secondCard.innerText = karakter;

    firstCard.className = "inactive";
    secondCard.className = "inactive";

    //Reset het aantal openkaarten
    openKaarten = 0;


    resetVindTimer();


}

function toggleCard(element) {
    // Draai de kaart om, als de letter getoond wordt, toon dan de achterkant en
    // vice versa. switch dus van active naar inactive of omgekeerd.
}

function checkKaarten() {
    // Kijk of de beide kaarten gelijk zijn. Als dit zo is moet het aantal gevonden paren
    // opgehord worden, het aantal resterende kaarten kleiner worden en ervoor
    // gezorgd worden dat er niet meer op de kaarten geklikt kan worden. De kaarten
    // zijn nu found.
    // Als de kaarten niet gelijk zijn moet de timer gaan lopen van de toontijd, en
    // de timeleft geanimeerd worden zodat deze laat zien hoeveel tijd er nog is.

    if (firstCard != "") {
        if (firstCard.innerText == secondCard.innerText) {


            resetVindTimer();

            firstCard.className = "found";
            secondCard.className = "found";


            //Reset firstcard, secondcard
            firstCard = "";
            secondCard = "";

            AantalGevonden++;
            gevonden.innerText = AantalGevonden;
            openKaarten = 0;

            if (AantalGevonden == cards.length / 2) {
                endGame();
            }
        } else {
            deactivateCards();
        }
    }

}

function updateTime() {

    seconden++;
    timefield.innerText = seconden;
}


// De functie tijdBijhouden moet elke halve seconde uitgevoerd worden om te controleren of
// het spel klaar is en de informatie op het scherm te verversen.
function tijdBijhouden() {
    if (numberOfCardsLeft == 0) {
        endGame();
    } else {
        setTijden();
        // Roep hier deze functie over 500 miliseconden opnieuw aan
    }
}

function endGame() {
    // Bepaal de speeltijd, chekc topscores en doe de overige
    // administratie.

    //stop de timer
    window.clearInterval(timer);

    updateTopScores(seconden);
    showScores(reDraw = true);


}

function updateTopScores(speelTijd) {
    var name = prompt("Game has ended! Please enter your name");

    let newScore = {
        name: name,
        time: speelTijd
    };
    topScores.push(newScore);


}

// Deze functie ververst de kleuren van de kaarten van het type dat wordt meegegeven.
function setColor(stylesheetId) {
    var valueLocation = '#value' + stylesheetId.substring(3);
    var color = $(valueLocation).val();
    $(stylesheetId).css('background-color', '#' + color);
}

// knuth array shuffle
// from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

$(document).ready(function () {


    $("#opnieuw").click(function () {
        initGame($("#size").val());
    });
});