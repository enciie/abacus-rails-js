class PopulateGroupMembersCount < ActiveRecord::Migration[5.2]
  def up
    Group.find_each do |group|
      Group.reset_counters(group.id, :memberships)
   end
 end
end
