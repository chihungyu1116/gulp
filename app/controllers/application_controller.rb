class ApplicationController < ActionController::Base
  protect_from_forgery
  # include PostsController::PostsHelper
  helper :all
end
