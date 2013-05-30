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
		boundary_allowed_paths : { // if that side is 0
			'top' : ['2','3','6','8'],
			'right' : ['3','4','5','9'],
			'bottom' : ['1','4','6','10'],
			'left' : ['1','2','5','7']
		},
		get_random_0_to_num : function(num){ // giving a num will return 0 to num
			return Math.floor(Math.random()*num);
		},
		set_compatible_paths_config: function(){
			var paths = this.paths,
				paths_config;

			function get_allowed_paths_config(){
				var configs = {}, 
					i;
				function _get_config(path_type){
					var path = paths[path_type],
						top_pos = 1,
						right_pos = 5,
						bottom_pos = 7,
						left_pos = 3,
						config = {};

					config['allowed_top'] = path[top_pos] === 0 ? false : true;
					config['allowed_right'] = path[right_pos] === 0 ? false : true;
					config['allowed_bottom'] = path[bottom_pos] === 0 ? false : true;
					config['allowed_left'] = path[left_pos] === 0 ? false : true;

					return config;
				}

				for(i in paths){
					if(paths.hasOwnProperty(i)){
						configs[i] = _get_config(i);
					}
				}
				return configs;
			}
			function get_compatible_paths_config(paths_config){
				var configs = {},
					i;

				function _get_compatible(path_config){
					var config = {
							'compatible_top' : [],
							'compatible_right' : [],
							'compatible_bottom' : [],
							'compatible_left' : []
						},
						top = path_config['allowed_bottom'], 
						right = path_config['allowed_left'],
						bottom = path_config['allowed_top'],
						left = path_config['allowed_right'];

					function get_compatible_paths(allowed_type){
						var compatible_paths=[],
							i;
						for(i in paths_config){
							if(paths_config.hasOwnProperty(i) && paths_config[i][allowed_type]){
								compatible_paths.push(i);
							}
						}
						return compatible_paths;
					}

					if(top) config['compatible_top'] = get_compatible_paths('allowed_top');
					if(right) config['compatible_right'] = get_compatible_paths('allowed_right');
					if(bottom) config['compatible_bottom'] = get_compatible_paths('allowed_bottom');
					if(left) config['compatible_left'] = get_compatible_paths('allowed_left');
					return config;
				}

				for(i in paths){
					if(paths.hasOwnProperty(i)){
						configs[i] = _get_compatible(paths_config[i]);
					}
				}
				return configs;
			}

			paths_config = get_allowed_paths_config();
			this.compatible_paths_config = get_compatible_paths_config(paths_config);
		},
		draw_block : function(path_type,id,type){ // function that draw block to the html
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
				first_half, second_half,
				top_path_type, top_compatible,
				right_path_type, right_compatible,
				bottom_path_type, bottom_compatible,
				left_path_type, left_compatible,
				compatible_paths_arr,
				take_all = ['1','2','3','4','5','6','7','8','9','10','11'],
				random_picked,
				path_picked,
				that = this,
				i,j,k;

			if(num_layers_height % 2 === 0){ // is even number
				first_half = num_layers_height/2;
			} else {
				first_half = (num_layers_height+1)/2;
			}
			second_half = num_layers_height - first_half;

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

			function biasify(arr){
				// double 7,8,9,10,11
				var newArr = [],
					val,
					i;
				for(i=0;i<arr.length;i++){
					val = arr[i];
					if(val === '7' || val === '8' || val === '9' || val === '10' || val === '11'){
						newArr.push(val);
						newArr.push(val);
					}
					newArr.push(val);
				}
				return newArr;
			}

			function loop_helper(i,j){
				top_path_type = that.blocks[i-1][j];
				right_path_type = that.blocks[i][j+1];
				bottom_path_type = that.blocks[i+1][j];
				left_path_type = that.blocks[i][j-1];

				top_compatible = top_path_type === 12 ? take_all : that.compatible_paths_config[top_path_type]['compatible_top'];
				right_compatible = right_path_type === 12 ? take_all : that.compatible_paths_config[right_path_type]['compatible_right'];
				bottom_compatible = bottom_path_type === 12 ? take_all : that.compatible_paths_config[bottom_path_type]['compatible_bottom'];
				left_compatible = left_path_type === 12 ? take_all : that.compatible_paths_config[left_path_type]['compatible_left'];

				if(top_compatible.length === 0) top_compatible = that.boundary_allowed_paths['top'];
				if(right_compatible.length === 0) right_compatible = that.boundary_allowed_paths['right'];
				if(bottom_compatible.length === 0) bottom_compatible = that.boundary_allowed_paths['bottom'];
				if(left_compatible.length === 0) left_compatible = that.boundary_allowed_paths['left'];
				
				compatible_paths_arr = get_intersects(top_compatible,right_compatible,bottom_compatible,left_compatible);
				compatible_paths_arr = biasify(compatible_paths_arr);

				random_picked = that.get_random_0_to_num(compatible_paths_arr.length);
				path_picked = compatible_paths_arr.length === 0 ? 0 : compatible_paths_arr[random_picked];
				that.blocks[i][j] = parseInt(path_picked);

				that.draw_block(path_picked,'block'+ i + '_' + j,'replace');
			}

			for(i=1;i<first_half-1;i++){
				for(j=1;j<num_layers_width-1;j++){
					loop_helper(i,j);
				}
			}
			for(k=(num_layers_height-2);k>=i;k--){
				for(j=num_layers_width-2;j>0;j--){
					loop_helper(k,j);
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
			this.set_compatible_paths_config(); // get allowed paths like path 1 allows combination with path 1,2,4,6,8 etc... example -> numbers are inaccurate
			this.build_map(); // build map in memory then use map to draw
			this.draw_map_to_boundary(); // draw the boundary
			this.draw_map_to_blocks(); // draw map
		}
	};
});