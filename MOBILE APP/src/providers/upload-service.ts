import { Injectable } from '@angular/core';

const CONFIG = {
  apiUrl: 'http://192.168.1.2:',

  //lezimna methode tlwaj l inet adr mtal wifi automatiquement
};

@Injectable()
export class UploadService {

  constructor() {
  }

  public getApiUrl() {
    return CONFIG.apiUrl;
  }
}
