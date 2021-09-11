'use strict';
import sympleTools from './_sympleTools.js';
sympleTools();
import front from './_front.js';
window.onload=
  ()=>
  {
    let manager = new front('#content','.route');
    manager.render(
      'index',
      'index',
      ()=>//CALLBACK
      {        
        //EXECUTA TODAS AS VEZES QUE UMA TAB É CARREGADA
      }
    );
  };