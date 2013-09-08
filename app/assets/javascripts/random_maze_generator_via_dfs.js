jQuery(function($){
	// 1 2 3 
	// 4 5 6
	// 7 8 9
	function Cell(x,y){
		this.id = x + '_' + y;
		this.x = x;
		this.y = y;
		this.unvisited = true;
		this.walls = ['top','right','bottom','left'];
		this.type = 'cell_';
	}

	function Maze(x,y,$container){
		this.matrix = [];
		this.$container = $container;
		this.x = x;
		this.y = y;
		this.begin = [0,0];
		this.end = [x-1,y-1];
		this.init = function(){
			var di_x,di_y,cell,arr;
			di_x = this.x;
			di_y = this.y;

			for(y = 0; y < di_y; y++){
				arr = [];
				for(x = 0 ;x < di_x; x++){
					cell = new Cell(x,y);
					arr.push(cell);
				}
				this.matrix.push(arr);
			}
		}
		this.findUnvisitedNeighborCells = function(cell){
			var x,y,matrix,arr;

			matrix = this.matrix;
			arr = [];
			x = cell.x;
			y = cell.y;


			if((x !== 0) && matrix[y][x-1].unvisited){ // top
				arr.push(matrix[y][x-1]);
			}
			if((y !== 0) && matrix[y-1][x].unvisited){ // left
				arr.push(matrix[y-1][x]);
			}
			if((y !== (this.y-1)) && matrix[y+1][x].unvisited){ // right
				arr.push(matrix[y+1][x]);
			}
			if((x !== (this.x-1)) && matrix[y][x+1].unvisited){ // bottom
				arr.push(matrix[y][x+1]);
			}
			return arr;
		}
		this.randomPick = function(arr){
			return parseInt(Math.random()*1000)%(arr.length);
		}
		this.breakWalls = function(from,to){
			var from_x, from_y, to_x, to_y;

			from_x = from.x;
			from_y = from.y;

			to_x = to.x;
			to_y = to.y;

			if(from_x < to_x){
				this.breakWall('right',from);
				this.breakWall('left',to);
			} else if(from_x > to_x) {
				this.breakWall('left',from);
				this.breakWall('right',to);
			} else if(from_y < to_y) {
				this.breakWall('bottom',from);
				this.breakWall('top',to);
			} else if(from_y > to_y) {
				this.breakWall('top',from);
				this.breakWall('bottom',to);
			}
		}
		this.breakWall = function(dir,cell){
			var index = cell.walls.indexOf(dir);
			cell.walls.splice(index,1);
		}
		this.create = function(){
			var matrix = this.matrix,
				cell_visited = 1,
				cell_total = this.x*this.y,
				cell_stack = [],
				cell_neighbor = [],
				cell_cur = matrix[0][0],
				cell_next,
				cell_index;

			cell_cur.unvisited = false;

			while(cell_visited < cell_total){
				cell_neighbor = this.findUnvisitedNeighborCells(cell_cur);
				if(cell_neighbor.length){
					cell_visited++;
					cell_stack.push(cell_cur);
					cell_index = this.randomPick(cell_neighbor);
					cell_next = cell_neighbor[cell_index];
					cell_next.unvisited = false;
					this.breakWalls(cell_cur,cell_next);
					cell_cur = cell_next;
				} else {
					cell_cur = cell_stack.pop();
				}
			}

			this.paint();
		}
		this.determineCellType = function(cell){
			cell.type += cell.walls.join('_');
		}
		this.getCellStr = function(cell){
			var type = cell.type,
				id = cell.id,
				str = [
						'<div id=',
						id,
						' class="cell ',
						type,
						'"></div>'
						].join('');

				return str;
		}
		this.paint = function(){
			var x,y,di_x,di_y,cell,cell_str,matrix,html,$container;

			matrix = this.matrix;
			html = '';
			di_x = this.x;
			di_y = this.y;
			$container = this.$container;
			$container.css({
				width:di_x*15,
				height:di_y*15
			})

			for(y = 0; y < di_y; y++){
				html += '<div class="cell_section clearfix">';
				for(x = 0; x < di_x; x++){
					cell = matrix[y][x];
					this.determineCellType(cell);
					cell_str = this.getCellStr(cell);
					if(x === 0 && y === 0){
						cell_str = cell_str.replace(/cell/,'cell_begin cell');
					} else if( x === (di_x - 1) && y === (di_y - 1) ) {
						cell_str = cell_str.replace(/cell/,'cell_end cell');
					}
					html += cell_str;
				}
				html += '</div>'
			}

			$container.html(html);
		}
	}

	window.Maze = new Maze(60,80,$('#maze'));
	window.Maze.init();
	window.Maze.create();
});