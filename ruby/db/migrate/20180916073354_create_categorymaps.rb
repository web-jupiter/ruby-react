class CreateCategorymaps < ActiveRecord::Migration[5.1]
  def change
    create_table :categorymaps do |t|
      t.belongs_to :category
      t.belongs_to :company
      
      t.timestamps
    end
  end
end
