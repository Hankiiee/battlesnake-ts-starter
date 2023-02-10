import { Direction } from "../types/strategy";
import { Battlesnake, Board, Coord } from "../types/types";
import { reachableCells } from "./ReachableCells";

export function coordInDirection(start: Coord, direction: Direction): Coord {
  switch (direction) {
    case Direction.UP:
      return { x: start.x, y: start.y + 1 }
    case Direction.RIGHT:
      return { x: start.x + 1, y: start.y }
    case Direction.DOWN:
      return { x: start.x, y: start.y - 1 }
    case Direction.LEFT:
      return { x: start.x - 1, y: start.y }
  }
}

export function isSnakePart(coord: Coord, board: Board): boolean {
  return board.snakes.some((snake: Battlesnake) => {
    return snake.body.some((bodyPart: Coord) => sameCoord(bodyPart, coord));
  });
}

export function getEnemySnakes(board: Board): Battlesnake[] {
  return board.snakes;
}

export function getEnemySnakeLength(board: Board): number[] {
  const lengths: number[] = []
  board.snakes.forEach(snake => {
    lengths.push(snake.length)
  });
  return lengths; 
}
export function fuckAroundAndFindOut(nextCoord: Coord, mySnake: Battlesnake, board: Board): number {
  let trigger: number = 0;
  getEnemySnakes(board).forEach(snake => {
    if (!sameCoord(mySnake.head, snake.head)){
      if(distance(nextCoord,snake.head) == 1){
        if(snake.length < mySnake.length)
          trigger = 2;
        else 
          trigger =-snake.length;
      }
    };
  });
  return trigger; 
}

export function boxing(nextCoord: Coord, mySnake: Battlesnake, board: Board): number{
  let points = 0;
  const newBoard = fakeBoard(nextCoord,mySnake,board);
  const length: number[] = [];
  const points1: number[] = [];
  const points2: number[] = [];
  board.snakes.forEach(snake => {
    if (!sameCoord(mySnake.head, snake.head)){
      length.push(snake.length)
      points1.push(reachableCells(board, snake.head))
    }
  }
  );
  newBoard.snakes.forEach(snake => {
    if (!sameCoord(mySnake.head, snake.head)){
      points2.push(reachableCells(newBoard, snake.head))
    }
  }
  );
  for(let i = 0; i < points1.length; i++) {
    if(points1[i] - points2[i] < length[i] -1){
      points += (points1[i] - points2[i] - length[i]);
    }
  }
  return points;
}

export function fakeBoard(nextCoord: Coord, mySnake: Battlesnake, board: Board): Board{
  const newBoard = board;
  const snakes: Battlesnake[] = [];
  board.snakes.forEach(snake => {
    if(!sameCoord(snake.head, mySnake.head)){
      snakes.push(snake)
    }
  });
  const modifiedSnake = mySnake;
  modifiedSnake.body.pop
  modifiedSnake.body.push(nextCoord)
  snakes.push(modifiedSnake)
  newBoard.snakes = snakes;
  return newBoard;
}

export function isOutside(coord: Coord, board: Board): boolean {
  return coord.y < 0 || coord.x < 0 || coord.x >= board.width || coord.y >= board.height;
}

export function sameCoord(coord1: Coord, coord2: Coord) {
  return coord1.x == coord2.x && coord1.y == coord2.y;
}

export function closestFood(head: Coord, board: Board): Coord | null {
  if (board.food.length == 0) {
    return null;
  }
  return board.food.sort((a, b) => distance(a, head) - distance(b, head))[0];
}

export function distance(coord1: Coord, coord2: Coord): number {
  return Math.abs(coord1.x - coord2.x) + Math.abs(coord2.y - coord1.y);
}