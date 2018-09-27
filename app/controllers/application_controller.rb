class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def home
  end

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user
  # methods you build in controller do not permeate to your ActionView
  # you have to explicitly tell it by calling it a helper method

  def logged_in?
    !!current_user
  end

  def authenticate_user
    if !logged_in?
      redirect_to root_path
    end
  end


end
