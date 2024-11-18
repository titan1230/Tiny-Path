import { format, subDays } from 'date-fns';

export function generatePast30Days() {
  const days = [];
  for (let i = 0; i < 30; i++) {
    days.push(format(subDays(new Date(), i), 'dd/MM'));
  }
  return days.reverse();
}
