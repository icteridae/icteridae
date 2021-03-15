
# Backend Documentation

The backend is written using [Django](https://www.djangoproject.com/). Papers are stored in a [PostgreSQL](https://www.postgresql.org/)  database. Search performance is increased using [Elasticsearch](https://www.elastic.co/elasticsearch/). Setup is simplified using [Docker](https://www.docker.com/).

## File Structure
*only important files are included*
```
backend
│   README.md
│   manage.py
│   docker-compose.yml  # development compose file
│   Dockerfile  # development dockerfile
|   docker-entrypoint.sh  # entrypoint used to wait for db and perform migrations
│
└───backend
│   |
│   |   settings.py  # backend configuration
│   
└───data
|   |
│   |   <empty, but put your jsonl files here>
│
└───graphgenerator
    |
    |   documents.py  # documents used for elasticsearch index
    |   models.py  # models used for Django ORM
    |   relevance.py  # relevance functions for graph element selection
    |   serializers.py  # serializers for models
    |   similarities.py  # similarity functions for graph similarity calculation
    |   urls.py  # url maps for api
    |   views.py  # api functions for searching/graph/lookup/bulk lookup 
    |
    └───authors  # author search urls/views
    |   
    └───management  # custom django commands for database population
    |
    └───migrations  # database migrations
```



## Configuration
For configuration, use `backend/backend/settings.py`. See [Django settings docs ](https://docs.djangoproject.com/en/3.1/ref/settings/) for detailed information.


## Graph customization
If you only wish to customize the graph, the only two relevant files are `graphgenerator/relevance.py` and `graphgenerator/similarities.py`. When generating a graph, both of them have the following responsibilities.

**Relevance** - Given a source node, decide which papers should be shown. 

**Similarity** - Given a list of papers, calculate their pairwise similarities.

Details on how to implement custom relevance/similarity-functions can be found in the respective files.

## Structure Guidelines

Every page has its own directory in `src/Components`. TSX Components which are page-specific should also be in this directory. If there are at least two .sass files in a page directory, they need to be placed in a separate `style`-directory inside the page-directory. TSX Components which are used more than once should be in `General`. 
