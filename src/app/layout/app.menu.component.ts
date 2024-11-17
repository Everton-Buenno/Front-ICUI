import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../demo/components/auth/services/auth.service';
import { Router } from '@angular/router';
import { JwtService } from '../demo/shared/jwt-service.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    userId: string | null = '';
    userName: string | null = '';
    igrejaId:string = '';
    userPermissions: string = '';
    model: any[] = [];
    constructor(public layoutService: LayoutService, private authService:AuthService, private router:Router, private jwtService:JwtService) { }

    ngOnInit() {


        const token = localStorage.getItem('jwt'); 

        if (token) {
          this.userId = this.jwtService.getUserId(token);
          this.userName = this.jwtService.getUserName(token);
          this.userPermissions = this.jwtService.getUserRole(token);
          this.igrejaId = this.jwtService.getIgrejaId(token);
        }
        console.log(this.userPermissions);

  

setTimeout(() => {
    this.model = [
        {
            label: 'Inicio',
            items: [
                { label: 'Lançamentos', icon: 'pi pi-fw pi-home', routerLink: ['/'], disabled: false },
                { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/usuarios'], disabled: this.userPermissions === 'Membro' },
                { label: 'Igrejas', icon: 'pi pi-fw pi-building', routerLink: ['/igrejas'], disabled: this.userPermissions === 'Membro' },
                { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logout(), disabled: false }, 
            ]
        },
    ];

    this.model.forEach((mdl) => {
        mdl.items = mdl.items.filter((item) => {
            return this.userPermissions === 'Administrador' || !item.disabled;
        });

     
    });
}, 200);
      
    }

    logout()
    {
        this.authService.logout();

        this.router.navigate(['/auth/login'])
    }
}
