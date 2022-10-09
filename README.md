# hackerflix

[HackerFlix](http://www.hackerflix.net/) is a curated directory of documentaries, docuseries, movies, and tv shows about computers, hacking, technology, privacy, cyberpunk and Internet culture. Most of the imagery and data is provided via The Movie DB.

## Development

### Prerequisites

- NodeJS v16+
- Docker Desktop

### Setup

1. Clone this repository.
1. Copy `.env.example` to `.env` and add config values.
1. Create a `private` directory and add the GCP service account credentials file.
1. Install dependencies: `npm install`
1. Start Redis: `docker-compose up -d`
1. Start the dev server: `npm run dev`

Upon a successful start of the application, the console will show:

```
[dev:server] Application listening on port 3000
```

To access the site visit:
http://localhost:3000/

To access Redis visit:
http://localhost:8001/
