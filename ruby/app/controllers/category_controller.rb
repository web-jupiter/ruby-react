class CategoryController < ApplicationController
  def index
    @data = Category.all()
    render json: @data
  end

  def create
    name = params[:name]
    description = params[:description]
    Category.create!(
      name: name,
      description: description
    )

    render json: {message: 'success'}
  end

  def delete
    id = params[:id]

    category_maps = Categorymap.where("category_id = ?", id)
    for category_map in category_maps
      category_map.delete()
    end

    companies = Company.all()
    for company in companies
      category_maps = Categorymap.where("company_id = ?", company.id)
      if category_maps.count() == 0
        company.delete()
      end
    end

    category = Category.find(id)
    category.delete()

    render json: {message: 'success'}
  end

  def update
    id = params[:id]
    name = params[:name]
    description = params[:description]
    category = Category.find(id)
    category.name = name
    category.description = description
    category.save()

    render json: {message: 'success'}
  end
end
