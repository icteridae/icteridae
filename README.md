
# Icteridae

Icteridae is an open-source Webapp for interactive research exploration, where users can dynamically visualize similarities between large amounts of research.

## Table of Contents

 - [Setup](#setup)
	 - [Direct Dependencies](#install-direct-dependencies)
	 - [Postgresql](#postgresql)
	 - [Elasticsearch](#elasticsearch)
 - [Running](#running)
	 - [Quickstart](#quickstart-on-single-machine)
	 - [Regular Start](#regular-start)
 - [Import Papers](#import-papers)
 - [References](#references)

## Setup

Make sure you have a recent version of yarn.
Clone the project using


    git clone git@github.com:icteridae/icteridae.git


#### Install direct dependencies
  
Navigate into the `frontend` directory and install the needed dependencies using

    yarn

Then, navigate into the `backend` directory and install the needed dependencies using

    pip install -r requirements.txt


#### Postgresql

[Setup postgresql](https://www.postgresql.org/download/) locally with a user with credentials 

| username | password |
|--|--|
| icteridae | bp62 |

The created user should have access to a database called **icteridae**

All variables can be used but have to be adjusted in `backend/backend/settings.py`

#### Elasticsearch

[Setup elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/deb.html) locally to run on port 9200 (the default). Alternative ports can be set in `backend/backend/settings.py`


## Running

### Quickstart on single machine
If both the back- and frontend are supposed to run on the same machine, simply execute `start.sh`

### Regular start

#### Start Django Server
If not using locally, enter the web address of your backend in `backend/backend/settings.py` under `ALLOWED_HOSTS`.

Navigate into the `backend/` directory and run

    python3 manage.py runserver

To make the backend accessible from outside, use

    python3 manage.py runserver 0.0.0.0:8000


#### Start React Server

Enter the web address of your backend in `frontend/src/Utils/Config.tsx`

Navigate into the `frontend/` directory and run

    yarn start

## Import Papers

Papers are structured as defined in the SemanticScholar Open Research Corpus. When inputting files, each line should represent a single paper as a json object. Place any files in the `backend/data/` directory. Then in the `backend`directory run

    python3 manage.py populate

Additional parameters can be seen with 

    python3 manage.py help populate

You should first try with a smaller dataset as the process can take a very long time.

## References

_Waleed Ammar et al. 2018. Construction of the Literature Graph in Semantic Scholar. NAACL_  
[https://www.semanticscholar.org/paper/09e3cf5704bcb16e6657f6ceed70e93373a54618](https://www.semanticscholar.org/paper/09e3cf5704bcb16e6657f6ceed70e93373a54618).

