class CreateQuizLets < ActiveRecord::Migration
  def change
    create_table :quiz_lets do |t|
      t.integer :thread_id
      t.integer :t
      t.string :desc
      t.string :expected
      t.integer :status
      t.integer :score

      t.timestamps null: false
    end
  end
end
