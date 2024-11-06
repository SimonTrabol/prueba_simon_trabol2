import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CuerpoLogin } from 'src/app/interfeces/CuerpoLogin';
import { Usuario } from 'src/app/interfeces/Usuario';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL_LOGIN: string = "https://dummyjson.com/auth/login"
  public usuario: Usuario | null = null;
  public accessToken: string | null = null;
  /// este es un observador = cargando
  private $cargando = new BehaviorSubject<boolean>(false);
  public cargando = this.$cargando.asObservable();



  constructor(
    private http:HttpClient,
    private router: Router
  ) { 

  }
  public iniciarSesion(nombre_usuario: string, contrasenia: string){
    const cuerpo: CuerpoLogin ={
      username: nombre_usuario,
      password: contrasenia
    }
    this.http.post<Usuario>(this.URL_LOGIN,JSON.stringify(cuerpo),{
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .subscribe(resultado => {
      this.usuario = resultado;
      this.accessToken = resultado.accessToken;
      this.$cargando.next(false);
      console.log(resultado)
      this.router.navigate(['/','productos']);
    })
  }
  public cerrrarSesion(){
    if (this.usuario){
    this.usuario = null;
    this.accessToken = null;
    }
  }
}
