class PublicController < ApplicationController
	include PostsHelper
	include ApplicationHelper

	def home
		@active_pg_head_link = "home"
		render 'public/home', layout: 'application'
	end

	def about
		@active_pg_head_link = "about"
		render 'public/about', layout: 'application'
	end

	def contact
		@active_pg_head_link = "contact"
		render 'public/contact', layout: 'application'
	end

	def posts
		@active_pg_head_link = "posts"
		@post_number = posts_get_newest_post_number
		render 'public/posts', layout: 'application'
	end
end
