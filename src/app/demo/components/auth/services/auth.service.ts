import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }



  login(email:string, senha:string):Observable<any>
  {
    return this.http.post<any>(`${this.baseUrl}/Usuario/login`,{email,senha})
    .pipe(
      tap(response => {
        console.log(response)
        if(response && response.token)
        {
          localStorage.setItem('jwt',response.token)
        }
      })
    );
  }


  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    
    if (token) {
      const decodedToken: any =jwtDecode(token);  
      
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        return false;
      }
      
      return true;
    }
  
    return false;
  }

logout():void{
  localStorage.removeItem('jwt');
}


}
