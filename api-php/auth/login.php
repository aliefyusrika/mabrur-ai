<?php
// Admin Login API
// File: api-php/auth/login.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

$input = getJSONInput();
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    sendResponse(['success' => false, 'error' => 'Email and password required'], 400);
}

try {
    $db = getDBConnection();
    
    // Find user by email
    $stmt = $db->prepare("SELECT * FROM User WHERE email = ? AND role = 'ADMIN'");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(['success' => false, 'error' => 'Invalid credentials'], 401);
    }
    
    // Verify password
    if (!verifyPassword($password, $user['password'])) {
        sendResponse(['success' => false, 'error' => 'Invalid credentials'], 401);
    }
    
    // Generate simple token (in production, use proper JWT)
    $token = base64_encode($user['id'] . ':' . time());
    
    sendResponse([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role']
        ],
        'token' => $token
    ]);
    
} catch(Exception $e) {
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
?>
