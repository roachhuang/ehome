 #!/bin/bash
 pm2 stop app
 NODE_ENV=build nodemon bin/www/ehome/server/app.js


