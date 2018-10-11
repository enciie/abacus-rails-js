class AddMembershipsCountToGroups < ActiveRecord::Migration[5.2]
  def change
    add_column :groups, :memberships_count, :integer
  end
end
