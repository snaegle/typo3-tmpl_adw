# Check

* [Ruby](https://www.ruby-lang.org/) is installed? `$ ruby -v`
* [Node](http://nodejs.org/) is installed `$ node -v`
* [Compass](http://compass-style.org/) is installed `$ gem list`
* [Bower](http://bower.io/) is installed? `$ bower -v`
* [Grunt](http://gruntjs.com/getting-started) is installed `$ grunt --version`

after first pull you'll need to 

* `$ npm install` to get all grunt dependencies like grunt-contrib-uglify, grunt-timer etc.
* `$ bower install` to get all bower dependencies like font-awesome, fancybox etc.

to get bower components and grunt modules you might need to run ist again if bower.json and/or package.json are updated

# Test/Dev/Deploy

`$ cd` into Build folder and run `$ grunt dev` (for local development) or '$ grunt devCSS' (if you want to run compass watch only for development) or `$ grunt dist` (before you commit stuff to GitHub) 


# please note

if you change scss files and commit them without running grunt (`$ grunt dist`), the css files won't get updated and - obviously - you can't expect to see changes in the front end.

Run any grunt task with `--verbose` to get lots of cli output.
