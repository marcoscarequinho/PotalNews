<?php
  $ch = curl_init('http://127.0.0.1:5000' . $_SERVER['REQUEST_URI']);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  echo curl_exec($ch);
  curl_close($ch);
  ?>