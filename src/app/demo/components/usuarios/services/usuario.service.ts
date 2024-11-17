import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsuarioViewModel } from '../models/usuario.viewModel';
import { UsuarioInputModel } from '../models/usuario.inputModel';
import { UsuarioEditInputModel } from '../models/usuario.editInputModel';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

private _baseUrl= environment.baseUrl;

  constructor(private http:HttpClient) { }


  getusuarioById(usuarioId:string):Observable<UsuarioViewModel>
  {
    return this.http.get<UsuarioViewModel>(`${this._baseUrl}/Usuario/${usuarioId}`)
  }


  getusuarios():Observable<UsuarioViewModel[]>
  {
    return this.http.get<UsuarioViewModel[]>(`${this._baseUrl}/Usuario`)
  }

  addUsuario(data:UsuarioInputModel):Observable<UsuarioViewModel>
  {
    return this.http.post<UsuarioViewModel>(`${this._baseUrl}/Usuario`,data)
  }

  editUsuario(data:UsuarioEditInputModel,id:string):Observable<UsuarioViewModel>
  {
    return this.http.put<UsuarioViewModel>(`${this._baseUrl}/Usuario/${id}`,data)
  }

  deleteUsuario(usuarioId:string):Observable<void>
  {
    return this.http.delete<void>(`${this._baseUrl}/Usuario/${usuarioId}`)

  }


}
