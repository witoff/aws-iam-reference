require 'thor'
require 'json'
require 'pry'

class AwsServicemap < Thor
  SERVICE_MAP_FILE="#{File.dirname(__FILE__)}/servicemap.json".freeze

  desc 'list-services', 'List all aws services'
  def list_services
    verify_service_map
    puts services.keys
  end

  desc 'list-actions', 'List all the actions for an AWS service'
  def list_actions(service)
    s = services.detect { |k, v| k == service }

    if s.nil?
      puts "Couldn't find a service matching that name"
      exit 1
    end

    service_hash = s[1]
    service_hash['Actions'].each do |a|
      puts "#{service_hash['StringPrefix']}:#{a}"
    end
  end

  desc 'find-actions', 'Try to find a service and list actions for it'
  def find_actions(service)
    found_services = services.keys.select { |s| s.downcase.include? service.downcase }

    if found_services.count.zero?
      puts "Couldn't find any services matching that name. Use `list-services` to see all services."
    elsif found_services.count == 1
      puts "Found service!"
      list_actions(found_services.first)
    else
      puts "Found multiple services matching that name:"
      puts found_services
    end
  end

  private

  def verify_service_map
    unless File.exists?(SERVICE_MAP_FILE)
      puts "File cannot be found. Please run `node generate.js` to generate the AWS service map"
      exit 1
    end
  end

  def services
    JSON.parse(File.read(SERVICE_MAP_FILE))
  end
end

AwsServicemap.start(ARGV)
