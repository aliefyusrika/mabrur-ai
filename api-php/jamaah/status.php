<?php
// Get Jamaah Status API
// File: api-php/jamaah/status.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

$token = $_GET['token'] ?? '';

if (empty($token)) {
    sendResponse(['success' => false, 'error' => 'Token required'], 400);
}

try {
    $db = getDBConnection();
    
    // Get jamaah status
    $stmt = $db->prepare("
        SELECT js.*
        FROM User u
        JOIN Jamaah j ON u.id = j.userId
        JOIN JamaahStatus js ON j.id = js.jamaahId
        WHERE u.token = ?
    ");
    $stmt->execute([$token]);
    $status = $stmt->fetch();
    
    if (!$status) {
        sendResponse(['success' => false, 'error' => 'Status not found'], 404);
    }
    
    sendResponse([
        'success' => true,
        'status' => $status
    ]);
    
} catch(Exception $e) {
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
?>
