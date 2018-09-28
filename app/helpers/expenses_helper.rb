module ExpensesHelper

  def total(expenses)
    @total = []
    expenses.each do |expense|
      @total << expense.amount.to_f
    end
    @total.sum
  end

end
