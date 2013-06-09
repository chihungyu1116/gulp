var Sphere = (function(){
	var self = {
		create_sphere_canvas : function(){
			var $canvas = this.$canvas = jQuery(this.canvas);

			$canvas.css({
				'position' : 'relative',
				'min-width' : this.radius + 'px',
				'min-height' : this.radius + 'px',
				'perspective' : 800
			});
		},
		create_sphere_container : function(){
			var $sphere_container = this.$sphere_container = jQuery('<div id="sphere_container"></div>');

			$sphere_container.css({
				'position' : 'absolute',
				'transform-style' : 'preserve-3d',
				'width' : this.radius,
				'height' : this.radius
			});

			this.$canvas.append($sphere_container);
		},
		create_sphere_pivot : function(){
			var $sphere_pivot = this.$sphere_pivot = jQuery('<div id="sphere_pivot"></div>');

			$sphere_pivot.css({
				'position' : 'absolute',
				'left' : this.center,
				'top' : this.center,
				'width' : 1,
				'height' : 1
			});

			this.$sphere_container.append($sphere_pivot);

		},
		create_sphere_stick : function(i,$container,color_picked){
			var html_str = '<div class="sphere_stick"><div class="stick_face_top"></div><div class="stick_face_bottom"></div></div>',
				$sphere_stick = jQuery(html_str);			

			$sphere_stick.css({
				'position' : 'absolute',
				'width' : 1,
				'height' : this.radius,
				'top' : this.neg_center,
				'transform' : 'rotate(' + i + 'deg)',
				'transform-style' : 'preserve-3d',
				'background' : this.stick_color
			});

			$sphere_stick.find('.stick_face_top').css({
				'position' : 'absolute',
				'width' : this.stick_face_radius,
				'height' :this.stick_face_radius,
				'top' : this.neg_stick_face_radius_center,
				'left' : this.neg_stick_face_radius_center,
				'transform' : 'rotateX(90deg)',
				'background' : color_picked,
				'border-radius' : '50%',
				'opacity' : this.transparency
			});

			$sphere_stick.find('.stick_face_bottom').css({
				'position' : 'absolute',
				'width' : this.stick_face_radius,
				'height' : this.stick_face_radius,
				'bottom' : this.neg_stick_face_radius_center,
				'left' : this.neg_stick_face_radius_center,
				'transform' : 'rotateX(90deg)',
				'background' : color_picked,
				'border-radius' : '50%',
				'opacity' : this.transparency
			});
			$container.append($sphere_stick);
		},
		create_sphere_sticks : function($container){
			var	i, color = this.color, color_len = this.color.length, color_index = 0, color_picked;
			for(i = 0; i < 180; i += 12){
				color_picked = color[color_index%color_len];
				color_index++;
				this.create_sphere_stick(i,$container,color_picked);
			}
		},
		create_sphere_plates : function(){
			var plate_id, $container, i;

			for(i = 0; i < 180; i += 12){
				$container = jQuery('<div class="sphere_plate"></div>');
				$container.css({
					'position' : 'absolute',
					'width' : 1,
					'height' : 1,
					'transform' : 'rotateX(' + i + 'deg)',
					'transform-style' : 'preserve-3d'
				});
				this.create_sphere_sticks($container);
				this.$sphere_pivot.append($container);

			}
		},
		create : function(){
			this.create_sphere_canvas();
			this.create_sphere_container();
			this.create_sphere_pivot();
			this.create_sphere_plates();

			this.$canvas.html('');
			this.$canvas.append(this.$sphere_container);
		},
		rotate : function(direction){
			if(direction === 'left'){
				this.degreeY--;
			} else if(direction === 'up'){
				this.degreeX++;
			} else if(direction === 'right'){
				this.degreeY++
			} else if(direction === 'down'){
				this.degreeX--;
			}
			$('#sphere_container').css({
				'transform' : 'rotateX(' + this.degreeX + 'deg) rotateY(' + this.degreeY + 'deg)'
			});
		},
		reset : function(){
			this.degreeY=0;
			this.degreeX=0;

			$('#sphere_container').css({
				'transform' : 'rotateX(' + this.degreeX + 'deg) rotateY(' + this.degreeY + 'deg)'
			});
		}
	}
	return {
		init : function(spec){
			var that = Object.create(self),
				density_chart = [0.02,0.04,0.06,0.08,0.1],
				stick_face_radius;


			that.degreeX = 0;
			that.degreeY = 0;

			that.canvas= spec.canvas;

			// take only odd number width and height --> for a perfectly centered pivot since pivot is 1 px 
			that.radius = (spec.radius % 2 === 0) ? (spec.radius + 1) : spec.radius;
			that.center = (that.radius - 1)/2;
			that.neg_center = ~that.center + 1;
			that.density = density_chart[spec.density-1];

			stick_face_radius = Math.floor(that.radius*that.density);

			that.stick_face_radius = (stick_face_radius % 2 === 0) ? (stick_face_radius + 1) : stick_face_radius
			that.stick_face_radius_center = (that.stick_face_radius-1)/2;
			that.neg_stick_face_radius_center = ~that.stick_face_radius_center + 1;
			
			that.color = spec.color;
			that.stick_color = spec.stick_color;
			that.transparency = spec.transparency || 1

			that.create();
			return that;
		}
	}
}());
