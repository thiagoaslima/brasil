
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isBrowser } from 'angular2-universal';

import { LoginService } from './core/login/login.service';
import { ConfigService } from './config/config.service';


@Injectable()
export class AuthorizationGuard implements CanActivate {

    private isBrowser = isBrowser;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private configService: ConfigService
    ) { }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if(isBrowser && this.configService.isHML()){

            // Verificar se o usuário está autorizado
            if(this.loginService.isLogado()){

                // Caso esteja, permite a continuar na rota
                return true;

            } else {

                // Caso não esteja, direcionar para tela de login
                this.router.navigateByUrl(`/login`);

                return false;
            }


        } else {

            return true;
        }

    }
}
