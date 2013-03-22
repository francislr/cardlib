/**
 * Simple playing card in javascript
 * By Francis Renaud
 */

Card = function (rank, suit, params) {
  /**
   * The card rank
   * @type {Card.Rank}
   * @private
   */
  this.rank = rank;

  /**
   * The card suit
   * @type {Card.Suit}
   * @private
   */
  this.suit = suit;

  /**
   * The main card element, containing front and back element
   * @type {Element}
   * @private
   */
  this.element = null;

  /**
   * The  card front DOM element node
   * @type {Element}
   * @private
   */
  this.frontElement = null;

  /**
   * The card back DOM element node
   * @type {Element}
   * @private
   */
  this.backElement = null;

  /**
   * Flipped card state
   * @type {Boolean}
   * @private
   */
  this.flipped = false;
};

/**
 * Card suits
 * @enum {Number}
 */
Card.Suit = {
  SPADE:    0,
  HEART:    1,
  DIAMOND:  2,
  CLUB:     3
};

/**
 * Card ranks
 * @enum {Number}
 */
Card.Rank = {
  ACE:      0,
  ONE:      1,
  TWO:      2,
  THREE:    3,
  FOUR:     4,
  FIVE:     5,
  SIX:      6,
  SEVEN:    7,
  EIGHT:    8,
  NINE:     9,
  TEN:      10,
  JACK:     11,
  QUEEN:    12,
  KING:     13
};

/**
 * Card suit symbols
 * @type {Object.<Card.Suit, String>}
 * @private
 */
Card.Symbols = {
  0: "\u2660",
  1: "\u2665",
  2: "\u2666",
  3: "\u2663"
};

/**
 * Card position
 */

/**
 * Symbol positions over the card column
 * @type {Array.<Array.<Number>>}
 */
Card.SymbolsPosition = [
  [ 0, 1, 0 ], // Ace
  [ 0, 2, 0 ], // Two
  [ 0, 3, 0 ], // Three
  [ 2, 0, 2 ], // Four
  [ 2, 1, 2 ], // Five
  [ 3, 0, 3 ], // Six
  [ 3, 1, 3 ], // Seven
  [ 4, 0, 4 ], // Eight
  [ 4, 1, 4 ], // Nine
  [ 4, 2, 4 ], // Ten
  [ 0, 0, 0 ], // Jack
  [ 0, 0, 0 ], // Queen
  [ 0, 0, 0 ]  // King
];

/**
 * Creates the DOM element structure
 */
Card.prototype.create = function () {
  this.destroy();

  this.element = document.createElement('DIV');
  this.element.className = 'Card';

  this.createFront();
  this.createBack();
};

/**
 * Creates the front face element
 */
Card.prototype.createFront = function () {
  this.frontElement = document.createElement('DIV');

  var cls = 'CardFront Card' + this.getRankValue();
  switch (this.suit) {
  case Card.Suit.SPADE:
    cls += ' CardSpade';
    break ;
  case Card.Suit.HEART:
    cls += ' CardHeart';
    break ;
  case Card.Suit.DIAMOND:
    cls += ' CardDiamond';
    break ;
  case Card.Suit.CLUB:
    cls += ' CardClub';
    break ;
  }

  this.frontElement.className = cls;
  this.element.appendChild(this.frontElement);

  var symbol = Card.Symbols[this.suit];

  // Create symbols
  var column_count = 3;

  var symbols_container = document.createElement('DIV');
  symbols_container.className = 'CardSymbolContainer';

  // Spacing between each symbols of the last iteration
  var last_spacing;

  for (var column = 0; column < column_count; column++) {

    var left = (column * 26 + 10);

    var row_count = Card.SymbolsPosition[this.rank][column];

    var spacing = (100 - 40) / Math.max(row_count - 1, 1);
    if (column == 1 && row_count < 3 && this.rank != Card.Rank.ACE) {
      spacing /= 2;
    }

    for (var row = 0; row < row_count; row++) {

      var top = (row * spacing + 16);

      if (column == 1 && row_count < 3) {
        top += (spacing / 2);
      }

      var symbol_span = document.createElement('DIV');
      symbol_span.className = 'CardSymbol';
      symbol_span.appendChild(document.createTextNode(symbol));
      symbol_span.style.left = left + '%';
      symbol_span.style.top = top + '%';

      symbols_container.appendChild(symbol_span);
    }
    last_spacing = spacing;
  }

  this.frontElement.appendChild(symbols_container);

  // Rank
  var rankSymbol = this.getRankValue();
  var rankSymbolElement = document.createElement('SPAN');
  rankSymbolElement.className = 'CardRank CardRank' + rankSymbol;
  rankSymbolElement.appendChild(document.createTextNode(rankSymbol));
  rankSymbolElement.appendChild(document.createElement('BR'));
  rankSymbolElement.appendChild(document.createTextNode(symbol));

  this.frontElement.appendChild(rankSymbolElement);
};

Card.prototype.createBack = function () {
  this.backElement = document.createElement('DIV');
  this.backElement.className = 'CardBack';
  this.element.appendChild(this.backElement);

};

Card.prototype.destroy = function () {
  // Remove an element from its parent
  var removeElement = function (element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  };

  if (this.element != null) {
    removeElement(this.element);
    this.element = null;
  }

  if (this.frontElement != null) {
    this.frontElement = null;
  }

  if (this.backElement != null) {
    this.backElement = null;
  }
};

Card.prototype.isFace = function () {
  return this.rank == Card.Rank.ACE || this.rank >= Card.Rank.JACK;
};

Card.prototype.getRankValue = function () {
  return [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ][this.rank];
};

Card.prototype.flip = function (state) {
  var flipped;
  if (state == undefined) {
    flipped = !this.flipped;
  }

  var cls = this.element.className;

  if (!flipped) {
    cls = cls.replace(/ CardFlipped/g, '');
  }
  else {
    cls += ' CardFlipped';
  }
  this.flipped = flipped;
  this.element.className = cls;
};
