class Category < ApplicationRecord
  has_many :expenses

  # Active Record Validation
  validates :name, presence: true, uniqueness: true

end
