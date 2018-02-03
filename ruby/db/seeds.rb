# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all

User.create!(
    email: 'hello@werate.co',
    password: '123456'
)

10.times do |index|
    User.create!(
        email: Faker::Internet.email,
        password: '123456'
    )
end

p "Created #{User.count} users"


Category.destroy_all

12.times do |index|
    Category.create!(
        name: Faker::Commerce.product_name,
        description: Faker::Lorem.paragraph(rand(1..3))
    )
end

p "Created #{Category.count} categories"


Company.destroy_all
Categorymap.destroy_all

categories = Category.all()

50.times do |index|
    low = rand(1..50)
    company = Company.create!(
        name: Faker::Company.name,
        description: Faker::Lorem.paragraph(rand(3..20)),
        year_found: rand(1900..2018),
        headquarter: Faker::Address.city,
        size: low.to_s + "-" + rand(low..100).to_s,
        site: Faker::Internet.domain_name,
        email: Faker::Internet.email,
        phone: Faker::PhoneNumber.phone_number,
        services: Faker::Lorem.word() + ", " + Faker::Lorem.word() + ", " + Faker::Lorem.word(),
        is_hot: rand(0..10) == 0 ? true : false
    )
    
    count = rand(0..10)
    if count == 0
        next
    end
    count.times do |index|
        category_id = rand(0..1) == 0 ? categories[rand(0..(Category.count - 1))].id : categories[0].id
        if Categorymap.where('category_id = ? AND company_id = ?', category_id, company.id).count > 0
            next
        end
        Categorymap.create!(
            category_id: category_id,
            company_id: company.id
        )
    end
end

p "Created #{Company.count} companies"
p "Created #{Categorymap.count} category maps"


Rate.destroy_all

Rate.create!(name: '服務質素')
Rate.create!(name: '服務速度')
Rate.create!(name: '服務態度')
Rate.create!(name: '職員知識')
Rate.create!(name: '價格')

p "Created #{Rate.count} rates"


Review.destroy_all
Election.destroy_all

companies = Company.all()
rates = Rate.all()

for company in companies
    random = rand(0..10)
    if random == 0
        next
    end

    random.times do |index|
        review = Review.create!(
            user_name: Faker::Name.name,
            is_anonymous: rand(0..2) == 2 ? true : false,
            title: Faker::Lorem.word,
            service_details: Faker::Lorem.word,
            company_id: company.id,
            description: Faker::Lorem.paragraph(rand(10..25)),
            user_email: Faker::Internet.email,
            approved: rand(0..5) == 0 ? false : true,
            verified: false,
            created_at: Faker::Date.backward(1000)
        )
        
        for rate in rates
            Election.create!(
                value: rand(1..5),
                rate_id: rate.id,
                review_id: review.id,
                created_at: review.created_at
            )
        end
    end
end

p "Created #{Review.count} reviews"
p "Created #{Election.count} elections"