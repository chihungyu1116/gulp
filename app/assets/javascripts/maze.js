/* 
11 paths
*/

jQuery(document).ready(function($){
	window.maze = {
		paths : {
			// 0 1 2
			// 3 4 5
			// 6 7 8
			// ---------
			// ---------
			// ---------
			0 : [0,0,0,0,0,0,0,0,0],

			// ---|||---
			// ---||||||
			// ---------
			1 : [0,1,0,0,1,1,0,0,0],

			// ---------
			// ---||||||
			// ---|||---
			2 : [0,0,0,0,1,1,0,1,0],

			// ---------
			// ||||||---
			// ---|||---
			3 : [0,0,0,1,1,0,0,1,0],

			// ---|||---
			// ||||||---
			// ---------
			4 : [0,1,0,1,1,0,0,0,0],

			// ---|||---
			// ---|||---
			// ---|||---
			5 : [0,1,0,0,1,0,0,1,0],

			// ---------
			// |||||||||
			// ---------
			6 : [0,0,0,1,1,1,0,0,0],

			// ---|||---
			// ---||||||
			// ---|||---
			7 : [0,1,0,0,1,1,0,1,0],

			// ---------
			// |||||||||
			// ---|||---
			8 : [0,0,0,1,1,1,0,1,0],

			// ---|||---
			// ||||||---
			// ---|||---
			9 : [0,1,0,1,1,0,0,1,0],

			// ---|||---
			// |||||||||
			// ---------
			10 : [0,1,0,1,1,1,0,0,0],

			// ---|||---
			// |||||||||
			// ---|||---
			11 : [0,1,0,1,1,1,0,1,0],

			// |||||||||
			// |||||||||
			// |||||||||
			12 : [1,1,1,1,1,1,1,1,1]
		},
		paths_restriction : { // if that side is 0
			'top' : ['2','3','6','8'],
			'right' : ['3','4','5','9'],
			'bottom' : ['1','4','6','10'],
			'left' : ['1','2','5','7']
		},
		get_random : function(num){ // giving 4 will return 0 to 3
			return Math.floor(Math.random()*num);
		},
		set_allowed_paths_config: function(){
			var that = this,
				paths_config;

			function get_path_config(path_type){
				var paths = that.paths[path_type],
					top = 1,
					right = 5,
					bottom = 7,
					left = 3,
					config = {};

				config['top'] = paths[top] === 0 ? false : true;
				config['right'] = paths[right] === 0 ? false : true;
				config['bottom'] = paths[bottom] === 0 ? false : true;
				config['left'] = paths[left] === 0 ? false : true;

				return config;
			}

			function return_paths_config(){
				var paths = that.paths,
					paths_config = {}, 
					i;

				for(i in paths){
					if(paths.hasOwnProperty(i)){
						paths_config[i] = get_path_config(i);
					}
				}
				return paths_config;
			}

			function return_allowed_paths_config(paths_config){
				var paths = that.paths,
					allowed_paths_config = {},
					i,j,k;

				function get_allowed_paths(path_type,paths_config){
					var config = {
							'top' : [],
							'right' : [],
							'bottom' : [],
							'left' : []
						},
						path_config = paths_config[path_type],
						top = path_config['bottom'] ? true : false,
						right = path_config['left'] ? true : false;
						bottom = path_config['top'] ? true : false;
						left = path_config['right'] ? true : false;

					function if_allowed(type){
						var allowed_paths=[],
							i;
						for(i in paths_config){
							if(paths_config.hasOwnProperty(i) && paths_config[i][type]){
								allowed_paths.push(i);
							}
						}
						return allowed_paths;
					}

					if(top) config['top'] = if_allowed('top');
					if(right) config['right'] = if_allowed('right');
					if(bottom) config['bottom'] = if_allowed('bottom');
					if(left) config['left'] = if_allowed('left');

					return config;
				}

				for(i in paths){
					if(paths.hasOwnProperty(i)){
						allowed_paths_config[i] = get_allowed_paths(i,paths_config);
					}
				}
				return allowed_paths_config;
			}

			paths_config = return_paths_config();
			this.allowed_paths_config = return_allowed_paths_config(paths_config);
		},
		draw_block : function(path_type,id,type){
			var container = $('<div id=' + id +' class="maze-modules-container"></div>'),
				paths = this.paths[path_type],
				path = '<div class="maze-module maze-path"></div>',
				no_path = '<div class="maze-module maze-no-path"></div>',
				result = "",
				i;

			for(i=0;i<paths.length;i++){
				result += (paths[i] === 0) ? no_path : path;
			}

			if(type === 'replace'){
				return $('#'+id).html(result);
			}

			return container.append($(result));
		},
		draw_map_to_boundary : function(){
			var map_width = (this.num_blocks_width + 2) * this.block_width,
				map_height = (this.num_blocks_height + 2) * this.block_height,
				map = $('<div class="maze-map"></div>'),
				that = this,
				block,
				i;

			map.css('width',map_width);
			map.css('height',map_height);

			$(this.map_id).append(map);

			for(i=0;i<this.blocks.length;i++){
				this.blocks[i].forEach(function(el,j){
					block = that.draw_block(el,'block' + i + '_' + j);
					map.append(block);
				});
			}
		},
		draw_map_to_blocks : function(){
			var num_layers_width = this.num_blocks_width + 2,
				num_layers_height = this.num_blocks_height + 2,
				top_path_type,
				right_path_type,
				bottom_path_type,
				left_path_type,
				top_allowed,
				right_allowed,
				bottom_allowed,
				left_allowed,
				allowed_path_arr,
				take_all = ['0','1','2','3','4','5','6','7','8','9','10','11'],
				that = this,
				random_picked,
				path_picked,
				i,j;

			function get_intersects(){
				var arr = [],
					count = 1,
					current = "",
					intersects_arr = [],
					i;

				for(i=0; i<arguments.length; i++){
					arr = arr.concat(arguments[i]);
				}
				arr = arr.sort(function(a,b){
					return parseInt(a) > parseInt(b) ? 1 : -1;
				});

				for(i=0; i<arr.length; i++){
					if(current !== arr[i]){
						current = arr[i];
						count = 1;
					} else {
						count++;
					}
					if(count === 4){
						intersects_arr.push(current);
					}
				}
				return intersects_arr;
			}

			for(i=1;i<num_layers_height-1;i++){
				for(j=1;j<num_layers_width-1;j++){
					top_path_type = this.blocks[i-1][j];
					right_path_type = this.blocks[i][j+1];
					bottom_path_type = this.blocks[i+1][j];
					left_path_type = this.blocks[i][j-1];
					
					top_allowed = top_path_type === 12 ? take_all : this.allowed_paths_config[top_path_type]['top'];
					right_allowed = right_path_type === 12 ? take_all : this.allowed_paths_config[right_path_type]['right'];
					bottom_allowed = bottom_path_type === 12 ? take_all : this.allowed_paths_config[bottom_path_type]['bottom'];
					left_allowed = left_path_type === 12 ? take_all : this.allowed_paths_config[left_path_type]['left'];

					if(top_allowed.length === 0) top_allowed = this.paths_restriction['top'];
					if(right_allowed.length === 0) right_allowed = this.paths_restriction['right'];
					if(bottom_allowed.length === 0) bottom_allowed = this.paths_restriction['bottom'];
					if(left_allowed.length === 0) left_allowed = this.paths_restriction['left'];
					
					allowed_path_arr = get_intersects(top_allowed,right_allowed,bottom_allowed,left_allowed);
					random_picked = this.get_random(allowed_path_arr.length);
					path_picked = allowed_path_arr.length === 0 ? 0 : allowed_path_arr[random_picked];
					this.blocks[i][j] = parseInt(path_picked);

					this.draw_block(path_picked,'block'+ i + '_' + j,'replace');
				}
			}
		},
		build_map : function(){
			var num_layers_width = this.num_blocks_width + 2,
				num_layers_height = this.num_blocks_height + 2,
				arr,arrs=[],i,j;
		
			for(i=0;i<num_layers_height;i++){
				arr = [];
				for(j=0;j<num_layers_width;j++){
					if ((i === 1 && j === 0) || ((i === num_layers_height-2) && j === num_layers_width-1)){ // assign entrance and exit => 1s
						arr.push(6);
					} else if(i === 0 || j === 0 || i === (num_layers_height-1) || j === (num_layers_width-1)){ // first and last layers => all 0s
						arr.push(0);
					} else {
						arr.push(12);
					}
				}
				arrs.push(arr);
			}
			this.blocks = arrs;
		},
		clear : function(){
			$(this.map_id).html('');
		},
		init : function(spec){
			this.map_id = spec.map_id;
			this.block_width = 30;
			this.block_height = 30;
			this.num_blocks_width = parseInt((spec.num_blocks_width > 0 && spec.num_blocks_width < 36) ? spec.num_blocks_width : 10); // number of blocks on the width side
			this.num_blocks_height = parseInt((spec.num_blocks_height > 0 && spec.num_blocks_height < 36) ? spec.num_blocks_height : 10); // number of blocks on the height side
			
			this.clear(); // clear main container (remove maze)
			this.set_allowed_paths_config(); // get allowed paths like path 1 allows combination with path 1,2,4,6,8 etc... example -> numbers are inaccurate
			this.build_map(); // build map in memory then use map to draw
			this.draw_map_to_boundary(); // draw the boundary
			this.draw_map_to_blocks(); // draw map
		}
	};
});