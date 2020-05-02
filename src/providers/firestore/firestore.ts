import { Injectable } from '@angular/core';
// Firebase
import { AngularFirestore } from "angularfire2/firestore";


@Injectable()
export class FirestoreProvider {

  constructor(private afs: AngularFirestore) {
    console.log('Hello FirestoreProvider Provider');
  }

  insertar(coleccion, datos) {
    return this.afs.collection(coleccion).add(datos);
  }

  consultar(coleccion) {
    return this.afs.collection(coleccion).snapshotChanges();
  }

  borrar(coleccion,id) {
    return this.afs.collection(coleccion).doc(id).delete();
  }

}
