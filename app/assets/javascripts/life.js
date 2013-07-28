var Life = (function(){
	var self = {
		setDefault : function(spec){
			spec = spec || {};
			this.game_speed = spec.game_speed || 1000;
			this.cell_dimension = 20;
			this.container_id = spec.container_id;
			this.control_id = spec.container_id + '_control';
			this.board_id = spec.container_id + '_board';
			this.board_width = spec.board_width || 30;
			this.board_height = spec.board_height || 30;
			this.cell_dead_color = spec.cell_dead_color || '#aaa';
			this.cell_live_color = spec.cell_live_color || 'red';
			this.cell_empty_color = spec.cell_empty_color || '#333';
			this.cell_map = [];
		},
		resetGameBoard : function(){
			var that = this,
				cell_map = this.cell_map,
				cell_arr,
				cell_id,
				$cell,
				index;

			for(index = 0; index < cell_map.length; index++){
				cell_arr = cell_map[index];
				$.each(cell_arr,function(key,cell){
					cell_id = cell.id;
					cell.status = 'empty';
					cell.status_next = 'empty';
					$cell = $(cell_id);
					that.setCellColor($cell,'empty');
				});
			}
		},
		removeGameBoard : function(){
			
		},
		createGame : function(){
			var $container = $(this.container_id),
				$control, $board,
				that = this;

			function createControl(){
				var control_id = that.control_id,
					control_str;
					$control = $(control_id);

				control_id = control_id.replace('#','');
					
				if($control.length === 0){
					control_str = [
						'<div id="',control_id,'" class="game-control clearfix">',
							'<div class="clearfix">',
								'<div id="',control_id + '_width" class="input-container col">',
									'<label>Width</label>',
									'<input name="width">',
								'</div>',
								'<div id="',control_id + '_height" class="input-container col">',
									'<label>Height</label>',
									'<input name="height">',
								'</div>',
								'<div id="',control_id + '_cell_live_color" class="input-container col">',
									'<label>Live Cell Color</label>',
									'<input name="cell_live_color">',
								'</div>',
								'<div id="',control_id + '_cell_dead_color" class="input-container col">',
									'<label>Dead Cell Color</label>',
									'<input name="cell_dead_color">',
								'</div>',
								'<div id="',control_id + '_cell_empty_color" class="input-container col">',
									'<label>Empty Cell Color</label>',
									'<input name="cell_empty_color">',
								'</div>',
							'</div>',
							'<div class="clearfix">',
								'<div id="',control_id + '_set_btn" class="btn col">Set</div>',
								'<div id="',control_id + '_start_btn" class="btn col">Start</div>',
								'<div id="',control_id + '_reset_btn" class="btn col">Reset</div>',
							'</div>',
							'<div class="game-score">',
								'Your Off Springs Successfully Live For ' + '<span id="',control_id + '_score" class="score">0</span>' + ' Generations',
							'</div>',
						'</div>'
					].join('');

					$control = $(control_str);
					$container.append($control);
				}
			}
			function createBoard(){
				var board_id = that.board_id,
					$board = $(board_id);

				function getCellStr(cell_id){
					var str = [
						'<div id="',cell_id,'" class="cell"></div>'
					].join('');
					return str;
				}
				function getAndSetBoardElems(){
					var board_width = that.board_width,
						board_height = that.board_height,
						board_str = '',
						cell_arr,cell_id,cell_obj,
						x,y;

					for(y=0;y<board_height;y++){
						cell_arr = [];
						for(x=0;x<board_width;x++){
							cell_id = 'cell_' + y + '_' + x;
							cell_obj = {
								id : '#' + cell_id,
								status : 'empty',
								status_next : 'empty',
								neighbors : []
							}
							cell_arr.push(cell_obj);
							board_str += getCellStr(cell_id);
						}
						that.cell_map.push(cell_arr);
					}
					return $(board_str);
				}
				function getAndSetBoardContainerWidthAndHeight(board_id){
					var board_width = that.board_width,
						board_height = that.board_height,
						cell_dimension = that.cell_dimension,
						board_str,
						$board;

					board_id = board_id.replace('#','');
					board_str = [
						'<div id="',board_id,'" class="game-board clearfix"></div>'
					].join('');

					$board = $(board_str);
					$board.css({
						'height' : board_height * cell_dimension + 'px',
						'width' : board_width * cell_dimension + 'px'
					});
					return $board;
				}

				if($board.length === 0){
					$board = getAndSetBoardContainerWidthAndHeight(board_id);
					$board_elems = getAndSetBoardElems();
					$board.append($board_elems);
					$container.append($board);
				}
			}
			createControl();
			createBoard();
		},
		setCellColor : function($cell,cell_status){
			var cell_live_color = this.cell_live_color,
				cell_dead_color = this.cell_dead_color,
				cell_empty_color = this.cell_empty_color,
				cell_color;

			if(cell_status === 'empty'){
				cell_color = cell_empty_color;
			} else if(cell_status === 'live'){
				cell_color = cell_live_color;
			} else if(cell_status === 'dead'){
				cell_color = cell_dead_color;
			}

			$cell.css('background',cell_color);
		},
		setCellStatus : function(cell,status){
			cell.status = status;
		},
		getCellReference : function(cell_id){
			var cell_map = this.cell_map,
				cell_arr,
				cell,
				x,y;

			for(x=0;x<cell_map.length;x++){
				cell_arr = cell_map[x];
				for(y=0;y<cell_arr.length;y++){
					cell = cell_arr[y];
					if(cell.id === cell_id){
						return cell;
					}
				}
			}
		},
		setCellNeighbors : function(cell,board_width,board_height){
			var that = this,
				cell_id = cell.id,
				cell_arr,
				cell_1_1,
				cell_2_1,
				cell_3_1,
				cell_1_2,
				cell_3_2,
				cell_1_3,
				cell_2_3,
				cell_3_3,
				x, y;

			cell_id = cell_id.replace('#cell_','');
			cell_arr = cell_id.split('_');
			x = parseInt(cell_arr[0]);
			y = parseInt(cell_arr[1]);

			// if cell is 2_2 it should have neighbors like that
			// 1_1 2_1 3_1
			// 1_2 2_2 3_2
			// 1_3 2_3 3_3
			function get_cell_id_str(x,y){
				return '#cell_' + x + '_' + y;
			}
			function get_cell_1_1(){
				var pos_x = x - 1,
					pos_y = y - 1,
					id;
				if(pos_x < 0 || pos_y < 0){return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			function get_cell_2_1(){
				var pos_x = x,
					pos_y = y - 1,
					id;

				if(pos_y < 0){return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			function get_cell_3_1(){
				var pos_x = x + 1,
					pos_y = y - 1,
					id;
				if(pos_x >= board_width || pos_y < 0) {return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			function get_cell_1_2(){
				var pos_x = x - 1,
					pos_y = y,
					id;
				if(pos_x < 0) {return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			function get_cell_3_2(){
				var pos_x = x + 1,
					pos_y = y,
					id;
				if(pos_x >= board_width) {return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			function get_cell_1_3(){
				var pos_x = x - 1,
					pos_y = y + 1,
					id;
				if(pos_x < 0 || pos_y >= board_height) {return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			function get_cell_2_3(){
				var pos_x = x,
					pos_y = y + 1,
					id;
				if(pos_y >= board_height) {return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			function get_cell_3_3(){
				var pos_x = x + 1,
					pos_y = y + 1,
					id;
				if(pos_x >= board_width || pos_y >= board_height) {return null;}
				id = get_cell_id_str(pos_x,pos_y);
				return that.getCellReference(id);
			}
			cell_1_1 = get_cell_1_1();
			cell_2_1 = get_cell_2_1();
			cell_3_1 = get_cell_3_1();
			cell_1_2 = get_cell_1_2();
			cell_3_2 = get_cell_3_2();
			cell_1_3 = get_cell_1_3();
			cell_2_3 = get_cell_2_3();
			cell_3_3 = get_cell_3_3();

			cell.neighbors.push(cell_1_1);
			cell.neighbors.push(cell_2_1);
			cell.neighbors.push(cell_3_1);
			cell.neighbors.push(cell_1_2);
			cell.neighbors.push(cell_3_2);
			cell.neighbors.push(cell_1_3);
			cell.neighbors.push(cell_2_3);
			cell.neighbors.push(cell_3_3);
		},
		bindCell : function($cell,cell){
			var cell_live_color = this.cell_live_color,
				cell_empty_color = this.cell_empty_color,
				that = this;
			$cell.click(function(){
				//[!!!] if game starts it shouldn't allow clicking
				if(cell.status === 'empty'){
					that.setCellColor($cell,'live');
					that.setCellStatus(cell,'live');
				} else if(cell.status === 'live'){
					that.setCellColor($cell,'empty');
					that.setCellStatus(cell,'empty');
				}
			});
		},
		bindBoard : function(){
			var that = this,
				board_width = this.board_width,
				board_height = this.board_height,
				cell_map = this.cell_map,
				cell_arr, cell_id, cell_status, cell_color,
				$cell, index;

			for(index = 0; index < cell_map.length; index++){
				cell_arr = cell_map[index];
				$.each(cell_arr,function(key,cell){
					cell_id = cell.id;
					cell_status = cell.status,
					$cell = $(cell_id);
					that.setCellColor($cell,cell_status);
					that.setCellNeighbors(cell,board_width,board_height);
					that.bindCell($cell,cell);
				});
			}
		},
		getAllCellsStatus : function(){
			var that = this,
				cell_map = this.cell_map,
				cell_status,
				cell_arr,
				x,y;
			this.cell_live_all = [];
			this.cell_dead_all = [];

			for(x=0;x<cell_map.length;x++){
				cell_arr = cell_map[x];
				$.each(cell_arr,function(key,cell){
					cell_status = cell.status;
					if(cell_status === 'live'){
						that.cell_live_all.push(cell);
					} else if(cell_status === 'dead'){
						that.cell_dead_all.push(cell);
					}
				});
			}

			// if no live cell, game stop
			if(this.cell_live_all.length === 0){
				this.game_flag_run = false;
			}
		},
		applyAllCellsRules : function(){
			var that = this,
				cell_live_all = this.cell_live_all,
				cell_dead_all = this.cell_dead_all,
				index;
			function randomPick(cell_arr){
				var upper_bound = cell_arr.length,
					index = Math.floor(Math.random()*1000)%upper_bound;
				cell_arr[index].status_next = 'live';

			}
			function reproduce(cell){
				var cell_neighbors = cell.neighbors,
					cell_live_count = 0,
					cell_neighbor,
					cell_arr = [],
					index;

				for(index = 0; index < cell.neighbors.length; index++){
					cell_neighbor = cell.neighbors[index];
					if(cell_neighbor){
						if(cell_neighbor.status !== 'live'){
							cell_arr.push(cell_neighbor);
						}
					}
				}
				if(cell_arr.length > 0){
					randomPick(cell_arr);
				}
			}
			// apply the rule
			// if cell dead cannot be revived, set it to status empty
			function apply_live_cell_rules(cell){
				var cell_neighbors = cell.neighbors,
					cell_live_count = 0,
					cell_neighbor,
					index;

				for(index = 0; index < cell.neighbors.length; index++){
					cell_neighbor = cell.neighbors[index];
					if(cell_neighbor){
						if(cell_neighbor.status === 'live'){
							cell_live_count++;
						}
					}
				}

				if(cell_live_count < 2 || cell_live_count > 3){
					cell.status_next = 'dead';
				} else {
					cell.status_next = 'live'
					reproduce(cell);
				}
			}
			function apply_dead_cell_rules(cell){
				var cell_neighbors = cell.neighbors,
					cell_live_count = 0,
					cell_neighbor,
					index;

				for(index = 0; index < cell.neighbors.length; index++){
					cell_neighbor = cell.neighbors[index];
					if(cell_neighbor){
						if(cell_neighbor.status === 'live'){
							cell_live_count++;
						}
					}
				}
				if(cell_live_count > 2 && cell_live_count < 5){
					cell.status_next = 'live';
				} else {
					cell.status_next = 'dead'
				}
			}
			$.each(cell_live_all,function(key,cell){
				apply_live_cell_rules(cell);
			});
			$.each(cell_dead_all,function(key,cell){
				apply_dead_cell_rules(cell);
			});
		},
		updateScores : function(){
			var control_id = this.control_id,
				$score = $(control_id + '_score');

			this.game_score++;
			$score.html(this.game_score);
		},
		applyAllCellsStatus : function(){
			var that = this,
				cell_map = this.cell_map,
				cell_arr,
				cell_id,
				cell_status,
				$cell,
				x,y;
			for(x = 0; x < cell_map.length; x++){
				cell_arr = cell_map[x];
				$.each(cell_arr,function(key,cell){
					cell_id = cell.id;
					cell_status = cell.status_next;
					$cell = $(cell_id);
					that.setCellColor($cell,cell_status);
					cell.status = cell.status_next;
					cell_status_next = 'empty';
				});
			}
		},
		gameStart : function(){
			var that = this,
				game_speed = this.game_speed;

			function gameTickFunction(){
				that.getAllCellsStatus();
				that.applyAllCellsRules();
				setTimeout(function(){
					if(that.game_flag_run){
						that.applyAllCellsStatus();
						that.updateScores();
						gameTickFunction();
					}
				},game_speed);
			}
			gameTickFunction();
		},
		bindControls : function(){
			var id = this.control_id,
				that = this;
			$(id + '_start_btn').click(function(){
				that.game_flag_run = true;
				that.game_score = 0;
				that.gameStart();
			});
			$(id + '_reset_btn').click(function(){
				that.game_flag_run = false;
				that.resetGameBoard();
				that.game_score = 0;
			});
		}
	}
	return {
		init : function(spec){
			var that = Object.create(self);
			that.setDefault(spec);
			that.createGame();
			that.bindBoard();
			that.bindControls()
		}
	}
}());