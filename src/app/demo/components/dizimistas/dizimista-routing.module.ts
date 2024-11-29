import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DizimistaComponent } from './dizimista.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DizimistaComponent }
	])],
	exports: [RouterModule]
})
export class DizimistaRoutingModule { }
