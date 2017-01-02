#!/usr/bin/env ruby
require 'json'
require 'faraday'

def get_servicemap
  download = Faraday.get 'https://awsiamconsole.s3.amazonaws.com/iam/assets/js/bundles/policies.js'
  File.write './policies.js', download.body
end

def parse_servicemap
  policies = File.read('./policies.js')
  # Extract the ServiceMap
  index = policies.index('serviceMap:') + 'serviceMap:'.length
  chars = policies[index..-1].split ''
  # Pull the following object
  obj = []
  lb=rb=0
  chars.each do |c|
    lb += 1 if c== '{'
    rb += 1 if c== '}'
    obj.push c
    break if lb>0 and lb==rb
  end
  # Turn Javascript Object into JSON (FML -- can't aws just give us the JSON?)
  servicemap = obj.join.gsub(/\s/, '')
  # Cleanup Exceptions
  servicemap.gsub!(/HasResource:\!([0-9]+)/, 'HasResource:"!\1"')
  servicemap.gsub!(/ARNRegex:("[^"]*")/, 'ARNRegex:"REMOVED"')
  # turn objects into strings e.g. test:[] => "test":[]
  servicemap.gsub!(/([a-zA-Z0-9_]+):([\[{0-9"])/, '"\1":\2')
  # verify that our json is correct
  JSON.load(servicemap)
  File.write('servicemap.json', servicemap)
end


get_servicemap
parse_servicemap
