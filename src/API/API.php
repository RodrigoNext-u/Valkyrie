<?php
header("Access-Control-Allow-Origin: *");
use Symfony\Component\Dotenv\Dotenv;

$dotenv = new Dotenv();
$dotenv->load('../../.env');

function connexionBDD() {
    // Informations de connexion à la base de données
    $servername = $_ENV["DB_HOST"];
    $username = $_ENV["DB_USERNAME"];
    $password = $_ENV["DB_PASSWORD"];
    $dbname = $_ENV["DB_DATABASE"];

    // Connexion à la base de données MySQL
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Vérification de la connexion
    if ($conn->connect_error) {
        die("Erreur de connexion à la base de données : " . $conn->connect_error);
    }

    // Retourner l'objet de connexion
    return $conn;
}

function checkSqlInjection($input) {
    // Liste de mots clés et caractères couramment utilisés dans les injections SQL
    $patterns = [
        '/select\s/i', '/insert\s/i', '/update\s/i', '/delete\s/i', '/drop\s/i', '/union\s/i',
        '/--/', '/#/', '/;/', '/\s+/', '/\s*or\s+/i', '/\s*and\s+/i'
    ];
    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $input)) {
            return true;
        }
    }
    return false;
}

// Endpoint pour récupérer des données depuis la base de données
function getDataFromDatabase() {    
    // Établir la connexion à la base de données
    $conn = connexionBDD();

    // Vérifier la méthode de la requête HTTP
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $url = $_SERVER['REQUEST_URI'];
        
        // Retirer le chemin de base, y compris 'API.php'
        $url = str_replace('/Valkyrie/src/API/API.php/', '', $url);

        // Extraire les segments d'URL
        $urlSegments = explode('/', $url);
        $action = $urlSegments[0];


        switch ($action) {
            case 'data':
                $sql = "SELECT *
FROM x.composant
ORDER BY 
  CASE 
    WHEN type = 'CPU' THEN 1
    WHEN type = 'MOB' THEN 2
    WHEN type = 'GPU' THEN 3
    WHEN type = 'COL' THEN 4
    WHEN type = 'RAM' THEN 5
    WHEN type = 'SSD' THEN 6
    WHEN type = 'HDD' THEN 7
    WHEN type = 'WIF' THEN 8
    WHEN type = 'CAS' THEN 9
    WHEN type = 'PSU' THEN 10
    ELSE 11
  END,
  libelle;
";
                // Exécuter la requête SQL
                $result = $conn->query($sql);
                // Vérifier s'il y a des résultats
                if ($result->num_rows > 0) {
                    // Créer un tableau pour stocker les données
                    $data = array();
                    // Parcourir les résultats et les stocker dans le tableau
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    // Convertir les données en format JSON et les retourner
                    return json_encode($data);
                } else {
                    // Aucune donnée trouvée
                    return "Aucune donnée trouvée";
                }
            case 'qrcode':
                // Récupérer la valeur après "qrcode/"
                $qrCodeValue = $urlSegments[1];
                // Check de la valeur afin d'éviter les injections SQL
                if (checkSqlInjection($urlSegments[1]))
                return;
                // Utiliser cette valeur pour la requête SQL
                $sql = "SELECT * FROM x.composant WHERE qrCode = '$qrCodeValue'";
                // Exécuter la requête SQL
                $result = $conn->query($sql);
                // Vérifier s'il y a des résultats
                if ($result->num_rows > 0) {
                    // Créer un tableau pour stocker les données
                    $data = array();
                    // Parcourir les résultats et les stocker dans le tableau
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    // Convertir les données en format JSON et les retourner
                    return json_encode($data);
                } else {
                    // Aucune donnée trouvée
                    return "Aucune donnée trouvée pour '$qrCodeValue'";
                }
            case 'stock':
                // Récupérer la valeur après "stock/"
                $qrCodeValue = $urlSegments[1];
                // Check de la valeur afin d'éviter les injections SQL
                if (checkSqlInjection($urlSegments[1]))
                return;
                // Utiliser cette valeur pour la requête SQL
                $sql = "SELECT * FROM x.stock stock 
                    left join x.composant composant on composant.idComposant = stock.idComposant
                WHERE qrCode = '$qrCodeValue'";
                // Exécuter la requête SQL
                $result = $conn->query($sql);
                // Vérifier s'il y a des résultats
                if ($result->num_rows > 0) {
                    // Créer un tableau pour stocker les données
                    $data = array();
                    // Parcourir les résultats et les stocker dans le tableau
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    // Convertir les données en format JSON et les retourner
                    return json_encode($data);
                } else {
                    // Aucune donnée trouvée
                    return "Aucune stock trouvée pour '$qrCodeValue'";
                }
            case 'stocks':
                // Utiliser cette valeur pour la requête SQL
                $sql = "SELECT type, qrCode, qteReel, qteMin FROM x.stock stock
                join x.composant composant on composant.idComposant = stock.idComposant";
                // Exécuter la requête SQL
                $result = $conn->query($sql);
                // Vérifier s'il y a des résultats
                if ($result->num_rows > 0) {
                    // Créer un tableau pour stocker les données
                    $data = array();
                    // Parcourir les résultats et les stocker dans le tableau
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    // Convertir les données en format JSON et les retourner
                    return json_encode($data);
                } else {
                    // Aucune donnée trouvée
                    return "Aucune donnée trouvée dans la table stocks";
                }
            case 'compat':
                if (checkSqlInjection($urlSegments[1]))
                return;
                $ComposantSegments = explode(',', $urlSegments[1]);
                $nmbrComposant = count($ComposantSegments);
                $sql = "SELECT c.* FROM x.composant c
                        JOIN x.proprietes p ON c.idComposant = p.idComposant
                        JOIN x.compatibilites co ON co.idComposant1 = p.idComposant
                        WHERE co.idComposant2 IN ($urlSegments[1]) AND co.compatibilite = true
                        GROUP BY c.idComposant
                        HAVING COUNT(DISTINCT co.idComposant2) = $nmbrComposant
                        ORDER BY 
                        CASE 
                            WHEN type = 'CPU' THEN 1
                            WHEN type = 'MOB' THEN 2
                            WHEN type = 'GPU' THEN 3
                            WHEN type = 'COL' THEN 4
                            WHEN type = 'RAM' THEN 5
                            WHEN type = 'SSD' THEN 6
                            WHEN type = 'HDD' THEN 7
                            WHEN type = 'WIF' THEN 8
                            WHEN type = 'CAS' THEN 9
                            WHEN type = 'PSU' THEN 10
                            ELSE 11
                        END,
                        libelle;";
                // Exécuter la requête SQL
                $result = $conn->query($sql);
                // Vérifier s'il y a des résultats
                if ($result->num_rows > 0) {
                    // Créer un tableau pour stocker les données
                    $data = array();
                    // Parcourir les résultats et les stocker dans le tableau
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    // Convertir les données en format JSON et les retourner
                    return json_encode($data);
                } else {
                    // Aucune donnée trouvée
                    return "Aucune donnée trouvée";
                }
            case 'commande':
                // Récupérer la valeur après "commande/"
                $qrCodeValue = $urlSegments[1];
                // Check de la valeur afin d'éviter les injections SQL
                if (checkSqlInjection($urlSegments[1]))
                return;
                // Utiliser cette valeur pour la requête SQL
                $sql = "SELECT *, services.libelle AS 'libelleService' FROM x.detailscommande dtscmd
                LEFT join x.services services on services.idServices = dtscmd.idServices
                LEFT join x.composant composant on composant.idComposant = dtscmd.idComposant
                WHERE dtscmd.idCommande = '$qrCodeValue'";
                // Exécuter la requête SQL
                $result = $conn->query($sql);
                // Vérifier s'il y a des résultats
                if ($result->num_rows > 0) {
                    // Créer un tableau pour stocker les données
                    $data = array();
                    // Parcourir les résultats et les stocker dans le tableau
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    // Convertir les données en format JSON et les retourner
                    return json_encode($data);
                } else {
                    // Aucune donnée trouvée
                    return "Aucune stock trouvée pour '$qrCodeValue'";
                }
        }
    }
}


echo getDataFromDatabase();