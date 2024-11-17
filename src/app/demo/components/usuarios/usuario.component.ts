import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UsuarioViewModel } from './models/usuario.viewModel';
import { UsuarioInputModel } from './models/usuario.inputModel';
import { UsuarioService } from './services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IgrejaViewModel } from '../igreja/Models/igreja.viewModel';
import { IgrejaService } from '../igreja/Services/igreja.service';
import { JwtService } from '../../shared/jwt-service.service';
import { UsuarioEditInputModel } from './models/usuario.editInputModel';

@Component({
    templateUrl: './usuario.component.html',
    providers: [MessageService]
})
export class UsuarioComponent implements OnInit {
    userDialog: boolean = false;
    deleteUserDialog: boolean = false;
    igrejas:IgrejaViewModel[] = [];
    igreja!:IgrejaViewModel;
    userEditDialog:boolean = false;
    selectedEditUserId:string;
    usuarios: UsuarioViewModel[] = [];
    selectedDeleteEditUserId:string;
    usuario: UsuarioInputModel = this.resetUsuario();
    selectedUsuarios: UsuarioViewModel[] = [];
    userId: string | null = '';
  userName: string | null = '';
  igrejaId:string = '';
  userPermissions: string = '';
    selectedEditUser:UsuarioEditInputModel = {
        nome:'',
        email:'',
        tipoUsuario:2,
        igrejaId:'',
        senha:''
    };
    submitted: boolean = false;
    tipoUsuario:any[] = [
        {nome:'Administrador', value:1},
        {nome:'Membro', value:2},
    ]
    cols: any[] = [];

    constructor(private messageService: MessageService,private usuarioService:UsuarioService,private spinner:NgxSpinnerService, private igrejaService:IgrejaService, private jwtService:JwtService ) {

        const token = localStorage.getItem('jwt'); 

        if (token) {
          this.userId = this.jwtService.getUserId(token);
          this.userName = this.jwtService.getUserName(token);
          this.userPermissions = this.jwtService.getUserRole(token);
          this.igrejaId = this.jwtService.getIgrejaId(token);
        }


    }

    ngOnInit() {
    this.obterUsuarios()
        this.cols = [
            { field: 'Nome', header: 'Nome' },
            { field: 'Email', header: 'E-mail' },
            { field: 'Igreja', header: 'Igreja' },
            { field: 'Tipo', header: 'Tipo' },
        ];


    }


    obterUsuarios()
    {
        this.usuarioService.getusuarios().subscribe({
            next:(data)=>{
                this.usuarios = data
            },
        })
    }

    openNew() {
        this.usuario = this.resetUsuario();
        this.submitted = false;
        this.userDialog = true;
        this.obterIgrejas();
    }

    deleteSelectedUsuarios(usuario:UsuarioViewModel) {
        if (usuario.id === this.userId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não é permitido deletar o seu próprio usuário.',
                life: 3000
            });
            return;
        }

        this.selectedDeleteEditUserId = usuario.id;
        this.deleteUserDialog = true;
    }
    editUsuario(usuario: UsuarioViewModel) {
        this.obterIgrejas();
        this.userEditDialog = true;
        this.selectedEditUserId = usuario.id;
        this.selectedEditUser = {
            ...(usuario.nome && { nome: usuario.nome }),
            ...(usuario.email && { email: usuario.email }),
            ...(usuario.tipoUsuario !== undefined && { tipoUsuario: usuario.tipoUsuario }), 
            igrejaId: usuario.igreja.id
        } as UsuarioEditInputModel;
    
    }

    confirmEditUsuario(){
        if(!this.selectedEditUser.nome || !this.selectedEditUser.email || !this.selectedEditUser.tipoUsuario || !this.selectedEditUser.igrejaId)
        {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Campos nome, email, tipo, e igreja são obrigatórios', life: 3000 });
            return;
        }


        this.spinner.show();
        this.usuarioService.editUsuario(this.selectedEditUser, this.selectedEditUserId).subscribe({
            next:(data)=>{
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado com sucesso.', life: 3000 });

            },
            error:(err) =>{
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar usuário.', life: 3000 });
            },
            complete:() => {
                this.spinner.hide();
                this.obterUsuarios();
                this.resetUsuario();
                this.userEditDialog = false;
                this.resetEditUsuario();
                this.selectedEditUserId = '';
            }
        })
    }
    



    confirmDelete() {


        this.spinner.show();

        this.usuarioService.deleteUsuario(this.selectedDeleteEditUserId).subscribe({
            next:(data)=>{
                
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído', life: 3000 });
                this.obterUsuarios();
            },
            error:(err)=>{
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir usuário.', life: 3000 });
            },
            complete:()=>{
        this.spinner.hide();
            this.resetEditUsuario();
            this.resetUsuario();
            this.selectedDeleteEditUserId = '';
            this.deleteUserDialog = false;
            }
        })

    }

    obterIgrejas()
            {
                this.spinner.show();
                this.igrejaService.getIgrejas().subscribe({
                    next:(data) =>{
                        if(data)
                        {
                            this.igrejas = data;
                        }
                    },complete:()=>{
                        this.spinner.hide();
                    }
                })
            }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUsuario() {
        this.submitted = true;
        this.spinner.show();
        if(!this.usuario.Nome || !this.usuario.Email || !this.usuario.Senha || !this.usuario.IgrejaId || !this.usuario.TipoUsuario)
        {
            this.messageService.add({
                severity:'error',summary:'Todos os campos são obrigatórios!'
            })
            return;
        }

        this.usuarioService.addUsuario(this.usuario).subscribe({
            next:(data)=>{
                this.messageService.add({
                    severity:'success',summary:'Usuário criado com sucesso.'
                })
                this.obterUsuarios();
            },
            error:() =>{
                this.messageService.add({
                    severity:'error',summary:'Erro ao criar novo usuário.'
                })
            },
            complete:()=>{
                this.spinner.hide();
                this.usuario = this.resetUsuario();
                this.userDialog = false;
            }
        })


        
    }


    private resetUsuario(): UsuarioInputModel {
        return {
            Nome: '',
            Email: '',
            Senha: '',
            IgrejaId: '',
            TipoUsuario: 0
        };
    }

    private resetEditUsuario(): UsuarioEditInputModel {
        return {
            nome: '',
            email: '',
            senha: '',
            igrejaId: '',
            tipoUsuario: 0
        };
    }



    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
