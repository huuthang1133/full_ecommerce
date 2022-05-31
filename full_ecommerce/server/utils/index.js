module.exports.paginateResults = ({
  after: cursor,
  pageSize = 3,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex((item) => {
    let itemFind = results.find((item) => item._id.toString() === cursor);
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = itemFind ? itemFind : getCursor(item);
    // if there's still not a cursor, return false by default
    return itemCursor ? itemCursor : false;
  });

  // cursor: products.length ? products[products.length - 1].cursor : null,
  // if the cursor at the end of the paginated results is the same as the
  // last item in _all_ results, then there are no more results after this

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};
