type ConnectedPlayer = {
  __status: "connected";
  deviceId: string;
};

type DisconnectedPlayer = {
  __status: "disconnected";
};

type ErroredPlayer = {
  __status: "errored";
};

export type ConnectionStatus =
  | ConnectedPlayer
  | DisconnectedPlayer
  | ErroredPlayer;

export const connected = (deviceId: string): ConnectedPlayer => ({
  __status: "connected",
  deviceId,
});
export const disconnected: DisconnectedPlayer = { __status: "disconnected" };
export const errored: ErroredPlayer = { __status: "errored" };
