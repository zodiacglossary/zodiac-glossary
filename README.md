# The Zodiac Glossary

## ZODIAC – Ancient Astral Science in Transformation

This glossary of ancient terms is only one facet of the [Zodiac Project](https://www.geschkult.fu-berlin.de/e/zodiac/index.html), an ERC-funded academic research project hosted at the Freie Universität Berlin.

## Work-in-Progress Webpages

Visit the new permanent address of the Zodiac Glossary: [zodiac.fly.dev](https://zodiac.fly.dev) to keep up with the latest features as they become available.

An earlier prototype of the frontend is still accessible at its [github pages site](https://christiancasey.github.io/zodiac-routing/). This will become the front-facing interface for the fully-connected project. Note that the data shown here are not truly dynamic. They are for development and demonstration purposes only.

## About ZODIAC

Astrology, Astronomy, Mathematics, Religion and Philosophy – all these different aspects and their theories and practices, texts and images, meet in the concept of the zodiac. 2500 years ago, in the 5th century BCE, the introduction of the zodiac in Babylonia marked a turning point in human culture and science. The zodiacal turn was accompanied by a mathematical turn in the astral sciences and a personal turn in astrology. From Babylonia, zodiacal astral science spread to Egypt, the Greco-Roman world, and beyond.

![Zodiac Logo](zodiac-galaxy.png)

# Development Stuff

## Database Backup

Database proxy must be running for this to work: 

    flyctl proxy 5432 -a zodiac-db

### Public Backup

    PGPASSWORD="[PASSWORD]" pg_dump --dbname=zodiac --host=localhost --port=5432 --username=zodiac -T users -T edit_history --inserts > backups/public/$(date +'%Y-%m-%d').sql

### Private Backup (with users table)

    PGPASSWORD="[PASSWORD]" pg_dump --dbname=zodiac --host=localhost --port=5432 --username=zodiac --inserts > backups/private/$(date +'%Y-%m-%d').sql

## Local Development

### Local Dev Server

    npm run dev

## Deploying (now with Docker)

Instructions:

1. Proxy database (above)
1. Run docker container with env vars, one of which allows the db host to connect to the localhost

    `docker run -e DB_HOST_LOCAL=host.docker.internal -e LOCAL_DEV=true -e DB_NAME=zodiac -e DB_USER=zodiac -e DB_PASS=[PASSWORD] -e DB_PORT=5432 -p 6001:3001 zodiac`

1. Put env vars in fly secrets
1. Run deployment

    `fly deploy --no-cache --verbose --depot`

    (`--depot` is needed to deploy on the Frankfurt server, other flags as needed)