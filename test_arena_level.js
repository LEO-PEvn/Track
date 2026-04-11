/**
 * Test script to verify arena avatar level display
 * Run this in browser console while in the arena to verify level is correct
 */

console.log('=== ARENA AVATAR LEVEL TEST ===\n');

// Get current student from session
const session = JSON.parse(localStorage.getItem('peHubSession') || 'null');
console.log('Current Session:', session);

if (session && session.userId) {
  // Load student data
  const studentsData = JSON.parse(localStorage.getItem('students') || '{}');
  const student = studentsData[session.userId];
  
  if (student) {
    console.log('\n✓ Student Found:', {
      name: `${student.firstName} ${student.familyName}`,
      studentId: student.studentId,
      xp: student.xp || 0,
      gloryPoints: student.gloryPoints || 0,
      arenaWins: student.arenaWins || 0
    });
    
    // Test level calculation
    const LEVEL_THRESHOLDS = [
      0,    10,   20,   30,   40,   50,   65,   80,   95,   110,
      130,  155,  180,  210,  240,  280,  320,  370,  420,  500,
      580,  670,  770,  880,  1000, 1130, 1270, 1420, 1580, 1750,
      1930, 2120, 2320, 2530, 2750, 2980, 3220, 3470, 3730, 4000,
      4280, 4570, 4870, 5180, 5500, 5830, 6170, 6520, 6880, 7250
    ];
    
    function calcLevel(xp) {
      let level = 1;
      for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
          level = i + 1;
        } else {
          break;
        }
      }
      return Math.min(level, 50);
    }
    
    const calculatedLevel = calcLevel(student.xp || 0);
    
    console.log('\n✓ Level Calculation:');
    console.log(`  XP: ${student.xp || 0}`);
    console.log(`  Calculated Level: ${calculatedLevel}`);
    
    // Check what the arena is showing
    const avatarLevelBadge = document.querySelector('.avatar-container-chibi');
    if (avatarLevelBadge) {
      const levelText = avatarLevelBadge.textContent;
      console.log(`  Arena Display Level: ${levelText}`);
      if (levelText.includes(`Lv${calculatedLevel}`)) {
        console.log('\n✅ SUCCESS: Arena avatar shows correct level!');
      } else {
        console.log('\n❌ ERROR: Arena avatar level mismatch!');
      }
    } else {
      console.log('\n⚠️  Could not find avatar element in DOM');
    }
    
    // Show progression stats
    if (calculatedLevel < 50) {
      const nextThreshold = LEVEL_THRESHOLDS[calculatedLevel] || LEVEL_THRESHOLDS[49];
      const currentThreshold = LEVEL_THRESHOLDS[calculatedLevel - 1] || 0;
      const xpInLevel = (student.xp || 0) - currentThreshold;
      const xpNeeded = nextThreshold - currentThreshold;
      console.log(`\n✓ Progression to Level ${calculatedLevel + 1}:`);
      console.log(`  ${xpInLevel} / ${xpNeeded} XP (${Math.round((xpInLevel / xpNeeded) * 100)}%)`);
    } else {
      console.log('\n✓ Max Level Reached: 50');
    }
  } else {
    console.log('❌ Student not found in localStorage');
  }
} else {
  console.log('❌ No active session found');
}
