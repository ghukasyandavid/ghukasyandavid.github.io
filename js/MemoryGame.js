var MemoryGame = {

  settings: {
    rows: 2,
    columns: 3,
    images: 3, // Number of images
  },

  cards: [],
  attempts: 0,  
  isGameOver: false,  

  /*
   * Initialize a new game
  */
  initialize: function (rows, columns, images) {

    this.settings.rows = rows;
    this.settings.columns = columns;
    this.settings.images = images;
    this.attempts = 0;   
    this.isGameOver = false;
    this.isFlipped = false;
    this.createCards().shuffleCards();

    return this.cards;
  },

  /*
   * Create an array of sorted cards
   */
  createCards: function () {
    var createCards = [];    
    var count = 0;
    var value =1;
    var differentCards = (this.settings.columns * this.settings.rows) / 2;    // Number of different cards
    while (count < differentCards) {
      // Create first Card
      createCards[2*count] = new this.Card(value);
      // Create second card with same value
      createCards[2*count + 1] = new this.Card(value, true);
      count++;
      value++;
    }
    this.cards = createCards;
    return this;
  },

  /*
   * Schuffle Cards and return a schuffled array of cards
   */
  shuffleCards: function () {    
    
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    return this;
  },
 
  

  /*
   * Player clicks two different cards that get flipped and checked for a match. Return a status   
   */
  play: (function () {
    var selectedCard = [];
    var revealedCards = 0;    
    var lockCards = false;

    return function (index) {
      var status = {};    

      // Prevents more than 2 cards beeing revealed at the same time
      if (lockCards == true){
        return;
      }      

      if (!this.cards[index].isRevealed) {       
        this.cards[index].reveal();
        
        if (selectedCard.length == 1) {  
          // Flip second card
          lockCards=true;
          selectedCard.push(index);                
          this.attempts++;
          setTimeout(function () {
            lockCards = false;
          }, 700)
          if (this.cards[selectedCard[0]].value != this.cards[selectedCard[1]].value) {
            // No match
            this.cards[selectedCard[0]].conceal();
            this.cards[selectedCard[1]].conceal();
            
            status.code = 3,           
            status.tmp = selectedCard;            
          }
          else {
            // Match
            revealedCards += 2;
            if (revealedCards == this.cards.length) {
              // All cards are matched, game is over
              this.isGameOver = true;
              revealedCards = 0;              
              status.code = 4;                           
            }
            else {
              // Match 
              status.code = 2;                
            }
          }          
          selectedCard = [];
        }
        else {
          // Flip first card
          selectedCard.push(index);
          status.code = 1;          
        }
      }
      else {
        // Card is already revealed and facing up
        status.code = 0;        
      }      
      return status;
    };
  })()
};

MemoryGame.Card = function(value, isMatchingCard) {
  this.value = value;
  this.isRevealed = false;
 
  if (isMatchingCard) {
    this.isMatchingCard = true;
  }

  this.reveal = function() {    
    this.isRevealed = true;    
  }

  this.conceal = function() {
    this.isRevealed = false;    
  }
};
