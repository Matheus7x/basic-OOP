import apiRest from "./_apiRest.js";

export default class front
{
  #controller;
  #action;
  contentPage;
  #contentLink;
  #functionWhileRender;
  #route;
  #rendered=false;
  #tipo=false;
  #params='';
  apiRest='';

  constructor(contentPage=false,contentLink=false)
  {
    this.apiRest= new apiRest();
    //VERIFICA INICIALIZACAO CORRETA
    if(contentPage===false || contentLink===false)//EXPLICACAO DE USO
    {
      console.error('Você precisa setar uma id da main e a classe dos links, caso contrário retire todos os parâmetros.');
    }

    //CRIA FUNCAO DE EVENTO DOS LINKS
    this.#route=
      event=>
      {
        if(event.target.attributes['data-controller'] && event.target.attributes['data-action'])
        {
          let controller=event.target.attributes['data-controller'].nodeValue,
              action=event.target.attributes['data-action'].nodeValue
          this.setPage(controller,action);
        }
      };

    //SETA ATRIBUTOS
    this.contentPage=contentPage;
    this.#contentLink=contentLink;
  }

  #getPagesLinks()
  {
    //DISTRIBUI ROTAS DOS LINKS
    document.querySelectorAll(this.#contentLink).forEach(
      element=>
      {
        //RETIRA EVENTOS ANTERIORES SE HOUVER
        element.removeEventListener(
          "click",
          this.#route
        );
        //SETA NOVOS EVENTOS
        element.addEventListener(
          "click",
          this.#route
        );
      }
    );
  }

  #controlsReturnPage()
  {
    //CONTROLE HISTÓRICO
    window.addEventListener(
      "popstate",
      event =>
      {
        this.loadModule();
      }
    );
  }

  render(controllerInit,actionInit,newFunction)
  {
    //INTERROMPE LOOPS
    if(this.#rendered)
    {
      console.error('A função render foi bloqueada, pois foi executada duas vezes, ocasionando um loop infinito.');
      return;
    }

    //SETA CALLBACK   
    if(typeof newFunction==='function') this.#functionWhileRender=newFunction;

    //CONTROLES DE HISTÓRICO, CARREGAMENTOS E LINKS
    if(!this.getController() && !this.getAction()) this.setPage(controllerInit,actionInit);
    else this.loadModule();
    this.#controlsReturnPage();
    this.#rendered=true;
  }

  getURL()
  {
    this.#params=new URLSearchParams(window.location.search);
  }

  getController()
  {
    this.getURL();
    return this.#controller=this.#params.get('controller');
  }

  getAction()
  {
    this.getURL();
    return this.#action=this.#params.get('action');
  }

  rendersJS(nameJS=false)
  {
    //IMPORTA JS
    this.apiRest.send(
      nameJS?`./js/${nameJS}.js`:`./js/${this.#controller}.js`,
      {
        configs:{
          mode: 'no-cors',//SERVE PARA REQUISITAR LOCALMENTE
          method: 'HEAD',
          headers: {
            "Content-Type":"text/js"
          }
        },
        success:
          js=>
          {
            console.log(js);//Corrigir pasta para jsControllers
            let fileJS = import(nameJS?`./${nameJS}.js`:`./${this.#controller}.js`);
            fileJS.then(
              (classJS)=>
              {
                if(classJS.default) var classInstance = new classJS.default();
                if(classInstance && classInstance[this.#action]) classInstance[this.#action]();
              }
            );
          },
        fail:
          err=>
          {
            console.error(err);
          }
      }
    );
  }

  rendersCSS()
  {
    if(document.getElementsByClassName('action-style').length!==0 && this.#tipo)
    {
      Array.from(document.getElementsByClassName('action-style')).forEach(
        linkCss=>
        {
          linkCss.setAttribute('disabled','disabled');
        }
      );
      this.#tipo=true;
    }
    var nameCSS=this.#controller+'_'+this.#action;
    this.apiRest.send(
      `./css/${nameCSS}.css`,
      {
        configs:{
          mode: 'no-cors',//SERVE PARA REQUISITAR LOCALMENTE
          method: 'HEAD',
          headers: {
            "Content-Type":"text/css"
          }
        },
        success:
          css=>
          {
            if(document.getElementById(`${nameCSS}Style`) === null)
            {
              document.getElementsByTagName('head')[0].insertAdjacentHTML(
                'beforeend',
                `<link rel="stylesheet" id="${nameCSS}Style" href="./css/${nameCSS}.css">`
              );
            }
            else
            {
              document.getElementById(`${nameCSS}Style`).removeAttribute('disabled');
            }
          },
        fail:
          err=>
          {
            console.error(err);
          }
      }
    );
  }

  #loadContent()
  {
    var contentPage=document.querySelector(this.contentPage);
    this.getController();
    this.getAction();
    this.apiRest.send(
      `./front.php?controller=${this.#controller}&action=${this.#action}`,
      {
        configs:{
          mode: 'no-cors',//SERVE PARA REQUISITAR LOCALMENTE
          method: 'GET',
          headers: {
            "Content-Type":"text/html"
          }
        },
        success:
          html=>
          {
            //this.rendersCSS();
            //SETA CONTEUDO
            contentPage.innerHTML=html;
            //localStorage.setItem(this.#controller+this.#action,contentPage.innerHTML);
            //DISTRIBUI ROTAS DOS LINKS
            this.#getPagesLinks();
          },
        fail:
          text=>
          {
            console.error(text.status);
            return;
          }
      }
    );

    //RENDERIZA HTML NO ELEMENTO DE CONTEUDO
    /*if(localStorage.getItem(this.#controller+this.#action)!==null)
    {
      this.rendersCSS();
      contentPage.innerHTML=localStorage.getItem(this.#controller+this.#action);
      this.#getPagesLinks();
    }
    else
    {*/

    //}
    //RENDERIZA FUNÇÃO JS PELO CONTROLLER
    this.rendersJS();
    /*setTimeout(
      ()=>
      {
        document.getElementsByClassName('container-loader')[0].classList.toggle('opacity-loader');
        setTimeout(
          ()=>
          {
            document.querySelector(this.contentPage).classList.toggle('d-none');
            document.querySelectorAll(this.#contentLink).forEach(
              link=>
              {
                link.removeAttribute('disabled');
              }
            );
          },500
        );
      },500
    );*/


  }

  #executeRenderFunction()
  {
    //EXECULTA CALLBACK
    if(typeof this.#functionWhileRender==='function') this.#functionWhileRender();
  }

  loadModule(title='')
  {
    //document.querySelector(this.contentPage).classList.toggle('d-none');
    //document.querySelector('.container-loader').classList.toggle('opacity-loader');
    document.querySelectorAll(this.#contentLink).forEach(
      link=>
      {
        link.setAttribute('disabled','disabled');
      }
    );
    let contentPage=document.querySelector(this.contentPage);
    //CALLBACK
    this.#executeRenderFunction();

    //CARREGA A ACTION
    this.getController();
    this.getAction();
    
    //VERIFICA SE FOI SETADO OU SE HÁ LINK DA PÁGINA
    if(
      this.#getElementLink()!==null
      ||
      (typeof title==='string' && title!=='')
    )
    {
      //COLOCA TÍTULO MANUALMENTE OU POR LINK NO HTML
      console.log(this.#getElementLink());
      document.title = title===''?this.#getElementLink().innerText:title;
    }
    this.#loadContent();
    
    this.#selectControler();
  }

  setPage(controller,action)
  {
    //INTERROMPE LOOPS
    if(this.getController()===controller && this.getAction()===action)
    {
      console.error('O setPage foi interrompido, pois pode causar um loop infinito ao redirecionar para si mesmo.');
      return;
    }
    //ADICIONA HISTÓRICO ANTES DE CARREGAR ACTION
    window.history.pushState({controller},`${controller}/${action}`,`?controller=${controller}&action=${action}`);
    
    this.loadModule();
  }

  #selectControler()
  {
    //SELECIONA LINK E DISABILITA O ANTERIOR
    let
      routeSelected=document.querySelector(`${this.#contentLink}.selected`);
    if(routeSelected!==null) routeSelected.classList.remove('selected');

    if(this.#getElementLink()!==null) this.#getElementLink().classList.add('selected');
  }

  #getElementLink()
  {
    //PEGA O LINK DA PÁGINA
    return document.querySelector(`${this.#contentLink}[data-controller="${this.#controller}"][data-action="${this.#action}"]`);
  }
}
    