import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IgrejaComponent } from './igreja.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: IgrejaComponent }
	])],
	exports: [RouterModule]
})
export class IgrejaRoutingModule { }
