const recentRequests = [];
const maxStoredRequests = 25;

function storeRequestSnapshot(snapshot) {
  recentRequests.unshift(snapshot);
  if (recentRequests.length > maxStoredRequests) {
    recentRequests.length = maxStoredRequests;
  }
}

function getRecentRequests() {
  return recentRequests;
}

module.exports = {
  storeRequestSnapshot,
  getRecentRequests,
};
