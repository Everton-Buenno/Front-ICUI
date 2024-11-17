import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IgrejaService } from './Services/igreja.service';
import { IgrejaViewModel } from './Models/igreja.viewModel';
import { IgrejaInputModel } from './Models/igreja.inputModel';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
    templateUrl: './igreja.component.html',
    providers: [MessageService]
})
export class IgrejaComponent implements OnInit {

    igrejaDialog: boolean = false;

    deleteIgrejaDialog: boolean = false;
    igrejaEditDialog:boolean = false;

    deleteIgrejasDialog: boolean = false;

    igrejas: IgrejaViewModel[] = [];

    igreja: IgrejaInputModel = { Nome: '', Cidade: '', Estado: '', SaldoInicial: 0 };
    selectedEditIgreja!:IgrejaViewModel;

    selectedIgrejas: IgrejaViewModel[] = [];

    submitted: boolean = false;
    idSelectedDeleteIgreja!:string;
    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private igrejaService: IgrejaService, private messageService: MessageService,private cdr: ChangeDetectorRef,  private spinner:NgxSpinnerService) { 
        
       
    }

    ngOnInit() {
      

        this.cols = [
            { field: 'nome', header: 'Nome' },
            { field: 'cidade', header: 'Cidade' },
            { field: 'estado', header: 'Estado' }, // Se aplicável
            { field: 'saldoFinal', header: 'Saldo Final' },
        ];
        

        this.obterIgrejas();
    }

    openNew() {
        this.igreja = { Nome: '', Cidade: '', Estado: '', SaldoInicial: 0 };
        this.submitted = false;
        this.igrejaDialog = true;
    }

    deleteSelectedIgrejas() {
        this.deleteIgrejasDialog = true;
    }
obterIgrejas()
{
    this.spinner.show();
    this.igrejaService.getIgrejas().subscribe({
        next:(data) =>{
            if(data)
            {
                this.igrejas = data;
                console.log(this.igrejas)
                this.cdr.detectChanges(); 
            }
        },complete:()=>{
            this.spinner.hide();
        }
    })
}
    editIgreja(igreja: IgrejaViewModel) {

       this.igrejaEditDialog= true;
       this.selectedEditIgreja = igreja;

    }


    saveEditedIgreja()
    {
        console.log(this.selectedEditIgreja);
        this.spinner.show();
        if (!this.selectedEditIgreja.nome || !this.selectedEditIgreja.estado || !this.selectedEditIgreja.cidade ) {
            this.messageService.add({ severity: 'error', summary: 'Preencha todos os campos', life: 3000 });
            return; 
          }

        this.igrejaService.editIgreja(this.selectedEditIgreja).subscribe({
            next:(data)=>{
                if(data)
                {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Igrejas atualizada com sucesso.', life: 3000 });
                    this.igrejaEditDialog = false;
                    this.obterIgrejas();
                }
            },
            error:(err)=>{
                this.messageService.add({ severity: 'error', summary: 'Erro ao editar igreja.', life: 3000 });
            },
            complete:()=>{
                this.spinner.hide();
            }
        })
    }


    deleteIgreja(igreja: IgrejaViewModel) {

        this.idSelectedDeleteIgreja = igreja.id
      this.deleteIgrejaDialog = true;


    }


    confirmDelete() {

        this.spinner.show();

        this.igrejaService.deleteIgreja(this.idSelectedDeleteIgreja)
        .subscribe({
            next:(data)=>{

                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Igreja excluída', life: 3000 });
            },
            error:(err)=>{
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar igreja.', life: 3000 });

            },
            complete:()=>{
                this.spinner.hide();
                this.deleteIgrejaDialog = false;
                this.selectedEditIgreja = { id:'',nome: '', cidade: '', estado: '', saldoFinal: 0 };
                this.obterIgrejas();
            }
        })



    }

    hideDialog() {
        this.igrejaDialog = false;
        this.submitted = false;
        this.igrejaEditDialog = false;
    }

    saveIgreja() {
        this.submitted = true;

this.spinner.show();
          
    if (!this.igreja.Nome || !this.igreja.Estado || !this.igreja.Cidade ) {
        this.messageService.add({ severity: 'error', summary: 'Preencha todos os campos', life: 3000 });
        return; 
      }

      if(this.igreja.SaldoInicial <= 0)
        this.igreja.SaldoInicial = 0;

      console.log(this.igreja);

      this.igrejaService.addIgreja(this.igreja).subscribe({
        next:(data) =>{
            if(data)
            {
        this.messageService.add({ severity: 'success', summary: 'Igreja cadastrada com sucesso.', life: 3000 });

            }
        },
        error:(err)=> {
            if(err)
            {
                this.messageService.add({ severity: 'error', summary: 'Erro ao cadastrar nova igreja.', life: 3000 });

            }
        },
        complete:() =>{
            this.igrejaDialog = false;
        this.obterIgrejas();
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
