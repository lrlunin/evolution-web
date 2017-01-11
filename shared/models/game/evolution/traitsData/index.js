import {fromJS} from 'immutable';
import {TRAIT_TARGET_TYPE
  , TRAIT_COOLDOWN_DURATION
  , TRAIT_COOLDOWN_PLACE
  , TRAIT_COOLDOWN_LINK
  , CARD_TARGET_TYPE
  , TRAIT_ANIMAL_FLAG
} from '../constants';

import {
  server$startFeeding
  , server$traitActivate
  , server$traitStartCooldown
  , server$traitAnimalRemoveTrait
  , server$traitGrazeFood
  , server$traitSetAnimalFlag
  , server$traitNotify_End
} from '../../../../actions/actions';

import {getRandom} from '../../../../utils/randomGenerator';
import {checkAction} from '../TraitDataModel';

import {FOOD_SOURCE_TYPE} from '../constants';

//

import {TraitCarnivorous} from './TraitCarnivorous';

export {TraitCarnivorous};

export const TraitParasite = {
  type: 'TraitParasite'
  , cardTargetType: CARD_TARGET_TYPE.ANIMAL_ENEMY
  , food: 2
};

export const TraitFatTissue = {
  type: 'TraitFatTissue'
  , multiple: true
};

//

export const TraitSwimming = {
  type: 'TraitSwimming'
};

export const TraitRunning = {
  type: 'TraitRunning'
  , action: (game, runningAnimal, attackAnimal) => dispatch => {
    if (getRandom(0, 1) > 0) {
      return true;
    }
    return false;
  }
};

export const TraitMimicry = {
  type: 'TraitMimicry'
  , targetType: TRAIT_TARGET_TYPE.ANIMAL
  , cooldowns: fromJS([
    ['TraitMimicry', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  ])
  , action: (game, mimicryAnimal, newTargetAnimal, attackAnimal, attackTraitData) => (dispatch, getState) => {
    dispatch(server$traitStartCooldown(game.id, TraitMimicry, mimicryAnimal));
    return dispatch(server$traitActivate(game, attackAnimal, attackTraitData, newTargetAnimal));
  }
  , getTargets: (game, attackAnimal, attackTraitData, mimicryAnimal) => {
    return game.getPlayer(mimicryAnimal.ownerId).continent.filter((animal) =>
      mimicryAnimal.id !== animal.id
      && attackAnimal.id !== animal.id
        //&& !animal.hasTrait('TraitMimicry')
      && (!animal.hasTrait('TraitMimicry') || animal.hasTrait('TraitMimicry') && checkAction(game, TraitMimicry, animal))
      && attackTraitData.checkTarget(game, attackAnimal, animal)
    );
  }
};

export const TraitScavenger = {
  type: 'TraitScavenger'
  , checkTraitPlacement: (animal) => !animal.hasTrait('TraitCarnivorous')
};

//

export const TraitSymbiosis = {
  type: 'TraitSymbiosis'
  , cardTargetType: CARD_TARGET_TYPE.LINK_SELF_ONEWAY
};

export const TraitPiracy = {
  type: 'TraitPiracy'
  , targetType: TRAIT_TARGET_TYPE.ANIMAL
  , playerControllable: true
  , cooldowns: fromJS([
    ['TraitPiracy', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.TURN]
  ])
  , action: (game, sourceAnimal, targetAnimal) => dispatch => {
    dispatch(server$traitStartCooldown(game.id, TraitPiracy, sourceAnimal));
    dispatch(server$startFeeding(game.id, sourceAnimal, 1, FOOD_SOURCE_TYPE.ANIMAL_TAKE, targetAnimal.id));
    return true;
  }
  , $checkAction: (game, sourceAnimal) => sourceAnimal.canEat(game)
  , checkTarget: (game, sourceAnimal, targetAnimal) => targetAnimal.food > 0 && !targetAnimal.canSurvive()
};

export const TraitTailLoss = {
  type: 'TraitTailLoss'
  , targetType: TRAIT_TARGET_TYPE.TRAIT
  , cooldowns: fromJS([
    ['TraitTailLoss', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  ])
  , action: (game, targetAnimal, traitIndex, attackAnimal, attackTraitData) => (dispatch, getState) => {
    dispatch(server$traitAnimalRemoveTrait(game.id, targetAnimal, traitIndex));

    dispatch(server$startFeeding(game.id, attackAnimal, 1, FOOD_SOURCE_TYPE.ANIMAL_HUNT, targetAnimal.id));
    dispatch(server$traitStartCooldown(game.id, TraitCarnivorous, attackAnimal));
    dispatch(server$traitNotify_End(game.id, attackAnimal.id, TraitCarnivorous.type, targetAnimal.id));
    return true;
  }
};

export const TraitCommunication = {
  type: 'TraitCommunication'
  , cardTargetType: CARD_TARGET_TYPE.LINK_SELF
  , cooldowns: fromJS([
    ['TraitCommunication', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  ])
  , action: () => true
};

//

export const TraitGrazing = {
  type: 'TraitGrazing'
  , cooldowns: fromJS([
    ['TraitGrazing', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ROUND]
  ])
  , targetType: TRAIT_TARGET_TYPE.NONE
  , playerControllable: true
  , action: (game, sourceAnimal) => (dispatch) => {
    dispatch(server$traitStartCooldown(game.id, TraitGrazing, sourceAnimal));
    dispatch(server$traitGrazeFood(game.id, 1, sourceAnimal));
    return true;
  }
  , $checkAction: (game, sourceAnimal) => game.food > 0
};

export const TraitMassive = {
  type: 'TraitMassive'
  , food: 1
};

export const TraitHibernation = {
  type: 'TraitHibernation'
  , cooldowns: fromJS([
    ['TraitHibernation', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.TWO_TURNS]
  ])
  , targetType: TRAIT_TARGET_TYPE.NONE
  , playerControllable: true
  , action: (game, sourceAnimal) => (dispatch) => {
    dispatch(server$traitStartCooldown(game.id, TraitHibernation, sourceAnimal));
    dispatch(server$traitSetAnimalFlag(game, sourceAnimal, TRAIT_ANIMAL_FLAG.HIBERNATED));
    return false;
  }
  , $checkAction: (game, sourceAnimal) => sourceAnimal.canEat(game) && game.deck.size > 0
};

export const TraitPoisonous = {
  type: 'TraitPoisonous'
  , targetType: TRAIT_TARGET_TYPE.NONE
  , action: (game, sourceAnimal, targetAnimal) => (dispatch) => {
    dispatch(server$traitSetAnimalFlag(game, targetAnimal, TRAIT_ANIMAL_FLAG.POISONED))
    return true;
  }
};

//

export const TraitCooperation = {
  type: 'TraitCooperation'
  , cardTargetType: CARD_TARGET_TYPE.LINK_SELF
  , cooldowns: fromJS([
    ['TraitCooperation', TRAIT_COOLDOWN_PLACE.ANIMAL, TRAIT_COOLDOWN_DURATION.ACTIVATION]
  ])
  , action: () => true
};

export const TraitBurrowing = {
  type: 'TraitBurrowing'
};

export const TraitCamouflage = {
  type: 'TraitCamouflage'
};

export const TraitSharpVision = {
  type: 'TraitSharpVision'
};