import calendar
import json
import random
import string
import sys
import time
import urllib2
from threading import Thread

def get_random_id():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

random.seed(time.time())

def post(req, data):
    response = urllib2.urlopen(req, json.dumps(data))
    print(response.getcode(), response.geturl()), sys.stdout.flush()

while True:
    req_type = random.randint(0, 1)
    cur_time = calendar.timegm(time.gmtime())
    data = {
        'user_id': get_random_id(), # To be changed
        'table_id': get_random_id(), # To be changed
        'type': ('b' if req_type == 0 else 'o'),
        'cur_time': cur_time
    }
    if req_type == 0:
        start = random.randint(cur_time, cur_time + 2592000) / 1800 * 1800
        data['start_time'] = start
        data['end_time'] = start + random.randint(1, 4) * 1800

    print(data), sys.stdout.flush()

    req = urllib2.Request('http://utoptutor.com:4000')
    req.add_header('Content-Type', 'application/json')
    
    Thread(target=post, args=(req, data)).start()

    time.sleep(0.01)

