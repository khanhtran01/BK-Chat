# the first you should install virtualenv by this command:

pip install virtualenv

# create venv

virtualenv venv

# run this command to access the virtualenv

cd ./suggestion

# Windows

./venv/Scripts/activate

# Mac

chmod +x ./venv/bin/activate
source ./venv/bin/activate

# run this command to install all dependencies

pip install -r requirements.txt

# to start server run this command

python index.py
