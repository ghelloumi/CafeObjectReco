import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {UploadService} from "../../providers/upload-service";

/*
  Generated class for the Result page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})
export class ResultPage {
  apiUrl = this.appSettings.getApiUrl();
  constructor(public appSettings: UploadService,public navCtrl: NavController, public navParams: NavParams) {}


  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
  }

}
