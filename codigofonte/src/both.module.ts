import { RootModule } from './app/root.module';
import { RootComponent } from './app/root.component';
import { SharedModule } from './app/shared/shared.module';

const MODULES = [
    // include modules to be imported by client and server
    RootModule,
    SharedModule.forRoot()
]

const COMPONENTS = [
    RootModule
]

const PROVIDERS = [

]

export {
    MODULES,
    COMPONENTS,
    PROVIDERS
}

export const BootstrapComponent = RootComponent;