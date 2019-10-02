<?php

session_cache_limiter('nocache');
header('Expires: ' . gmdate('r', 0));

header('Content-type: application/json');
require 'phpmailer/class.phpmailer.php';
require_once('phpmailer/PHPMailerAutoload.php');

// Step 1 - Enter your email address below.
$email   = 'example@example.com';
$debug   = 0;
$subject = 'Contact Form'; // You can change your message Subject Here

$fields = array(
    0 => array(
        'text' => 'Name',
        'val' => $_POST['name']
    ),
    1 => array(
        'text' => 'Email address',
        'val' => $_POST['email']
    ),
    2 => array(
        'text' => 'Message',
        'val' => $_POST['message']
    )
);

$message = '';
foreach ($fields as $field) {
    $message .= $field['text'] . ": " . htmlspecialchars($field['val'], ENT_QUOTES) . "<br>\n";
}

$mail = new PHPMailer(true);
try {
    
    $mail->SMTPDebug = $debug;
    $mail->AddAddress($email);
    //$mail->AddAddress('person2@domain.com', 'Person 2');     // Add a secondary recipient
    //$mail->AddCC('person3@domain.com', 'Person 3');          // Add a "Cc" address. 
    //$mail->AddBCC('person4@domain.com', 'Person 4');         // Add a "Bcc" address. 
    
    $mail->SetFrom($email, $_POST['name']);
    $mail->AddReplyTo($_POST['email'], $_POST['name']);
    
    $mail->IsHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = $subject;
    $mail->Body    = $message;
    
    $mail->Send();
    $arrResult = array(
        'response' => 'success'
    );
    
}
catch (phpmailerException $e) {
    $arrResult = array(
        'response' => 'error',
        'errorMessage' => $e->errorMessage()
    );
}
catch (Exception $e) {
    $arrResult = array(
        'response' => 'error',
        'errorMessage' => $e->getMessage()
    );
}
if ($debug == 0) {
    echo json_encode($arrResult);
}