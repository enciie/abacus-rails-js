class Group < ApplicationRecord
  belongs_to :user
  has_many :expenses
  validates :name, presence: true, uniqueness: true

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

  scope :recent, -> {order('groups.updated_at DESC')}
  scope :active_groups, -> {where(:status => 0)}
  scope :inactive_groups, -> {where(:status => 1)}

end
