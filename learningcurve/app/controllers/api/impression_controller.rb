class Api::ImpressionController < ApplicationController

    def list()
    	word = params[:word]
    	is = Impression.where :word => word

    	render :json => {
    	  :code => 0,
	      :result => is,
	      :count => is.length
	    }, :status => 200
    end

	def create()
		partId = params[:part_id]
    	part, = Part.where :id => partId
    	type = params[:type]
    	iType = ['lookup','pin','quiz'].index(type)
    	score = [1,2,3][iType]

		# save into db
		impression = Impression.new
		impression.part_id = partId
		impression.t = iType
		impression.score = score
		impression.word = part.word
		impression.updated_at = impression.created_at = DateTime.now
		impression.save!
	
		render :json => {
		  :code => 0,
	      :result => impression
	    }, :status => 200
	end
end
