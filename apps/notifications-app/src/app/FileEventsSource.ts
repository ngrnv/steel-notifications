import { concatMap, delay, Observable, of, range } from 'rxjs';
import { EventType, IFileEvent } from './models';
import { ObjectId } from 'mongodb';

export class FileEventsSource {
  public start(): Observable<IFileEvent> {
    const eventTypes: EventType[] = [
      EventType.FileUploadStarted,
      EventType.FileUploadCompleted,
      EventType.FileRemoved
    ];

    return range(1, 1000).pipe(
      concatMap(i => of({
          _id: new ObjectId(),
          payload: `File ${i}`,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          timestamp: new Date(),
        } as IFileEvent)
          .pipe(
            delay(1e3 + (Math.random() * 1e4)),
          )
      )
    );
  }
}
