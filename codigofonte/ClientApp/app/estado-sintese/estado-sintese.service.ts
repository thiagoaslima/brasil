import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Panorama2Service } from '../panorama2/panorama.service';
import { LocalidadeService2 } from '../shared2/localidade/localidade.service';
import { RouterParamsService } from '../shared/router-params.service';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../shared2/app-state';
import { converterObjArrayEmHash } from '../utils2';
import { PANORAMA, ItemConfiguracao } from '../panorama2/configuration';

@Injectable()
export class EstadoSinteseService {
    
    private _totalMunicipios: number;
    private _totalUfs: number;
    private _localidade$$: Subscription;
    private resumo;
    constructor(
        private _panoramaService: Panorama2Service,
        private _localidadeService: LocalidadeService2,
        private _appState: AppState,
        private _routerParams: RouterParamsService,
    ) {
        
    }
    getResumoMunicipios(estado,indicadores){
             
             let municipios = estado.children;
             const resultObservables = []
             
             for(let municipio of municipios){
                 
                     let configuracao = this.getConfiguracao(municipio.tipo);      
                     let resumoMunicipio = this._panoramaService.getResumo(configuracao,municipio)
                     .map((res)=>{
                         let resumo = <any>{};
                         resumo.municipio =  municipio.nome;
                         res  = res.map(res=>{
                              if(res.titulo=='Gentílico') {
                                  resumo.gentilico = res.valor;
                              }
                              return res;
                         }).filter(res=>res.valor!='-' && res.titulo!='Gentílico' && indicadores.includes(res.id+"") );
                         resumo.indicadores = res;
                         return resumo;
                     });       
                     resultObservables.push(resumoMunicipio);     
             }
             return Observable.forkJoin(resultObservables); 
             
    }
    getResumoEstado(localidade,indicadores){

        let configuracao = this.getConfiguracao(localidade.tipo);      
        return this._panoramaService.getResumo(configuracao,localidade);
        
    }
    getIndicadores(estado){

    }
    getConfiguracao(tipo) {
    
        const { temas, indicadores } = PANORAMA[tipo] || { temas: [], indicadores: [] };
        const hash = converterObjArrayEmHash(indicadores, 'tema', true);
        return temas.reduce((agg, tema) => agg.concat(hash[tema]), [] as ItemConfiguracao[]).filter(Boolean);
    }
    getIndicadoresMunicipioCorrespondentes(indicadoresEstado){
       
        let panoramaEstado      = <any>PANORAMA['uf'];
        let panoramaMunicipios  = PANORAMA['municipio'];
        return panoramaEstado.indicadores.
        map(indicador=> panoramaMunicipios.indicadores.filter(indMun=>indMun.titulo==indicador.titulo))
        .map(ind=>ind[0] && ind[0].indicadorId)
        .filter(ind=>ind!=null)

        
    }
    
}
