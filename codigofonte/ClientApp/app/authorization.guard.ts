
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { LoginService } from './core/login/login.service';
import { ConfigService } from './shared/config/config.service';
import { CanActivateChild } from '@angular/router/src/interfaces';


@Injectable()
export class AuthorizationGuard implements CanActivate, CanActivateChild {
    
    private isBrowser;
    
    constructor(
        private router: Router,
        private loginService: LoginService,
        private configService: ConfigService,
        @Inject(PLATFORM_ID) platformId
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }
    
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        
        if(this.isBrowser && this.configService.isHML()){
            
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

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(childRoute, state);
    }
}