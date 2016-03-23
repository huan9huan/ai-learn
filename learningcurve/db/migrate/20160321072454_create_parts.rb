class CreateParts < ActiveRecord::Migration
  def change
    create_table :parts do |t|
      t.string :word
      t.integer :t
      t.string :desc
      t.string :attachments

      t.timestamps null: false
    end
  end
end
