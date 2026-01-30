# Vehicle CLI

Client en ligne de commande pour interagir avec le vehicle-server.

## Installation et utilisation

### Prérequis
- Docker
- Node.js 20+ (pour le vehicle-server)
## Démarrage avec Docker

### 1. Lancer le serveur et la base de données
```bash
docker-compose up
```

Le serveur démarrera sur http://localhost:8080

### 2. Utiliser le CLI (dans un autre terminal)
```bash
# Builder le CLI
docker build -f Dockerfile.cli -t vehicle-cli .

# Créer l'alias
alias vehicle-cli='docker run --rm --network host vehicle-cli --server http://localhost:8080'
```

### Utilisation
```bash
# Afficher l'aide
vehicle-cli --help

# Lister les véhicules
vehicle-cli list

# Créer des véhicules
vehicle-cli create --shortcode AUDI --battery 85 --lat 48.8566 --lng 2.3522
vehicle-cli create --shortcode PEJO --battery 67 --lat 48.8738 --lng 2.2950
vehicle-cli create --shortcode OPEL --battery 92 --lat 48.8606 --lng 2.3376
vehicle-cli create --shortcode FORD --battery 78 --lat 48.8420 --lng 2.3200
vehicle-cli create --shortcode FIAT --battery 54 --lat 48.8700 --lng 2.3100

# Vérifier la création
vehicle-cli list

# Supprimer un véhicule
vehicle-cli delete <vehicle-id>
```

## Workflow complet
```bash
# Terminal 1 : Démarrer le serveur
cd ../vehicle-server
npm run start

# Terminal 2 : Utiliser le CLI
cd ci-cd-brown-pelissier
docker build -t vehicle-cli .
alias vehicle-cli='docker run --rm --network host vehicle-cli --server http://localhost:8080'

# Créer des véhicules
vehicle-cli create --shortcode AUDI --battery 85 --lat 48.8566 --lng 2.3522
vehicle-cli create --shortcode PEJO --battery 67 --lat 48.8738 --lng 2.2950
vehicle-cli create --shortcode OPEL --battery 92 --lat 48.8606 --lng 2.3376
vehicle-cli create --shortcode FORD --battery 78 --lat 48.8420 --lng 2.3200
vehicle-cli create --shortcode FIAT --battery 54 --lat 48.8700 --lng 2.3100

# Lister tout
vehicle-cli list
```

## Exemples de résultats

### Création d'un véhicule
```bash
$ vehicle-cli create --shortcode AUDI --battery 85 --lat 48.8566 --lng 2.3522
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "shortcode": "AUDI",
  "battery": 85,
  "position": {
    "latitude": 48.8566,
    "longitude": 2.3522
  }
}
```

### Liste des véhicules
```bash
$ vehicle-cli list
{
  "vehicles": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "shortcode": "AUDI",
      "battery": 85,
      "position": { "latitude": 48.8566, "longitude": 2.3522 }
    },
    ...
  ]
}
```