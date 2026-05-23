'use client';

import { useState, useEffect } from 'react';
import { usePetStore } from '../../store/petStore';

export default function DashboardPage() {
  const { pet, xp, level, stats } = usePetStore();
  const [displayStats, setDisplayStats] = useState(null);

  useEffect(() => {
    // Calculate stats from pet store
    setDisplayStats({
      level: level || 1,
      xp: xp || 0,
      nextLevelXp: (level || 1) * 100,
      mood: pet?.mood || 'happy',
      hunger: pet?.hunger || 50,
      energy: pet?.energy || 80,
      missionsCompleted: stats?.missionsCompleted || 0,
      codeRuns: stats?.codeRuns || 0,
      achievements: stats?.achievements || 0,
    });
  }, [pet, xp, level, stats]);

  if (!displayStats) return <div style={{ color: '#CDD6F4' }}>Loading...</div>;

  const xpProgress = (displayStats.xp / displayStats.nextLevelXp) * 100;

  return (
    <div style={{ backgroundColor: '#1E1E2E', color: '#CDD6F4', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ color: '#F38BA8', marginBottom: '2rem' }}>Dashboard</h1>

      {/* Player Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
      }}>
        {/* Level & XP Card */}
        <div style={{
          backgroundColor: '#313244',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #A6E3A1',
        }}>
          <h3 style={{ color: '#A6E3A1', marginBottom: '1rem' }}>Level & Experience</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#89B4FA' }}>Level {displayStats.level}</p>
          <p style={{ color: '#CDD6F4', marginBottom: '0.5rem' }}>
            {displayStats.xp} / {displayStats.nextLevelXp} XP
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#45475A',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${xpProgress}%`,
              height: '100%',
              backgroundColor: '#A6E3A1',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Pet Status Card */}
        <div style={{
          backgroundColor: '#313244',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #F38BA8',
        }}>
          <h3 style={{ color: '#F38BA8', marginBottom: '1rem' }}>Pet Status</h3>
          <p style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#CDD6F4' }}>Mood: </span>
            <span style={{ color: '#A6E3A1' }}>{displayStats.mood}</span>
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#CDD6F4' }}>Hunger: </span>
            <span style={{ color: '#F38BA8' }}>{displayStats.hunger}%</span>
          </p>
          <p>
            <span style={{ color: '#CDD6F4' }}>Energy: </span>
            <span style={{ color: '#89B4FA' }}>{displayStats.energy}%</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          backgroundColor: '#313244',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #89B4FA',
        }}>
          <h3 style={{ color: '#89B4FA', marginBottom: '1rem' }}>Quick Stats</h3>
          <p style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#CDD6F4' }}>Missions Completed: </span>
            <span style={{ color: '#F9E2AF' }}>{displayStats.missionsCompleted}</span>
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#CDD6F4' }}>Code Runs: </span>
            <span style={{ color: '#F9E2AF' }}>{displayStats.codeRuns}</span>
          </p>
          <p>
            <span style={{ color: '#CDD6F4' }}>Achievements: </span>
            <span style={{ color: '#F9E2AF' }}>{displayStats.achievements}</span>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
        flexWrap: 'wrap',
      }}>
        <a href="/missions" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#A6E3A1',
          color: '#1E1E2E',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}>
          📚 Missions
        </a>
        <a href="/playground/1" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#89B4FA',
          color: '#1E1E2E',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}>
          🎮 Playground
        </a>
        <a href="/shop" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#F38BA8',
          color: '#1E1E2E',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}>
          🛍️ Shop
        </a>
      </div>
    </div>
  );
}
