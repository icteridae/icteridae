
# Getting Started 

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

### Start separately

#### Start Django Server
Navigate into the `backend/` directory and run

    python3 manage.py runserver

#### Start React Server

Navigate into the `frontend/` directory and run

    yarn start

## Parse Paper Data

Papers are structured as defined in the SemanticScholar Open Research Corpus. When inputting files, each line should represent a single paper as a json object. Place any files in the `backend/data/` directory. Then in the `backend`directory run

    python3 manage.py populate

Additional parameters can be seen with 

    python3 manage.py help populate

You should first try with a smaller dataset as the process can take a very long time.
