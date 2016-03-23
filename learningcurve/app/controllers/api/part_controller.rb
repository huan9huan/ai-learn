require 'json'
require "uri"
require 'rest-client'

class Api::PartController < ApplicationController

    def get() 
    	word = params[:word]
    	parts = Part.where :word => word

    	render :json => {
    	  :code => 0,
	      :result => parts,
	      :count => parts.length
	    }, :status => 200
    end

	def create()
		parts = JSON.parse(params[:parts])
		word = params[:word]
		i = 0
		parts.each do |p| 
			# save into db
			part, = Part.where :md5 => p['id']
			if(!part)
				part = Part.new
				part.created_at = DateTime.now
			end

			part.md5 = p['id']
			part.word = word
			part.t = 1	# todo: define it globally
			part.desc = p['def']
			# part.attachments = p['attachments'] ? (p['attachments'].to_json) : ""
			part.updated_at = DateTime.now
			part.save!
		end

		render :json => {
		  :code => 0,
	      :result => 'ok',
	      :count => parts.length
	    }, :status => 200
	end
end
