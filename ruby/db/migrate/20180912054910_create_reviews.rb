class CreateReviews < ActiveRecord::Migration[5.1]
  def change
    create_table :reviews do |t|
      t.belongs_to :company
      t.belongs_to :attachment
      t.string :user_name
      t.boolean :is_anonymous, :default => false
      t.string :title
      t.string :service_details
      t.text :description
      t.string :user_email
      t.boolean :approved, :default => false
      t.boolean :verified, :default => false

      t.timestamps
    end
  end
end
