import {Component} from '@angular/core';
import {
  NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading,
  AlertController
} from 'ionic-angular';
import {Camera, File, Transfer, FilePath} from 'ionic-native';
import {ResultPage} from "../result/result";
import {UploadService} from "../../providers/upload-service";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lastImage: string = null;
  loading: Loading;
  apiUrl = this.appSettings.getApiUrl();
  name: String;
  successUrl: String;
  urlImg: string;
  numero: string;
  image: string;

  constructor(public http: Http, public alertCtrl: AlertController, public appSettings: UploadService, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) {
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Load random image',
          handler: () => {
            this.presentPrompt();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Random Picture',
      inputs: [
        {
          name: 'number',
          placeholder: 'Give number [1..2947]'
        }
      ],
      buttons: [
        {
          text: 'Preview',
          handler: data => {
            this.preview(data.number);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            //Cancel
          }
        }

      ]
    });
    alert.present();
  }

//Preview - random
  public preview(num) {
    this.numero = "IMG" + num + ".jpg";
    var data = JSON.stringify({
      number: num,
    });
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post(this.apiUrl + "numb", data, {headers: headers}).subscribe();
    this.urlImg = this.apiUrl + "IMG" + num + ".jpg";
    this.lastImage = "IMG" + num + ".jpg";
  }


//Camera
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    }
    else if (img === this.numero) {
      return this.urlImg;
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = this.apiUrl + "upload";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    this.name = "file-" + filename;

    this.successUrl = this.apiUrl + this.name;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'fileName': filename}
    };



    const fileTransfer = new Transfer();


    console.log(targetPath);
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();


    // Use the FileTransfer to upload the image

    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded. Please wait until image get recognized');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });

  }


  pushPage() {
    this.navCtrl.push(ResultPage, {name: this.name});
  }

}
