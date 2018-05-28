# CC_sportdec

## Backend project in node js

### Requisites :  

* Node
* npm  

### Installation:

* Open a terminal window inside the project directory and run:
```
npm install
touch .env
```
* Open your preferred IDE and ensure to fill up the .env file with the following text, replacing 'xxx' with your twitter credentials, no space needed after '=' signs.
```
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_TOKEN_SECRET=xxx
```

### Run:

You can run the program from command line by typing:
```
node index.js
```
or
```
npm start
```
By default the program will fetch the top 10 starred Football repos on github, however you can pass up to 3 arguments in the following order:
keyword, page, per_page
per_page max number is 10 and minimum is 1: if this condition is not respected it will default to 10

For example:

```
node index.js tennis 5 3
```
This command will fetch 3 repos about tennis on the fifth page of the github search results.

### Limits:
This program has API rate and query limits relative to Github and Twitter APIs.

Whenever these limits are hit the full response/error with status code will be parsed to the summary, and tweets objects of each repo.

Rate limiting is explained in the Github and Twitter API documentation.

### Tweets completeness:
As specified in the Twitter documentation
