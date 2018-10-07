package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const PolicyUrl = "https://awspolicygen.s3.amazonaws.com/js/policies.js"
const PolicyFilename = "reference.json"

func Check(err error) {
	if err != nil {
		panic(err)
	}
}

// Load the policymap, save to `reference.json` and print to stdout
func main() {
	// Download the policymap
	resp, err := http.Get(PolicyUrl)
	Check(err)

	contents, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	Check(err)

	// Parse it
	policyBytes := ParsePolicyJs(contents)
	prettyPolicy := BytesToPrettyJson(policyBytes)

	// Write and print to stdout
	ioutil.WriteFile(PolicyFilename, prettyPolicy, 0644)
	fmt.Printf("%s", prettyPolicy)
}

// Parses the raw .js file and returns a JSON byte string
func ParsePolicyJs(policy []byte) []byte {
	var separatorIndex int
	separator := []byte("{")[0]

	for i, v := range policy {
		if v == separator {
			separatorIndex = i
			break
		}
	}
	return policy[separatorIndex:]
}

// Turn JSON bytes into a pretty printed string
func BytesToPrettyJson(jsonBytes []byte) []byte {

	var jsonIface interface{}
	err := json.Unmarshal(jsonBytes, &jsonIface)
	Check(err)

	printedBytes, err := json.MarshalIndent(jsonIface, "", "  ")
	Check(err)
	return printedBytes
}
