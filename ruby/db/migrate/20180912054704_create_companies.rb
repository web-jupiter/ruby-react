class CreateCompanies < ActiveRecord::Migration[5.1]
  def change
    create_table :companies do |t|
      t.string :name
      t.text :description
      t.integer :year_found
      t.string :headquarter
      t.string :size
      t.string :site
      t.string :email
      t.string :phone
      t.text :services
      t.boolean :is_hot
      t.integer :logo_id, :default => 0
      t.integer :banner_id, :default => 0
      
      t.timestamps
    end
  end
end
