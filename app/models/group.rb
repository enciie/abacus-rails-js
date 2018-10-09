class Group < ApplicationRecord
  belongs_to :user
  has_many :expenses, :dependent => :delete_all
  validates :name, presence: true

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

  scope :recent, -> {order('groups.updated_at DESC')}
  scope :active_groups, -> {where(:status => 0)}
  scope :inactive_groups, -> {where(:status => 1)}

end
