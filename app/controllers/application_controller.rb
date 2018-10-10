class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?, :last_updated, :group_count

  def home
    if logged_in?
      redirect_to user_path(current_user)
    end
  end

  private

  def last_updated(group)
    if group.expenses.empty?
      group.updated_at.strftime("Last updated %A, %b %e, at %l:%M %p")
    else
      group.expenses.last.updated_at.strftime("Last updated %A, %b %e, at %l:%M %p")
    end
  end

  # def group_count
  #   current_user.groups.count
  # end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def logged_in?
    !!current_user
  end

  def authenticate_user
    if !logged_in?
      redirect_to root_path
    end
  end
  # methods you build in controller do not permeate to your ActionView
  # you have to explicitly tell it by calling it a helper method


end
