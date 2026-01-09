import type {EndHandler} from './EndHandler';
import type {IntermediateHandler} from './IntermediateHandler';
import type {StartHandler} from './StartHandler';

interface HandlersCollector {
  start: StartHandler[];
  intermediate: IntermediateHandler[];
  end: EndHandler[];
}

export const allHandlers: HandlersCollector = {
  start: [],
  intermediate: [],
  end: []
};
