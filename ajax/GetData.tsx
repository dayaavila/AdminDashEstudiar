import * as $ from "jquery";
import {Globals} from '../Globals';

export namespace Datos {
  export function JSONPost(url:string, method: string,
                           params:any, callback:any, callbackerr:any, submodule?:string) {
    let parametros = {
      MODULE: Globals.Module,
      SUBMODULE : submodule? submodule: Globals.Submodule,
      APPCODE: Globals.AppCode,
      METHOD: method,
      METHODPARAMS: Object.assign({},params, {APPCODE: Globals.AppCode})
    };
    console.log("CALLING METHOD: " + parametros.MODULE + ":->" + parametros.SUBMODULE + ":->" + parametros.METHOD + ":->" + parametros.METHODPARAMS.OPERATION);
    let httpRequest: XMLHttpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    httpRequest.withCredentials = true;

    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState == XMLHttpRequest.DONE) {
        if (httpRequest.readyState == 4) {
          if (httpRequest.status == 200) {
            try {
              let strresponse: string = httpRequest.response.trim();
              let response: any = JSON.parse(strresponse);
              //if (response['SQL']) console.log(response['SQL']);
              if (callback != null) callback(response);
            } catch (err) {
              console.log(err);
              console.log(httpRequest.response);
              alert(err+"\r\n\r\n\r\n"+httpRequest.response);
            }
          }
        } else {
          console.log("Error de servicio. ¿tiene conexión?");
        }
      }
    };

    httpRequest.send(JSON.stringify(parametros));
  }
}
