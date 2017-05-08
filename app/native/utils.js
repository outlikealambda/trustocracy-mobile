// super fragile...
export function initials (friend) {
  if (friend) {
    const { name } = friend;
    return name[0] + name.split(' ')[1][0];
  }
  return '';
}

export const array = {
  remove: (array, idxRem) =>
      array.reduce((agg, elem, idx) => {
        if (idx === idxRem) {
          // skip element
          return agg;
        }
        agg.push(elem);
        return agg;
      },
      []
    ),
  insert: (array, idxNew, elemNew) =>
      array.reduce((agg, elem, idx) => {
        if (idx === idxNew) {
          return agg.concat([elemNew, elem]);
        }

        agg.push(elem);
        return agg;
      },
      []
    )
};
