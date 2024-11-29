import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DizimistaViewModel } from '../Models/dizimista.viewModel';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DizimistaInputModel } from '../Models/dizimista.inputModel';

@Injectable({
  providedIn: 'root',
})
export class DizimistaService {
  private _baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getDizimistaById(dizimistaId: string): Observable<DizimistaViewModel> {
    return this.http.get<DizimistaViewModel>(`${this._baseUrl}/Dizimista/${dizimistaId}`);
  }

  getDizimistasByIgreja(igrejaId: string): Observable<DizimistaViewModel[]> {
    return this.http.get<DizimistaViewModel[]>(`${this._baseUrl}/Dizimista/igreja/${igrejaId}`);
  }

  addDizimista(data: DizimistaInputModel): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this._baseUrl}/Dizimista`, data);
  }

  editDizimista(id: string, data: DizimistaInputModel): Observable<DizimistaViewModel> {
    return this.http.put<DizimistaViewModel>(`${this._baseUrl}/Dizimista/${id}`, data);
  }

  deleteDizimista(dizimistaId: string): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Dizimista/${dizimistaId}`);
  }
}
