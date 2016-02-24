pid=`ps aux |grep bin/api |grep node|awk '//{print $2}'`
if [ "$pid" == "" ] 
then
 echo "not found old api server"
else
 echo "found old server, will kill it ,pid = ${pid}"
 kill -9 ${pid}
fi
cd api
node ./bin/api >> ../api.log & 2>&1
echo "start done"
