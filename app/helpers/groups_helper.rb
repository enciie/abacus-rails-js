module GroupsHelper

  def last_updated(group)
    group.updated_at.strftime("Last updated %A, %b %e, at %l:%M %p")
  end

end
