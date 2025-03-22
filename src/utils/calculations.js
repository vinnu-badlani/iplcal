/**
 * Calculate profit for a specific bet
 * @param {number} stake - The amount bet
 * @param {number} odds - The decimal odds
 * @param {number} totalStake - Total stake across all bets
 * @returns {number} - Profit if this bet wins
 */
export const calculateProfit = (stake, odds, totalStake) => {
    return stake * odds - totalStake;
  };
  
  /**
   * Calculate balanced stakes to get equal profit regardless of outcome
   * @param {number} odds1 - Team 1 odds
   * @param {number} odds2 - Team 2 odds
   * @param {number} totalStake - Total amount to be distributed
   * @returns {Object} - Balanced stakes for each team
   */
  export const calculateBalancedStakes = (odds1, odds2, totalStake) => {
    // The ratio ensures equal profit regardless of which team wins
    const ratio = odds2 / (odds1 + odds2);
    const stake1 = totalStake * ratio;
    const stake2 = totalStake - stake1;
    
    return { stake1, stake2 };
  };
  
  /**
   * Calculate stakes for maximum profit (higher risk)
   * @param {number} odds1 - Team 1 odds
   * @param {number} odds2 - Team 2 odds
   * @param {number} totalStake - Total amount to be distributed
   * @returns {Object} - Stakes maximized for potential profit
   */
  export const calculateMaxProfitStakes = (odds1, odds2, totalStake) => {
    // Put all stake on the team with higher odds
    const higherOdds = odds1 > odds2;
    return {
      stake1: higherOdds ? totalStake : 0,
      stake2: higherOdds ? 0 : totalStake
    };
  };
  
  /**
   * Calculate stakes for high chance mode (favoring likely winner)
   * @param {number} odds1 - Team 1 odds
   * @param {number} odds2 - Team 2 odds
   * @param {number} totalStake - Total amount to be distributed
   * @returns {Object} - Stakes favoring the likely winner (lower odds)
   */
  export const calculateHighChanceStakes = (odds1, odds2, totalStake) => {
    // Team with lower odds is statistically more likely to win
    const lowerOdds = odds1 < odds2;
    // Allocate 70% to the likely winner
    const favoredRatio = 0.7;
    
    return {
      stake1: lowerOdds ? totalStake * favoredRatio : totalStake * (1 - favoredRatio),
      stake2: lowerOdds ? totalStake * (1 - favoredRatio) : totalStake * favoredRatio
    };
  };
  
  /**
   * Calculate stakes for low stake wins mode
   * @param {number} odds1 - Team 1 odds
   * @param {number} odds2 - Team 2 odds
   * @param {number} totalStake - Total amount to be distributed
   * @returns {Object} - Stakes favoring the team with lower odds
   */
  export const calculateLowStakeWinsMode = (odds1, odds2, totalStake) => {
    // Favor the team with lower odds by allocating 80% of stake
    const lowerOdds = odds1 < odds2;
    return {
      stake1: lowerOdds ? totalStake * 0.8 : totalStake * 0.2,
      stake2: lowerOdds ? totalStake * 0.2 : totalStake * 0.8
    };
  };