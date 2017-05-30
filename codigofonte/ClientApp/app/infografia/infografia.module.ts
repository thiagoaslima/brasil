import { NgModule } from '@angular/core';

import { ChartsModule } from './ng2-charts.module';
import { SharedModule } from '../shared/shared.module';
import { IBGECartogramaModule } from './ibge-cartograma';
import { GraficoComponent } from './grafico-base/grafico.component';
// import { CartogramaComponent, LocalCartogramaComponent } from './cartograma/cartograma.component';
// import { MapaService } from './cartograma/mapa.service';
import { LinhaTempo } from './linha-tempo/linha-tempo.component';

@NgModule({
	imports: [
		ChartsModule,
		SharedModule,
		IBGECartogramaModule
	],
	declarations: [ 
		GraficoComponent,
		LinhaTempo
	],
	exports: [
		GraficoComponent,
		LinhaTempo,
		IBGECartogramaModule
	],
	providers: [
		// MapaService
	]
})
export class InfografiaModule {

}