class AddMd5ToPart < ActiveRecord::Migration
  def change
    add_column :parts, :md5, :string
  end
end
