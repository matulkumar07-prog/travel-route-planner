// Nearest Neighbour Algorithm - O(n²)
// Greedy approach: always visit the nearest unvisited city

const nearestNeighbour = (distanceMatrix) => {
  const startTime = Date.now();
  const n = distanceMatrix.length;
  const visited = new Array(n).fill(false);
  const path = [];
  let currentCity = 0;
  visited[0] = true;
  path.push(0);
  let totalDistance = 0;
  let pathsExplored = 1;

  for (let i = 0; i < n - 1; i++) {
    let nearestCity = -1;
    let minDistance = Infinity;

    // Find nearest unvisited city
    for (let j = 0; j < n; j++) {
      if (!visited[j] && distanceMatrix[currentCity][j] < minDistance) {
        minDistance = distanceMatrix[currentCity][j];
        nearestCity = j;
      }
    }

    if (nearestCity === -1) break;

    visited[nearestCity] = true;
    path.push(nearestCity);
    totalDistance += minDistance;
    currentCity = nearestCity;
    pathsExplored++;
  }

  // Return to starting city
  totalDistance += distanceMatrix[currentCity][0];

  const executionTime = Date.now() - startTime;
  return {
    path,
    totalDistance: Math.round(totalDistance * 100) / 100,
    executionTime,
    pathsExplored
  };
};

module.exports = nearestNeighbour;
