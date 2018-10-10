Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET']
end

#telling the rails app to use a piece of middleware created by Omniauth for the github authentication strategy
