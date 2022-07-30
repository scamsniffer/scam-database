while true
do
    node generate.js
    git pull
    git add .
    git commit -m "update"
    git push
    sleep 600
done
