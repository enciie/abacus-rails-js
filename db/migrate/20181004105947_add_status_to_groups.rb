class AddStatusToGroups < ActiveRecord::Migration[5.2]
  def change
    add_column :groups, :status, :integer, :default => 0
  end
end
