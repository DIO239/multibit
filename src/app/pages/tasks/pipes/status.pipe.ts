import { Pipe, PipeTransform } from "@angular/core";
import {Status} from "../types/status.enum";

@Pipe({
  standalone: true,
  name: 'currentStatusName'
})

export class StatusPipe implements PipeTransform {
  transform(value: string): any {
    return Status[value as keyof typeof Status];
  }
}
