<?php session_start();
?>
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="../favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="../CSS/style.css" />
  <title>Ajouter</title>
</head>

<body>
  <main class="main">
    <div class="container">
      <form action="genre.php" id="form-el" class="form col" method="POST" enctype="multipart/form-data">
        <!--Insértion du nom Anglais de l'anime-->
        <input class="form-input" type="text" name="nomEn" id="EnName" placeholder="Type Composant" required />
        <!--Insértion du nom Japonais de l'anime-->
        <input class="form-input" type="text" name="nomJp" id="JpName" placeholder="Marque" required />
        <!--Insértion du lien de l'image de l'anime-->
        <input class="form-input" type="text" name="fichier" id="imageInput" placeholder="Lien image" minlength="3"
          required />
        <!--Insértion du status de l'anime (personnel)-->
        <select name="statu" id="Statu" class="select" required>
          <option value="">-- Sélectionnez un status --</option>
          <option value="Fini">Fini</option>
          <option value="En cours">En cours</option>
          <option value="A venir">A venir</option>
        </select>
        <!--Insértion de la note de l'anime (personnel)-->
        <input class="form-input" type="text" name="notes" id="Note" placeholder="Note sur 20" required />
        <p class="p">Année de sortie</p>
        <!--Insértion de la date de sortie en streaming de l'anime-->
        <input class="form-input" type="Date" name="anneeSortie" id="Annee_sortie" placeholder="Année de sortie"
          required />

        <button class="btn">Continuer</button>
      </form>
    </div>
  </main>
</body>
<script src="./main.js"></script>

</html>