import { IgrejaViewModel } from "../../igreja/Models/igreja.viewModel"

export interface UsuarioEditInputModel
{
    nome?:string
    email?:string
    senha?:string
    tipoUsuario?:number
    igrejaId:string

}

