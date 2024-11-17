import { LancamentoViewModel } from "./Lancamento.ViewModel";

export interface LancamentosResponse {
    lancamentos: LancamentoViewModel[]; 
    totalRecords: number;      
    saldoTotal:number;
    entrada:number;
    saida:number;
  }
  