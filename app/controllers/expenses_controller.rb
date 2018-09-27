class ExpensesController < ApplicationController
  before_action :authenticate_user, only: [:index, :create, :edit, :upate, :destroy]

  def new
    @group = Group.find_by(id: params[:group_id])
    @expense = Expense.new
  end

  def create
    raise params.inspect
  end

end
