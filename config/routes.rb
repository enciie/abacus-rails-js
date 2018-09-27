Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'application#home'
  get '/signup' => 'users#new'

  resources :users, only: [:create, :show, :edit, :update]

end
