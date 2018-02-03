class CreateAttachments < ActiveRecord::Migration[5.1]
  def change
    create_table :attachments do |t|
      t.string :file_name
      t.string :path

      t.timestamps
    end
  end
end
