import { Actor, CollisionType, Color, Engine, Font, FontUnit, Label, Loader, Sound, vec } from "excalibur"

// 1 - Criar uma instância de Engine, que representa o jogo

const game = new Engine ({
	width: 800,
  	height: 600
})

// 2 - Criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 200,
	height: 20,
	color: Color.Chartreuse
})

barra.body.collisionType = CollisionType.Fixed

// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	// Faz a posição x da barra, ser igual a posição x do mouse
	barra.pos.x = event.worldPos.x
})

//Insere o Actor barra - player, no game
game.add(barra)

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

let coresBolinha = [
	/* Color.Black,
	Color.Chartreuse,
	Color.Cyan,
	Color.Green,
	Color.Magenta,
	Color.Orange,
	Color.Red,
	Color.Rose,
	Color.White,
	Color.Yellow */
	Color.Red,
	Color.Orange,
	Color.Yellow,
	Color.Green,
	Color.Cyan,
	Color.Blue,
	Color.Violet
]

let numeroCores = coresBolinha.length

// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(100, 100)

setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - Fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if(bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}

	// Se a bolinha colidir com o lado direito
	if(bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}

	// Se a bolinha colidir com a parte superior
	if(bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}

	/* // Se a bolinha colidir com a parte inferior
	if(bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
		bolinha.vel.y = -velocidadeBolinha.y
	} */
})

// Insere bolinha no game
game.add(bolinha)

// 7 - Criar os blocos
// Configurações de tamanho e espaçamento
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas= 3

const corBloco = [Color.Violet, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136 // Colocando só um número
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderização dos bloquinhos

// Renderiza 3 linhas
for(let j = 0; j < linhas; j++) {
	// Renderiza 5 bloquinhos
	for(let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}
}

listaBlocos.forEach(bloco => {
	// Define o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active

	// Adiciona cada bloco no game
	game.add(bloco)
})

//Adicionando pontuação
let pontos = 0

// label = text + actor
const textoPontos = new Label({
	text: pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px
	}),
	pos: vec(600, 500)
})

game.add(textoPontos)

// Porde colocar mais sons em diferentes formatos, caso o navegador não reconhaça o primeiro som, ele tenta tocar o segundo
// ./ = pasta atual
const batida = new Sound("./src/sound/Block Break 1.wav");
const gameOverSound = new Sound("./src/sound/273807-Wrong-Answer-Game-Over-2.wav")
const loader = new Loader([batida]);

/* const textoPontos = new Text({
	text: "Hello Worlds",
	font: new Font({size:20})
})

const objetoTexto = new Actor({
	x: game.drawWidth - 80,
	y: game.drawHeight - 15
})

objetoTexto.graphics.use(textoPontos)

game.add(objetoTexto) */

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
	// Verificar se a bolinha colidiu com algum bloco destrutível

	// Se o elemento colidido for um bloco da lita de blocos (destrutíveis)
	if(listaBlocos.includes(event.other)) {
		//Destroi o bloco colidido
		event.other.kill()

		//Executar som
		batida.play()
		
		//Adiciona um ponto
		pontos++

		//Mudar a cor da bolinha
		bolinha.color = coresBolinha[Math.trunc(Math.random() * numeroCores)]
		//Math.random -> retorna número de 0 a 1; 0 - 1 * numeroCores -> 10
		//0.5 * 10 = 5
		//0.3 * 10 = 3
		//0.873 * 10 = 8.73

		//Math.trunc() -> retorna somente a porção inteira de um número

		//Mudar a cor da bolinha com a cor do bloco colidido
		//bolinha.color = event.other.color

		//Atualiza valor do placar
		textoPontos.text = pontos.toString()
	}

	// Rebater a bolinha - Inverter as direções
	// "minimun translation vector" is a vector 'normalize()'
	let intersecção = event.contact.mtv.normalize()

	// Se não está colidindo

	if(!colidindo) {
		colidindo = true

		//intersecção.x e intersecção.y
		// O maior representa o eixo onde houve o contato

		if(Math.abs(intersecção.x) > Math.abs(intersecção.y)) {
			//bolinha.vel.x = -bolinha.vel.x
			//bolinha.vel.x *= -1
			bolinha.vel.x = bolinha.vel.x * -1
		}
		else {
			//bolinha.vel.y = -bolinha.vel.y
			//bolinha.vel.y *= -1
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
})

bolinha.on("collisionend", () => {
	colidindo = false

	if(pontos == linhas * colunas) {
		alert("Venceu")
		window.location.reload()
	}
})

bolinha.on("exitviewport", () => {
	//Executar som de game over
	gameOverSound.play()
	.then(() => {
		alert("E morreu")
		window.location.reload()
	})
})

// Inicia o game
await game.start(loader)