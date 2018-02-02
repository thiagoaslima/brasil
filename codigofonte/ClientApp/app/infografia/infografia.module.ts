import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChartsModule } from './ng2-charts.module';
import { SharedModule } from '../shared/shared.module';
import { IBGECartogramaModule } from './ibge-cartograma';
import { GraficoComponent } from './grafico-base/grafico.component';
import { LinhaTempo } from './linha-tempo/linha-tempo.component';
import { PiramideEtariaComponent } from './piramide-etaria/piramide-etaria.component';
import { PiramideEtariaService } from './piramide-etaria/piramide-etaria.service';

@NgModule({
	imports: [
		CommonModule,
		ChartsModule,
		SharedModule,
		IBGECartogramaModule.forRoot(),
	],
	declarations: [ 
		GraficoComponent,
		LinhaTempo,
		PiramideEtariaComponent
	],
	exports: [
		GraficoComponent,
		LinhaTempo,
		IBGECartogramaModule,
		PiramideEtariaComponent
	],
	providers: [
		PiramideEtariaService
	]
})
export class InfografiaModule {

}