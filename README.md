# ScoreBoard v0.1

Petit robot discord qui met en place un système de point par équipe. Les équipes sont créés/supprimées manuellement (pas en relation avec des roles), et les points sont également accordés manuellement. Les commandes sont utilisables suivant le role de l'utilisateur.

## Liste des commandes

Entre `[]` le role requis pour activer une commande.

- Créer une faction [admin]
 `!create <faction>`
- Supprimer une faction [admin]
 `!delete <faction>`
- Ajouter <val> points à la faction <faction> [chef|admin]
 `!add <faction> <val>`
- Retirer <val> points à la faction <faction> [chef|admin]
 `!rem <faction> <val>`
- Ecraser le compteur de <faction> et le réinitialiser à <val> points [admin]
 `!set <faction> <val>`
- Affiche le score [tous]
 `!score`
- Afficher l'aide [tous]
 `!help`


## Base de donnée

La base de donnée est stockée sous forme d'un fichier JSON à l'aide du module lowdb.

```json
{
  "factions": [
    {
      "name": "blue",
      "points": 18
    },
    {
      "name": "red",
      "points": 22
    },
    {
      "name": "yellow",
      "points": 0
    },
    {
      "name": "green",
      "points": 12
    }
  ]
}
```

## TODO

- Assignation des roles avec une commande
 `!assign <cmd> <role>`
 Ex : `!assign !add all` : n'importe qui peut ajouter des points