import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtendo o token JWT do localStorage
    const token = localStorage.getItem('jwt');
    
    // Definindo os cabeçalhos adicionais
    let headers = req.headers.set('ngrok-skip-browser-warning', '69420');

    // Se houver token JWT, adiciona o cabeçalho de autorização
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Clonando a requisição para adicionar os novos cabeçalhos
    const clonedRequest = req.clone({ headers });

    // Passando a requisição clonada para o próximo handler
    return next.handle(clonedRequest);
  }
}
