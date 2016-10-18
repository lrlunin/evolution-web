import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate'

import {CardUnknown} from '../../../shared/models/game/evolution/cards'

export const gameGiveCards = (done, game, cards, Deck, Cards) => {
  const DeckHtml = ReactDOM.findDOMNode(Deck);

  cards.map((card, index) => {
    try {
      const CardComponent = Cards[card.id];
      const CardHtml = ReactDOM.findDOMNode(CardComponent);

      const sourceBbx = DeckHtml.getBoundingClientRect();
      const deckOffset = Deck.getXYForCard(game.deck.size + index);
      const targetBbx = CardHtml.getBoundingClientRect();

      const childNode = CardHtml.childNodes[0];
      const style = {
        innerHTML: childNode.innerHTML
        , backgroundImage: childNode.style.backgroundImage
      };
      childNode.innerHTML = '';
      childNode.style.backgroundImage = `url(${CardUnknown.image})`;

      Velocity(CardHtml, {
        translateX: -targetBbx.left + sourceBbx.left + deckOffset.x
        , translateY: -targetBbx.top + sourceBbx.top + deckOffset.y
        , rotateY: 0
      }, 0);

      Velocity(CardHtml, {translateX: -targetBbx.left + 200, translateY: -targetBbx.top + 200, rotateY: 90}
        , {
          duration: 800
          , delay: (cards.size - index) * 200
          , easing: 'easeOutCubic'
          , complete: () => {
            childNode.innerHTML = style.innerHTML;
            childNode.style.backgroundImage = style.backgroundImage;
          }
        });

      Velocity(CardHtml, {translateX: 0, translateY: 0, rotateY: 0}
        , {
          duration: 800
          , easing: 'easeInOutCubic'
        });
    } catch (e) {
      console.error(e)
    }
  });
  setTimeout(() => done(), cards.size * 200);
};