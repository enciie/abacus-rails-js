class CreateExpenses < ActiveRecord::Migration[5.2]
  def change
    create_table :expenses do |t|
      t.string :description
      t.float :amount
      t.integer :user_id
      t.integer :group_id
      t.integer :category_id
      t.timestamps
    end
  end
end
