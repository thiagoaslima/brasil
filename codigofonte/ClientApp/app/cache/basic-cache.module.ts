import { NgModule } from '@angular/core';

import { CacheFactory } from './cacheFactory.service';
import { PesquisaCacheComponent } from './components';

import { SharedModule3 } from '../shared3/shared3.module';

@NgModule({
    imports: [
        SharedModule3.forRoot()
    ],
    declarations: [
        PesquisaCacheComponent
    ],
    providers: [
        { provide: 'CacheService', useFactory: CacheFactory }
    ]
})
export class BasicCacheModule {

}