class ApplicationController < ActionController::Base
	protect_from_forgery
	helper :all

	def public_get_newest_post_number
		1
	end
end
