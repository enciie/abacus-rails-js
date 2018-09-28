class Expense < ApplicationRecord
  belongs_to :group
  belongs_to :user
  belongs_to :category, required: false

  validates :description, presence: true
  validates :amount,
            presence: true,
            numericality: true
      
end
