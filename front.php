<?php
  spl_autoload_register(
    function ($name)
    {
      $name=implode('/',array_diff(explode("_",$name)));
      $name="./$name.php";
      if(!file_exists($name))
      {
        echo 'Arquivo não encontrado: '.$name;
        exit;
      }
      require $name;
    }
  );

  class MT_frontController
  {
    public function __construct()
    {
      $controllerView='send'.$_SERVER['REQUEST_METHOD'];
      if(method_exists($this,$controllerView)) $this->{$controllerView}();
    }

    private function send()
    {
      $controller='Controllers_'.$_REQUEST['controller'];
      $controller=new $controller();
      $controller->{$_REQUEST['action']}();
    }
    private function sendGET()
    {
      $this->send();
    }

    private function sendPOST()
    {
      $this->send();
    }

    private function sendPUT()
    {
      $this->send();
    }

    private function sendDELETE()
    {
      $this->send();
    }
  }

  new MT_frontController();