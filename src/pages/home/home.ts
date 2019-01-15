import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  todo:any={};

  constructor(public navCtrl: NavController, public http:Http, public toastCtrl: ToastController, public plataform:Platform) {
    this.todo.monitor=localStorage.getItem("user");
    this.todo.fecha='';
    this.todo.resumen='';
    this.todo.response='';
    this.http = http;
  }

  //Recoge el nombre de usuario del almacenamiento y para enviarlo al servidor
  llenarMonitor() {
    if(localStorage.getItem("user") != null ){
      document.getElementById("inMonitor").innerText = localStorage.getItem("user");
      console.log(localStorage.getItem("user"));
    }
  }

  //Crea el toast y lo muestra
  public mostrarToast(mensaje:string){
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position:'top'
    });
    toast.present(toast);
  }

  //Recoge la información del formulario y la envía a la api
  logForm(){

    var link="https://hinojosapp.000webhostapp.com/hinojos/web_service/noticiaController.php?vista=registro_clase";

    //Pasamos los datos a un json
    var datos = JSON.stringify({monitor : this.todo.monitor, fecha : this.todo.fecha, resumen : this.todo.resumen});

    /*
    Comprobamos que todos los campos están rellenos
    */
    if(this.todo.fecha == ''){
      document.getElementById('lbFecha').style.color='#F08787';
    }else{
      document.getElementById('lbFecha').style.color='';
    }

    if(this.todo.resumen == ''){
      document.getElementById('lbResumen').style.color='#F08787';
    }else{
      document.getElementById('lbResumen').style.color='';
    }

      //Enviamos la petición post y guardando los resultados
      this.http.post(link,datos).subscribe(data => {

        //Almacenamos y tratamos la respuesta del servidor
        this.todo.response = data["_body"];

        if(this.todo.response == "almacenado_correcto"){
          this.mostrarToast("Información registrada correctamente");
          this.navCtrl.push(HomePage);
        }else{
          this.mostrarToast("No se ha podido registrar la información, revisa la información introducida");
        }

      }, error =>{
        console.log("Ha ocurrido un error interno!");
      });

  }

  //Permite al usuario desconectarse
  logout(){
    localStorage.clear();
    this.navCtrl.push(LoginPage);
  }

}
