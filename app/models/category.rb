class Category < ApplicationRecord
  has_many :expenses

  # Active Record Validation
  validates :name, presence: true, uniqueness: true

  before_validation :titleize_name

  private

    def titleize_name
      self.name = self.name.titleize
    end

end
