require 'securerandom'

class CompanyController < ApplicationController
  def index
    @data = Company.all()
    render json: @data
  end

  def category
    @category_id = params[:id]
    data = []
    companies = Categorymap.where("category_id = ?", @category_id)
    for company in companies
      company_row = Company.find(company.company_id)
      data.push({
        company: company_row,
        rate: getRate(company.company_id),
        logo: get_logo(company_row.logo_id)
      })
    end
    @data = {
      companies: data,
      category: Category.find(@category_id)
    }
    render json: @data
  end

  def search
    @key = params[:key]
    data = []
    companies = Company.where("name LIKE ?", '%' + @key + '%')
    for company in companies
      data.push({
        company: company,
        rate: getRate(company.id),
        logo: get_logo(company.logo_id)
      })
    end
    @data = {
      companies: data,
      category: {
        name: "Search results for \"" + @key + "\"",
        description: ''
      }
    }
    render json: @data
  end

  def suggest
    @key = params[:key]
    @data = Company.where("name LIKE ?", '%' + @key + '%').select('id', 'name').limit(5)
    if @key == ''
      @data = []
    end
    
    render json: @data
  end

  def get_logo(id)
    logo = Attachment.where('id = ?', id)
    if logo.size() > 0
      logo = logo[0]
    else
      logo = nil
    end

    return logo
  end
    
  def show
    @company_id = params[:id]
    @data = {
      company: Company.find(@company_id),
      reviews: [],
      categories: [],
      rate: getRate(@company_id)
    }

    @reviews = Review.where("company_id = ?", @company_id).to_a
    for review in @reviews
      @row = {
        data: review,
        elections: Election.where("review_id = ?", review.id),
        attachment: Attachment.where('id = ?', review.attachment_id).first()
      }
      @data[:reviews].push(@row)  
    end

    categories = Categorymap.where('company_id = ?', @company_id)
    for category in categories
      @data[:categories].push(Category.find(category.category_id))
    end

    logo = get_logo(@data[:company].logo_id)
    @data[:logo] = logo
    banner = Attachment.where('id = ?', @data[:company].banner_id)
    if banner.size() > 0
      banner = banner[0]
    else
      banner = nil
    end
    @data[:banner] = banner

    # Get the server time
    @data[:server_time] = Time.now.strftime("%Y-%m-%dT%H:%M:%S")

    render json: @data
  end

  def create
    data = params[:company]
    category_id = params[:category_id]
    company = Company.create!(
      name: data['name'],
      description: data['description'],
      year_found: data['year_found'],
      headquarter: data['headquarter'],
      size: data['size'],
      site: data['site'],
      email: data['email'],
      phone: data['phone'],
      services: data['services']
    )
    
    Categorymap.create!(
      category_id: category_id,
      company_id: company.id
    )

    render json: {message: 'success'}
  end

  def update
    id = params[:id]
    data = params[:company]
    company = Company.find(id)
    company.name = data['name']
    company.description = data['description']
    company.year_found = data['year_found']
    company.headquarter = data['headquarter']
    company.size = data['size']
    company.site = data['site']
    company.email = data['email']
    company.phone = data['phone']
    company.services = data['services']
    company.logo_id = data['logo_id']
    company.banner_id = data['banner_id']
    company.save()

    render json: {message: 'success'}
  end

  def updateCategories
    category_ids = params[:category_ids]
    company_id = params[:company_id]
    old_categories = Categorymap.where('company_id = ?', company_id)
    for old_category in old_categories
      old_category.delete()
    end

    for category_id in category_ids
      Categorymap.create!(
        category_id: category_id,
        company_id: company_id
      )
    end

    render json: {message: 'success'}
  end

  def getRate(company_id)
    reviews = Review.where("company_id = ? AND approved = ?", company_id, true)
    reviewCount = reviews.count
    if reviewCount == 0
      return {rate: 0, review_count: 0}
    end

    rateCount = Rate.count
    total = 0
    for review in reviews
      sum = Election.where("review_id = ?", review.id).sum(:value)
      total += sum
    end
    rate = total / reviewCount.to_f / rateCount * 2;

    approvedCount = Review.where("company_id = ? and approved = ?", company_id, true).count

    return {rate: rate, review_count: approvedCount}
  end

  def hot
    id = params[:id]
    is_hot = params[:is_hot]
    company = Company.find(id)
    company.is_hot = is_hot
    company.save()

    render json: {message: 'success'}
  end

  def delete
    id = params[:id]
    company = Company.find(id)
    company.delete()
    
    categories = Categorymap.where("company_id = ?", company.id)
    for category in categories
      category.delete()
    end

    render json: {message: 'success'}
  end

  def upload_file(file)
    param_file = file
    if param_file == "" || param_file == nil
        return {"id": 0}
    end

    file = param_file.read
    file_name = param_file.original_filename
    file_type = file_name.split('.').last
    new_name_file = SecureRandom.hex
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

    return attachment
  end

  def upload
      logo_file = params[:logo]
      banner_file = params[:banner]
      logo = upload_file(logo_file)
      banner = upload_file(banner_file)

      data = {
        "logo": logo,
        "banner": banner
      }

      render json: data
  end

end
