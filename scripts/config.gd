extends Node

var percTiles = [
	{ perc = 60, id = 0 },
	{ perc = 70, id = 1 },
	{ perc = 80, id = 2 },
	{ perc = 90, id = 3 },
	{ perc = 100, id = 4 }]
	
var percGroup = [
	{ perc = 98, group = "Earth" },
	{ perc = 99, group = "Rock" },
	{ perc = 100, group = "Water" },
  ]

func save_map(map):
	var save_map = File.new()
	save_map.open("user://map.save", File.WRITE)
	for m in map:
		save_map.store_line(to_json(m))
	save_map.close()

func load_map():
	var map: Array = []
	var load_map = File.new()
	load_map.open("user://map.save", File.READ)
	while load_map.get_position() < load_map.get_len():
		map.append(parse_json(load_map.get_line()))
	load_map.close()
	return map

func check_map():
	var check_map = File.new()
	if not check_map.file_exists("user://map.save"):
		return false
	check_map.open("user://map.save", File.READ)
	return parse_json(check_map.get_line())

var figures = {
	Water = [
	  [
		{ x = 0, y = 0, w = 135, h = 45 },
		{ x = 1, y = 1, w = 45, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 270, h = 45 },
		{ x = 1, y = 1, w = 180, h = 45 },
		{ x = 1, y = 2, w = 90, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 270, h = 45 },
		{ x = 1, y = 1, w = 180, h = 45 },
		{ x = 3, y = 2, w = 90, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 360, h = 45 },
		{ x = 1, y = 1, w = 270, h = 45 },
		{ x = 2, y = 2, w = 180, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 180, h = 45 },
		{ x = 0, y = 1, w = 135, h = 45 },
		{ x = 0, y = 2, w = 135, h = 45 },
		{ x = 0, y = 3, w = 90, h = 45 },
		{ x = 0, y = 4, w = 45, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 180, h = 45 },
		{ x = 1, y = 1, w = 135, h = 45 },
		{ x = 1, y = 2, w = 135, h = 45 },
		{ x = 2, y = 3, w = 90, h = 45 },
		{ x = 3, y = 4, w = 45, h = 45 },
	  ],
	],
	Rock = [
	  [
		{ x = 0, y = 0, w = 270, h = 45 },
		{ x = 1, y = 1, w = 180, h = 45 },
		{ x = 1, y = 2, w = 90, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 270, h = 45 },
		{ x = 1, y = 1, w = 180, h = 45 },
		{ x = 3, y = 2, w = 90, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 360, h = 45 },
		{ x = 1, y = 1, w = 270, h = 45 },
		{ x = 2, y = 2, w = 180, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 180, h = 45 },
		{ x = 0, y = 1, w = 135, h = 45 },
		{ x = 0, y = 2, w = 135, h = 45 },
		{ x = 0, y = 3, w = 90, h = 45 },
		{ x = 0, y = 4, w = 45, h = 45 },
	  ],
	  [
		{ x = 0, y = 0, w = 180, h = 45 },
		{ x = 1, y = 1, w = 135, h = 45 },
		{ x = 1, y = 2, w = 135, h = 45 },
		{ x = 2, y = 3, w = 90, h = 45 },
		{ x = 3, y = 4, w = 45, h = 45 },
	  ],
	],
  }
