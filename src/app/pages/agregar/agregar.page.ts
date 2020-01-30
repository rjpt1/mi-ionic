import { Component, OnInit, ViewChild } from '@angular/core';
import { DeseosService } from '../../services/deseos.service';
import { ActivatedRoute } from '@angular/router';
import { Lista } from '../../models/lista.models';
import { ListaItem } from '../../models/lista-item.model';
import { AlertController, IonList } from '@ionic/angular';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  @ViewChild(IonList, {static: true}) cerrarBotonEditar: IonList;
  lista: Lista;
  nombreItem = '';
  constructor(private deseosService: DeseosService,
              private route: ActivatedRoute,
              private alertCtrl: AlertController) {
    const listaId = this.route.snapshot.paramMap.get('listaId');
    this.lista = this.deseosService.obtenerLista( listaId );
  }

  ngOnInit() {
  }

  agregarItem() {
    if (this.nombreItem.length === 0) {
      return;
    }
    const nuevoItem = new ListaItem(this.nombreItem);
    this.lista.items.push(nuevoItem);
    this.nombreItem = '';
    this.deseosService.guardarStorage();
  }

  cambioCheck(item: ListaItem){
    const pendientes = this.lista.items.filter(itemData =>{
      return !itemData.completado;
    }).length;
    if (pendientes === 0) {
      this.lista.terminadaEn = new Date();
      this.lista.terminada = true;
    } else {
      this.lista.terminadaEn = null;
      this.lista.terminada = false;
    }
    this.deseosService.guardarStorage();
  }

  borrar(i: number) {
    this.lista.items.splice(i, 1);
    this.deseosService.guardarStorage();
  }

  async editar(i: number, mislide: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar items',
      inputs: [{
        name: 'titulo',
        type: 'text',
        value: this.lista.items[i].descripcion,
        placeholder: 'Nombre del item'
      }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: ()  => {
            console.log('Cancelar');
            // this.cerrarBotonEditar.closeSlidingItems();
            mislide.close(); // otra forma de cerrar el slide; mislide es un id que le pongo a la etiqueta ion-item-sliding
          }
        },
        {
          text: 'Actualizar',
          handler: (data) => {
            console.log(data);
            if (data.titulo.length === 0) {
              return;
            }
            this.lista.items[i].descripcion = data.titulo;
            this.deseosService.guardarStorage();
            // this.cerrarBotonEditar.closeSlidingItems();
            mislide.close();
          }
        }
      ]
    });

    alert.present();
  }
}
