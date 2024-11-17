import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LancamentoViewModel } from '../Models/Lancamento.ViewModel';
import { LancamentoInputModel } from '../Models/Lancamento.InputModel';
import { LancamentosResponse } from '../Models/Lancameto.Response';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private _baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getLancamento(igrejaId: string,data:Date, filtro?: string): Observable<LancamentosResponse> {
    const params = new HttpParams()
      .set('igrejaId', igrejaId)
      .set('data',data.toISOString() )
      .set('filtro', filtro || '');

    return this.http.get<LancamentosResponse>(`${this._baseUrl}/Lancamento`, { params });
  }

  newLancamento(data: LancamentoInputModel): Observable<void> {
    return this.http.post<void>(`${this._baseUrl}/Lancamento`, data);
  }

  atualizarLancamento(data: LancamentoInputModel, lancamentoId: string): Observable<LancamentoViewModel> {
    return this.http.put<LancamentoViewModel>(`${this._baseUrl}/Lancamento/${lancamentoId}`, data);
  }

  removerLancamento(lancamentoId: string): Observable<void> {
    return this.http.delete<void>(`${this._baseUrl}/Lancamento/${lancamentoId}`);
  }
}
