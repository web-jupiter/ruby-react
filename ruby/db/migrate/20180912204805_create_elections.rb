class CreateElections < ActiveRecord::Migration[5.1]
  def change
    create_table :elections do |t|
      t.belongs_to :rate
      t.belongs_to :review
      t.integer :value

      t.timestamps
    end
  end
end
