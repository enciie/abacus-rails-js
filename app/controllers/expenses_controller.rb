class ExpensesController < ApplicationController
  before_action :authenticate_user

  def new
    @group = Group.find_by(id: params[:group_id])
    @expense = Expense.new
  end

  def create
    @group = Group.find_by(id: params[:group_id])
    @expense = @group.expenses.new(expense_params)
    @expense.user_id = current_user.id
    if @expense.save
      redirect_to @group #Group show page
    else
      render 'new'
    end
  end

  def show
    @group = Group.find_by(id: params[:group_id])
    @expense = Expense.find(params[:id])
  end

  def edit
    @group = Group.find_by(id: params[:group_id])
    @expense = Expense.find(params[:id])
  end

  def update
    @group = Group.find_by(id: params[:group_id])
    @expense = Expense.find(params[:id])
    if @expense.update(expense_params)
      @expense.save
      redirect_to @group
    else
      render 'edit'
    end
  end

  def destroy
    @group = Group.find_by(id: params[:group_id])
  end

  private

  def expense_params
    params.require(:expense).permit(:description, :amount, :group_id, :user_id)
  end

end
