import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  // Método para decodificar o token
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);  // Decodificando o token
    } catch (error) {
      return null;
    }
  }

  // Método para obter o UserId do token
  getUserId(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['nameid'] : null;  // Ajustado para 'nameid'
  }

  // Método para obter o nome do usuário
  getUserName(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['unique_name'] : null;  // Ajustado para 'unique_name'
  }

  // Método para obter o papel do usuário
  getUserRole(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['role'] : null;  // Ajustado para 'role'
  }

  // Método para obter as permissões (caso existam no token)
  getUserPermissions(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken && decodedToken['permissions'] ? decodedToken['permissions'] : null;
  }

  // Método para obter o IgrejaId do token
  getIgrejaId(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken['igrejaId'] : null;  // Ajustado para 'igrejaId'
  }
}
