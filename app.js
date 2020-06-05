$(document).ready(function() {

  // -----------------------\
  // Variable initialization\
  // -----------------------\

  // Grid
  const height = 20;
  const width = 12;     //Includes walls
  const startRow = -3;  //Number of invisible rows above the game board (as a negative number)
  let gameContainer;
  let squares;

  //Animation
  let paused;    //Keep track of pause state
  let timerId;   //Used for gravity ticks.
  let gameSpeed;        //milliseconds between gravity ticks
  let startSpeed = 400;
  let maxSpeed = 80;    //highest speed before going to killSpeed
  let killSpeed = 40;   //final level speed
  const speedDip = startSpeed / 10;

  //Scoring
  const baseScore = 100800;
  let score;
  let lines;
  const linesPerLevel = 1;

  //Class specific constants (for use in the Tetrimino class)
  const _startPos = 4;
  const _startRotation = 0;
  const _colors = ['purple', 'orange', 'gray'];

  //Tetriminoes
  const _jTetrimino = [
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2],
    [1, 2, width + 1, width * 2 + 1]
  ];

  const _zTetrimino = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 1, width + 2, width * 2 + 1]
  ];

  const _lTetrimino = [
    [width, width + 1, width + 2, width * 2],
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2]
  ];

  const _sTetrimino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [1, width + 1, width + 2, width * 2 + 2],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [1, width + 1, width + 2, width * 2 + 2]
  ];

  const _tTetrimino = [
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1]
  ];

  const _iTetrimino = [
    [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3],
    [2, width + 2, width * 2 + 2, width * 3 + 2],
    [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3],
    [2, width + 2, width * 2 + 2, width * 3 + 2]
  ];

  const _oTetrimino = [
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2],
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2],
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2],
    [width + 1, width + 2, width * 2 + 1, width * 2 + 2]
  ];

  const _tetriminoes = [_jTetrimino, _zTetrimino, _lTetrimino, _sTetrimino, _tTetrimino, _iTetrimino, _oTetrimino];

  class Tetrimino {
    //Construct a new piece
    constructor() {
      this._position = _startPos;
      this._rotation = _startRotation;
      this._makePiece();
    }

    //Helper for the constructor (set _piece and _color based on a random selection)
    _makePiece() {
      let selection = Math.floor(Math.random() * _tetriminoes.length);
      if(Math.floor(selection / 2) === 0){
        this._color = _colors[0];
      }
      else if(Math.floor(selection / 2) === 1){
        this._color = _colors[1];
      }
      else{
        this._color = _colors[2];
      }
      this._piece = _tetriminoes[selection];
    }

    /*Getters and setters*/
    get position() {
      return this._position;
    }
    set position(pos) {
      this._position = pos;
    }
    get rotation() {
      return this._rotation;
    }
    set rotation(rot) {
      this._rotation = rot;
    }
    get color() {
      return this._color;
    }
    //Get the piece in its current rotation
    get piece() {
      return this._piece[this._rotation];
    }

    /*Other methods*/

    //Get the piece in a different rotation
    getNewPiece(rot) {
      return this._piece[rot];
    }
  }

  // ---------\
  // Main Code\
  // ---------\

  //Create a tetrimino at the top (would make sense to use classes eventually)
  let current;
  let next;

  newGame();

  //Set up a new Game
  function newGame() {
    //Remove all content from the game board
    $(".grid").empty();

    gameContainer = document.getElementsByClassName("grid")[0];

    //Create roof (should be invisible)
    for(let i = startRow; i < 0; i++) {
      let leftWall = document.createElement("div");
      leftWall.className = "roof wall";
      gameContainer.appendChild(leftWall);

      for(let j = 0; j < width - 2; j++) {
        let roofSquare = document.createElement("div");
        roofSquare.className = "roof";
        gameContainer.appendChild(roofSquare);
      }

      let rightWall = document.createElement("div");
      rightWall.className = "roof wall";
      gameContainer.appendChild(rightWall);
    }

    //Create main game board
    for(let i = 0; i < height; i++) {
      let leftWall = document.createElement("div");
      leftWall.className = "wall";
      gameContainer.appendChild(leftWall);

      //Create row
      for(let j = 0; j < width - 2; j++) {
        gameContainer.appendChild(document.createElement("div"));
      }

      let rightWall = document.createElement("div");
      rightWall.className = "wall";
      gameContainer.appendChild(rightWall);
    }

    //Create floor
    for(let i = 0; i < width; i++) {
      let floorSquare = document.createElement("div");
      floorSquare.className = "wall";
      gameContainer.appendChild(floorSquare);
    }

    //Create nextbox
    let nextBox = document.getElementsByClassName("next-box")[0];

    for(let i = 0; i < 16; i++) {
      nextBox.appendChild(document.createElement("div"));
    }

    squares = Array.from(document.querySelectorAll('.grid div'));
    score = 0;
    lines = 0;
    paused = true;
    timerId = null;
    gameSpeed = startSpeed;
    next = new Tetrimino();

    showNext();
    spawn();
    $("#start-button").attr("class", "initial");
    $("#start-button").text("Start");
  }

  //Create a new tetrimino
  /*function makePiece() {
    let selection = Math.floor(Math.random() * tetriminoes.length);
    let color;
    if(floor(selection / 2) === 0){
      color = colors[0];
    }
    else if(floor(selection / 2) === 1){
      color = colors[1];
    }
    else{
      color = colors[2];
    }
    return Tetrimino(tetriminoes[selection], color);
  }*/

  //Create a new tetrimino
  function spawn() {
    //Update game container and squares
    gameContainer = document.getElementsByClassName("grid")[0];
    squares = Array.from(document.querySelectorAll('.grid div'));

    current = next;
    gameOver();
    next = new Tetrimino();
    draw();
    if(!paused){
      showNext();
    }
  }

  //Display a new tetrimino in the nextbox
  function showNext() {
    let shownSquares = Array.from(document.querySelectorAll('.next-box div'));
    shownSquares.forEach(field => {
      field.classList.remove('next');
    })
    next.piece.forEach( index => {
      let tmp = index;
      if(tmp >= width && tmp < 2 * width){
        tmp += 4 - width;
      }
      else if(tmp >= 2 * width) {
        tmp += 2 * (4 - width);
      }
      shownSquares[tmp].classList.add('next');
    })
  }

  //draw tetrimino
  function draw() {
    current.piece.forEach(filled => {
      squares[filled + current.position].classList.add('tetrimino', current.color);
    })
  }

  //undraw tetrimino
  function undraw() {
    current.piece.forEach(filled => {
      squares[filled + current.position].classList.remove('tetrimino', current.color);
    })
  }

  //Assign functions to keycodes
  function control(e) {
    if(!paused){
      if(e.keyCode === 37) {
        e.preventDefault();
        moveLeft();
      }
      else if(e.keyCode === 38) {
        e.preventDefault();
        rotate(1);
      }
      else if(e.keyCode === 39) {
        e.preventDefault();
        moveRight();
      }
      else if(e.keyCode === 40) {
        e.preventDefault();
        rotate(3);
      }
      else if(e.keyCode === 32) {
        e.preventDefault();
        descend();
      }
    }
  }
  document.addEventListener('keydown', control);

  //Make tetrimino descend
  function descend() {
    undraw();
    current.position += width;
    draw();
    rest();
  }

  //Stop if tetrmino lands on the floor or previously placed tetriminoes)
  function rest() {
    //Optimally, this should happen just before the tetrimino moves to the next position
    if(current.piece.some(index => squares[current.position + index + width].classList.contains('occupied') || squares[current.position + index + width].classList.contains('wall'))) {
      current.piece.forEach(index => squares[current.position + index].classList.add('occupied'));

      //Clean up game board and update score
      update();

      //Spawn a new tetrimino
      spawn();
    }
  }

  //Move left if possible
  function moveLeft() {
    if(!(current.piece.some(index => squares[current.position + index - 1].classList.contains("occupied"))) && !(current.piece.some(index => squares[current.position + index - 1].classList.contains("wall")))) {
      undraw();
      current.position--;
      draw();
    }
  }

  //Move right if possible
  function moveRight() {
    if(!(current.piece.some(index => squares[current.position + index + 1].classList.contains("occupied"))) && !(current.piece.some(index => squares[current.position + index + 1].classList.contains("wall")))) {
      undraw();
      current.position++;
      draw();
    }
  }

  //Rotate if possible (quarters should tells the number of 90 degree clockwise rotations)
  function rotate(quarters) {
    let tmp = (current.rotation + quarters) % 4;
    let newPiece = current.getNewPiece(tmp)

    //Confirm that all squares of the rotated tetrimino inhabit unoccupied spaces.
    if(!(newPiece.some(index => squares[current.position + index].classList.contains("occupied"))) && !(newPiece.some(index => squares[current.position + index].classList.contains("wall")))) {
      undraw();
      current.rotation = tmp;
      draw();
    }
  }

  //Update game board and fix score if necessary
  function update(){
    let firstRow = Math.floor((current.position + current.piece[0]) / width);
    let lastRow = Math.floor((current.position + current.piece[3]) / width);
    let fullRows = 0;
    for(let i = lastRow; i >= firstRow; i--){
      let full = true;
      for(let j = 0; j < width; j++){
        if(!(squares[i * width + j].classList.contains("wall")) && !(squares[i * width + j].classList.contains("occupied"))){
          full = false;
          continue;
        }
      }
      if(full){
        fullRows++;
        squares.splice(i * width, width);
        //Remove cleared row
        for(let k = 0; k < width; k++){
          let targetSquare = gameContainer.children[i * width];
          gameContainer.removeChild(targetSquare);
        }
      }
    }
    //Calculate and update score
    let multiplier = 0;
    if(fullRows === 1){
      multiplier = 1;
      lines++;
    }
    else if(fullRows === 2){
      multiplier = 5;
      lines += 2;
    }
    else if(fullRows === 3){
      multiplier = 15;
      lines += 3;
    }
    else if(fullRows === 4){
      multiplier = 60;
      lines += 4;
    }

    if(lines >= linesPerLevel){
      lines -= linesPerLevel;
      bumpSpeed();
    }

    //insert the same number of rows as those that were cleared at the top of the visible game board.
    while(fullRows > 0) {

      let rightWall = document.createElement("div");
      rightWall.className = "wall";
      gameContainer.insertBefore(rightWall, gameContainer.children[ -1 * startRow * width]);

      for(let i = 0; i < width - 2; i++){
        gameContainer.insertBefore(document.createElement("div"), gameContainer.children[-1 * startRow * width]);
      }

      let leftWall = document.createElement("div");
      leftWall.className = "wall";
      gameContainer.insertBefore(leftWall, gameContainer.children[ -1 * startRow * width]);

      fullRows--;
    }

    score += multiplier * baseScore / gameSpeed;
    $("#score").text(score);
  }

  //Increase game speed
  function bumpSpeed(){
    if(gameSpeed > maxSpeed){
      gameSpeed -= speedDip;
    }
    else{
      gameSpeed = killSpeed;
    }
    clearInterval(timerId);
    timerId = setInterval(descend, gameSpeed);
  }

  //Game over check
  function gameOver(){
    if(current.piece.some(index => squares[current.position + index].classList.contains("occupied"))){
      $(".game-state").text("Game Over");
      $("#start-button").text("Try again");
      $("#start-button").attr("class", "dead");
      clearInterval(timerId);
    }
  }


  //Use a button to control game start and pausing
  $("#start-button").click(function() {
    if($(this).text() === "Try again") {
      newGame();
      paused = true;
    }
    else if(!paused) {
      clearInterval(timerId);
      timerId = null;
      gameContainer.classList.add("paused");
      $(this).text("Continue");
      $(this).attr("class", "stopped");
      paused = true;
    }
    else {
      //Make sure the next box is updated
      showNext();

      //Start executing functions
      gameContainer.classList.remove("paused");
      timerId = setInterval(descend, gameSpeed);
      $(this).text("Pause");
      $(this).attr("class", "running");
      paused = false
    }
  });

  //Allow instructions to be collapsed
  $(".collapsing").click(function() {
    $(this).toggleClass("active");
    $(this).siblings().toggle();
  })

})
