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
    }, []),

  range: (len, mapFn = () => {}) =>
    Array.from(new Array(len), (x, idx) => mapFn(idx))
};

export const Log = {
  promise: msg => {
    return v => {
      console.log(msg, v);
      return v;
    };
  }
};
