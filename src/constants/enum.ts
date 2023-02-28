export enum EDisconnectReason {
  TRANSPORT_CLOSE = 'transport close',
  TRANSPORT_ERROR = 'transport error',
  PING_TIMEOUT = 'ping timeout',
}

export enum NotifyEvent {
  AddLog = 'AddLog',
  ClearLog = 'ClearLog',
  RefetchUser = 'RefetchUser',
  ShowConnectionAlert = 'ShowConnectionAlert',
}
