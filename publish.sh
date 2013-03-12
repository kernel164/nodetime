TAG=$1
MSG=$2

echo $TAG
echo $MSG

git add .
git commit -am "$MSG"
#git tag -a "$TAG" -m "$MSG"
#git push origin master
#git push origin $TAG
#npm publish