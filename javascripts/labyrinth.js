"use strict";
var rows;
var cols;
var verticalWallChance = 50;
var horizontalWallChance = 50;
var setCounter;
var startPos;
var endPos;
var cell;

createTable(20, 40, 760, 39);

function regenerateLabyrinth() {
  document.getElementById("main_window").removeChild(document.getElementById('table'));
  createTable(rows, cols, startPos, endPos);
}

function createTable(rows_, cols_, startPos_, endPos_) {
  rows = rows_;
  cols = cols_;
  startPos = startPos_;
  endPos = endPos_;
  var table = "<table id='table'>";
  for(let i = 0; i < rows; i++) {
    table+="<tr>";
    for(let j = 0; j < cols; j++) {
      table+="<td id='"+(j+cols*i)+"'></td>";
    }
    table+="</tr>";
  }
  table+= "</table>";
  document.getElementById("main_window").innerHTML = table;
  document.getElementById("table").style.width = cols*24+cols+6+"px";
  setCounter = cols;
  addWalls();
}

function addWalls() {
  for(let j = 0; j < cols; j++) {
    document.getElementById(j).innerHTML = j;
  }
  for(let i = 0; i < rows; i++) {
    //add vertical walls
    for(let j = 0; j < cols - 1; j++) {
      if(getInt(1,100) <= verticalWallChance) {
        document.getElementById(j+cols*i).style.borderRightColor = "black";
      } else {
        document.getElementById(j+1+cols*i).innerHTML = document.getElementById(j+cols*i).innerHTML;
      }
    }
    //add horizontal walls
    if(i == rows - 1)  {
      for(let j = 0; j < cols - 1; j++) {
        checkSets();
        if(document.getElementById(j+cols*i).innerHTML != document.getElementById(j+1+cols*i).innerHTML && document.getElementById(j+cols*i).style.borderRightColor == "black") {
          document.getElementById(j+cols*i).style.borderRightColor = "white";
          for(let k = j; k < cols; k++) {
            if(document.getElementById(j+1+cols*i).innerHTML == document.getElementById(k+cols*i).innerHTML) {
              document.getElementById(k+cols*i).innerHTML = document.getElementById(j+cols*i).innerHTML;
            }
          }
        }
      }
      clearNumbers();

      document.getElementById(startPos).innerHTML = "0";
      calculateRoute(startPos);
      cell = document.getElementById(endPos).innerHTML;
      showPath(endPos);
      clearNumbers();
      document.getElementById(startPos).innerHTML = "S";
      document.getElementById(startPos).style.color = "red";
      document.getElementById(startPos).style.backgroundImage = "none";
      document.getElementById(endPos).style.backgroundImage = "url('images/finish.png')";
      return;
    }
    for(let j = 0; j < cols; j++) {
      var counter = 0;
      for(let k = 0; k < cols; k++) {
        if(document.getElementById(k+cols*i).style.borderBottomColor != "black" && document.getElementById(k+cols*i).innerHTML == document.getElementById(j+cols*i).innerHTML) counter++;
      }
      if(getInt(1,100) <= horizontalWallChance && counter > 1) {
        document.getElementById(j+cols*i).style.borderBottomColor = "black";
        document.getElementById(j+cols*(i+1)).innerHTML = setCounter++;
      } else {
        document.getElementById(j+cols*(i+1)).innerHTML = document.getElementById(j+cols*i).innerHTML;
      }
    }
  }
}

function showPath(cell_id) {
  cell--;
  if(cell_id % cols > 0 && document.getElementById(cell_id - 1).style.borderRightColor != "black" && document.getElementById(cell_id - 1).innerHTML == cell) {
    document.getElementById(cell_id - 1).style.backgroundImage = "url('images/step_right.png')";
    showPath(cell_id - 1);
    return;
  }
  if(cell_id > (cols - 1) && document.getElementById(cell_id - cols).style.borderBottomColor != "black" && document.getElementById(cell_id - cols).innerHTML == cell) {
    document.getElementById(cell_id - cols).style.backgroundImage = "url('images/step_down.png')";
    showPath(cell_id - cols);
    return;
  }
  if((cell_id % cols) - 39 != 0 && document.getElementById(cell_id).style.borderRightColor != "black" && document.getElementById(cell_id + 1).innerHTML == cell) {
    document.getElementById(cell_id + 1).style.backgroundImage = "url('images/step_left.png')";
    showPath(cell_id + 1);
    return;
  }
  if(cell_id < (cols * rows - cols) && document.getElementById(cell_id).style.borderBottomColor != "black" && document.getElementById(cell_id + cols).innerHTML == cell) {
    document.getElementById(cell_id + cols).style.backgroundImage = "url('images/step_up.png')";
    showPath(cell_id + cols);
  }
}

function calculateRoute(cell_id) {
  let left, right, up, down;
  left = false;
  right = false;
  up = false;
  down = false;
  var cell = document.getElementById(cell_id).innerHTML;
  cell++;
  if(cell_id % cols > 0 && document.getElementById(cell_id - 1).style.borderRightColor != "black" && (document.getElementById(cell_id - 1).innerHTML == "" || document.getElementById(cell_id - 1).innerHTML > cell)) {
    document.getElementById(cell_id - 1).innerHTML = cell;
    left = true;
  }
  if(cell_id > (cols - 1) && document.getElementById(cell_id - cols).style.borderBottomColor != "black" && (document.getElementById(cell_id - cols).innerHTML == "" || document.getElementById(cell_id - cols).innerHTML > cell)) {
    document.getElementById(cell_id - cols).innerHTML = cell;
    up = true;
  }
  if((cell_id % cols) - 39 != 0 && document.getElementById(cell_id).style.borderRightColor != "black" && (document.getElementById(cell_id + 1).innerHTML == "" || document.getElementById(cell_id + 1).innerHTML > cell)) {
    document.getElementById(cell_id + 1).innerHTML = cell;
    right = true;
  }
  if(cell_id < (cols * rows - cols) && document.getElementById(cell_id).style.borderBottomColor != "black" && (document.getElementById(cell_id + cols).innerHTML == "" || document.getElementById(cell_id + cols).innerHTML > cell)) {
    document.getElementById(cell_id + cols).innerHTML = cell;
    down = true;
  }
  if(up) calculateRoute(cell_id - cols);
  if(left) calculateRoute(cell_id - 1);
  if(right) calculateRoute(cell_id + 1);
  if(down) calculateRoute(cell_id + cols);
}

function clearNumbers() {
  for(let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      document.getElementById(j+cols*i).innerHTML = "";
    }
  }
}

function checkSets() {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      if(j != cols - 1 && document.getElementById(j+cols*i).innerHTML != document.getElementById(j+1+cols*i).innerHTML && document.getElementById(j+cols*i).style.borderRightColor != "black") {
        concatSets(document.getElementById(j+cols*i).innerHTML, document.getElementById(j+1+cols*i).innerHTML);
      }
      if(i != rows - 1 && document.getElementById(j+cols*i).innerHTML != document.getElementById(j+cols*(i+1)).innerHTML && document.getElementById(j+cols*i).style.borderBottomColor != "black") {
        concatSets(document.getElementById(j+cols*i).innerHTML, document.getElementById(j+cols*(i+1)).innerHTML);
      }
    }
  }
}

function concatSets(set1, set2) {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      if(document.getElementById(j+cols*i).innerHTML == set2) {
        document.getElementById(j+cols*i).innerHTML = set1;
      }
    }
  }
}

function getInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}