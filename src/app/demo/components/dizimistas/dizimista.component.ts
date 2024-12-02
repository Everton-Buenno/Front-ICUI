import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { DizimistaInputModel } from './Models/dizimista.inputModel';
import { DizimistaViewModel } from './Models/dizimista.viewModel';
import { DizimistaService } from './Services/dizimista.service';
import { JwtService } from '../../shared/jwt-service.service';
import { IgrejaService } from '../igreja/Services/igreja.service';
import { IgrejaViewModel } from '../igreja/Models/igreja.viewModel';

@Component({
    templateUrl: './dizimista.component.html',
    providers: [MessageService]
})
export class DizimistaComponent implements OnInit {

    dizimistaDialog: boolean = false;

    deleteDizimistaDialog: boolean = false;
    dizimistaEditDialog:boolean = false;
    dizimistaDetalhesDialog:boolean = false;
    dizimistaInfo!:DizimistaViewModel;
    //deleteDizimistaDialog: boolean = false;
    igrejas:IgrejaViewModel[] = [];
    dizimistas: DizimistaViewModel[] = [];

    dizimista: DizimistaInputModel = { Nome: '', IgrejaId: ''};
    selectedEditDizimista!:DizimistaViewModel;
    igrejaId:string = '';
    selectedDizimistas: DizimistaViewModel[] = [];
    editDizimist:DizimistaInputModel;
    submitted: boolean = false;
    idSelectedDeleteDizimista!:string;
    cols: any[] = [];
    igreja!:IgrejaViewModel;

    userPermissions: string = '';

    rowsPerPageOptions = [5, 10, 20];

    constructor(private dizimistaService: DizimistaService, 
        private messageService: MessageService,
        private cdr: ChangeDetectorRef, 
         private spinner:NgxSpinnerService, 
         private jwtService:JwtService,
         private igrejaService:IgrejaService
        ) { 
            const token = localStorage.getItem('jwt'); 

            if (token) {
                this.igrejaId = this.jwtService.getIgrejaId(token);
                this.userPermissions = this.jwtService.getUserRole(token);
        
            }
    }

    ngOnInit() {
      

        this.cols = [
            { field: 'nome', header: 'Nome' },
            { field: 'Ações', header: 'Ações' },
        ];


  
        this.obterDizimistas();


        if(this.userPermissions === 'Administrador')
            {
              this.igrejaService.getIgrejas().subscribe({
                next:(data)=> {
                  if(data){
                    this.igrejas = data;
                    const igrejaAtual = this.igrejas.find((igr)=> {
                      return igr.id === this.igrejaId
                    })
        
                    if(igrejaAtual.id === this.igrejaId)
                    {
                      this.igreja = igrejaAtual;
                    }
                  }
                }
              });
            }else{
              this.igrejaService.getIgrejaById(this.igrejaId).subscribe({
                next:(data) =>{
                  if(data){
                    this.igreja === data;
                  }
                }
                
              })
            }


    }



    

    openNew() {
        this.dizimista = { Nome: '', IgrejaId: '' };
        this.submitted = false;
        this.dizimistaDialog = true;
    }

    deleteSelectedDizimista() {
        this.deleteDizimistaDialog = true;
    }
obterDizimistas(igrejaId:string = this.igrejaId)
{

    this.spinner.show();
    this.dizimistaService.getDizimistasByIgreja(igrejaId).subscribe({
        next:(data) =>{
            if(data)
            {
                this.dizimistas = data;
                this.cdr.detectChanges(); 
            }
        },complete:()=>{
            this.spinner.hide();
        }
    })
}
    editDizimista(dizimista: DizimistaViewModel) {

       this.dizimistaEditDialog= true;
       this.selectedEditDizimista = dizimista;

    }


    saveEditedDizimista()
    {
        console.log(this.selectedEditDizimista);
        this.spinner.show();
        if (!this.selectedEditDizimista.nome || !this.selectedEditDizimista.igrejaId) {
            this.messageService.add({ severity: 'error', summary: 'Preencha todos os campos', life: 3000 });
            return; 
          }


          this.editDizimist.Nome = this.selectedEditDizimista.nome;
          this.editDizimist.IgrejaId = this.selectedEditDizimista.igrejaId;

        this.dizimistaService.editDizimista(this.selectedEditDizimista.id,this.editDizimist).subscribe({
            next:(data)=>{
                if(data)
                {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dizimista atualizada com sucesso.', life: 3000 });
                    this.dizimistaEditDialog = false;
                    this.obterDizimistas();
                }
            },
            error:(err)=>{
                this.messageService.add({ severity: 'error', summary: 'Erro ao editar dizimista.', life: 3000 });
            },
            complete:()=>{
                this.spinner.hide();
            }
        })
    }


    deleteDizimista(dizimista: DizimistaViewModel) {

        this.idSelectedDeleteDizimista = dizimista.id
      this.deleteDizimistaDialog = true;


    }


    confirmDelete() {

        this.spinner.show();

        this.dizimistaService.deleteDizimista(this.idSelectedDeleteDizimista)
        .subscribe({
            next:(data)=>{

                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dizimista excluído', life: 3000 });
            },
            error:(err)=>{
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar dizimista.', life: 3000 });

            },
            complete:()=>{
                this.spinner.hide();
                this.deleteDizimistaDialog = false;
                this.selectedEditDizimista = { id:'',nome: '', igrejaId:'' };
                this.obterDizimistas();
            }
        })



    }

    hideDialog() {
        this.dizimistaDialog = false;
        this.submitted = false;
        this.dizimistaEditDialog = false;
    }

    saveDizimista() {
        this.submitted = true;

this.spinner.show();

this.dizimista.IgrejaId = this.igrejaId;
    if (!this.dizimista.Nome || !this.dizimista.IgrejaId ) {
        this.messageService.add({ severity: 'error', summary: 'Preencha todos os campos', life: 3000 });
        this.spinner.hide();
        return; 
      }

      
     

      this.dizimistaService.addDizimista(this.dizimista).subscribe({


        next:(data) =>{
            if(data)
            {
        this.messageService.add({ severity: 'success', summary: 'Dizimista cadastrado com sucesso.', life: 3000 });

            }
        },
        error:(err)=> {
            if(err)
            {
                this.messageService.add({ severity: 'error', summary: 'Erro ao cadastrar novo dizimista.', life: 3000 });

            }
        },
        complete:() =>{
            this.dizimistaDialog = false;
        this.obterDizimistas();
        this.spinner.hide();

        }
      })

    }

  
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


    showDizimistaInfo(dizimista:DizimistaViewModel)
    {
        console.log(dizimista);
        this.dizimistaInfo = dizimista;
        setTimeout(() =>{
            this.dizimistaDetalhesDialog = true;
        },200)
    }
}
