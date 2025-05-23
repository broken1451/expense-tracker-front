import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../interfaces/expenses.interface';
import dayjs from 'dayjs'
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

@Pipe({
  name: 'orderByDate',
  standalone: true
})
export class OrderByDatePipe implements PipeTransform {

  transform(expense: Expense[], startDate?: string): Expense[] {
    if (!expense) {
      return [];
    }

    if (!startDate) {
      return expense;
    }

    let selectedExpenses: any;
    let otherExpenses: any;
    selectedExpenses = expense.filter(ex => ex.date === startDate);
    otherExpenses = expense.filter(ex => ex.date !== startDate);
    return [...selectedExpenses, ...otherExpenses];
  }
}
