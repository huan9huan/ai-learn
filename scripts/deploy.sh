#!/bin/bash
server=l2

pushd .
cd `dirname $0`
echo "scp nginx conf to l2 ..."
scp ./j.deepword.conf ${server}:/etc/nginx/conf.d/
echo "reload the nginx..."
ssh ${server} "/etc/init.d/nginx reload"
echo "done!"
popd