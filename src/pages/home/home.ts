import { Component } from "@angular/core";
import { IonicPage,NavController,NavParams,ToastController} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import { Tarea } from '../../interfaces/Tarea';
import { FirestoreProvider } from '../../providers/firestore/firestore';




@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  user: any = {};
  productos: Tarea;
  arrayColeccionTareas: any = [{ id: "", data: {} as Tarea }];
  idProduct: string;

  constructor(
    private afAuth: AngularFireAuth,
    private _fs: FirestoreProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
  ) {
    this.productos = {} as Tarea;
    this.obtenerListaProductos();
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe((data) => {
      console.log(data);
      if (data && data.email && data.uid) {
        this.user = data;
        this.toast
          .create({
            message: `Bienvenido a nuestra aplicación ${data.email}`,
            duration: 3000,
          })
          .present();
      } else {
        this.toast
          .create({
            message: "No fue posible identificar al usuario",
            duration: 3000,
          })
          .present();
      }
    });
    console.log(this.user);
  }

  salir() {
    this.afAuth.auth
      .signOut()
      .then((data) => {
        this.navCtrl.push("LoginPage");
      })
      .catch((e) => {
        console.error(e);
      });
  }

  agregar() {
    this._fs.insertar("productos", this.productos).then(
      () => {
        console.log("Tarea agregada");
        this.productos.nombre = "";
        this.productos.descripcion = "";
        this.productos.img = "";
        this.toast
          .create({
            message: `Producto agregado correctamente`,
            duration: 3000,
          })
          .present();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  obtenerListaProductos() {
    this._fs.consultar("productos").subscribe((data) => {
      this.arrayColeccionTareas = [];

      data.forEach((dataproduct: any) => {
        this.arrayColeccionTareas.push({
          id: dataproduct.payload.doc.id,
          data: dataproduct.payload.doc.data(),
        });
      });
    });
  }

  selectProduct(product) {
    this.idProduct = product.id;
    // this.productos.nombre = product.data.nombre;
    // this.productos.descripcion = product.data.descripcion;
    // this.productos.img = product.data.img;
  }

  eliminarProduct(item) {
    this.selectProduct(item);
    this._fs.borrar("productos", this.idProduct).then(() => {
      // Actualizar la lista completa
      this.obtenerListaProductos();
      // Limpiar datos en pantalla
      this.productos = {} as Tarea;
    });
  }

}
