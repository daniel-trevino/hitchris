<?php 
$name = $_POST['name'];
$work = $_POST['work'];
$message = $_POST['message'];
$subject = $_POST['subject'];
$formcontent = "Hi, my name is " . $name . " and I work at " . $work . ". I would very much like to get in touch with you about " . $subject;
$recipient = "danielivert@gmail.com";
$mailheader = "From hitChris Website \r\n";
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
echo "Sent";
?>