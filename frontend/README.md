

# Frontend Documentation

The Icteridae frontend is using [React](https://reactjs.org/) and [React Suite](https://rsuitejs.com/) components. Most files are written with [TypeScript](https://www.typescriptlang.org/). To allow easier configuration, [Sass](https://sass-lang.com/) files are used for style sheets. Package management and running is done using [yarn](https://yarnpkg.com/) and [Docker](https://www.docker.com/). Additionally, the force directed graph is rendered using the 2D variant of [react-force-graph](https://github.com/vasturiano/react-force-graph).

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
