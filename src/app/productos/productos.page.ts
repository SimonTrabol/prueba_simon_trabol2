import { Component } from '@angular/core';
import { ProductoService } from '../servicio/producto/producto.service';
import { Producto } from '../interfeces/Producto';
import { ViewWillEnter, ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements ViewWillEnter, ViewDidLeave {
  public productos: Producto[] = [];
  private subProducto!: Subscription;

  constructor(private prdS: ProductoService) {}

  ionViewWillEnter(): void {
    this.resetProductList(); // Reinicia la lista de productos
    this.subProducto = this.prdS.producto.subscribe((productos) => {
      this.productos = productos;
    });
    this.prdS.listarProductos();
  }

  ionViewDidLeave(): void {
    if (this.subProducto) {
      this.subProducto.unsubscribe();
    }
  }

  private resetProductList() {
    this.productos = []; // Reinicia la lista de productos
    this.prdS.resetPagination(); // Resetea la paginación en el servicio
  }

  public siguiente(event: any) {
    setTimeout(() => {
      this.prdS.siguientesProductos(); // Obtiene más productos
      this.prdS.producto.subscribe((productos) => {
        if (productos.length > 0) {
          event.target.complete(); // Completa el evento de Infinite Scroll
        } else {
          event.target.disabled = true; // Desactiva el Infinite Scroll si no hay más productos
        }
      });
    }, 1600);
  }
}