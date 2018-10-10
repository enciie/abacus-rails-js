class Expense < ApplicationRecord
  belongs_to :group
  belongs_to :user
  belongs_to :category

# Active Record Validations
  validates :description, :category_name, presence: true
  validates :amount,
            presence: true,
            numericality: { greater_than: 0 }

#custom setter & getter
#setter method is called whenever an Expense is initialized with a category_name field
  def category_name=(name)
    self.category = Category.find_or_create_by(name: name)
  end

  def category_name
    self.category ? self.category.name : nil
  end

end
