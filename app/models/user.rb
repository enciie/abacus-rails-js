class User < ApplicationRecord
  has_many :memberships
  has_many :groups, :through => :memberships

  has_many :expenses, :through => :groups
  has_many :categories, :through => :expenses

  has_secure_password

  # Active Record Validations
  # Verify that fields are not blank and that it doesn't already exist in the db (prevents duplicates):
  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true,
                    format: { with: /\A[A-Za-z0-9._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]+\Z/ }
  validates :password, presence: true

end
