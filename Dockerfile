
FROM ubuntu:bionic-20190204

WORKDIR /home/jb/DRA

COPY ./requirements.txt ./

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

RUN apt install -y build-essential libssl-dev libffi-dev \
    python3-dev default-libmysqlclient-dev python3-pip python3-venv -y 

RUN pip3 install -r requirements.txt --ignore-installed

EXPOSE 8001

CMD ["python3" ,"manage.py", "runserver", "0.0.0.0:8001"]

#START BY
#docker run -it -p 8000:8001 -v $(pwd):/home/jb/DRA  canburaks/backend
