import { BundleSender } from './BundleSender';
import { Periodicity } from '../models';

/**
 * What could be improved: generating senders for custom interval using factory
 */
export class TenMinuteSender extends BundleSender {
  constructor() {
    super(Periodicity.TenMin, 50*1000);
  }
}
