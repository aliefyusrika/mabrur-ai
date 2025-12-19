<?php
// Jamaah Token Verification API
// File: api-php/jamaah/verify.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

$input = getJSONInput();
$token = $input['token'] ?? '';

if (empty($token)) {
    sendResponse(['success' => false, 'error' => 'Token required'], 400);
}

try {
    $db = getDBConnection();
    
    // Find user by token
    $stmt = $db->prepare("
        SELECT u.*, j.*, js.*
        FROM User u
        LEFT JOIN Jamaah j ON u.id = j.userId
        LEFT JOIN JamaahStatus js ON j.id = js.jamaahId
        WHERE u.token = ? AND u.role = 'JAMAAH'
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(['success' => false, 'error' => 'Invalid token'], 401);
    }
    
    sendResponse([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'token' => $user['token'],
            'phone' => $user['phone'],
            'passportNo' => $user['passportNo'],
            'packageType' => $user['packageType'],
            'departureDate' => $user['departureDate']
        ],
        'status' => [
            'payment' => $user['payment'],
            'visa' => $user['visa'],
            'ticket' => $user['ticket'],
            'hotel' => $user['hotel'],
            'transport' => $user['transport'],
            'equipment' => $user['equipment'],
            'manasik' => $user['manasik']
        ]
    ]);
    
} catch(Exception $e) {
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
?>
