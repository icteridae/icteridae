

# Icteridae

Icteridae is an open-source Webapp for interactive research exploration, where users can dynamically visualize similarities between large amounts of research.

## Table of Contents

 - [Setup](#setup)
	 - [Requirements](#requirements)
	 - [Direct Dependencies](#install-dependencies)
 - [Running](#running)
	 - [Start Backend](#start-backend)
	 - [Start Frontend](#start-frontend)
 - [Import Papers](#import-papers)
 - [References](#references)

## Documentation

Docs are split into [Backend Docs](backend/README.md) and [Frontend Docs](frontend/README.md)


## Setup

Clone the project using

    git clone git@github.com:icteridae/icteridae.git

### Requirements

*Icteridae* requires having both [Docker](https://www.docker.com/get-started), [Docker Compose](https://docs.docker.com/compose/) and a recent version of [yarn](https://yarnpkg.com/) installed and runnable.


#### Install dependencies
  
Navigate into the `frontend` directory and install the needed dependencies using

    yarn


## Running

### Start Backend
If not used locally, enter the web address of your backend in `backend/backend/settings.py` under `ALLOWED_HOSTS`.

Navigate into the `backend/` directory and run

    docker-compose up

### Start Frontend

Enter the web address of your backend in `frontend/src/Utils/Config.tsx`

Navigate into the `frontend/` directory and run

    yarn start

## Import Papers

Papers are structured as defined in the SemanticScholar Open Research Corpus. When inputting files, each line should represent a single paper as a json object. Place any files in the `backend/data/` directory. Then in the `backend`directory run

Connect to your container (usually named `icteridae_django`, use `docker ps` to list container names) using

    docker exec -it [web container name] bash

Start importing papers using 

    ./manage.py populate [parameters]

Additional parameters can be seen with 

    ./manage.py help populate

You should first try with a smaller dataset as the process can take a very long time.

## References

_Waleed Ammar et al. 2018. Construction of the Literature Graph in Semantic Scholar. NAACL_  
[https://www.semanticscholar.org/paper/09e3cf5704bcb16e6657f6ceed70e93373a54618](https://www.semanticscholar.org/paper/09e3cf5704bcb16e6657f6ceed70e93373a54618).

