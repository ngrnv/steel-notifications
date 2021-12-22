import { Router } from "express";
import { Observable } from "rxjs";
import { IFileEvent } from "./models";
import { NotificationsService } from "./services/NotificationsService";
import { ImmediateSender } from "./senders/ImmediateSender";
import { FiveMinuteSender } from "./senders/FiveMinuteSender";
import { TenMinuteSender } from "./senders/TenMinuteSender";

export class FileEventReceiver {
  private static instance: FileEventReceiver;
  private static router: Router;

  private immediateSender = new ImmediateSender();

  public static getInstance(events$: Observable<IFileEvent>) {
    if (!FileEventReceiver.instance) {
      FileEventReceiver.instance = new FileEventReceiver(events$);
    }
    new FiveMinuteSender().start();
    new TenMinuteSender().start();
    return FileEventReceiver.router;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(events$: Observable<IFileEvent>) {
    events$.subscribe(this.handleEvents);
    const router = Router();
    router.get("/health", (req, res) => {
      res.send("ok");
    });
    FileEventReceiver.router = router;
  }

  private handleEvents = async (e: IFileEvent) => {
    await NotificationsService.persistEvent({ ...e, timestamp: new Date() });
    await this.immediateSender.send(e);
  };

}
