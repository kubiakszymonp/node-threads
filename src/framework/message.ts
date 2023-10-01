export class ThreadMessage {
  constructor(public type: ThreadMessageType, public payload: any) {}
}

export enum ThreadMessageType {
  FINISHED,
  ERROR,
  MESSAGE,
}
