
# Getting Started for development

## Setup

Make sure you have a recent version of yarn.

Clone the project using 


    git clone git@github.com:icteridae/icteridae.git


Change into the now downloaded directory with

    cd icteridae

Install the needed dependencies using

    yarn

## Running 

Run just the React project using

    yarn react-start

Alternatively you can run the React project in an Electron environment using

    yarn start

## Building

You can build the project for your local system using 

    yarn build

You'll the executable files in `icteridae/dist/`.

## Structure guidelines

Every page has its own directory in src. JSX Components which are page-specific should also be in this directory. If there are at least 
two .css files in a page directory they need to be placed in a seperate "style"-directory inside the page-directory.
JSX Components which are used more then once should be in "Common". 
Static files like Images and other media should be in the "static"-directory.
The formatting inside the files is based on airbnb: https://airbnb.io/javascript/react/
