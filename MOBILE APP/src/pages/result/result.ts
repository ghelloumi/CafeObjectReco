import {Component} from '@angular/core';
import {NavParams, Platform} from 'ionic-angular';
import {UploadService} from "../../providers/upload-service";

@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})

export class ResultPage {

  h: number;
  w: number;

  url = this.appSettings.getApiUrl()+this.navParams.get('name');

  constructor(platform: Platform,public appSettings: UploadService, public navParams: NavParams) {
    platform.ready().then((readySource) => {
      this.w = platform.width();
      this.h = (platform.height()/4)*3;
    });
  }

  ionViewDidLoad() {
  }
}
