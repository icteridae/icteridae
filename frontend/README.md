
# Frontend Documentation


## File Structure
*only important files are included*
```
frontend
│   README.md
│   package.json
│   yarn.lock
│   tsconfig.json
│   docker-compose.yml  # development compose file
│   prod.yml  # production compose file
│   Dockerfile  # development dockerfile
│   Dockerfile.prod  # production dockerfile   
│
└───public
│   
└───src
    |
    └───Components
    |   |
    |   └───App  # root, react-router
    |   └───Author  # author search/papers/relations
    |   └───Description  # faq, imprint 
    |   └───Front  # frontpage, recently opened papers
    |   └───Genral  # globally used components
    |   └───Navbar  # navigation bar on each site
    |   └───SavedPapers  # MyPapers tab, localstorage tree structures
    |   └───Search  # paper search
    |   
    └───Utils
        │   _colors.sass  # colors definition
        |   Config.tsx  # configuration file
        │   GeneralTypes.tsx  # typescript definitions for globally used types

```



## Imprint
If you need to provide an imprint, navigate to Config.tsx and set the value of `show_imprint` to `true`. Enter your imprint in `frontend/src/Components/Description/Privacy/PageImprint.tsx`.


## Structure Guidelines

Every page has its own directory in `src/Components`. TSX Components which are page-specific should also be in this directory. If there are at least two .sass files in a page directory, they need to be placed in a separate `style`-directory inside the page-directory. TSX Components which are used more than once should be in `General`. 
