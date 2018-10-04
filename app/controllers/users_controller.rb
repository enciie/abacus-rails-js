class UsersController < ApplicationController
  before_action :authenticate_user

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      flash[:notice] = "Successfully Created An Account"
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      render 'new' #show the sign up form
    end
  end

  def show
    if logged_in?
      @user = User.find_by(id: params[:id])
      if @user != current_user
        redirect_to user_path(current_user)
      end
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end

end
