export class TransactionStep {
  constructor(
    private doFunc: () => void | null | Promise<void>,
    private rollbackFunc: () => void | null | Promise<void>
  ) {}

  do(): void | null | Promise<void> {
    return this.doFunc();
  }

  rollback(): void | null | Promise<void> {
    return this.rollbackFunc();
  }
}
