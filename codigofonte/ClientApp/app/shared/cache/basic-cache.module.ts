import { NgModule } from '@angular/core';

import { CacheFactory } from './cacheFactory.service';

@NgModule({
    imports: [
    ],
    declarations: [
        
    ],
    providers: [
        { provide: 'CacheService', useFactory: CacheFactory }
    ],
    exports: [
    ]
})
export class BasicCacheModule {

}