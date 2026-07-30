import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { calculateRiskForAll } from './utils/riskScore.js';
import { calculateAgingForAll } from './utils/aging.js';
import data from '../public/data/poams.json' with { type: 'json' };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const agedItems = calculateAgingForAll(data);
console.log("Aging test:", agedItems.map(item => ({
  id: item.id,
  status: item.status,
  daysOverdue: item.daysOverdue,
  slaStatus: item.slaStatus,
  percentUsed: item.slaPercentUsed
})));


const scoredItems = calculateRiskForAll(data);

const testItem = scoredItems.find(i => i.severity === 'High' && i.assetCriticality === 'Critical');
console.log("Risk score for high/critical item:", testItem.riskScore);

const acceptedItem = scoredItems.find(i => i.status === 'Risk Accepted');
console.log("Risk accepted item score (should be <= 5.0):", acceptedItem.riskScore);

const completedItem = scoredItems.find(i => i.status === 'Completed');
console.log("Completed item score (should be 0):", completedItem.riskScore);
