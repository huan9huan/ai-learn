class CreateImpressions < ActiveRecord::Migration
  def change
    create_table :impressions do |t|
      t.integer :part_id
      t.integer :t
      t.string :score

      t.timestamps null: false
    end
  end
end
