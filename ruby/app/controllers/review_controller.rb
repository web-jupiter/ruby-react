require 'rubygems'
require 'json'
require 'gmail'

class ReviewController < ApplicationController
    
    def submit
        company_id = params[:company_id]
        stars = params[:stars]
        data = params[:review]
        if company_id.to_i != 0
            review = Review.create!(
                company_id: company_id,
                attachment_id: data['attachment_id'],
                user_name: data['user_name'],
                title: data['title'],
                service_details: data['service_details'],
                description: data['description'],
                user_email: data['user_email'],
                approved: false,
                verified: data['verified']
            )

            stars.each do |key, value|
                Election.create!(
                    review_id: review.id,
                    rate_id: key,
                    value: value
                )
            end

            # Message here
            company = Company.find(company_id)
            message = "<h3>" + review.title + "</h3>"
            message += "<hr />";
            message += "<p>";
            message += "<label><b>Company:</b></label>"
            message += "<span>" + company.name + "</span>"
            message += "</p>";
            message += "<p>";
            message += "<label><b>User name:</b></label>"
            message += "<span>" + review.user_name + "</span>"
            message += "</p>";
            message += "<p>";
            message += "<label><b>Service details:</b></label>"
            message += "<span>" + review.service_details + "</span>"
            message += "</p>";
            message += "<p>";
            message += "<label><b>User email:</b></label>"
            message += "<span>" + review.user_email + "</span>"
            message += "</p>";
            message += "<label><b>Description:</b></label>"
            message += "<p>" + review.description + "</p>"
            
            Gmail.connect('weratehello@gmail.com', 'WErate123') do |gmail|
                email = gmail.compose do
                    to "weratehello@gmail.com"
                    subject "WeRate - New Review"
                    html_part do
                        content_type 'text/html; charset=UTF-8'
                        body message
                    end
                end
                email.deliver!
            end
        else
            review = Review.where('id = ?', data['id']).first()
            review.attachment_id = data['attachment_id']
            review.user_name = data['user_name']
            review.is_anonymous = data['is_anonymous']
            review.title = data['title']
            review.service_details = data['service_details']
            review.description = data['description']
            review.user_email = data['user_email']
            review.verified = data['verified']
            review.save()

            stars.each do |key, value|
                election = Election.where('rate_id = ? AND review_id = ?', key, data['id']).first()
                election.value = value
                election.save()
            end
            
            render json: data
            return
        end

        render json: {message: 'success'}
    end

    def delete
        id = params[:id]
        review = Review.find(id)
        review.delete()

        render json: {message: 'success'}
    end
    
    def show
        id = params[:id]
        review = Review.find(id)
        elections = Election.where('review_id = ?', review.id)
        rate_values = {}
        for election in elections
            rate_values[election.rate_id] = election.value
        end
        rates = Rate.all()
        attachment = Attachment.where('id = ?', review.attachment_id).first()

        render json: {review: review, rate_values: rate_values, rates: rates, attachment: attachment}
    end

    def approveDismiss
        id = params[:id]
        flag = params[:flag]
        review = Review.find(id)
        review.approved = flag
        review.save()

        render json: review
    end

    def upload
        param_file = params[:file]
        if param_file == ""
            render json: {id: 0}
            return
        end

        file = param_file.read
        file_name = param_file.original_filename
        file_type = file_name.split('.').last
        new_name_file = Time.now.to_i
        name_folder = new_name_file
        new_file_name_with_type = "#{new_name_file}." + file_type
        folder_root = 'upload/';
        link_path = 'upload/' + new_file_name_with_type;
        file_path = 'public/' + link_path;

        File.open(file_path, "wb")  do |f|  
            f.write(file) 
        end

        attachment = Attachment::create!(
            file_name: file_name,
            path: link_path
        )

        render json: attachment
    end
end
