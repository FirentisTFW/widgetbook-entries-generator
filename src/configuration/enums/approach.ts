enum Approach {
  manual,
  generation,
}

function parseApproach(approach: string): Approach {
  switch (approach) {
    case "Manual":
      return Approach.manual;
    case "Generation":
      return Approach.generation;
  }

  throw new Error(`This approach is not handled: ${approach}`);
}

export { Approach, parseApproach };
