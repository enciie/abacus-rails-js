class User < ApplicationRecord
  has_many :groups
  has_many :expenses, :through => :groups
  has_many :categories, :through => :expenses

  has_secure_password

end
