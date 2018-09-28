class CategoriesController < ApplicationController

  def show
    @categories = Category.all
  end

end
