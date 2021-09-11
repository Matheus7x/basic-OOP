export default class apiRest
{
  #fetchSend(nameFile,configs)
  {
    let success = configs.success,
        fail    = configs.fail,
        async   = configs.async;
    delete configs.success;
    delete configs.fail;
    delete configs.async;
    let fetchSend=
      ()=>
      {
        //ENVIA REQUISIÇÃO DO HTML
        const promise = fetch(
          nameFile,//PASSA PARAMETROS PARA O CONTROLLER
          configs
        );
        promise.then(
          (response)=>
          {
            if (response.ok && response.status===200) {
              //CONVERTE O RESPONSE EM TEXTO
              return response.text();
            }
            else if(response.status===404)
            {
              return false;
            }
          }
        ).then(success).catch(fail);
      };
    if(!async) return fetchSend();
    return async ()=>{ return await fetchSend();};
  }

  send(nameFile='',configs={configs:'',success:'',fail:'',async:false})
  {
    //SETA O RETORNO COMO HTML
    if(configs.configs.headers)
    {
      var myHeaders = new Headers(configs.configs.headers);
      delete configs.configs.headers;
      configs.configs={...configs.configs, ...{headers:myHeaders}};
    }

    //VALIDA PARAMETROS
    if(typeof nameFile!=='string' && typeof configs.success!=='function' && typeof configs.fail!=='function') return 'Parâmetros inconsistentes ao carregar o html';

    //ENVIA O HTML OU ERROS
    this.#fetchSend(nameFile,configs);
  }
}