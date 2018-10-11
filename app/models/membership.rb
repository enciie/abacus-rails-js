class Membership < ApplicationRecord
  belongs_to :group, counter_cache: true
  belongs_to :user
end
