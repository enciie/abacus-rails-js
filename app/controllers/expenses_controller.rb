class ExpensesController < ApplicationController
  before_action :authenticate_user
  before_action :set_group, except: [:show]
  before_action :set_expenses, only: [:update, :destroy]
  helper_method :sort_column, :sort_direction, :total

  def index
    # @group = current_user.groups.find_by(id: params[:group_id])
    if @group.nil?
      redirect_to groups_path
      flash[:error] = "You do not have permission to view the Group"
    else
      @expenses = @group.expenses.order("#{sort_column} #{sort_direction}")
    end
  end

  def new
    # @group = current_user.groups.find_by(id: params[:group_id])
    if @group
      @expense = @group.expenses.new
    else
      redirect_to groups_path
    end
  end

  def create
    # @group = current_user.groups.find_by(id: params[:group_id])
    @expense = @group.expenses.new(expense_params)
    @expense.user_id = current_user.id
    if @expense.save
      flash[:notice] = "Successfully Created An Expense"
      redirect_to group_expenses_path(@group) #Group/expense show page
    else
      render 'new'
    end
  end

  def edit
    # @group = current_user.groups.find_by(id: params[:group_id])
    if @group.nil?
      redirect_to group_expenses_path, alert: "Group Not Found"
    else
      @expense = @group.expenses.find_by(id: params[:id])
      redirect_to group_expenses_path, alert: "Expense Not Found" if @expense.nil?
      @categories = Category.all.map{|c| [ c.name, c.id ] }
    end
  end

  def update
    # @group = current_user.groups.find_by(id: params[:group_id])
    # @expense = @group.expenses.find_by(id: params[:id])
    @expense.update(expense_params)
    if @expense.save
      flash[:notice] = "Successfully Updated The Expense"
      redirect_to group_expenses_path(@group)
    else
      render 'edit'
    end
  end

  def destroy
    # @group = current_user.groups.find_by(id: params[:group_id])
    # @expense = @group.expenses.find_by(id: params[:id])
    if @expense.delete
      flash[:notice] = "Successfully Deleted The Expense"
      redirect_to group_expenses_path(@group)
    end
  end

  private

  def set_group
    @group = current_user.groups.find_by(id: params[:group_id])
  end

  def set_expenses
    @expense = @group.expenses.find_by(id: params[:id])
  end

  def expense_params
    params.require(:expense).permit(:description, :amount, :group_id, :user_id, :category_name)
  end

  def sortable_columns
    ["description", "amount", "created_at", "category_name"]
  end

  def sort_column
    sortable_columns.include?(params[:column]) ? params[:column] : "description"
  end

  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
  end

end
