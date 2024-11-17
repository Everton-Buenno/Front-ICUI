import { IgrejaViewModel } from "../../igreja/Models/igreja.viewModel"

export interface UsuarioViewModel
{
    id:string
    nome:string
    email:string
    senha:string
    tipoUsuario:number
    igreja:IgrejaViewModel
}

