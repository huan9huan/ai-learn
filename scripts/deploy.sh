#!/bin/bash
server=l2

pushd .
cd `dirname $0`
echo "scp nginx conf to l2 ..."
scp ./jupyter_notebook_config.py ${server}:~/
scp ./j.deepword.co.password ${server}:/etc/nginx/conf.d/
scp ./j.deepword.conf ${server}:/etc/nginx/conf.d/
echo "reload the nginx..."
ssh ${server} "/etc/init.d/nginx reload"
echo "done!"
popd