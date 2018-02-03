require 'rubygems'
require 'json'
require 'gmail'

class WelcomeController < ApplicationController
  def index
  end

  def test
  end

  def contact
    # Message here
    message = "<h3>" + params[:title] + "</h3>"
    message += "<label style='font-weight: bold'>Name: </label>"
    message += " <span>" + params[:name] + "</span><br />"
    message += "<label style='font-weight: bold'>Message: </label>"
    message += "<p>" + params[:message] + "</p>"
    
    Gmail.connect('weratehello@gmail.com', 'WErate123') do |gmail|
        email = gmail.compose do
            to "weratehello@gmail.com"
            subject "WeRate - Contact Us"
            html_part do
                content_type 'text/html; charset=UTF-8'
                body message
            end
        end
        email.deliver!
    end
  end
end
