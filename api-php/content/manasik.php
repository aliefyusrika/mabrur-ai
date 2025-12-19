<?php
// Get Manasik Content API
// File: api-php/content/manasik.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

try {
    $db = getDBConnection();
    
    // Get all active manasik content
    $stmt = $db->prepare("
        SELECT * FROM ManasikContent 
        WHERE isActive = 1 
        ORDER BY orderIndex ASC
    ");
    $stmt->execute();
    $content = $stmt->fetchAll();
    
    sendResponse([
        'success' => true,
        'data' => $content
    ]);
    
} catch(Exception $e) {
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
?>
