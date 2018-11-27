class GroupsController < ApplicationController
  before_action :authenticate_user #Rails runs a check before any controller action
  before_action :set_group, only: [:show, :edit, :update, :destroy]

  def index
    @groups = Group.search(params[:term])
  end

  def most_popular
    @groups = if params[:term]
      Group.where('name LIKE ?', "%#{params[:term]}%")
    else
      Group.all
    end
  end

  def new
    @group = Group.new
    render :layout => false
  end

  def show
    # @group = Group.find_by(id: params[:id])
    respond_to do |format|
      format.html {render :show}
      format.json {render json: @group, status: 200}
    end

    if @group.nil?
      redirect_to groups_path
      flash[:error] = "Group Not Found"
    end

  end

  def create
    @group = current_user.groups.build(group_params)
    if @group.valid?
      @group.save
      @membership = current_user.memberships.build(:group_id => @group.id)
      if @membership.valid?
        @membership.save
      end
      flash[:notice] = "Successfully Created A Group"
      render json: @group

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
    # @group = Group.find_by(id: params[:id])
    if @group.nil?
      redirect_to groups_path
      flash[:error] = "Group Not Found"
    elsif
      !@group.users.ids.include?(current_user.id)
      redirect_to groups_path
      flash[:error] = "You do not have permission to edit this group"
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
    params.require(:group).permit(:name, :status, :term)
  end
  #params that get passed mist conatin a key called group

end
