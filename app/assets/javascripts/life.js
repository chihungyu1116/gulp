var Life = (function(){
	var self = {
		setDefault : function(spec){
			spec = spec || {};
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
							'<div id="',control_id + '_set_btn" class="btn col">Set</div>',
							'<div id="',control_id + '_submit_btn" class="btn col">Start</div>',
							'<div id="',control_id + '_reset_btn" class="btn col">Reset</div>',
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
								status : 'empty'
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
		getCellReferenceFromMap : function(cell_id){

		},
		bindCell : function($cell,cell){
			var cell_live_color = this.cell_live_color,
				cell_empty_color = this.cell_empty_color,
				that = this;
			$cell.click(function(){
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
					that.bindCell($cell,cell);
				});
			}
		},
		bindControls : function(){
			
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