 #!/bin/bash  
 cd var/www/ehome
 pm2 stop app
 nodemon app
 