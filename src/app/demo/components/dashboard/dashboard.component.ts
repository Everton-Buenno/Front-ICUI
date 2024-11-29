import { Component, OnInit, OnDestroy } from '@angular/core';
import { LancamentoViewModel } from './Models/Lancamento.ViewModel';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LancamentoInputModel } from './Models/Lancamento.InputModel';
import { LancamentoService } from './services/lancamento.service';
import { JwtService } from '../../shared/jwt-service.service';
import {  NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { IgrejaService } from '../igreja/Services/igreja.service';
import { IgrejaViewModel } from '../igreja/Models/igreja.viewModel';
import { DizimistaViewModel } from '../dizimistas/Models/dizimista.viewModel';
import { DizimistaService } from '../dizimistas/Services/dizimista.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  lancamentos!: LancamentoViewModel[];
  entradaTotal: number = 0;
  saidaTotal: number = 0;
  saldoTotal: number = 0;
  dialogNovoLancamento:boolean = false;
  dialogExcluirLancamento:boolean = false;
  subscription!: Subscription;
  userId: string | null = '';
  userName: string | null = '';
  igrejaId:string = '';
  userPermissions: string = '';
  currentPage: number = 1; 
  detalheLancamentoDialog:boolean = false;
  dtLancamento:Date = new Date;
  totalRecords:number = 0;
  igrejas:IgrejaViewModel[] = [];
  igreja!:IgrejaViewModel;
pageSize: number = 10;
seriaDizimista:boolean = false;
dizimistas:DizimistaViewModel[] = [];
detalheDizimista!:DizimistaViewModel;
selectedDeleteLancamento!:string;
selectedDetalheLancamento!:LancamentoViewModel;
  novoLancamento: LancamentoInputModel = {
    Descricao: '',
    Valor: 0,
    IgrejaId: '',
    DataLancamento: new Date(),
    TipoOperacao: 1,
    UsuarioId:''
  };

  tipoOperacoes = [
    { label: 'Receita', value: 1 },
    { label: 'Despesa', value: 2 }
  ];

  constructor(
    public layoutService: LayoutService,
    private lancamentoService: LancamentoService,
    private jwtService:JwtService,
    private spinner:NgxSpinnerService,
    private messageService:MessageService,
    private igrejaService:IgrejaService,
    private dizimistaService:DizimistaService
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe((config) => {});

      const token = localStorage.getItem('jwt'); 

    if (token) {
      this.userId = this.jwtService.getUserId(token);
      this.userName = this.jwtService.getUserName(token);
      this.userPermissions = this.jwtService.getUserRole(token);
      this.igrejaId = this.jwtService.getIgrejaId(token);
    }

  }

  ngOnInit() {
    this.carregarLancamentos(); 
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

  carregarLancamentos(igrejaId = this.igrejaId) {
    this.spinner.show();
 
    this.lancamentoService.getLancamento(igrejaId, this.dtLancamento).subscribe({
      next:(response) => {
        console.log(response);
        this.lancamentos = response.lancamentos; 
        this.totalRecords = response.totalRecords;
        this.saldoTotal = response.saldoTotal;
        this.entradaTotal = response.entrada;
        this.saidaTotal = response.saida;
    this.carregarDizimistas(igrejaId)

      },error:(err)=>{
      }
      ,complete:() => {
        this.spinner.hide();
      }
    });
  }

  onPage(event: any) {
    const page = event.page;
    this.carregarLancamentos(page);
  }
  
  carregarDizimistas(igrejaId:string)
  {
    this.dizimistaService.getDizimistasByIgreja(igrejaId).subscribe({
      next:(data)=>{
        if(data)
        {
          this.dizimistas = data;
        }
      }
    })
  }

  excluirLancamento() {
    this.spinner.show();
    this.lancamentoService.removerLancamento(this.selectedDeleteLancamento).subscribe( {
      next:()=>{
        this.carregarLancamentos();
        this.dialogExcluirLancamento = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Lançamento excluído com sucesso.',
        
      });
      },
      error:()=> {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao excluir lançamento!'})
      },
      complete:()=>{
    this.spinner.hide();

      }
    
    });
  }

  verificarDizimista(seriaDizimista:boolean)
  {
 this.seriaDizimista = seriaDizimista;
   console.log(this.seriaDizimista);
  }

  salvarLancamento(form: any) {

    if (form.valid) {
      this.novoLancamento.IgrejaId = this.igrejaId;
      this.novoLancamento.UsuarioId = this.userId;
  
      this.lancamentoService.newLancamento(this.novoLancamento).subscribe(() => {
        this.dtLancamento = new Date();
        this.carregarLancamentos();
        this.dialogNovoLancamento = false;
        this.messageService.add({ severity: 'success', summary: 'Lançamento salvo com sucesso!' });
        form.resetForm();
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Por favor, preencha todos os campos obrigatórios.' });
    }
  }
  

  showDialogNovoLancamento() {
    this.novoLancamento.Descricao ='';
    this.novoLancamento.Valor = 0;
    this.dialogNovoLancamento = true;
  }

  showDialogDeleteLancamento(id:string)
  {
    this.dialogExcluirLancamento = true;
    this.selectedDeleteLancamento = id;
  }

  showDetalhesDialog( lancamento:LancamentoViewModel)
  {
    this.spinner.show();
    if(lancamento.isDizimo && lancamento.dizimistaId)
      {
        this.dizimistaService.getDizimistaById(lancamento.dizimistaId).subscribe({
          next:(data)=> {
            this.detalheDizimista = data;
          this.selectedDetalheLancamento = lancamento;
          
          console.log(this.detalheDizimista);
          console.log(this.selectedDetalheLancamento);
    this.detalheLancamentoDialog = true;


          },
          error:() =>{
            this.messageService.add({ severity: 'error', summary: 'Erro ao buscar dizimista.' });
          }, 
          complete:()=>{
            this.spinner.hide();
          }
        })
        
      }else{
          this.selectedDetalheLancamento = lancamento;
    this.detalheLancamentoDialog = true;
    this.spinner.hide();
        }
  }
}
