import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IgrejaViewModel } from '../Models/igreja.viewModel';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IgrejaInputModel } from '../Models/igreja.inputModel';

@Injectable({
  providedIn: 'root'
})
export class IgrejaService {

private _baseUrl= environment.baseUrl;

  constructor(private http:HttpClient) { }


  getIgrejaById(igrejaId:string):Observable<IgrejaViewModel>
  {
    return this.http.get<IgrejaViewModel>(`${this._baseUrl}/Igreja/${igrejaId}`)
  }


  getIgrejas():Observable<IgrejaViewModel[]>
  {
    return this.http.get<IgrejaViewModel[]>(`${this._baseUrl}/Igreja`)
  }

  addIgreja(data:IgrejaInputModel):Observable<IgrejaViewModel>
  {
    return this.http.post<IgrejaViewModel>(`${this._baseUrl}/Igreja`,data)
  }

  editIgreja(data:IgrejaViewModel):Observable<IgrejaViewModel>
  {
    return this.http.put<IgrejaViewModel>(`${this._baseUrl}/Igreja`,data)
  }

  deleteIgreja(igrejaId:string):Observable<void>
  {
    return this.http.delete<void>(`${this._baseUrl}/Igreja/${igrejaId}`)

  }


}
