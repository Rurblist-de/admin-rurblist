let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

export function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export function setRefreshing(value: boolean) {
  isRefreshing = value;
}

export function getRefreshing() {
  return isRefreshing;
}
