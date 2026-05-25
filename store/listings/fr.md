# StayActive — Fiche Chrome Web Store (FR)

## Nom
StayActive

## Description courte (132 caractères max)
Empêchez les sites de remarquer que vous avez quitté l'onglet. Les vidéos, pubs et minuteurs ne se mettent plus en pause.

## Catégorie
Productivité

## Langue
Français

## Description détaillée
StayActive fait croire aux sites web que l'onglet courant est toujours
au premier plan, même quand vous passez sur un autre onglet ou une autre
fenêtre.

Certains sites mettent en pause les vidéos, les pubs ou les minuteurs dès
que vous partez. StayActive contourne ce comportement en interceptant les
signaux que le navigateur transmet à la page (Page Visibility API, focus,
blur).

Fonctionnalités
• Activation/désactivation en un clic depuis la barre d'outils
• Fonctionne sur tous les sites, y compris dans les iframes
• Aucun tracking, aucune analytique, aucun serveur distant
• Code 100 % open source

Comment ça marche
L'extension remplace document.hidden, document.visibilityState et
document.hasFocus() et bloque les évènements visibilitychange / blur /
pagehide pour que la page pense que l'onglet reste actif.

Confidentialité
StayActive ne collecte, n'enregistre et ne transmet aucune donnée.
La seule chose stockée localement est votre préférence on/off.

## Mots-clés / tags
onglet actif, anti-pause, lecture continue, focus onglet,
pub en arrière-plan, page visibility, garder actif

## Objectif unique (pour la revue Chrome Web Store)
StayActive remplace l'API Page Visibility et les évènements focus/blur
à l'intérieur des pages web afin que les sites croient que l'onglet
courant reste visible et au premier plan, ce qui les empêche de
suspendre la lecture ou de mettre en pause leur fonctionnement
lorsque l'utilisateur change d'onglet.

## Justification des permissions
- storage : stocke la préférence on/off de l'utilisateur en local.
- host_permissions <all_urls> : le script qui masque la visibilité
  doit être injecté sur chaque page où l'utilisateur souhaite que la
  fonctionnalité s'applique. L'extension ne lit pas le contenu des
  pages et ne transmet aucune donnée.

## Déclaration sur l'utilisation des données
- Informations personnelles identifiables : Non
- Informations de santé : Non
- Informations financières : Non
- Informations d'authentification : Non
- Communications personnelles : Non
- Localisation : Non
- Historique de navigation : Non
- Activité utilisateur : Non
- Contenu de sites web : Non

Certification :
Je ne vends ni ne transfère les données utilisateur à des tiers.
Je n'utilise ni ne transfère les données utilisateur à des fins étrangères
à l'objectif unique de l'extension.
Je n'utilise ni ne transfère les données utilisateur pour déterminer
la solvabilité ou à des fins de prêt.
