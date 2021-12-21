import { Router } from "express";
import { SubscribersService } from "./services/SubscribersService";
import * as yup from "yup";

const ADD_SUBSCRIBER_REQUEST_SCHEMA = yup.object({
  email: yup.string().email().required('Email is required'),
  interval: yup.mixed().oneOf(['immediate', '5min', '10min']).required('Interval is required'),
});

export class SubscriptionsController {
  readonly router: Router;

  constructor() {
    const router = Router();
    router.post("/", SubscriptionsController.addSubscription);
    this.router = router;
  }

  get routes() {
    return this.router;
  }

  private static async addSubscription(req, res) {
    try {
      await ADD_SUBSCRIBER_REQUEST_SCHEMA.validate(req.body)
    } catch (err) {
      res.status(400).send(err.errors);
      return;
    }
    const { email, interval } = req.body;
    const { upsertedId } = await SubscribersService.addSubscription({ email, periodicity: interval});
    res.status(upsertedId ? 201 : 200).send(upsertedId);
  }
}
