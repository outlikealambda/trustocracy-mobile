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
  insert: (array, idxNew, item) => {
    const copy = array.slice(array);
    copy.splice(idxNew, 0, item);

    return copy;
  },

  remove: (array, idxRem) => {
    const copy = array.slice(array);
    copy.splice(idxRem, 1);
    return copy;
  },

  removeWhere: (array, hasCondition) =>
    array.reduce((agg, elem) => {
      if (hasCondition(elem)) {
        return agg;
      }

      agg.push(Object.assign({}, elem));

      return agg;
    }, []
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
