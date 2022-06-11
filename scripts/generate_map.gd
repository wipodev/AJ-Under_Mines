extends Node

onready var tiles: TileMap = get_node("TileMap")
var conf = preload("res://scripts/config.gd")

export(float) var tile_size = 45.0
export(int) var shapes_amount = 5
export(int) var sky_line = 10
export(int) var sky_tile = 23
export(int) var horizon_tile = 20
export(int) var water_tile = 17
export(int) var figure_tile_start = 10
export(int) var figure_tile_end = 14
export(int) var probability = 10
export(int) var width = 43
export(int) var height = 24

var figures = {}
var maps: Array
var percTiles: Array
var percGroup: Array

func _ready() -> void:
	randomize()
	conf = conf.new()
	percTiles = conf.percTiles
	percGroup = conf.percGroup
	figures = conf.figures
	generate_map_tiles()
	load_map()

func load_map():
	for m in maps:
		tiles.set_cell(m.x, m.y, m.tile, m.flipx, m.flipy, m.rote)

func generate_map_tiles() ->void:
	# verificamos si ya hay un mapa creado.
	if !conf.check_map():
		for y in height:
			for x in width:
				if y < sky_line:
					maps.append({x = x, y = y, tile = sky_tile, flipx = false, flipy = false, rote = false})
				if y == sky_line:
					maps.append({x = x, y = y, tile = horizon_tile, flipx = false, flipy = false, rote = false})
				if y > sky_line:
					create_tile(x, y)
		conf.save_map(maps)
	else:
		maps = conf.load_map()
	
func update_tile_probability(y):
	var high = round(float(height - sky_line) / 5)
	var top = y - sky_line
	var reduce = probability
	if top == high:
		percTiles[0].perc -= reduce
	if top == high*2:
		percTiles[0].perc -= reduce
		percTiles[1].perc -= reduce
	if top == high*3:
		percTiles[0].perc -= reduce
		percTiles[1].perc -= reduce
		percTiles[2].perc -= reduce
	if top == high*4:
		percTiles[0].perc -= reduce
		percTiles[1].perc -= reduce
		percTiles[2].perc -= reduce
		percTiles[3].perc -= reduce
	
func reset_tile_probability():
	var reduce = probability
	percTiles[0].perc += reduce * 4
	percTiles[1].perc += reduce * 3
	percTiles[2].perc += reduce * 2
	percTiles[3].perc += reduce

func generate_angle_random() -> Array:
	var new_angle = randi() % 2 > 0
	var new_flipx = randi() % 2 > 0
	var new_flipy = randi() % 2 > 0
	return [new_flipx, new_flipy, new_angle]

func create_tile(x, y):
	var group = random_group()
	var angle: Array = generate_angle_random()
	var r = randi() % 100 + 1
	if group == "Earth":
		for perc_tile in percTiles:
			if r <= perc_tile.perc:
				if !tile_exist(x, y):
					maps.append({x = x, y = y, tile = perc_tile.id, flipx = angle[0], flipy = angle[1], rote = angle[2]})
					break
	else:
		random_shape(x, y, group)
	update_tile_probability(y)

func random_shape(x, y, group):
	var r_figure = figures[group][randi() % figures[group].size()]
	var tile: int
	for rf in r_figure:
		for h in rf.h / tile_size:
			for w in rf.w / tile_size:
				if group == "Water":
					tile = water_tile
				else:
					tile = int(rand_range(figure_tile_start, figure_tile_end))
				var angle: Array = generate_angle_random()
				var x_t = x + rf.x + w
				var y_t = y + rf.y + h
				if x_t >= width:
					x_t = x_t - width
					if !tile_exist(x_t, y_t):
						maps.append({x = x_t, y = y_t, tile = tile, flipx = angle[0], flipy = angle[1], rote = angle[2]})
				if !tile_exist(x_t, y_t):
					maps.append({x = x_t, y = y_t, tile = tile, flipx = angle[0], flipy = angle[1], rote = angle[2]})

func random_group():
	var r = randi() % 100 + 1
	for p_group in percGroup:
		if r <= p_group.perc:
			return p_group.group
			
func tile_exist(x, y):
	if maps.size() != 0:
		for m in maps:
			if m.x == x && m.y == y:
				return true
	return false
