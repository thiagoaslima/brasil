import { NgModule } from '@angular/core';

import { ChartsModule } from './ng2-charts.module';
import { SharedModule } from '../shared/shared.module';
import { GraficoComponent } from './grafico-base/grafico.component';

@NgModule({
	imports: [
		ChartsModule,
		SharedModule
	],
	declarations: [ 
		GraficoComponent
	],
	exports: [
		GraficoComponent
	]
})
export class InfografiaModule {

}