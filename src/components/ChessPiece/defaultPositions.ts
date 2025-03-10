import { PiecesInfo } from "./types";

export const defaultPiecesInfo: PiecesInfo[] = [
  // Peças pretas (linha 7 - peças maiores)
  {
    id: "black-rook-1",
    alive: true,
    type: 'rook',
    color: 'black',
    rotate: 0,
    coords: { x: 0, y: 7 },
  },
  {
    id: "black-knight-1",
    alive: true,
    type: 'knight',
    color: 'black',
    rotate: 0,
    coords: { x: 1, y: 7 },
  },
  {
    id: "black-bishop-1",
    alive: true,
    type: 'bishop',
    color: 'black',
    rotate: 0,
    coords: { x: 2, y: 7 },
  },
  {
    id: "black-queen-1",
    alive: true,
    type: 'queen',
    color: 'black',
    rotate: 0,
    coords: { x: 3, y: 7 },
  },
  {
    id: "black-king-1",
    alive: true,
    type: 'king',
    color: 'black',
    rotate: 0,
    coords: { x: 4, y: 7 },
  },
  {
    id: "black-bishop-2",
    alive: true,
    type: 'bishop',
    color: 'black',
    rotate: 0,
    coords: { x: 5, y: 7 },
  },
  {
    id: "black-knight-2",
    alive: true,
    type: 'knight',
    color: 'black',
    rotate: 0,
    coords: { x: 6, y: 7 },
  },
  {
    id: "black-rook-2",
    alive: true,
    type: 'rook',
    color: 'black',
    rotate: 0,
    coords: { x: 7, y: 7 },
  },
  // Peões pretos (linha 6)
  {
    id: "black-peon-1",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 0, y: 6 },
  },
  {
    id: "black-peon-2",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 1, y: 6 },
  },
  {
    id: "black-peon-3",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 2, y: 6 },
  },
  {
    id: "black-peon-4",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 3, y: 6 },
  },
  {
    id: "black-peon-5",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 4, y: 6 },
  },
  {
    id: "black-peon-6",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 5, y: 6 },
  },
  {
    id: "black-peon-7",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 6, y: 6 },
  },
  {
    id: "black-peon-8",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'black',
    rotate: 0,
    coords: { x: 7, y: 6 },
  },
  
  // Peças brancas (linha 0 - peças maiores)
  {
    id: "white-rook-1",
    alive: true,
    type: 'rook',
    color: 'white',
    rotate: 180,
    coords: { x: 0, y: 0 },
  },
  {
    id: "white-knight-1",
    alive: true,
    type: 'knight',
    color: 'white',
    rotate: 180,
    coords: { x: 1, y: 0 },
  },
  {
    id: "white-bishop-1",
    alive: true,
    type: 'bishop',
    color: 'white',
    rotate: 180,
    coords: { x: 2, y: 0 },
  },
  {
    id: "white-queen-1",
    alive: true,
    type: 'queen',
    color: 'white',
    rotate: 180,
    coords: { x: 3, y: 0 },
  },
  {
    id: "white-king-1",
    alive: true,
    type: 'king',
    color: 'white',
    rotate: 180,
    coords: { x: 4, y: 0 },
  },
  {
    id: "white-bishop-2",
    alive: true,
    type: 'bishop',
    color: 'white',
    rotate: 180,
    coords: { x: 5, y: 0 },
  },
  {
    id: "white-knight-2",
    alive: true,
    type: 'knight',
    color: 'white',
    rotate: 180,
    coords: { x: 6, y: 0 },
  },
  {
    id: "white-rook-2",
    alive: true,
    type: 'rook',
    color: 'white',
    rotate: 180,
    coords: { x: 7, y: 0 },
  },
  // Peões brancos (linha 1)
  {
    id: "white-peon-1",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 0, y: 1 },
  },
  {
    id: "white-peon-2",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 1, y: 1 },
  },
  {
    id: "white-peon-3",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 2, y: 1 },
  },
  {
    id: "white-peon-4",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 3, y: 1 },
  },
  {
    id: "white-peon-5",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 4, y: 1 },
  },
  {
    id: "white-peon-6",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 5, y: 1 },
  },
  {
    id: "white-peon-7",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 6, y: 1 },
  },
  {
    id: "white-peon-8",
    alive: true,
    type: 'peon',
    firstMove: true,
    color: 'white',
    rotate: 180,
    coords: { x: 7, y: 1 },
  },
];
