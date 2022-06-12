extends Node

#------------------------------------------------º
# SCRIPT PARA LA GENERACION Y CONTROL DE MAPAS   |
#------------------------------------------------º

# Inspector variables.

export (int, 40, 400) var map_width = 70;
export (int, 20, 300) var map_height = 50;

# Diccionarios (lo que serian objetor en javascript.

var available_tiles = {
	"earth": 0,
	"rock": 10,
	"base": 5,
	"water": 18
};

# Resources variables.

var terrain_map: TileMap = null; # tilemap que se asocia co los tiles deceados.
var perlin_noise: OpenSimplexNoise = null; # algoritmo que genera el ruido.

func _ready() -> void:
	randomize(); # Se encarga de que el script pueda funsionar con valores aleatorios.
	
	set_process(false); # cancelamos los procesos para que no ocupen espacio en la memoria.
	
	configurate_perlin_noise(); # funsion para configurar las propiedades de OpenSimplexNoise.
	configurate_tilemaps(); # funsion para cargar el tilemap y añadirlo a la escena.
	generate_terrain(); # funsion que usa los metodos de OpenSimplexNoise para generar el mapa.


func configurate_perlin_noise() -> void:
	perlin_noise = OpenSimplexNoise.new(); # Se crea el nuevo recurso (no se añade como hijo a la escena).
	perlin_noise.seed = randi(); # Se le da una "semilla" aleatoria. se puede guardar este valor si se quiere generar el mismo mapa.
	perlin_noise.octaves = 4;
	perlin_noise.period = 25;
	perlin_noise.lacunarity = 1.5;
	perlin_noise.persistence = 2;


func configurate_tilemaps() -> void:
	if terrain_map != null:
		return
	terrain_map = load("res://scenes/TileMap.tscn").instance(); # nueva instancia de la escena de terreno tilemap (la escena donde esta el tileSet)
	add_child(terrain_map); # se añade como hijo de este nodo al tilemap resien instanciado.


func generate_terrain() -> void:
	terrain_map.clear(); # se limpian todos los tiles creados antes.
	generate_perimeter(); # esta funsion se encarga de generar los limites del mapa.
	
	for y in map_height: # este bucle recorre las celdas.
		for x in map_width:
			var random: float = perlin_noise.get_noise_2d(float(x), float(y)); # obtenemos numero aleatorio segun coordenadas y semilla.
			terrain_map.set_cellv(Vector2(x,y), get_tile(random)); # aqui agregamos el nuevo tile a la celda indicada.


func generate_perimeter() -> void:
	for x in [-1, map_width]:
		for y in map_height:
			terrain_map.set_cellv(Vector2(x,y),6)
	
	for y in [-1, map_height]:
		for x in map_width + 1:
			terrain_map.set_cellv(Vector2(x,y),6)


func get_tile(noise: float) -> int:
	if noise < 0.0:
		if noise < -0.3:
			return available_tiles.water
		return available_tiles.base
	
	if noise < 0.1:
		if noise < 0.03:
			available_tiles.rock = 12
			return available_tiles.rock
		if noise < 0.05:
			available_tiles.rock = 13
			return available_tiles.rock
	
	if noise < 0.7:
		if noise < 0.2:
			available_tiles.earth = 0
			return available_tiles.earth
		available_tiles.earth = 3
		return available_tiles.earth
	
	return available_tiles.earth

func _input(_event) -> void:
	if Input.is_action_just_pressed("ui_accept"): # cuando se presione la tecla "ENTER"
		configurate_perlin_noise()                # generamos un nuevo mundo.
		generate_terrain()
