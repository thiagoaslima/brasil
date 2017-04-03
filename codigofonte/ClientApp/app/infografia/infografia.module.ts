import { NgModule } from '@angular/core';

import { ChartsModule } from './ng2-charts.module';
import { SharedModule } from '../shared/shared.module';
import { GraficoComponent } from './grafico-base/grafico.component';
import { CartogramaComponent, LocalCartogramaComponent } from './cartograma/cartograma.component';
import { MapaService } from './cartograma/mapa.service';

@NgModule({
	imports: [
		ChartsModule,
		SharedModule
	],
	declarations: [ 
		GraficoComponent,
		CartogramaComponent,
		LocalCartogramaComponent
	],
	exports: [
		GraficoComponent,
		CartogramaComponent,
		LocalCartogramaComponent
	],
	providers: [
		MapaService
	]
})
export class InfografiaModule {

}