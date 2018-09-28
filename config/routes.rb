Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'application#home'
  #new user sign up page
  get '/signup' => 'users#new'

  #Routes for user login form, logging user in, and logging user out
  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'

  resources :users, only: [:create, :show, :edit, :update]
  resources :groups, except: [:show]  do
    resources :expenses, except: [:show]
  end
end
