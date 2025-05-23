import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../interfaces/expenses.interface';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByPipe implements PipeTransform {

  transform(expense: Expense[], orderBy?: string): Expense[] {
    
    if (!orderBy) {
      return expense;
    }

    let selectedExpenses: any;
    let otherExpenses: any;
    switch (orderBy) {
      case 'comida':
        selectedExpenses = expense.filter(ex => ex.category === orderBy);
        otherExpenses = expense.filter(ex => ex.category !== orderBy);
        return [...selectedExpenses, ...otherExpenses];
      case 'transporte':
        selectedExpenses = expense.filter(ex => ex.category === orderBy);
        otherExpenses = expense.filter(ex => ex.category !== orderBy);
        return [...selectedExpenses, ...otherExpenses];
      case 'hogar':
        selectedExpenses = expense.filter(ex => ex.category === orderBy);
        otherExpenses = expense.filter(ex => ex.category !== orderBy);
        return [...selectedExpenses, ...otherExpenses];
      case 'ocio':
        selectedExpenses = expense.filter(ex => ex.category === orderBy);
        otherExpenses = expense.filter(ex => ex.category !== orderBy);
        return [...selectedExpenses, ...otherExpenses];
      case 'salud':
        selectedExpenses = expense.filter(ex => ex.category === orderBy);
        otherExpenses = expense.filter(ex => ex.category !== orderBy);
        return [...selectedExpenses, ...otherExpenses];
      case 'otros':
        selectedExpenses = expense.filter(ex => ex.category === orderBy);
        otherExpenses = expense.filter(ex => ex.category !== orderBy);
        return [...selectedExpenses, ...otherExpenses];
      default:
        return expense;
    }
  }

}
