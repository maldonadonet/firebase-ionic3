import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController } from "ionic-angular";
import { User } from "./../../models/user";
// Firebase import
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
    user = {} as User;

    constructor(private afA: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {}

    async login(user: User) {
      try{
        const result = await this.afA.auth.signInWithEmailAndPassword(user.email,user.password);
        console.log('Inicio exitoso: ',result);
        if(result) {
          this.navCtrl.setRoot("HomePage");
        }
      }catch(e){
        console.error('Error',e);
        const alert = this.alertCtrl.create({
          title: 'Error al Iniciar',
          subTitle: e.message,
          buttons: ['Ok']
        });
        alert.present();
        this.user.password = '';
      }
    }

    register() {
        this.navCtrl.push('RegisterPage');
    }
}
