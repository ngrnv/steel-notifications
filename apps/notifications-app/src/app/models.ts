import { ObjectId } from 'mongodb';

export enum EventType {
  FileUploadStarted = 'FileUploadStarted',
  FileUploadCompleted = 'FileUploadCompleted',
  FileRemoved = 'FileRemoved',
}

export enum EventStatus {
  Pending = 'pending',
  Sending = 'sending',
  Sent = 'sent',
  Error = 'error'
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
  status: EventStatus;
  statuses: {[senderKey: string]: EventStatus}
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
