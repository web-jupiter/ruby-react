# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180918164315) do

  create_table "attachments", force: :cascade do |t|
    t.string "file_name"
    t.string "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "categorymaps", force: :cascade do |t|
    t.integer "category_id"
    t.integer "company_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_categorymaps_on_category_id"
    t.index ["company_id"], name: "index_categorymaps_on_company_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "year_found"
    t.string "headquarter"
    t.string "size"
    t.string "site"
    t.string "email"
    t.string "phone"
    t.text "services"
    t.boolean "is_hot"
    t.integer "logo_id", default: 0
    t.integer "banner_id", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "elections", force: :cascade do |t|
    t.integer "rate_id"
    t.integer "review_id"
    t.integer "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["rate_id"], name: "index_elections_on_rate_id"
    t.index ["review_id"], name: "index_elections_on_review_id"
  end

  create_table "rates", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "company_id"
    t.integer "attachment_id"
    t.string "user_name"
    t.boolean "is_anonymous", default: false
    t.string "title"
    t.string "service_details"
    t.text "description"
    t.string "user_email"
    t.boolean "approved", default: false
    t.boolean "verified", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["attachment_id"], name: "index_reviews_on_attachment_id"
    t.index ["company_id"], name: "index_reviews_on_company_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
