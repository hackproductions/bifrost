import uuid
import boto3
import os
import json
from botocore.config import Config
import jwt

BUCKET = os.getenv("S3_BUCKET")

def lambda_handler(event, context):
    # Get the service client.
    s3 = boto3.client('s3', region_name='eu-west-1', config = Config(signature_version = 's3v4', s3={'addressing_style': 'virtual'}))

    # Generate a random S3 key name
    try:
        result = jwt.decode(event["queryStringParameters"]['token'], os.getenv("UPLOAD_SECRET"), algorithms=['HS256'])

        upload_key = uuid.uuid4().hex

        # Generate the presigned URL for put requests
        presigned_url = s3.generate_presigned_post(
            Bucket=BUCKET,
            Key=result.get('user') + '/' + upload_key
        )

        # Return the presigned URL
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            "body": json.dumps(presigned_url, indent=4),
        }
    except Exception as e:
        print(e)
        # Signature has expired
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            "body": json.dumps({'error': '"Failed to validate token."'}, indent=4)
        }