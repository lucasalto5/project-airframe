// ============================================================================
// PROJECT AIRFRAME - DETERMINISTIC SEEDED PSEUDO-RANDOM NUMBER GENERATOR
// ============================================================================

export class SeededRNG {
  private state: [number, number, number, number];

  constructor(seed: number = 123456789) {
    this.state = this.initializeState(seed);
  }

  private initializeState(seed: number): [number, number, number, number] {
    let s = Math.abs(Math.floor(seed)) || 1;
    const state: [number, number, number, number] = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      s = (s ^ (s << 13)) >>> 0;
      s = (s ^ (s >>> 17)) >>> 0;
      s = (s ^ (s << 5)) >>> 0;
      state[i] = s || 1;
    }
    return state;
  }

  /**
   * Returns a float in [0, 1) using xorshift128+
   */
  public nextFloat(): number {
    let [x, y, z, w] = this.state;
    const t = (x ^ (x << 11)) >>> 0;
    x = y;
    y = z;
    z = w;
    w = (w ^ (w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    this.state = [x, y, z, w];
    return (w >>> 0) / 4294967296;
  }

  /**
   * Returns an integer in [min, max] inclusive
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  /**
   * Returns a float in [min, max)
   */
  public nextRange(min: number, max: number): number {
    return min + this.nextFloat() * (max - min);
  }

  /**
   * Returns true with given probability [0, 1]
   */
  public nextBool(probability: number = 0.5): boolean {
    return this.nextFloat() < probability;
  }

  /**
   * Picks a random element from an array
   */
  public pick<T>(items: T[]): T {
    if (items.length === 0) throw new Error("Cannot pick from empty array");
    const index = this.nextInt(0, items.length - 1);
    return items[index];
  }

  /**
   * Samples a normal distribution using Box-Muller transform
   */
  public nextGaussian(mean: number = 0, standardDeviation: number = 1): number {
    let u = 0, v = 0;
    while (u === 0) u = this.nextFloat();
    while (v === 0) v = this.nextFloat();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * standardDeviation;
  }

  /**
   * State serialization for save files
   */
  public getState(): [number, number, number, number] {
    return [...this.state];
  }

  public setState(state: [number, number, number, number]): void {
    this.state = [...state];
  }
}

export const globalRNG = new SeededRNG(20160101);
