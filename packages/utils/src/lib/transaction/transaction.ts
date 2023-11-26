import { TransactionStep } from './step';

export class Transaction {
  private steps: TransactionStep[];

  constructor() {
    this.steps = [];
  }

  addStep(step: TransactionStep) {
    this.steps.push(step);
  }

  async commit() {
    const doneSteps = [];
    try {
      for (const step of this.steps) {
        await step.do();
        doneSteps.push(step);
      }
    } catch (error) {
      for (const step of doneSteps.reverse()) {
        try {
          await step.rollback();
        } catch (rollbackError) {
          console.error('Failed to rollback', rollbackError);
        }
      }
      throw error;
    }
  }
}
