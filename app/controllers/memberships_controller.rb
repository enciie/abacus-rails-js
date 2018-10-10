class MembershipsController < ApplicationController

    def new
      @group = Group.find params[:group_id]
      @membership = Membership.new({group: group})
    end

    def create
      @group = Group.find params[:group_id]
      @membership = Membership.new(membership_params)
    end

    private

    def membership_params
        params.require(:membership).merge(group_id: params[:group_id], user_id: current_user.id)
    end
end
