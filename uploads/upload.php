<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['stl']) && $_FILES['stl']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = basename($_FILES['stl']['name']);
        $uploadPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['stl']['tmp_name'], $uploadPath)) {
            echo json_encode(['success' => true, 'file' => $fileName]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Échec sauvegarde']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Fichier invalide']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
}
?>
