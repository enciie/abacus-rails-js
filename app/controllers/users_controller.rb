class UsersController < ApplicationController
  before_action :authenticate_user, only: [:show]

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.valid?
      @user.username = @user.username
      @user.save
      flash[:notice] = "Successfully Created An Account"
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      render 'new' #show the sign up form
    end
  end

  def show
    @user = User.find_by(id: params[:id])
    if @user && @user == current_user
      @groups = @user.groups
      # @group for create new group form
      @group = Group.new
      respond_to do |format|
        format.html {render :show}
        format.json {render json: @user, status: 200}
      end
    else
      redirect_to root_path
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end

end
