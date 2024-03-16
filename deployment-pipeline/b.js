import conventionalRecommendedBump from 'conventional-recommended-bump';

const recommendation = await conventionalRecommendedBump({
  preset: `angular`
});

console.log(recommendation); // 'major'