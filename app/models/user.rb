class User < ApplicationRecord
  has_many :memberships
  has_many :groups, :through => :memberships

  has_many :expenses, :through => :groups
  has_many :categories, :through => :expenses

  has_secure_password

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true,
                    format: { with: /\A[A-Za-z0-9._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]+\Z/ }
  validates :password, presence: true

end
