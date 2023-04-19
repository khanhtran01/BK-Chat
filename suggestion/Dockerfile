FROM python:3.10

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP index.py

ENV FLASK_DEBUG 1

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]