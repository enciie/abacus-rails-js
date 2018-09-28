class Expense < ApplicationRecord
  belongs_to :group
  belongs_to :user
  belongs_to :category, required: false

  validates :description, presence: true
  validates :amount,
            presence: true,
            numericality: true

  def category_name=(name)
    self.category = Category.find_or_create_by(name: name)
  end

  def category_name
    self.category ? self.category.name : nil
  end

end
