import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'; // Importa o FormGroup
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    loginForm: FormGroup; 
    email!: string;
    password!: string;
    loading = false;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private router:Router
    ) { 
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]], 
            password: ['', [Validators.required, Validators.minLength(6)]] 
        });
    }

    login() {

        console.log(this.loginForm.value);
        if (this.loginForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Por favor, preencha todos os campos corretamente.',
                detail: 'Email e Senha são obrigatórios e o email deve ser válido.'
            });
            return; 
        }

        this.loading = true;

        const { email, password } = this.loginForm.value;

        this.authService.login(email, password).subscribe({
            next: (data) => {
                this.loading = false;
                if (data && data.token) {
                    localStorage.setItem('jwt', data.token);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Autenticado com sucesso!'
                    });

                    this.router.navigate(['/lancamentos']);
                }
            },
            error: (err) => {
                console.log(err);
                console.log(err.error)
                this.loading = false;
                const errorMessage = err?.error?.mensagem || 'Erro desconhecido ao autenticar';
                this.messageService.add({
                    severity: 'error',
                    summary: `Erro ao autenticar: ${errorMessage}`
                });
            }
        });
    }
}
