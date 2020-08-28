function makeMovesArray() {
  return [
    {
      id: 1,
      gameId: 'e1564da3-797a-4fb1-975e-4f3935d7eeca',
      moveType: 'selection',
      value: 10,
    },
    {
      id: 2,
      gameId: 'e1564da3-797a-4fb1-975e-4f3935d7eeca',
      moveType: 'placement',
      value: 0,
    },
    {
      id: 3,
      gameId: 'e1564da3-797a-4fb1-975e-4f3935d7eeca',
      moveType: 'selection',
      value: 6,
    },
    {
      id: 4,
      gameId: 'e1564da3-797a-4fb1-975e-4f3935d7eeca',
      moveType: 'placement',
      value: 3,
    },
    {
      id: 5,
      gameId: 'e1564da3-797a-4fb1-975e-4f3935d7eeca',
      moveType: 'selection',
      value: 5,
    },
    {
      id: 6,
      gameId: 'e1564da3-797a-4fb1-975e-4f3935d7eeca',
      moveType: 'placement',
      value: 2,
    },
    {
      id: 17,
      gameId: 'e1564da3-797a-4fb1-975e-4f3935d7eeca',
      moveType: 'selection',
      value: 1,
    },
  ];
}

const expectedMovesArray = [
  {
    moveType: 'selection',
    value: 10,
  },
  {
    moveType: 'placement',
    value: 0,
  },
  {
    moveType: 'selection',
    value: 6,
  },
  {
    moveType: 'placement',
    value: 3,
  },
  {
    moveType: 'selection',
    value: 5,
  },
  {
    moveType: 'placement',
    value: 2,
  },
  {
    moveType: 'selection',
    value: 1,
  },
];

module.exports = {
  makeMovesArray,
  expectedMovesArray,
};
