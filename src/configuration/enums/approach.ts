enum Approach {
  manual,
  generation,
}

function parseApproach(approach: string): Approach {
  // TODO Consider better way of handling this. Does TypeScript offer something cool here?
  switch (approach) {
    case "Manual":
      return Approach.manual;
    case "Generation":
      return Approach.generation;
  }

  throw new Error(`This approach is not handled: ${approach}`);
}

export { Approach, parseApproach };
