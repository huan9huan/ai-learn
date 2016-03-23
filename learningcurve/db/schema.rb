# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20160321142859) do

  create_table "impressions", force: :cascade do |t|
    t.integer  "part_id",    limit: 4
    t.integer  "t",          limit: 4
    t.string   "score",      limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "word",       limit: 255
  end

  create_table "parts", force: :cascade do |t|
    t.string   "word",        limit: 255
    t.integer  "t",           limit: 4
    t.string   "desc",        limit: 255
    t.string   "attachments", limit: 255
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.string   "md5",         limit: 255
  end

  create_table "quiz_lets", force: :cascade do |t|
    t.integer  "thread_id",  limit: 4
    t.integer  "t",          limit: 4
    t.string   "desc",       limit: 255
    t.string   "expected",   limit: 255
    t.integer  "status",     limit: 4
    t.integer  "score",      limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

end
