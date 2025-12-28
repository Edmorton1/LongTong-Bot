export interface Connection {
  connect: () => void;
  get: () => unknown;
  disconnect: () => void;
}
