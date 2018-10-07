AWS Servicemap
==============

A simple means of extracting the AWS IAM Service Map, which includes all services and actions from the IAM [Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html).  This is used in the [Atom IAM Syntax Highlighter](github.com/witoff/atom-iam-syntax) and is useful for additional AWS validation and monitoring.  You can use this JSON servicemap like:

<img alt="Screenshot" src="https://raw.githubusercontent.com/witoff/aws-servicemap/master/screenshot.png" width="400">

## Usage

**Update The Servicemap:**
```bash
go run main.go
```

**Querying:**
```bash
# Optionally Download Map Directly
curl -sO https://raw.githubusercontent.com/witoff/aws-servicemap/master/servicemap.json

# Query for a key
jq '.["AWS Config"]' servicemap.json
# {
#   "StringPrefix": "config",
#   "Actions": [
#     "DeleteConfigRule",
#     ...
#   ]
# }

# Get a list of available keys
jq keys servicemap.json
# [
#   "AWS Application Discovery Service",
#   "AWS Billing",
#   "AWS Budgets",
#   .....
# ]

# Get actions for a single key
jq '.["AWS WAF"].Actions' servicemap.json
# [
#   "CreateByteMatchSet",
#   "CreateIPSet",
#   "CreateRule",
#   ...
# ]

```
