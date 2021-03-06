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
```

### Run:

You can run the program from command line by typing:
```
node index.js
```

You can also pass 3 optional flags, they don't need to be in sequential order:

-k   => keyword (it will default to "Football")

-c   => results per page (it will default to 10, max is 10)

-p   => the page number (it will default to 1)

Example with flags: (fetch 7 repos about tennis from the 3rd search page in github)

```
node index.js -k Tennis -c 7 -p 3
```

once the script has run, the server will serve  the response at http://localhost:3000/CC_sportdec


### Limits:
This program has API rate and query limits relative to Github and Twitter APIs.

Whenever these limits are hit the full response/error with status code will be parsed to the summary, and tweets objects of each repo.

Rate limiting is explained in the Github and Twitter API documentation.

### Tweets completeness:
Unsure about what could be the reason but unless the repo is very popular I can't get tweets consistently,
However, I made some tests using keywords like ExpressJs or NodeJs and I can get those tweets.
