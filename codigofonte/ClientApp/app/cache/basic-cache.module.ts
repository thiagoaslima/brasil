import { NgModule } from '@angular/core';

import { CacheFactory } from './cacheFactory.service';
import { IndicadorCacheComponent, PesquisaCacheComponent } from './components';

import { SharedModule3 } from '../shared3/shared3.module';

@NgModule({
    imports: [
        SharedModule3.forRoot()
    ],
    declarations: [
        IndicadorCacheComponent,
        PesquisaCacheComponent
    ],
    providers: [
        { provide: 'CacheService', useFactory: CacheFactory }
    ],
    exports: [
        IndicadorCacheComponent,
        PesquisaCacheComponent
    ]
})
export class BasicCacheModule {

}