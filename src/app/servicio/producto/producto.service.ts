import { Injectable } from '@angular/core';
import { Producto } from 'src/app/interfeces/Producto';
import { ProductoRespuesta } from 'src/app/interfeces/ProductoRespuesta';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly URL_PRODUCTOS = 'https://dummyjson.com/products'
  private saltar = 0;
  private cantidad = 30;
  private total = 0;
  private $productos = new BehaviorSubject<Producto[]>([]);
  public producto = this.$productos.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  public listarProductos(){
    const url_nueva = `${this.URL_PRODUCTOS}?limit=${this.cantidad}&skip=0`;
    this.http.get<ProductoRespuesta>(url_nueva, {
      headers:{
        'Authorization': 'Bearer '+this.auth.accessToken,
        'Content-Type': 'application/json'
      }
    })
    .subscribe( datos => {
      this.$productos.next(datos.products);
      this.total = datos.total;
    })
  }
    public resetPagination() {
      this.saltar = 0; // Reinicia el offset
      this.$productos.next([]); // Limpia la lista de productos
    }
    public siguientesProductos() {
      this.saltar += this.cantidad; // Incrementa el offset
      const url_nueva = `${this.URL_PRODUCTOS}?limit=${this.cantidad}&skip=${this.saltar}`;
      this.http.get<ProductoRespuesta>(url_nueva, {
        headers: {
          'Authorization': 'Bearer ' + this.auth.accessToken,
          'Content-Type': 'application/json'
        }
      })
      .subscribe(
        datos => {
          const productosActuales = this.$productos.value;
          this.$productos.next([...productosActuales, ...datos.products]); // Actualiza el BehaviorSubject
          this.total = datos.total;
        },
        error => {
          console.error('Error al cargar productos:', error);
          // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
        }
      );
  }
}

