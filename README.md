AWS Servicemap
==============

A simple means of extracting the AWS IAM Service Map, which includes all services and actions from the IAM [Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html).  This is used in the [Atom IAM Syntax Highlighter](github.com/witoff/atom-iam-syntax) and is useful for additional AWS validation and monitoring.  You can use this JSON servicemap like:

<img alt="Screenshot" src="https://raw.githubusercontent.com/witoff/aws-servicemap/master/screenshot.png" width="400">

## Usage

**Update The Servicemap:**
```bash
node generate.js
```

**Query Locally:**
```bash
jq .AWSConfig servicemap.json
jq .AWSConfig servicemap.json
# {
#   "StringPrefix": "config",
#   "Actions": [
#     "DeleteConfigRule",
#     ...
#   ]
# }
```

**Query Remotely:**
```bash
curl -s https://raw.githubusercontent.com/witoff/aws-servicemap/master/servicemap.json | jq .AmazonRekognition
# {
#   "StringPrefix": "rekognition",
#   "Actions": [
#     "CreateCollection",
#     ...
#   ]
# }
```

**Use the CLI:**
```ruby
  ./cli.rb list-services
  ./cli.rb list-actions "Amazon RDS"
  ./cli.rb find-actions "rds"
```
