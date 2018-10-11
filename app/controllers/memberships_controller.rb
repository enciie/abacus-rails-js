class MembershipsController < ApplicationController
  before_action :authenticate_user

  def new
    @group = Group.find_by(params[:id])
    @membership = Membership.new({group: @group.id})
  end

  def create
    @group = Group.find(params[:id])
    @membership = current_user.memberships.build(:group_id => params[:id])
    if @membership.valid?
      @membership.save
      flash[:notice] = "You have joined this group."
      redirect_to group_path(@group)
    else
      flash[:error] = "Unable to join."
      redirect_to group_path(@group)
    end
  end

  private

  def membership_params
      params.require(:membership).merge(group_id: params[:group_id], user_id: current_user.id)
  end

end
