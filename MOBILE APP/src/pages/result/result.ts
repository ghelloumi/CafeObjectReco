import {Component} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {Http} from "@angular/http";
import {UploadService} from "../../providers/upload-service";

@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})


export class ResultPage {
  url = this.appSettings.getApiUrl() + "3002/";
  h: number;
  w: number;

  constructor(platform: Platform, public http: Http, public appSettings: UploadService, public navCtrl: NavController, public navParams: NavParams) {
    platform.ready().then((readySource) => {
      this.w = platform.width();
      this.h = platform.height();
    });
  }

  ionViewDidLoad() {

  }

}
