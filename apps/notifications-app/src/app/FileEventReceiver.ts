import { Router } from 'express';
import { Observable } from 'rxjs';
import { EventStatus, IFileEvent } from './models';
import { NotificationsService } from './NotificationsService';
import { ImmediateSender } from './senders/ImmediateSender';

export class FileEventReceiver {
  private static instance: FileEventReceiver;
  private static router: Router;

  private immediateSender = new ImmediateSender();

  public static getInstance(events$: Observable<IFileEvent>) {
    if (!FileEventReceiver.instance) {
      FileEventReceiver.instance = new FileEventReceiver(events$);
    }
    return FileEventReceiver.router;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(events$: Observable<IFileEvent>) {
    events$.subscribe(this.handleEvents);
    const router = Router();
    router.get('/test', (req, res) => {
      res.send('ok')
    });
    FileEventReceiver.router = router;
  }

  private handleEvents = async (e: IFileEvent) => {
    console.log(`Event ${Date.now()}: ${JSON.stringify(e)}`)
    await NotificationsService.persistEvent(e);
    try {
      await this.immediateSender.send(e);
    } catch (err) {
      await NotificationsService.updateEventStatus(
        e._id, EventStatus.Error, this.immediateSender.getSenderKey()
      );
    }
  }

}
