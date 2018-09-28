class ExpensesController < ApplicationController
  before_action :authenticate_user

  def index
    if params[:group_id]
      @group = Group.find_by(id: params[:group_id])
      if @group.nil?
        redirect_to user_path(current_user)
      else
        @expenses = @group.expenses
      end
    end
  end

  def new
    if params[:group_id] && !Group.exists?(params[:group_id])
      redirect_to user_path(current_user)
    else
      @group = Group.find_by(id: params[:group_id])
      @expense = Expense.new(group_id: params[:group_id])
    end
  end

  def create
    @group = Group.find_by(id: params[:group_id])
    @expense = @group.expenses.new(expense_params)
    @expense.user_id = current_user.id
    if @expense.save
      redirect_to group_expenses_path(@group) #Group/expense show page
    else
      render 'new'
    end
  end

  def show
    if params[:group_id]
    @group = Group.find_by(id: params[:group_id])
    @expense = @group.expenses.find_by(id: params[:id])
    @expense.category_id = params[:expense][:category_id]
      if @expense.nil?
        redirect_to user_path(current_user)
      end
    else
      @expense = Expense.find(params[:id])
    end
  end

  def edit
    if params[:group_id]
      @group = Group.find_by(id: params[:group_id])
      if @group.nil?
        redirect_to user_path(current_user), alert: "Group Not Found"
      else
        @expense = @group.expenses.find_by(id: params[:id])
        redirect_to user_path(current_user), alert: "Expense Not Found" if @expense.nil?
      end
    else
      @expense = Expense.find(params[:id])
      @categories = Category.all.map{|c| [ c.name, c.id ] }
    end
  end

  def update
    @group = Group.find_by(id: params[:group_id])
    @expense = Expense.find(params[:id])
    @expense.category_name = params[:expense][:category_name]
    if @expense.update(expense_params)
      @expense.save
      redirect_to group_expenses_path(@group)
    else
      render 'edit'
    end
  end

  def destroy
    @group = Group.find_by(id: params[:group_id])
    @expense = Expense.find(params[:id])
    if @expense.delete
      redirect_to group_expenses_path(@group)
    end
  end

  private

  def expense_params
    params.require(:expense).permit(:description, :amount, :group_id, :user_id, :category_name)
  end

end
