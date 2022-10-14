const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || 1;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit; //if return 0, mongo will return all data

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
