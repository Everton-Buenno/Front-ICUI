import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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



isAuthenticated():boolean{
  const token = localStorage.getItem('jwt');
  return token != null;
}

logout():void{
  localStorage.removeItem('jwt');
}


}
