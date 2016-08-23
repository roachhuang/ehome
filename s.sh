#!/bin/bash
# usage ./sh f.txt. where f.txt is the frame to send


#sudo stty -F /dev/ttyAMA0 9600

#echo -en '~¢@ëUlÿþD0Ë' > /dev/ttyAMA0

#FILE=$1
#read -r line < /tmp/f.txt
#echo -en $line > /dev/ttyAMA0
#echo -en "$line" |od -t x1 -c;
#echo  $1


FILE=$1
while read -r line
do
	echo "$line"
	#echo -en $line > /dev/ttyAMA0
#	echo -en "\x7e\x00\x10\x17\x05\x00\x13\xa2\x00\x40\xeb\x55\x6c\xff\xfe\x02\x44\x30\x04\xcb" > /dev/ttyAMA0
done < f.txt


