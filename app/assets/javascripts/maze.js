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
		draw_block : function(path_type){
			var container = $('<div class="maze-modules-container"></div>'),
				paths = this.paths[path_type],
				path = '<div class="maze-module maze-path"></div>',
				no_path = '<div class="maze-module maze-no-path"></div>',
				result = "",
				i;

			for(i=0;i<paths.length;i++){
				result += (paths[i] === 0) ? no_path : path;
			}
			return container.append($(result));
		},
		draw_map_to_blocks : function(){
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
				this.blocks[i].forEach(function(el,index){
					block = that.draw_block(el);
					map.append(block);
				});
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
					} else if(i === 0 || j === 0 || i === (num_layers_height-1) || j === (num_layers_height-1)){ // first and last layers => all 0s
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
			$(this.canvas_id).html('');
		},
		init : function(spec){
			this.map_id = spec.map_id;
			this.block_width = spec.block_width || 45;
			this.block_height = spec.block_height || 45;
			this.num_blocks_width = spec.num_blocks_width; // number of blocks on the width side
			this.num_blocks_height = spec.num_blocks_height; // number of blocks on the height side
			
			this.clear();
			this.build_map();
			this.draw_map_to_blocks();
		}
	};

	window.maze.init({
		map_id : '#maze',
		num_blocks_width : 20,
		num_blocks_height : 20
	});
});