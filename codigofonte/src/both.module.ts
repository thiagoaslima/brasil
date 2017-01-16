import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { SharedModule } from './app/shared/shared.module';

const MODULES = [
    // include modules to be imported by client and server
    AppModule,
    SharedModule.forRoot()
]

const COMPONENTS = [
    AppComponent
]

const PROVIDERS = [

]

export {
    MODULES,
    COMPONENTS,
    PROVIDERS
}

export { AppComponent }