class GroupExpenseSerializer < ActiveModel::Serializer
  attributes :id, :description, :amount, :created_at, :category
end
