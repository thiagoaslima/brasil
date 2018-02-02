import { Injectable, Inject } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

/**
 * 
 * 
 * @export
 * @class CommonService
 */
@Injectable()
export class UIState {

  private _notify = new Subject<any>();
  private _uiState = Object;
  private _uiState$ = this._notify.asObservable();

  /**
   * Creates an instance of CommonService.
   * 
   * 
   * @memberOf CommonService
   */
  constructor(){}

  /**
   * 
   * 
   * @param {string} stateName
   * @param {string} stateValue
   * 
   * @memberOf CommonService
   */
  public setState(stateName: string, stateValue: string): void {
      
    if (!!stateName && !!stateValue) {

      this._uiState[stateName] = stateValue;

      this._notify.next({"state": stateName, "value": stateValue});
    }
  }

  /**
   * 
   * 
   * @param {string} stateName
   * @returns {string}
   * 
   * @memberOf CommonService
   */
  public getState(stateName: string): string{

    if(!stateName || !this._uiState[stateName]){

      return null;
    }

    return this._uiState[stateName];
  }

  /**
   * 
   * 
   * @readonly
   * 
   * @memberOf CommonService
   */
  public get observable$(){

    return this._uiState$;
  }

}