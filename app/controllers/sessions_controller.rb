class SessionsController < ApplicationController

  def new
  end

  def create
    #login with OmniAuth path
    if auth
      @user = User.find_or_create_by(uid: auth['uid']) do |u|
        u.username = auth['info']['nickname']
        u.email = auth['info']['email']
        u.password = SecureRandom.hex
      end

      session[:user_id] = @user.id #set a cookie on the user's browser by writing user.id into the session hash
      redirect_to user_path(@user)

    else
      #normal login with username/password
      @user = User.find_by(:username => params[:session][:username])
      #If user exists AND password is correct
      if @user && @user.authenticate(params[:session][:password])
        session[:user_id] = @user.id
        redirect_to user_path(@user)
      else
        # Sends user back to the login/signup root page
        flash[:error] = "Please enter correct username and password, or sign up"
        redirect_to root_path
      end
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
    flash[:notice] = "Successfully Logged out!"
  end

  private

  def auth
    request.env['omniauth.auth']
  end

end
