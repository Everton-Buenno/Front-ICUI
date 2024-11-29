import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { DizimistaInputModel } from './Models/dizimista.inputModel';
import { DizimistaViewModel } from './Models/dizimista.viewModel';
import { DizimistaService } from './Services/dizimista.service';
import { JwtService } from '../../shared/jwt-service.service';

@Component({
    templateUrl: './dizimista.component.html',
    providers: [MessageService]
})
export class DizimistaComponent implements OnInit {

    dizimistaDialog: boolean = false;

    deleteDizimistaDialog: boolean = false;
    dizimistaEditDialog:boolean = false;

    //deleteDizimistaDialog: boolean = false;

    dizimistas: DizimistaViewModel[] = [];

    dizimista: DizimistaInputModel = { Nome: '', IgrejaId: ''};
    selectedEditDizimista!:DizimistaViewModel;
    igrejaId:string = '';
    selectedDizimistas: DizimistaViewModel[] = [];
    editDizimist:DizimistaInputModel;
    submitted: boolean = false;
    idSelectedDeleteDizimista!:string;
    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private dizimistaService: DizimistaService, private messageService: MessageService,private cdr: ChangeDetectorRef,  private spinner:NgxSpinnerService, private jwtService:JwtService) { 
        
       
    }

    ngOnInit() {
      

        this.cols = [
            { field: 'nome', header: 'Nome' },
        ];


        const token = localStorage.getItem('jwt'); 

    if (token) {
        this.igrejaId = this.jwtService.getIgrejaId(token);
    }
        this.obterDizimistas();
    }

    openNew() {
        this.dizimista = { Nome: '', IgrejaId: '' };
        this.submitted = false;
        this.dizimistaDialog = true;
    }

    deleteSelectedDizimista() {
        this.deleteDizimistaDialog = true;
    }
obterDizimistas()
{

    this.spinner.show();
    this.dizimistaService.getDizimistasByIgreja(this.igrejaId).subscribe({
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

    estados = [
        { sigla: 'AC', nome: 'Acre' },
        { sigla: 'AL', nome: 'Alagoas' },
        { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' },
        { sigla: 'BA', nome: 'Bahia' },
        { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'DF', nome: 'Distrito Federal' },
        { sigla: 'ES', nome: 'Espírito Santo' },
        { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' },
        { sigla: 'MT', nome: 'Mato Grosso' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'PA', nome: 'Pará' },
        { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'PE', nome: 'Pernambuco' },
        { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'RN', nome: 'Rio Grande do Norte' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' },
        { sigla: 'RR', nome: 'Roraima' },
        { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'SE', nome: 'Sergipe' },
        { sigla: 'TO', nome: 'Tocantins' }
    ];
    
}
