import { ObjectId } from 'mongodb';

export enum EventType {
  FileUploadStarted = 'FileUploadStarted',
  FileUploadCompleted = 'FileUploadCompleted',
  FileRemoved = 'FileRemoved',
}

export enum Periodicity {
  Immediate = 'immediate',
  FiveMin = '5min',
  TenMin = '10min',
}

export type SenderKey = Periodicity;

export interface IFileEvent {
  _id: ObjectId;
  type: EventType;
  payload: string;
  timestamp: Date;
  statuses: {[senderKey: string]: NotificationsStatus}
}

export interface ISubscription {
  email: string;
  periodicity: Periodicity;
}

export interface EmailSendResult {
  accepted: string[];
  rejected: string[];
  response: string;
  messageId: string;
}

export enum NotificationsStatus {
  Pending = 'pending',
  Sending = 'sending',
  Sent = 'sent',
  PartiallySent = 'partiallySent',
  Failed = 'failed',
}

export interface NotificationsJob {
  _id: ObjectId;
  failedSubscribers: string[];
  senderKey: string;
  status: NotificationsStatus;
  events: ObjectId[];
}
