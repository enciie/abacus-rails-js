class Group < ApplicationRecord
  has_many :memberships, :dependent => :delete_all
  has_many :users, :through => :memberships

  has_many :expenses, :dependent => :delete_all
  has_many :categories, :through => :expenses

  # Active Record Validation
  validates :name, presence: true

  scope :recent, -> {order('groups.updated_at DESC')}
  scope :active_groups, -> {where(:status => 0)}
  scope :inactive_groups, -> {where(:status => 1)}

  STATUS = {
    :active => 0,
    :inactive => 1
  }

  def active?
    self.status == STATUS[:active]
  end

  def inactive?
    self.status == STATUS[:inactive]
  end

  def group_status
    self.active? ? "Active" : "Inactive"
  end

  def total_expenses
    self.expenses.sum(:amount)
  end

  def min_expense
    self.expenses.minimum(:amount)
  end

  def max_expense
    self.expenses.maximum(:amount)
  end

  def avg_expense
    self.expenses.average(:amount)
  end

end
