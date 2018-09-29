class Group < ApplicationRecord
  belongs_to :user
  has_many :expenses

  validates :name, presence: true, uniqueness: true

end
