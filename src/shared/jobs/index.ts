import { registerAbsentMarkingJob } from './absent-marking.job';
import { registerAutoCheckoutJob } from './auto-checkout.job';

export function registerJobs(): void {
  registerAbsentMarkingJob();
  registerAutoCheckoutJob();
}

