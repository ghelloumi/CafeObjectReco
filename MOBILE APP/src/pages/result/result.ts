import {Component, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {NavParams, Platform, NavController} from 'ionic-angular';
import {UploadService} from "../../providers/upload-service";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-result',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: 'result.html'
})

export class ResultPage {
  h: number;
  w: number;

  urlp = this.appSettings.getApiUrl()+this.navParams.get('name');

  constructor(private cdr:ChangeDetectorRef,platform: Platform,public appSettings: UploadService, public navParams: NavParams,public navCtrl:NavController) {
    platform.ready().then((readySource) => {
      this.w = platform.width();
      this.h = (platform.height()/6)*3;

    });
  }

  private imageRetries:number = 0;
  private unsub;


  private detach() {
    this.cdr.detach();
  }

  private getImageUrl() {
    var url = '';
    switch (this.imageRetries){
      case 0: {
        url = this.urlp;
        break;
      }
      case 1: {
        url = 'assets/img/wait.gif';
        break;
      }
      default: {
        url = 'assets/img/wait.gif'
        break;
      }

    }
    return url;
  }

  private onImageLoaded() {
    this.detach();
  }

  private onImageError() {
    this.imageRetries++;
  }

  update(){
    // this.urlp = this.appSettings.getApiUrl()+HomePage.n;
    // console.log(HomePage.n);
    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  returnto(){
    // this.navCtrl.pop();
  }

  ionViewDidLoad() {
  }
}
