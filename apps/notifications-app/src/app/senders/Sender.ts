import { IFileEvent, Periodicity } from '../models';

export abstract class Sender {
  protected periodicity: Periodicity;

  protected constructor(periodicity: Periodicity) {
    this.periodicity = periodicity;
  }

  getSenderKey() {
    return this.periodicity;
  }

  abstract send(event?: IFileEvent);
}
