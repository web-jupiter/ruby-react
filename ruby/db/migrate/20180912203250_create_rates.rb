class CreateRates < ActiveRecord::Migration[5.1]
  def change
    create_table :rates do |t|
      t.string :name
      
      t.timestamps
    end
  end
end
