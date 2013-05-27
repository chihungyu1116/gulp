class PublicController < ApplicationController	
	include PostsHelper

	def home
		@active_pg_head_link = "home"
		render 'public/home', layout: 'application'
	end

	def about
		@active_pg_head_link = "about"
		render 'public/about', layout: 'application'
	end

	def posts
		@active_pg_head_link = "posts"
		render 'public/posts', layout: 'application'
	end

	def js_posts
		@active_pg_head_link = "js_posts"
		render 'public/js_posts', layout: 'application'
	end

	def rails_posts
		@active_pg_head_link = "rails_posts"
		render 'public/rails_posts', layout: 'application'
	end

	def css_html_posts
		@active_pg_head_link = "css_html_posts"
		render 'public/css_html_posts', layout: 'application'
	end

	def galleries_posts
		@active_pg_head_link = "galleries_posts"
		render 'public/galleries_posts', layout: 'application'
	end
end
