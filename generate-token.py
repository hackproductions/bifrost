import jwt
import os
import datetime

jwt_payload = jwt.encode({
    'user': 'Will Russell#1024',
    'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=240),
}, 'secret')

print("Upload Token: " + jwt_payload.decode('utf-8'))
