<?php

  class MT_modelbase
  {
    private $handler;
    public function __construct()
    {
      require 'sql.php';
      $this->handler = pg_connect($sqlCredentials);
    }

    public function select($params)
    {
      $params=implode(',',$params);
      $query=pg_query($this->handler,"select {$params} from clientes");
      $results=pg_fetch_assoc($query);
      return $results;
    }
  }