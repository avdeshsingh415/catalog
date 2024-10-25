const fs = require('fs');

// Function to load input from a JSON file
function loadInput(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
}

// Function to decode a value from a given base
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to get the points (x, y) from the input data
function getPoints(data) {
    const points = [];
    for (const key in data) {
        if (key === 'keys') continue;
        const x = parseInt(key);
        const base = parseInt(data[key].base);
        const y = decodeValue(base, data[key].value);
        points.push([x, y]);
    }
    return points;
}

// Function to perform Lagrange interpolation
function lagrangeInterpolation(points, xVal = 0) {
    let total = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        const [xi, yi] = points[i];
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const [xj, _] = points[j];
                li *= (xVal - xj) / (xi - xj);
            }
        }

        total += yi * li;
    }

    return Math.round(total);
}

// Main function to find the secret constant term
function findSecret(filename) {
    // Load and parse input
    const data = loadInput(filename);

    // Get the number of required points
    const n = data.keys.n;
    const k = data.keys.k;

    // Decode points
    const points = getPoints(data);

    // Ensure there are at least k points
    if (points.length < k) {
        throw new Error('Not enough points provided.');
    }

    // Find the constant term using Lagrange interpolation
    const secret = lagrangeInterpolation(points.slice(0, k));
    return secret;
}

// Example usage
const filename = 'input.json';
try {
    const secret = findSecret(filename);
    console.log(`The secret constant term is: ${secret}`);
} catch (error) {
    console.error(`An error occurred: ${error.message}`);
}
