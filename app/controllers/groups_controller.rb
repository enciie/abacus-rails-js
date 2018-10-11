class GroupsController < ApplicationController
  before_action :authenticate_user #Rails runs a check before any controller action
  before_action :set_group, only: [:show, :edit, :update, :destroy]

  def index
    @groups = Group.all
  end

  def new
    @group = Group.new
  end

  def show
    # @group = Group.find_by(id: params[:id])
  end

  def create
    @group = Group.new(group_params)
    if @group.valid?
      @group.save
      @membership = current_user.memberships.build(:group_id => @group.id)
      if @membership.valid?
        @membership.save
      end
      flash[:notice] = "Successfully Created A Group"
      redirect_to current_user
    else
      flash[:error] = "Group Name Can't Be Blank"
      render 'new'
    end
  end

  def update
    if @group.update(group_params)
      flash[:notice] = "Successfully Updated Group"
      redirect_to group_expenses_path(@group)
    else
      flash[:error] = "Group name can't be blank"
      render 'edit'
    end
  end

  def edit
    if @group.nil?
      redirect_to groups_path
      flash[:error] = "Group Not Found"
    end
  end

  def destroy
    @group.destroy
    flash[:notice] = "Successfully Deleted Group"
    redirect_to current_user
  end

  private

  def set_group
    @group = Group.find_by(id: params[:id])
  end

#strong params
  def group_params
    params.require(:group).permit(:name, :status)
  end
  #params that get passed mist conatin a key called group

end
