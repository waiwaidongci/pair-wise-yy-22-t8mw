// Per-workstation FIFO lock: two schedulers racing for the same workstation
// are serialized so the earlier request claims the slot first.
const chains = new Map<number, Promise<unknown>>();

export function withWorkstationLock<T>(workstationId: number, task: () => Promise<T>): Promise<T> {
  const previous = chains.get(workstationId) ?? Promise.resolve();
  const next = previous.then(task, task);
  chains.set(
    workstationId,
    next.then(
      () => undefined,
      () => undefined
    )
  );
  return next;
}
