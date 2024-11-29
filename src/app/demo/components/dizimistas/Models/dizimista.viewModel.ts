import { LancamentoViewModel } from "../../dashboard/Models/Lancamento.ViewModel"

export interface DizimistaViewModel{
    id:string
    nome:string
    lancamentos?:LancamentoViewModel[]
    igrejaId:string
}
