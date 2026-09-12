import React, { useState, useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  createHashHistory
} from '@tanstack/react-router';
import { useGame } from './context/GameStateContext';
import { audioService } from './services/audioService';
import { ActiveTab, Quest } from './types';

// Layout
import { Layout } from './components/layout/Layout';

// Modals
import { CreateQuestModal } from './components/quest/CreateQuestModal';
import { QuestDetailModal } from './components/quest/QuestDetailModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { CharacterPage } from './pages/CharacterPage';
import { WorldPage } from './pages/WorldPage';
import { OraclePage } from './pages/OraclePage';
import { ReplayPage } from './pages/ReplayPage';
import { InventoryPage } from './pages/InventoryPage';
import { SettingsPage } from './pages/SettingsPage';

// Meta tag updater helper
function updateScreenMeta(title: string, description: string) {
  document.title = `${title} // LIFE//OS`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  }
}

// Define Root Route using shared Layout component
const rootRoute = createRootRoute({
  component: Layout
});

// Route 1: Landing Page
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function LandingRoute() {
    const navigate = useNavigate();
    useEffect(() => {
      updateScreenMeta('Ascend Real Life', 'Turn progress into a world worth returning to — a tactile futuristic Life RPG.');
    }, []);
    return <LandingPage onEnterApp={() => navigate({ to: '/command' })} />;
  }
});

// Route 1b: Explicit Landing Page Route
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing',
  component: function ExplicitLandingRoute() {
    const navigate = useNavigate();
    useEffect(() => {
      updateScreenMeta('Ascend Real Life', 'Turn progress into a world worth returning to — a tactile futuristic Life RPG.');
    }, []);
    return <LandingPage onEnterApp={() => navigate({ to: '/command' })} />;
  }
});

// Route 2: Command Center
const commandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/command',
  component: function CommandRoute() {
    const navigate = useNavigate();
    const [inspectedQuest, setInspectedQuest] = useState<Quest | null>(null);
    const [isForgeOpen, setIsForgeOpen] = useState(false);
    const {
      player,
      attributes,
      quests,
      boss,
      regions,
      oracle,
      replayDays,
      completeQuest,
      createQuest,
      damageBoss
    } = useGame();

    useEffect(() => {
      updateScreenMeta('Command Center', 'High-leverage life operations, biospheric equilibrium, and today\'s quest stack.');
    }, []);

    const pathMap: Record<ActiveTab, string> = {
      landing: '/',
      dashboard: '/command',
      quests: '/quests',
      character: '/character',
      world: '/world',
      oracle: '/oracle',
      replay: '/replay',
      inventory: '/inventory',
      settings: '/settings'
    };

    return (
      <>
        <DashboardPage
          player={player}
          attributes={attributes}
          quests={quests}
          boss={boss}
          regions={regions}
          oracle={oracle}
          replayDays={replayDays}
          onCompleteQuest={(id) => completeQuest(id)}
          onInspectQuest={(quest) => setInspectedQuest(quest)}
          onOpenCreateQuest={() => setIsForgeOpen(true)}
          onNavigateTab={(tab) => navigate({ to: pathMap[tab as ActiveTab] || '/command' })}
          onSimulateBossHit={(dmg) => damageBoss(dmg)}
        />
        <QuestDetailModal
          quest={inspectedQuest}
          onClose={() => setInspectedQuest(null)}
          onComplete={(id) => completeQuest(id)}
        />
        <CreateQuestModal
          isOpen={isForgeOpen}
          onClose={() => setIsForgeOpen(false)}
          onCreateQuest={(qData) => createQuest(qData)}
        />
      </>
    );
  }
});

// Route 3: Quests
const questsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quests',
  component: function QuestsRoute() {
    const [inspectedQuest, setInspectedQuest] = useState<Quest | null>(null);
    const [isForgeOpen, setIsForgeOpen] = useState(false);
    const { quests, completeQuest, createQuest } = useGame();

    useEffect(() => {
      updateScreenMeta('Quest Matrix', 'Turn real-life goals into quests, rewards, and progression.');
    }, []);

    return (
      <>
        <QuestsPage
          quests={quests}
          onCompleteQuest={(id) => completeQuest(id)}
          onInspectQuest={(quest) => setInspectedQuest(quest)}
          onOpenCreateQuest={() => setIsForgeOpen(true)}
        />
        <QuestDetailModal
          quest={inspectedQuest}
          onClose={() => setInspectedQuest(null)}
          onComplete={(id) => completeQuest(id)}
        />
        <CreateQuestModal
          isOpen={isForgeOpen}
          onClose={() => setIsForgeOpen(false)}
          onCreateQuest={(qData) => createQuest(qData)}
        />
      </>
    );
  }
});

// Route 4: Character & Build
const characterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character',
  component: function CharacterRoute() {
    const { player, attributes, inventory, badges } = useGame();
    useEffect(() => {
      updateScreenMeta('Character & Build', 'Your character identity, weekly build progression, attributes, and class evolution.');
    }, []);

    return (
      <CharacterPage
        player={player}
        attributes={attributes}
        inventory={inventory}
        badges={badges}
      />
    );
  }
});

// Route 5: World Biosystems Map
const worldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/world',
  component: function WorldRoute() {
    const navigate = useNavigate();
    const [inspectedQuest, setInspectedQuest] = useState<Quest | null>(null);
    const { regions, quests, completeQuest } = useGame();

    useEffect(() => {
      updateScreenMeta('Biosystem World Map', 'Dynamic topological biomes shaped by real-world habit consistency.');
    }, []);

    const pathMap: Record<ActiveTab, string> = {
      landing: '/',
      dashboard: '/command',
      quests: '/quests',
      character: '/character',
      world: '/world',
      oracle: '/oracle',
      replay: '/replay',
      inventory: '/inventory',
      settings: '/settings'
    };

    return (
      <>
        <WorldPage
          regions={regions}
          quests={quests}
          onInspectQuest={(quest) => setInspectedQuest(quest)}
          onNavigateTab={(tab) => navigate({ to: pathMap[tab as ActiveTab] || '/world' })}
        />
        <QuestDetailModal
          quest={inspectedQuest}
          onClose={() => setInspectedQuest(null)}
          onComplete={(id) => completeQuest(id)}
        />
      </>
    );
  }
});

// Route 6: Oracle AI Game Master
const oracleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/oracle',
  component: function OracleRoute() {
    const navigate = useNavigate();
    const [inspectedQuest, setInspectedQuest] = useState<Quest | null>(null);
    const { oracle, quests, completeQuest } = useGame();

    useEffect(() => {
      updateScreenMeta('Oracle AI Game Master', 'Your progress, analyzed. Your next move, recommended.');
    }, []);

    const pathMap: Record<ActiveTab, string> = {
      landing: '/',
      dashboard: '/command',
      quests: '/quests',
      character: '/character',
      world: '/world',
      oracle: '/oracle',
      replay: '/replay',
      inventory: '/inventory',
      settings: '/settings'
    };

    return (
      <>
        <OraclePage
          oracle={oracle}
          quests={quests}
          onInspectQuest={(quest) => setInspectedQuest(quest)}
          onNavigateTab={(tab) => navigate({ to: pathMap[tab as ActiveTab] || '/oracle' })}
        />
        <QuestDetailModal
          quest={inspectedQuest}
          onClose={() => setInspectedQuest(null)}
          onComplete={(id) => completeQuest(id)}
        />
      </>
    );
  }
});

// Route 7: Chrono Replay (7-day debrief)
const replayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/replay',
  component: function ReplayRoute() {
    const navigate = useNavigate();
    const [inspectedQuest, setInspectedQuest] = useState<Quest | null>(null);
    const { replayDays, player, attributes, quests, oracle, completeQuest } = useGame();

    useEffect(() => {
      updateScreenMeta('Weekly Replay', 'See what changed this week.');
    }, []);

    const pathMap: Record<ActiveTab, string> = {
      landing: '/',
      dashboard: '/command',
      quests: '/quests',
      character: '/character',
      world: '/world',
      oracle: '/oracle',
      replay: '/replay',
      inventory: '/inventory',
      settings: '/settings'
    };

    return (
      <>
        <ReplayPage
          replayDays={replayDays}
          player={player}
          attributes={attributes}
          quests={quests}
          oracle={oracle}
          onInspectQuest={(quest) => setInspectedQuest(quest)}
          onNavigateTab={(tab) => navigate({ to: pathMap[tab as ActiveTab] || '/replay' })}
        />
        <QuestDetailModal
          quest={inspectedQuest}
          onClose={() => setInspectedQuest(null)}
          onComplete={(id) => completeQuest(id)}
        />
      </>
    );
  }
});

// Route 8: Armory & Rewards
const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: function InventoryRoute() {
    const { inventory, badges, player, regions, purchaseItem, toggleEquipItem } = useGame();
    useEffect(() => {
      updateScreenMeta('Inventory & Armory', 'Your earned relics, equipment and progression rewards.');
    }, []);

    return (
      <InventoryPage
        inventory={inventory}
        badges={badges}
        player={player}
        regions={regions}
        onPurchaseItem={purchaseItem}
        onToggleEquip={toggleEquipItem}
      />
    );
  }
});

// Route 9: System Settings
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: function SettingsRoute() {
    const {
      player,
      quests,
      attributes,
      inventory,
      badges,
      regions,
      oracle,
      updateUsername,
      resetToDefault
    } = useGame();

    useEffect(() => {
      updateScreenMeta('System Settings', 'Audio, accessibility, profile parameters and progress management.');
    }, []);

    return (
      <SettingsPage
        player={player}
        quests={quests}
        attributes={attributes}
        inventory={inventory}
        badges={badges}
        regions={regions}
        oracle={oracle}
        onUpdateUsername={updateUsername}
        onResetData={resetToDefault}
      />
    );
  }
});

// Create Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  landingRoute,
  commandRoute,
  questsRoute,
  characterRoute,
  worldRoute,
  oracleRoute,
  replayRoute,
  inventoryRoute,
  settingsRoute
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: function DefaultNotFound() {
    return <LandingPage onEnterApp={() => router.navigate({ to: '/command' })} />;
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
