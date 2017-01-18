// Core
import React, {PropTypes} from 'react';
import T from 'i18n-react';
import RIP from 'react-immutable-proptypes';

// Validation
import {CardModel} from '../../../../shared/models/game/CardModel';

// Components
import {AnimationServiceRef} from '../../../services/AnimationService';
import {Card} from './Card.jsx';
import Deck from './Deck.jsx';

import './DeckWrapper.scss';

export const DeckWrapper = AnimationServiceRef(({deck, connectRef}) => (
  <div className='DeckWrapper'>
    <h6>{T.translate('Game.UI.Deck')}: ({deck.size})</h6>
    <Deck ref={connectRef('Deck')}>
      {deck.map((cardModel, i) => <Card key={i} card={cardModel}/>)}
    </Deck>
  </div>
));

DeckWrapper.displayName = 'DeckWrapper';

DeckWrapper.propTypes = {
  deck: RIP.listOf(PropTypes.instanceOf(CardModel)).isRequired
  //, connectRef: PropTypes.func.isRequired
};