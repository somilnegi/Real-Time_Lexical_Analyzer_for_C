<!DOCTYPE html>
<html>
<head>
  <title>jQuery Mouse Events</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script>
    $(document).ready(function(){
      $("p").mouseenter(function(){
        $(this).hide();
      }).mouseleave(function(){
        $(this).show();
      });
    });
  </script>
</head>
<body>

<p>Hover over this paragraph. It will disappear when the mouse enters and reappear when the mouse leaves.</p>

</body>
</html>
