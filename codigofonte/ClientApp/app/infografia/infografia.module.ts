import { NgModule } from '@angular/core';

import { ChartsModule } from './ng2-charts.module';
import { SharedModule } from '../shared/shared.module';
import { GraficoComponent } from './grafico-base/grafico.component';
import { Grafico2Component } from './grafico-base/grafico2.component';
// import { CartogramaComponent, LocalCartogramaComponent } from './cartograma/cartograma.component';
// import { MapaService } from './cartograma/mapa.service';
import { LinhaTempo } from './linha-tempo/linha-tempo.component';

@NgModule({
	imports: [
		ChartsModule,
		SharedModule
	],
	declarations: [ 
		GraficoComponent,
		Grafico2Component,
		// CartogramaComponent,
		// LocalCartogramaComponent,
		LinhaTempo
	],
	exports: [
		GraficoComponent,
		Grafico2Component,
		// CartogramaComponent,
		// LocalCartogramaComponent,
		LinhaTempo
	],
	providers: [
		// MapaService
	]
})
export class InfografiaModule {

}