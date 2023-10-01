export class ThreadMessage {
  constructor(public type: ThreadMessageType, public payload: any) {}

  serialize() {
    return JSON.stringify({
      type: this.type,
      payload: this.payload,
    });
  }
  static deserialize(message: string) {
    if (typeof message !== "string") {
      return message;
    }
    const { type, payload } = JSON.parse(message);
    return new ThreadMessage(type, payload);
  }
}

export enum ThreadMessageType {
  FINISHED,
  ERROR,
  MESSAGE,
}
