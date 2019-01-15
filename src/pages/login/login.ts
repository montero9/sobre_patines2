import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

 datos:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public toastCtrl: ToastController, public platform: Platform) {
    this.datos.user='';
    this.datos.pass='';
    this.datos.response='';
    this.http = http;

    //Controlamos el botón pulsar atrás
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        platform.exitApp();
      });
    });
  }

  //Comprobamos si usuario inició sesión anteriormente
  ionViewWillEnter() {
    if(localStorage.getItem("user")  != null){
      this.navCtrl.push(HomePage);
    }
  }

  //Recogemos usuario/contraseña y se lo pasamos al servidor
  login(){

      let link="https://hinojosapp.000webhostapp.com/hinojos/web_service/noticiaController.php?vista=login";

      let datos = JSON.stringify({user : this.datos.user, pass : this.datos.pass});

      this.http.post(link,datos).subscribe(data => {

        this.datos.response = data["_body"];

        if(this.datos.response == "login_aceptado"){
          localStorage.setItem("user", this.datos.user);
          this.navCtrl.push(HomePage);
        }else{

            const toast = this.toastCtrl.create({
              message: 'Usuario/Contraseña incorrecta',
              duration: 3000,
              position:'top'
            });
            toast.present(toast);

        }

      }, error =>{
        console.log("Error inesperado, contacte con el administrador");
      });

  }

}
