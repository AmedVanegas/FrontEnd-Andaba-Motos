import { Pipe} from '@angular/core';

@Pipe({
  name: 'mongoDate',
})
export class MongoDatePipe{
  transform(value: string | Date): string {
    const date = new Date(value);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const ordinal = day > 3 && day < 21 ? 'th' : ['st', 'nd', 'rd', 'th'][day % 10];
    
    return `${month} ${day}${ordinal} ${year}`;
  }
  
}
