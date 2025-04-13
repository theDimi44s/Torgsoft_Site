<?php
if ($_FILES['uploadfile']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['uploadfile']['tmp_name'];
    $filename = $_FILES['uploadfile']['name'];
    $ext = pathinfo($filename, PATHINFO_EXTENSION);

    if ($ext === 'csv') {
        $csv = array_map('str_getcsv', file($tmpName));
        echo "<h2>Завантажено CSV:</h2><ul>";
        foreach ($csv as $row) {
            echo "<li>" . implode(" | ", $row) . "</li>";
        }
        echo "</ul>";
    } else {
        echo "Формат $ext поки не підтримується.";
    }
} else {
    echo "Помилка завантаження.";
}
?>