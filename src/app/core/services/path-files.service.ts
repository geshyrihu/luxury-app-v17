import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PathFilesService {
  applicationUsserImgPath(imgName: string): string {
    return `${environment.base_urlImg}Administration/accounts/${imgName}`;
  }
}
