class PublicController < ApplicationController
	def home
		@active_pg_head_link = "home"
		render 'public/home', layout: 'application'
	end

	def what_is_hot
		@active_pg_head_link = "what_is_hot"
		render 'public/what_is_hot', layout: 'application'
	end

	def recent_articles
		@active_pg_head_link = "recent_articles"
		render 'public/recent_articles', layout: 'application'
	end

	def about_me
		@active_pg_head_link = "about_me"
		render 'public/about_me', layout: 'application'
	end
end
