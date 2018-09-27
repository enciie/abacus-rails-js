class CreateExpenses < ActiveRecord::Migration[5.2]
  def change
    create_table :expenses do |t|

      t.timestamps
    end
  end
end
