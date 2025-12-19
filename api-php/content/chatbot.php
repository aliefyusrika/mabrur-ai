<?php
// Chatbot API
// File: api-php/content/chatbot.php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

$input = getJSONInput();
$message = $input['message'] ?? '';

if (empty($message)) {
    sendResponse(['success' => false, 'error' => 'Message required'], 400);
}

try {
    $db = getDBConnection();
    
    // Search for relevant content based on keywords
    $searchTerm = '%' . $message . '%';
    $stmt = $db->prepare("
        SELECT * FROM ChatbotContent 
        WHERE isActive = 1 
        AND (question LIKE ? OR keywords LIKE ? OR answer LIKE ?)
        LIMIT 1
    ");
    $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
    $content = $stmt->fetch();
    
    if ($content) {
        sendResponse([
            'success' => true,
            'reply' => $content['answer']
        ]);
    } else {
        sendResponse([
            'success' => true,
            'reply' => 'Maaf, saya belum memiliki informasi tentang pertanyaan Anda. Silakan hubungi admin untuk informasi lebih lanjut.'
        ]);
    }
    
} catch(Exception $e) {
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
?>
