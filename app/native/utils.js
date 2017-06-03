export const Persons = {
  // super fragile...
  initials: friend => {
    if (friend) {
      const { name } = friend;
      return name[0] + name.split(' ')[1][0];
    }
    return '';
  }
};

export const Arrays = {
  remove: (array, idxRem) =>
    array.reduce((agg, elem, idx) => {
      if (idx === idxRem) {
        // skip element
        return agg;
      }

      agg.push(Object.assign({}, elem));

      return agg;
    },
    []
  ),

  removeWhere: (array, hasCondition) =>
    array.reduce((agg, elem) => {
      if (hasCondition(elem)) {
        return agg;
      }

      agg.push(Object.assign({}, elem));

      return agg;
    }, []
  ),

  insert: (array, idxNew, elemNew) =>
    array.reduce((agg, elem, idx) => {
      if (idx === idxNew) {
        return agg.concat([elemNew, elem]);
      }

      agg.push(Object.assign({}, elem));

      return agg;
    },
    []
  )
};

export const Log = {
  promise: msg => {
    return v => {
      console.log(msg, JSON.stringify(v, null, 2));
      return v;
    };
  }
};
