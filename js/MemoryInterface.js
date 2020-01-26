(function (game) {


    // How long a non matching card is revealed until flipped back
    var timeWait = 700;

    // How many different images are available     
    var imagesAvailable = 15;


    // Clicking on settings icon
    var settings = document.getElementById('memory_menuIcon');
    var template = document.getElementById('memory_settings_template');
    var clickSettings = function (event) {
        event.preventDefault();
        template.classList.toggle('show');
    };
    settings.addEventListener('click', clickSettings);

    // Clicking start button
    var start = document.getElementById('memory_settings_start');

    var clickStart = function (event) {
        event.preventDefault();

        var selectWidget = document.getElementById("memory_settings_dropdown").valueOf();
        var grid = selectWidget.options[selectWidget.selectedIndex].value;
        var gridValues = grid.split('x');
        var cards = game.initialize(Number(gridValues[0]), Number(gridValues[1]), imagesAvailable);

        if (cards) {
            //remove settings menu to start playing
            document.getElementById('memory_settings_template').classList.remove('show');
            document.getElementById('memory_endgame_template').classList.remove('show');
            document.getElementById('memory_endgame_message').innerText = "";
            buildLayout(game.cards, game.settings.rows, game.settings.columns);
        }

    };
    start.addEventListener('click', clickStart);

    // Clicking on a card 
    var flipCard = function (event) {

        event.preventDefault();

        var status = game.play(this.index);

        if (status != null) {

            if (status.code != 0) {
                this.classList.toggle('clicked');
            }

            if (status.code == 3) {
                // No Match. Unflip cards 
                setTimeout(function () {
                    var childNodes = document.getElementById('memory_cards').childNodes;
                    ///////// morgen hier schauen
                    //this.classList.remove('clicked');
                    //this.classList.toggle('clicked');
                    childNodes[status.tmp[0]].classList.remove('clicked');
                    childNodes[status.tmp[1]].classList.remove('clicked');
                }.bind(status), timeWait);
            } else if (status.code == 4) {
                // Match and all cards are revealed. Game is over
                var message = "Glückwunsch du hast das Level mit " + game.attempts + " Versuchen geschafft!";
                document.getElementById('memory_endgame_message').textContent = message;
                document.getElementById("memory_endgame_template").classList.toggle('show');
                //+vfbrb   hiernach noch evtl dann nen button mit zurück oder so zu settings_template
                //document.getElementById('memory_settings_template').classList.toggle('show');
            }

        };
    }

    // Build grid of cards
    var buildLayout = function (cards, rows, columns) {
        if (!cards.length) {
            return;
        }

        var memoryCards = document.getElementById("memory_cards");
        var index = 0;

        var cardMaxWidth = document.getElementById('memory_container').offsetWidth / columns;
        var cardHeightForMaxWidth = cardMaxWidth;

        var cardMaxHeight = document.getElementById('memory_container').offsetHeight / rows;
        var cardWidthForMaxHeight = cardMaxHeight;

        // Remove child nodes and event listeners.
        while (memoryCards.firstChild) {
            memoryCards.firstChild.removeEventListener('click', flipCard);
            memoryCards.removeChild(memoryCards.firstChild);
        }

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                memoryCards.appendChild(buildCardNode(index, cards[index],
                    (100 / columns) + "%", (100 / rows) + "%"));
                index++;
            }
        }

        // Make everything responsive 
        if (cardMaxHeight > cardHeightForMaxWidth) {
            // Update height
            memoryCards.style.height = (cardHeightForMaxWidth * rows) + "px";
            memoryCards.style.width = document.getElementById('memory_container').offsetWidth + "px";
            memoryCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
        } else {
            // Update Width
            memoryCards.style.width = (cardWidthForMaxHeight * columns) + "px";
            memoryCards.style.height = document.getElementById('memory_container').offsetHeight + "px";
            memoryCards.style.top = 0;
        }

    };

    // Update on media resize
    window.addEventListener('resize', function () {
        buildLayout(game.cards, game.settings.rows, game.settings.columns);
    }, true);

    // Build a card in html
    var buildCardNode = function (index, card, width, height) {
        var flipContainer = document.createElement("li");
        var flipper = document.createElement("div");
        var front = document.createElement("a");
        var back = document.createElement("a");

        flipContainer.index = index;
        flipContainer.style.width = width;
        flipContainer.style.height = height;
        flipContainer.classList.add("flip_container");
        if (card.isRevealed) {
            flipContainer.classList.add("clicked");
        }

        flipper.classList.add("flipper");
        front.classList.add("front");
        front.setAttribute("href", "#");
        back.classList.add("back");
        back.classList.add("card" + card.value);
        if (card.isMatchingCard) {
            back.classList.add("matching");
        }
        back.setAttribute("href", "#");

        flipper.appendChild(front);
        flipper.appendChild(back);
        flipContainer.appendChild(flipper);

        flipContainer.addEventListener('click', flipCard);

        return flipContainer;
    };

})(MemoryGame);