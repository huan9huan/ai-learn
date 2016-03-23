class AddWordToImpression < ActiveRecord::Migration
  def change
    add_column :impressions, :word, :string
  end
end
