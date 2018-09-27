class GroupsController < ApplicationController
  before_action :authenticate_user

  def index
    @groups = Group.all
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_params)
    @group.user_id = session[:user_id]
    if @group.save
      redirect_to group_path(@group)
    else
      render 'new'
    end
  end

  def show
    @group = Group.find(params[:id])
  end

  def update
  end

  def edit
  end

  def destroy
  end

  private

  def group_params
    params.require(:group).permit(:name, :user_id)
  end

end
