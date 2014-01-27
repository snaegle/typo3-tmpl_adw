# Requirements
* [Ruby](https://www.ruby-lang.org/)
* [Node](http://nodejs.org/)
* compass	`$ gem install compass`
* sass		`$ gem install sass`
* bower		`$ npm install bower`
* grunt		`$ npm install grunt-cli`

after first pull you'll need to 
* `$ npm install` to get all grunt dependencies like grunt-contrib-uglify, grunt-timer etc.
* `$ bower install` to get all bower dependencies like font-awesome, fancybox etc.
to get bower components and grunt modules
you might need to run ist again if bower.json and/or package.json are updated

# Test/Dev/Deploy
`$ grunt`

# please note
if you change scss files and commit them without running grunt, the css files won't get updated and - obviously - you can't expect to see changes in the front end
