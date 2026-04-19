// Brute Force Algorithm - O(n!)
// Tries all possible permutations and finds the shortest path
// WARNING: Only practical for n <= 8 cities due to factorial complexity

const bruteForce = (distanceMatrix) => {
  const startTime = Date.now();
  const n = distanceMatrix.length;

  // Only allow up to 8 cities for brute force
  if (n > 8) {
    throw new Error('Brute Force Algorithm: Maximum 8 cities allowed. Got ' + n + ' cities.');
  }

  // Generate all permutations
  const permute = (arr) => {
    if (arr.length <= 1) return [arr];
    const perms = [];
    const restPerms = permute(arr.slice(1));
    for (let perm of restPerms) {
      for (let i = 0; i <= perm.length; i++) {
        perms.push([...perm.slice(0, i), arr[0], ...perm.slice(i)]);
      }
    }
    return perms;
  };

  // Create array of cities [0, 1, 2, ..., n-1]
  const cities = Array.from({ length: n }, (_, i) => i);

  // Generate all permutations starting from city 0
  const permutations = permute(cities.slice(1)).map(perm => [0, ...perm]);

  // Find the shortest path
  let shortestPath = null;
  let shortestDistance = Infinity;

  for (let path of permutations) {
    let distance = 0;
    for (let i = 0; i < n; i++) {
      distance += distanceMatrix[path[i]][path[(i + 1) % n]];
    }

    if (distance < shortestDistance) {
      shortestDistance = distance;
      shortestPath = path;
    }
  }

  const executionTime = Date.now() - startTime;
  return {
    path: shortestPath,
    totalDistance: Math.round(shortestDistance * 100) / 100,
    executionTime,
    pathsExplored: permutations.length
  };
};

module.exports = bruteForce;
