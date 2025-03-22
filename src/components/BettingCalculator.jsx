import React, { useState, useEffect } from 'react';

const BettingCalculator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [team1, setTeam1] = useState('csk');
  const [team2, setTeam2] = useState('mi');
  const [totalStake, setTotalStake] = useState(2000);
  const [odds1, setOdds1] = useState(1.8);
  const [odds2, setOdds2] = useState(2.1);
  const [activeMode, setActiveMode] = useState('balanced');
  const [specialCase, setSpecialCase] = useState(false);
  const [results, setResults] = useState({ 
    stakeDistribution: { stake1: 0, stake2: 0 },
    outcomes: { profit1: 0, profit2: 0, bothWin: 0 }
  });

  // Team data with logos
  const teams = [
    { id: 'csk', name: 'Chennai Super Kings', color: '#FFFF00' },
    { id: 'mi', name: 'Mumbai Indians', color: '#0000FF' },
    { id: 'rcb', name: 'Royal Challengers Bangalore', color: '#FF0000' },
    { id: 'kkr', name: 'Kolkata Knight Riders', color: '#800080' },
    { id: 'dc', name: 'Delhi Capitals', color: '#0000FF' },
    { id: 'pbks', name: 'Punjab Kings', color: '#FF0000' },
    { id: 'rr', name: 'Rajasthan Royals', color: '#FF69B4' },
    { id: 'srh', name: 'Sunrisers Hyderabad', color: '#FFA500' },
    { id: 'gt', name: 'Gujarat Titans', color: '#00FFFF' },
    { id: 'lsg', name: 'Lucknow Super Giants', color: '#00FF00' },
  ];
//mi
  // Mode information for tooltips
  const modeInfo = {
    balanced: "Distributes stakes to balance profit/loss regardless of outcome",
    maxProfit: "Allocates more to higher odds for maximum potential profit (higher risk)",
    highChance: "Places more stake on the likely winner (team with lower odds)",
    lowStakeWins: "Higher stake on team with lower odds for better security",
    specialCase: "Special case: Both teams can win based on bonus conditions (e.g., hitting sixes in early overs)"
  };

  // Calculate all results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [totalStake, odds1, odds2, activeMode, team1, team2, specialCase]);

  const calculateResults = () => {
    // Parse numeric inputs
    const parsedTotalStake = parseFloat(totalStake) || 0;
    const parsedOdds1 = parseFloat(odds1) || 1;
    const parsedOdds2 = parseFloat(odds2) || 1;
    
    // Calculate balanced stakes
    const ratio = parsedOdds2 / (parsedOdds1 + parsedOdds2);
    const balancedStake1 = parsedTotalStake * ratio;
    const balancedStake2 = parsedTotalStake - balancedStake1;

    // Max profit mode: put more on higher odds
    const higherOdds = parsedOdds1 > parsedOdds2;
    const maxProfitStake1 = higherOdds ? parsedTotalStake * 0.8 : parsedTotalStake * 0.2;
    const maxProfitStake2 = parsedTotalStake - maxProfitStake1;

    // High chance mode: more stake on likely winning team (lower odds)
    const lowerOdds = parsedOdds1 < parsedOdds2;
    const highChanceStake1 = lowerOdds ? parsedTotalStake * 0.7 : parsedTotalStake * 0.3;
    const highChanceStake2 = parsedTotalStake - highChanceStake1;

    // Low stake wins mode: higher stake on lower odds
    const lowOddsStake1 = parsedOdds1 < parsedOdds2 ? parsedTotalStake * 0.8 : parsedTotalStake * 0.2;
    const lowOddsStake2 = parsedTotalStake - lowOddsStake1;

    // Special case mode: distribute stakes for potential both-win scenario
    const specialCaseStake1 = parsedTotalStake * 0.5;
    const specialCaseStake2 = parsedTotalStake * 0.5;

    // Determine which stakes to use based on active mode
    let activeStakes = { stake1: balancedStake1, stake2: balancedStake2 };
    
    switch (activeMode) {
      case 'maxProfit':
        activeStakes = { stake1: maxProfitStake1, stake2: maxProfitStake2 };
        break;
      case 'highChance':
        activeStakes = { stake1: highChanceStake1, stake2: highChanceStake2 };
        break;
      case 'lowStakeWins':
        activeStakes = { stake1: lowOddsStake1, stake2: lowOddsStake2 };
        break;
      case 'specialCase':
        activeStakes = { stake1: specialCaseStake1, stake2: specialCaseStake2 };
        break;
      default:
        // balanced is default
        break;
    }

    // Calculate profit outcomes based on active stakes
    const profit1 = activeStakes.stake1 * parsedOdds1 - parsedTotalStake;
    const profit2 = activeStakes.stake2 * parsedOdds2 - parsedTotalStake;
    
    // Special case - both win scenario
    const bothWin = specialCase ? 
      (activeStakes.stake1 * parsedOdds1 + activeStakes.stake2 * parsedOdds2) - parsedTotalStake : 
      null;

    setResults({
      stakeDistribution: activeStakes,
      outcomes: { profit1, profit2, bothWin }
    });
  };

  const getTeamInitials = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.id.toUpperCase() : '';
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : '';
  };

  const getTeamColor = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.color : '#CCCCCC';
  };

  // CSS for the component
  const styles = {
    container: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? '#e5e7eb' : '#333333',
      transition: 'all 0.3s ease'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      paddingBottom: '12px',
      flexWrap: 'wrap'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 0 8px 0',
      color: darkMode ? '#ffffff' : '#111827',
      width: '100%'
    },
    headerControls: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px'
    },
    themeButton: {
      padding: '8px 12px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s'
    },
    card: {
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      backgroundImage: darkMode ? 
        'linear-gradient(to right, #1f2937, #263142)' : 
        'linear-gradient(to right, #f9fafb, #f3f4f6)'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: darkMode ? '#e5e7eb' : '#111827',
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: darkMode ? '#d1d5db' : '#4b5563'
    },
    selectWrapper: {
      position: 'relative'
    },
    select: {
      width: '100%',
      padding: '10px 16px',
      paddingLeft: '40px',
      border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '6px',
      backgroundColor: darkMode ? '#374151' : '#ffffff',
      color: darkMode ? '#e5e7eb' : '#111827',
      fontSize: '14px',
      appearance: 'none'
    },
    input: {
      width: '100%',
      padding: '10px 16px',
      border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '6px',
      backgroundColor: darkMode ? '#374151' : '#ffffff',
      color: darkMode ? '#e5e7eb' : '#111827',
      fontSize: '14px'
    },
    checkbox: {
      marginRight: '8px'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '16px',
      padding: '8px',
      borderRadius: '6px',
      backgroundColor: darkMode ? '#374151' : '#f3f4f6'
    },
    teamBadge: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      color: '#000',
      fontWeight: 'bold',
      fontSize: '12px',
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    resultsCard: {
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: darkMode ? '#374151' : '#ffffff',
      borderLeft: '4px solid',
      transition: 'all 0.2s ease'
    },
    teamHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px'
    },
    progressBarContainer: {
      width: '100%',
      height: '6px',
      backgroundColor: darkMode ? '#4b5563' : '#e5e7eb',
      borderRadius: '3px',
      marginTop: '8px',
      marginBottom: '8px'
    },
    progressBar: {
      height: '100%',
      borderRadius: '3px',
      backgroundColor: '#3b82f6'
    },
    resultsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '14px'
    },
    modeButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px'
    },
    modeButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '13px'
    },
    modeInfo: {
      padding: '12px',
      borderRadius: '6px',
      backgroundColor: darkMode ? '#4b5563' : '#f9fafb',
      fontSize: '14px',
      marginBottom: '16px'
    },
    summaryCard: {
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: darkMode ? '#374151' : '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    summaryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    },
    summaryItem: {
      padding: '12px',
      textAlign: 'center',
      borderRadius: '8px',
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
    },
    summaryLabel: {
      fontSize: '12px',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginBottom: '4px'
    },
    summaryValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#111827'
    },
    disclaimer: {
      textAlign: 'center',
      fontSize: '12px',
      color: darkMode ? '#9ca3af' : '#6b7280',
      marginTop: '12px'
    },
    profitPositive: {
      color: '#10b981'
    },
    profitNegative: {
      color: '#ef4444'
    },
    bothWinCard: {
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: darkMode ? '#374151' : '#ffffff',
      borderLeft: '4px solid #10b981',
      marginTop: '16px'
    },
    bothWinHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px'
    },
    featuresContainer: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '16px'
    },
    featureTag: {
      padding: '4px 10px',
      backgroundColor: darkMode ? '#4b5563' : '#e5e7eb',
      color: darkMode ? '#e5e7eb' : '#4b5563',
      borderRadius: '16px',
      fontSize: '12px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>IPL Betting Calculator</h1>
        <div style={styles.headerControls}>
          <div style={{
            ...styles.featureTag,
            backgroundColor: '#3b82f6',
            color: '#ffffff'
          }}>
            IPL 2025
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={styles.themeButton}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      
      {/* Match Setup Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Match Setup</h2>
        
        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Team 1</label>
            <div style={styles.selectWrapper}>
              <div 
                style={{
                  ...styles.teamBadge,
                  backgroundColor: getTeamColor(team1)
                }}
              >
                {getTeamInitials(team1)}
              </div>
              <select 
                style={styles.select}
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Team 2</label>
            <div style={styles.selectWrapper}>
              <div 
                style={{
                  ...styles.teamBadge,
                  backgroundColor: getTeamColor(team2)
                }}
              >
                {getTeamInitials(team2)}
              </div>
              <select 
                style={styles.select}
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="specialCase"
            checked={specialCase}
            onChange={(e) => setSpecialCase(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="specialCase">
            Enable special case - both teams can win (hitting sixes in early overs)
          </label>
        </div>
      </div>
      
      {/* Betting Details Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Betting Details</h2>
        
        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Total Stake (₹)</label>
            <input
              type="number"
              value={totalStake}
              onChange={(e) => setTotalStake(e.target.value)}
              style={styles.input}
              placeholder="2000"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>{getTeamName(team1)} Odds</label>
            <input
              type="number"
              step="0.01"
              value={odds1}
              onChange={(e) => setOdds1(e.target.value)}
              style={styles.input}
              placeholder="1.80"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>{getTeamName(team2)} Odds</label>
            <input
              type="number"
              step="0.01"
              value={odds2}
              onChange={(e) => setOdds2(e.target.value)}
              style={styles.input}
              placeholder="2.10"
            />
          </div>
        </div>
      </div>
      
      {/* Betting Modes Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Betting Modes</h2>
        
        <div style={styles.modeButtons}>
          {['balanced', 'maxProfit', 'highChance', 'lowStakeWins', 'specialCase'].map(mode => (
            <button 
              key={mode}
              onClick={() => setActiveMode(mode)}
              style={{
                ...styles.modeButton,
                backgroundColor: activeMode === mode 
                  ? '#3b82f6' 
                  : darkMode ? '#4b5563' : '#e5e7eb',
                color: activeMode === mode 
                  ? '#ffffff' 
                  : darkMode ? '#e5e7eb' : '#4b5563'
              }}
            >
              {mode === 'balanced' ? 'Balanced' : 
               mode === 'maxProfit' ? 'Max Profit' : 
               mode === 'highChance' ? 'High Chance' : 
               mode === 'lowStakeWins' ? 'Low Stake Wins' :
               'Special Case'}
            </button>
          ))}
        </div>
        
        <div style={styles.modeInfo}>
          <strong>Mode Info:</strong> {modeInfo[activeMode]}
        </div>
      </div>
      
      {/* Results Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Results</h2>
        
        <div style={styles.grid}>
          <div 
            style={{
              ...styles.resultsCard,
              borderLeftColor: getTeamColor(team1)
            }}
          >
            <div style={styles.teamHeader}>
              <div 
                style={{
                  ...styles.teamBadge,
                  backgroundColor: getTeamColor(team1),
                  marginRight: '8px',
                  position: 'static'
                }}
              >
                {getTeamInitials(team1)}
              </div>
              <h3 style={{ fontWeight: 'bold', margin: 0 }}>{getTeamName(team1)}</h3>
            </div>
            
            <div>
              <div style={styles.resultsRow}>
                <span>Recommended Stake:</span>
                <span style={{ fontWeight: '500' }}>₹{Math.round(results.stakeDistribution.stake1)}</span>
              </div>
              
              <div style={styles.progressBarContainer}>
                <div 
                  style={{
                    ...styles.progressBar,
                    width: `${(results.stakeDistribution.stake1 / totalStake) * 100}%`
                  }}
                ></div>
              </div>
              
              <div style={styles.resultsRow}>
                <span>If Wins:</span>
                <span style={results.outcomes.profit1 >= 0 ? styles.profitPositive : styles.profitNegative}>
                  {results.outcomes.profit1 >= 0 ? '+ ' : ''}
                  ₹{Math.round(results.outcomes.profit1)}
                </span>
              </div>
              
              <div style={styles.resultsRow}>
                <span>Odds:</span>
                <span style={{ fontWeight: '500' }}>{parseFloat(odds1).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div 
            style={{
              ...styles.resultsCard,
              borderLeftColor: getTeamColor(team2)
            }}
          >
            <div style={styles.teamHeader}>
              <div 
                style={{
                  ...styles.teamBadge,
                  backgroundColor: getTeamColor(team2),
                  marginRight: '8px',
                  position: 'static'
                }}
              >
                {getTeamInitials(team2)}
              </div>
              <h3 style={{ fontWeight: 'bold', margin: 0 }}>{getTeamName(team2)}</h3>
            </div>
            
            <div>
              <div style={styles.resultsRow}>
                <span>Recommended Stake:</span>
                <span style={{ fontWeight: '500' }}>₹{Math.round(results.stakeDistribution.stake2)}</span>
              </div>
              
              <div style={styles.progressBarContainer}>
                <div 
                  style={{
                    ...styles.progressBar,
                    width: `${(results.stakeDistribution.stake2 / totalStake) * 100}%`
                  }}
                ></div>
              </div>
              
              <div style={styles.resultsRow}>
                <span>If Wins:</span>
                <span style={results.outcomes.profit2 >= 0 ? styles.profitPositive : styles.profitNegative}>
                  {results.outcomes.profit2 >= 0 ? '+ ' : ''}
                  ₹{Math.round(results.outcomes.profit2)}
                </span>
              </div>
              
              <div style={styles.resultsRow}>
                <span>Odds:</span>
                <span style={{ fontWeight: '500' }}>{parseFloat(odds2).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Special case - both win scenario */}
        {specialCase && (
          <div style={styles.bothWinCard}>
            <div style={styles.bothWinHeader}>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🏆</span> Special Case: Both Teams Win
              </span>
            </div>
            
            <div style={styles.resultsRow}>
              <span>Total Profit:</span>
              <span style={results.outcomes.bothWin >= 0 ? styles.profitPositive : styles.profitNegative}>
                {results.outcomes.bothWin >= 0 ? '+ ' : ''}
                ₹{Math.round(results.outcomes.bothWin)}
              </span>
            </div>
            
            <div style={{
              fontSize: '13px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              marginTop: '8px'
            }}>
              This applies when both teams fulfill bonus conditions (e.g., hitting sixes in early overs)
            </div>
          </div>
        )}
      </div>
      
      {/* Summary Card */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryHeader}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Summary</h2>
          <div style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
            Mode: <span style={{ color: '#3b82f6', fontWeight: '500' }}>
              {activeMode.charAt(0).toUpperCase() + activeMode.slice(1).replace(/([A-Z])/g, ' $1')}
            </span>
          </div>
        </div>
        
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Total Stake</div>
            <div style={styles.summaryValue}>₹{parseFloat(totalStake).toLocaleString()}</div>
          </div>
          
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Distribution</div>
            <div style={styles.summaryValue}>
              {Math.round((results.stakeDistribution.stake1 / totalStake) * 100)}% / {Math.round((results.stakeDistribution.stake2 / totalStake) * 100)}%
            </div>
          </div>
        </div>
        
        <div style={styles.featuresContainer}>
          <div style={styles.featureTag}>IPL 2025</div>
          <div style={styles.featureTag}>Multiple Betting Modes</div>
          <div style={styles.featureTag}>Special Cases Support</div>
          <div style={styles.featureTag}>Mobile Responsive</div>
        </div>
        
        <div style={styles.disclaimer}>
          This calculator is for informational purposes only. Always bet responsibly.
        </div>
      </div>
    </div>
  );
};

export default BettingCalculator;