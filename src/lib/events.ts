const bus = new EventTarget();

export function emit(event: 'words-changed' | 'sessions-changed') {
  bus.dispatchEvent(new Event(event));
}

export function subscribe(
  event: 'words-changed' | 'sessions-changed',
  handler: () => void
) {
  bus.addEventListener(event, handler);
  return () => bus.removeEventListener(event, handler);
}
