jQuery(function($){
	var Emission = {
		initModels : function(){
			var that = this;
			this.Models = {}
			this.Models.Vector = {};
			this.Models.Vector = Backbone.Model.extend({
				defaults : {
					x : 0,
					y : 0
				},
				initialize : function(){
					console.log(this)
				},
				getMagnitudeFromPositions : function(x,y){
					return x^2 + y^2;
				},
				getAngleFromPositions : function(x,y){
					return Math.atan2(x,y);
				},
				getPositionXFromAngleAndMagnitude : function(angle,magnitude){
					return magnitude * Math.cos(angle);
				},
				getPositionYFromAngleAndMagnitude : function(angle,magnitude){
					return magnitude * Math.sin(angle);
				},
				add : function(vector){
					var x = this.get('x'),
						y = this.get('y'),
						x_new = vector.get('x'),
						y_new = vector.get('y');

					this.set({'x' : x + x_new});
					this.set({'y' : y + y_new});
				}
			});
			this.Models.Particle = Backbone.Model.extend({
				initialize : function(){
					this.set({
						position : that.getNewVector(),
						velocity : that.getNewVector(),
						acceleration : that.getNewVector()
					});
				},
				move : function(){
					var acceleration = this.get('acceleration'),
						velocity = this.get('velocity'),
						position = this.get('position');
					velocity.add(acceleration);
					position.add(velocity);
				}
			});
			this.Models.Emitter = Backbone.Model.extend({
				defaults : {
					spread : Math.PI/32,
					color : '#999'
				},
				initialize : function(){
					this.set({
						position : that.getNewVector(),
						velocity : that.getNewVector(),
					});
				},
				emitParticle : function(){
					var spread, 
						velocity, velocity_x, velocity_y, velocity_new, velocity_magnitude, velocity_angle,
						position, position_x, position_y, position_new, position_x_curved, position_y_curved;

					spread = this.get('spread');
					velocity = this.get('velocity');
					velocity_x = velocity.get('x');
					velocity_y = velocity.get('y');
					velocity_angle = velocity.getAngleFromPositions(velocity_x,velocity_y) + spread - (Math.random() * spread * 2);
					velocity_magnitude = velocity.getMagnitudeFromPositions(velocity_x,velocity_y);
					
					position = this.get('position');
					position_x = position.get('x');
					position_y = position.get('y');
					position_new = that.getNewVector(position_x,position_y);
					
					position_x_curved = velocity.getPositionXFromAngleAndMagnitude(angle,magnitude),
					position_y_curved = velocity.getPositionYFromAngleAndMagnitude(angle,magnitude),
					
					velocity_new = this.getNewVector(position_x_curved,position_y_curved);
					
					return that.getNewParticle(position_new,velocity_new)
				}
			});
		},
		getNewVector : function(x,y){
			return new this.Models.Vector({
				x : x || 0,
				y : y || 0
			});
		},
		getNewParticle : function(position,velocity,acceleration){
			return new this.Models.Particle({
				position : position || this.getNewVector(),
				velocity : velocity || this.getNewVector(),
				acceleration : acceleration || this.getNewVector()
			});
		},
		setCanvasHeight : function(val){
			this.Canvas.el.height = val;
		},
		setCanvasWidth : function(val){
			this.Canvas.el.width = val;
		},
		clear : function(){
			this.Canvas.ctx.clearRect(0,0,this.Canvas.el.width,this.Canvas.el.height);
		},
		queue : function(){
			//this.loop();
			//window.requestAnimationFrame(this.loop);
		},
		update : function(){

		},
		draw : function(){

		},
		loop : function(){
			this.clear();
			this.update();
			this.draw();
			this.queue();
		},
		initCanvas : function(){
			this.Canvas = {};
			this.Canvas.el = document.getElementById('emission');
			this.Canvas.ctx = this.Canvas.el.getContext('2d');
			this.setCanvasWidth(800);
			this.setCanvasHeight(800);
		},
		init : function(){
			this.initCanvas();
			this.initModels();
			//this.loop();
		}
	};
	Emission.init();
});