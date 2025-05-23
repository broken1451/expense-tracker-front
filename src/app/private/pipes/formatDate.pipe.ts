import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

@Pipe({
  name: 'formatDate',
  standalone: true,

})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, format: string = 'DD-MM-YYYY'): string {
    if (value) {
      return dayjs(value).locale('es').format(format);
    }
    return '';
  }

}