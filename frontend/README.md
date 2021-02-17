# Frontend Documentation

## Structure guidelines

Every page has its own directory in src. JSX Components which are page-specific should also be in this directory. If there are at least 
two .css files in a page directory, they need to be placed in a separate "style"-directory inside the page-directory.
JSX Components which are used more than once should be in "Common". 
Static files like Images and other media should be in the "static"-directory.
