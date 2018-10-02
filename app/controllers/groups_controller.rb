class GroupsController < ApplicationController
  before_action :authenticate_user
  before_action :set_group, only: [:show, :edit, :update, :destroy]

  def index
    @groups = current_user.groups
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_params)
    @group.user_id = session[:user_id]
    if @group.save
      flash[:notice] = "Successfully Created A Group"
      redirect_to groups_path
    else
      flash[:error] = "Group name can't be blank"
      render 'new'
    end
  end

  def update
    if @group.update(group_params)
      @group.save
      redirect_to group_expenses_path(@group)
    else
      render 'edit'
    end
  end

  def edit
  end

  def destroy
    @group.destroy
    redirect_to groups_path
  end

  private

  def set_group
    @group = Group.find(params[:id])
  end

  def group_params
    params.require(:group).permit(:name, :user_id)
  end

end
