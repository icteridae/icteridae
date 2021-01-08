# Getting Started 

## Setup

Make sure you have a recent version of yarn.
Clone the project using


    git clone git@github.com:icteridae/icteridae.git


#### Install dependencies
  
Navigate into the `frontend` directory and install the needed dependencies using

    yarn

Then, navigate into the `backend` directory and install the needed dependencies using

    pip install -r requirements.txt


## Running

### Start Django Server
Navigate into the `backend/` directory and run

    python manage.py runserver

### Start React Server

Navigate into the `frontend/` directory and run

    yarn start
   
### Visit http://localhost:3000

## Structure guidelines

Every page has its own directory in src. JSX Components which are page-specific should also be in this directory. If there are at least 
two .css files in a page directory, they need to be placed in a separate "style"-directory inside the page-directory.
JSX Components which are used more than once should be in "Common". 
Static files like Images and other media should be in the "static"-directory.
