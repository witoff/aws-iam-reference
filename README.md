AWS Servicemap
==============

A simple means of extracting the AWS IAM Service Map, which includes all services and actions from the IAM Policy Generator.  This is used in the [Atom IAM Syntax Highlighter](github.com/witoff/atom-iam-syntax) and is useful for additional AWS validation and monitoring.  You can use this JSON servicemap like:

<img alt="Screenshot" src="https://raw.githubusercontent.com/witoff/aws-servicemap/master/screenshot.png" width="400">

### Usage

Update The Servicemap:
```bash
bundle install
bundle exec generate-servicemap.rb
```

Query the Servicemap:
```bash
# Locally
jq .AWSXRay servicemap.json
# Remotely
curl -s https://raw.githubusercontent.com/witoff/aws-servicemap/master/servicemap.json | jq .AWSXRay
```
