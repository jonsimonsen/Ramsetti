document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------\
  // Initialization of game board\
  // ----------------------------\

  // Create grid
  const height = 20
  const width = 12 //Includes walls
  const startRow = -3 //Number of invisible rows above the game board

  let gameContainer = document.getElementsByClassName("grid")[0]

  //Create roof (should be invisible)
  for(let i = startRow; i < 0; i++) {
    let leftWall = document.createElement("div")
    leftWall.className = "roof wall"
    gameContainer.appendChild(leftWall)

    for(let j = 0; j < width - 2; j++) {
      let roofSquare = document.createElement("div")
      roofSquare.className = "roof"
      gameContainer.appendChild(roofSquare)
    }

    let rightWall = document.createElement("div")
    rightWall.className = "roof wall"
    gameContainer.appendChild(rightWall)
  }

  //Create main game board
  for(let i = 0; i < height; i++) {
    let leftWall = document.createElement("div")
    leftWall.className = "wall"
    gameContainer.appendChild(leftWall)

    //Create row
    for(let j = 0; j < width - 2; j++) {
      // let inner = document.createElement("div")
      // inner.innerHTML = i * width + j + 1
      // gameContainer.appendChild(inner)
      gameContainer.appendChild(document.createElement("div"))
    }

    let rightWall = document.createElement("div")
    rightWall.className = "wall"
    gameContainer.appendChild(rightWall)
  }

  //Create floor
  for(let i = 0; i < width; i++) {
    let floorSquare = document.createElement("div")
    floorSquare.className = "wall"
    gameContainer.appendChild(floorSquare)
  }

  //Create nextbox
  let nextBox = document.getElementsByClassName("next-box")[0]

  for(let i = 0; i < 16; i++) {
    nextBox.appendChild(document.createElement("div"))
  }

// -----------------------\
// Variable initialization\
// -----------------------\

  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')

  //Animation
  let paused = true //Keep track of pause state
  let timerId = null  //Used for gravity ticks.
  let gameSpeed = 480 //milliseconds between gravity ticks
  let maxSpeed = 240 //highest speed before going to killSpeed
  let killSpeed = 48 //final level speed
  const speedDip = gameSpeed / 10
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'brown']

  //Scoring
  const baseScore = 30 * gameSpeed
  let score = 0
  let lines = 0
  const linesPerLevel = 6

  //Tetriminoes
  const jTetrimino = [
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2],
    [1, 2, width + 1, width * 2 + 1]
  ]

  const lTetrimino = [
    [width, width + 1, width + 2, width * 2],
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2]
  ]

  const tTetrimino = [
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1]
  ]

  const zTetrimino = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 1, width + 2, width * 2 + 1]
  ]

  const sTetrimino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [1, width + 1, width + 2, width * 2 + 2],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [1, width + 1, width + 2, width * 2 + 2]
  ]

  const iTetrimino = [
    [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3],
    [2, width + 2, width * 2 + 2, width * 3 + 2],
    [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3],
    [2, width + 2, width * 2 + 2, width * 3 + 2]
  ]

  const oTetrimino = [
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2],
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2],
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2],
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2]
  ]

  //Code that can be used for debugging. TODO: Consider removing it.
  /*let col = 0
  oTetrimino.forEach(rot => {
    console.log(rot)
    rot.forEach(filled => {
      console.log(filled)
      squares[filled + col].classList.add('tetrimino')
    })
    col += 4
  })*/

  const tetriminoes = [jTetrimino, lTetrimino, tTetrimino, zTetrimino, sTetrimino, iTetrimino, oTetrimino]

  // Main Code\
  // ---------\
  // ---------\

  //Create a tetrimino at the top
  let current
  let next = tetriminoes[Math.floor(Math.random() * tetriminoes.length)]
  let pos
  let rot

  
  showNext()
  spawn()

  //Create a new tetrimino
  function spawn() {
    //Update game container and squares
    gameContainer = document.getElementsByClassName("grid")[0]
    squares = Array.from(document.querySelectorAll('.grid div'))

    pos = 4
    rot = 0
    current = next
    gameOver()
    next = tetriminoes[Math.floor(Math.random() * tetriminoes.length)]
    draw()
    if(!paused){
      showNext()
    }
  }

  //Display a new tetrimino in the nextbox
  function showNext() {
    let shownSquares = Array.from(document.querySelectorAll('.next-box div'))
    shownSquares.forEach(field => {
      field.classList.remove('next')
    })
    next[0].forEach( index => {
      let tmp = index
      if(tmp >= width && tmp < 2 * width){
        tmp += 4 - width
      }
      else if(tmp >= 2 * width) {
        tmp += 2 * (4 - width)
      }
      shownSquares[tmp].classList.add('next')
    })
  }

  //draw tetrimino
  function draw() {
    current[rot].forEach(filled => {
      squares[filled + pos].classList.add('tetrimino')
    })
  }

  //undraw tetrimino
  function undraw() {
    current[rot].forEach(filled => {
      squares[filled + pos].classList.remove('tetrimino')
    })
  }

  //Assign functions to keycodes
  function control(e) {
    if(!paused){
      if(e.keyCode === 37) {
        moveLeft()
      }
      else if(e.keyCode === 38) {
        rotate(1)
      }
      else if(e.keyCode === 39) {
        moveRight()
      }
      else if(e.keyCode === 40) {
        rotate(3)
      }
      else if(e.keyCode === 17) {
        descend()
      }
    }
  }
  document.addEventListener('keyup', control)

  //Make tetrimino descend
  function descend() {
    undraw()
    pos += width
    draw()
    rest()
  }

  //Stop if tetrmino lands on the floor or previously placed tetriminoes)
  function rest() {
    //Optimally, this should happen just before the tetrimino moves to the next position
    if(current[rot].some(index => squares[pos + index + width].classList.contains('occupied') || squares[pos + index + width].classList.contains('wall'))) {
      current[rot].forEach(index => squares[pos + index].classList.add('occupied'))

      //Clean up game board and update score
      update()

      //Spawn a new tetrimino
      spawn()
    }
  }

  //Move left if possible
  function moveLeft() {
    if(!(current[rot].some(index => squares[pos + index - 1].classList.contains("occupied"))) && !(current[rot].some(index => squares[pos + index - 1].classList.contains("wall")))) {
      undraw()
      pos--
      draw()
    }
  }

  //Move right if possible
  function moveRight() {
    if(!(current[rot].some(index => squares[pos + index + 1].classList.contains("occupied"))) && !(current[rot].some(index => squares[pos + index + 1].classList.contains("wall")))) {
      undraw()
      pos++
      draw()
    }
  }

  //Rotate if possible (quarters should tells the number of 90 degree clockwise rotations)
  function rotate(quarters) {
    tmp = (rot + quarters) % 4

    //Confirm that all squares of the rotated tetrimino inhabit unoccupied spaces.
    if(!(current[tmp].some(index => squares[pos + index].classList.contains("occupied"))) && !(current[tmp].some(index => squares[pos + index].classList.contains("wall")))) {
      undraw()
      rot = tmp
      draw()
    }
  }

  //Update game board and fix score if necessary
  function update(){
    let firstRow = Math.floor((pos + current[rot][0]) / width)
    let lastRow = Math.floor((pos + current[rot][3]) / width)
    console.log(firstRow)
    console.log(lastRow)
    console.log(pos)
    console.log(document.getElementsByClassName("grid")[0])
    let fullRows = 0
    for(let i = lastRow; i >= firstRow; i--){
      let full = true
      for(let j = 0; j < width; j++){
        if(!(squares[i * width + j].classList.contains("wall")) && !(squares[i * width + j].classList.contains("occupied"))){
          full = false
          continue;
        }
      }
      if(full){
        fullRows++
        squares.splice(i * width, width)
        //Remove cleared row
        for(let k = 0; k < width; k++){
          let targetSquare = gameContainer.children[i * width]
          console.log(i * width)
          console.log(targetSquare)
          gameContainer.removeChild(targetSquare)
        }
      }
    }
    //Calculate and update score
    let multiplier = 0
    if(fullRows === 1){
      multiplier = 2
      lines++
    }
    else if(fullRows === 2){
      multiplier = 5
      lines += 2
    }
    else if(fullRows === 3){
      multiplier = 15
      lines += 3
    }
    else if(fullRows === 4){
      multiplier = 60
      lines += 4
    }

    if(lines >= linesPerLevel){
      lines -= linesPerLevel
      bumpSpeed()
    }

    //insert the same number of rows as those that were cleared at the top of the visible game board.
    while(fullRows > 0) {

      let rightWall = document.createElement("div")
      rightWall.className = "wall"
      gameContainer.insertBefore(rightWall, gameContainer.children[ -1 * startRow * width])

      for(let i = 0; i < width - 2; i++){
        gameContainer.insertBefore(document.createElement("div"), gameContainer.children[-1 * startRow * width])
      }

      let leftWall = document.createElement("div")
      leftWall.className = "wall"
      gameContainer.insertBefore(leftWall, gameContainer.children[ -1 * startRow * width])

      fullRows--
    }

    score += multiplier * baseScore / gameSpeed
    scoreDisplay.innerHTML = score
  }

  //Increase game speed
  function bumpSpeed(){
    if(gameSpeed > maxSpeed){
      gameSpeed -= speedDip
    }
    else{
      gameSpeed = killSpeed
    }
    clearInterval(timerId)
    timerId = setInterval(descend, gameSpeed)
  }

  //Game over check
  function gameOver(){
    if(current[rot].some(index => squares[pos + index].classList.contains("occupied"))){
      scoreDisplay.innerHTML += ' - Game Over'
      clearInterval(timerId)
    }
  }


  //Use a button to control game start and pausing
  startBtn.addEventListener('click', () => {
    if(!paused) {
      clearInterval(timerId)
      timerId = null
    }
    else {
      //Make sure the next box is updated
      showNext()

      //Start executing functions
      timerId = setInterval(descend, gameSpeed)
    }

    //Toggle pause state
    paused = !paused
  })

})
