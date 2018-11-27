class GroupSerializer < ActiveModel::Serializer
  attributes :id, :name, :status, :memberships_count
  has_many :users
  has_many :expenses, serializer: GroupExpenseSerializer
end
