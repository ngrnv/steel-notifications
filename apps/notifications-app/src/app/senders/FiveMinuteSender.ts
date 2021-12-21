import { BundleSender } from './BundleSender';
import { Periodicity } from '../models';

/**
 * What could be improved: generating senders for custom interval using factory
 */
export class FiveMinuteSender extends BundleSender {
  constructor() {
    super(Periodicity.FiveMin, 25*1000);
  }
}
