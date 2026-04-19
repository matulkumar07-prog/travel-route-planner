// Held-Karp Dynamic Programming Algorithm - O(n²·2ⁿ)
// Optimal solution using dynamic programming
// Works for up to 15-20 cities in reasonable time

const heldKarp = (distanceMatrix) => {
  const startTime = Date.now();
  const n = distanceMatrix.length;

  // Only allow up to 20 cities for DP to avoid excessive memory
  if (n > 20) {
    throw new Error('Held-Karp Algorithm: Maximum 20 cities allowed. Got ' + n + ' cities.');
  }

  // memo[mask][i] = [min_cost, prev_city]
  const memo = {};
  let pathsExplored = 0;

  const tsp = (mask, pos) => {
    pathsExplored++;

    // All cities visited
    if (mask === (1 << n) - 1) {
      return [distanceMatrix[pos][0], -1];
    }

    // Check memo
    const key = `${mask},${pos}`;
    if (memo[key]) {
      return memo[key];
    }

    let minCost = Infinity;
    let nextCity = -1;

    // Try visiting each unvisited city
    for (let next = 0; next < n; next++) {
      if (!(mask & (1 << next))) {
        const newMask = mask | (1 << next);
        const [cost, _] = tsp(newMask, next);
        const totalCost = distanceMatrix[pos][next] + cost;

        if (totalCost < minCost) {
          minCost = totalCost;
          nextCity = next;
        }
      }
    }

    memo[key] = [minCost, nextCity];
    return [minCost, nextCity];
  };

  // Start from city 0
  const [minCost, _] = tsp(1, 0);

  // Reconstruct path
  const path = [0];
  let mask = 1;
  let pos = 0;

  while (mask !== (1 << n) - 1) {
    const key = `${mask},${pos}`;
    const nextCity = memo[key][1];
    path.push(nextCity);
    mask |= (1 << nextCity);
    pos = nextCity;
  }

  const executionTime = Date.now() - startTime;
  return {
    path,
    totalDistance: Math.round(minCost * 100) / 100,
    executionTime,
    pathsExplored
  };
};

module.exports = heldKarp;
