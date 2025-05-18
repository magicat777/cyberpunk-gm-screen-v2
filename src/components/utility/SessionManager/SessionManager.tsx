import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import styles from './SessionManager.module.css';
import { Button } from '../Form/Button';
import { Icon } from '../Icon';
import { TextInput } from '../Form/TextInput';
import { Select } from '../Form/Select';

export const SessionManager: React.FC = () => {
  const {
    currentSession,
    sessions,
    campaigns,
    createSession,
    loadSession,
    endSession,
    updateSessionStatus,
    deleteSession,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    removePlayer
  } = useStore(state => ({
    currentSession: state.currentSession,
    sessions: state.sessions,
    campaigns: state.campaigns,
    createSession: state.createSession,
    loadSession: state.loadSession,
    endSession: state.endSession,
    updateSessionStatus: state.updateSessionStatus,
    deleteSession: state.deleteSession,
    createCampaign: state.createCampaign,
    updateCampaign: state.updateCampaign,
    deleteCampaign: state.deleteCampaign,
    removePlayer: state.removePlayer
  }));

  const [activeTab, setActiveTab] = useState<'sessions' | 'campaigns' | 'current'>('current');
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    title: '',
    campaignId: '',
    description: ''
  });
  const [newCampaignData, setNewCampaignData] = useState({
    name: '',
    description: '',
    gmNotes: ''
  });

  const handleCreateSession = () => {
    if (newSessionData.title) {
      createSession(
        newSessionData.title,
        newSessionData.campaignId || undefined,
        newSessionData.description
      );
      setShowNewSessionModal(false);
      setNewSessionData({ title: '', campaignId: '', description: '' });
    }
  };

  const handleCreateCampaign = () => {
    if (newCampaignData.name) {
      createCampaign(
        newCampaignData.name,
        newCampaignData.description,
        newCampaignData.gmNotes
      );
      setShowNewCampaignModal(false);
      setNewCampaignData({ name: '', description: '', gmNotes: '' });
    }
  };

  const renderCurrentSession = () => {
    if (!currentSession) {
      return (
        <div className={styles.noSession}>
          <Icon name="chevron-right" size="lg" />
          <p>No active session</p>
          <Button onClick={() => setShowNewSessionModal(true)}>
            <Icon name="add" /> Start New Session
          </Button>
        </div>
      );
    }

    const campaign = campaigns.find(c => c.id === currentSession.campaignId);
    
    return (
      <div className={styles.currentSession}>
        <div className={styles.sessionHeader}>
          <h3>{currentSession.title}</h3>
          <div className={styles.sessionMeta}>
            <span>Session #{currentSession.sessionNumber}</span>
            {campaign && <span>Campaign: {campaign.name}</span>}
            <span>Started: {currentSession.startTime ? new Date(currentSession.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not started'}</span>
            <span className={`${styles.status} ${styles[currentSession.status]}`}>
              {currentSession.status}
            </span>
          </div>
        </div>

        <div className={styles.sessionControls}>
          <Button
            onClick={() => updateSessionStatus(currentSession.id, 'paused')}
            disabled={currentSession.status !== 'active'}
          >
            <Icon name="chevron-up" /> Pause
          </Button>
          <Button
            onClick={() => updateSessionStatus(currentSession.id, 'active')}
            disabled={currentSession.status !== 'paused'}
          >
            <Icon name="chevron-right" /> Resume
          </Button>
          <Button
            onClick={() => endSession(currentSession.id)}
            variant="danger"
          >
            <Icon name="close" /> End Session
          </Button>
        </div>

        <div className={styles.sessionDetails}>
          <div className={styles.players}>
            <h4>Players ({currentSession.players.length})</h4>
            <ul>
              {currentSession.players.map(player => (
                <li key={player.id}>
                  {player.name} ({player.role})
                  <button
                    onClick={() => removePlayer(currentSession.id, player.id)}
                    className={styles.removeButton}
                  >
                    <Icon name="close" size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.npcs}>
            <h4>NPCs ({currentSession.npcs.length})</h4>
            <ul>
              {currentSession.npcs.map(npc => (
                <li key={npc.id}>
                  {npc.name} - {npc.role}
                  {npc.status && ` (${npc.status})`}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.loot}>
            <h4>Loot</h4>
            {currentSession.loot.length === 0 ? (
              <p>No loot recorded</p>
            ) : (
              <ul>
                {currentSession.loot.map(item => (
                  <li key={item.id} className={item.distributed ? styles.distributed : ''}>
                    {item.name} - {item.value}eb
                    {item.distributedTo && ` → ${item.distributedTo}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.reputation}>
            <h4>Reputation Changes</h4>
            {currentSession.reputationChanges.length === 0 ? (
              <p>No reputation changes</p>
            ) : (
              <ul>
                {currentSession.reputationChanges.map(change => (
                  <li key={change.id}>
                    {change.faction}: {change.change > 0 ? '+' : ''}{change.change}
                    {change.reason && ` - ${change.reason}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {currentSession.gmNotes && (
          <div className={styles.gmNotes}>
            <h4>GM Notes</h4>
            <p>{currentSession.gmNotes}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSessions = () => (
    <div className={styles.sessionsList}>
      <div className={styles.listHeader}>
        <h3>All Sessions</h3>
        <Button onClick={() => setShowNewSessionModal(true)}>
          <Icon name="add" /> New Session
        </Button>
      </div>
      
      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        <div className={styles.sessionsGrid}>
          {sessions.map(session => {
            const campaign = campaigns.find(c => c.id === session.campaignId);
            return (
              <div key={session.id} className={styles.sessionCard}>
                <h4>{session.name}</h4>
                <div className={styles.sessionCardMeta}>
                  <span>Session #{session.sessionNumber}</span>
                  {campaign && <span>{campaign.name}</span>}
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  <span className={`${styles.status} ${styles[session.status]}`}>
                    {session.status}
                  </span>
                </div>
                <p>{session.synopsis || ''}</p>
                <div className={styles.sessionCardActions}>
                  <Button
                    size="sm"
                    onClick={() => loadSession(session.id)}
                    disabled={currentSession?.id === session.id}
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteSession(session.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCampaigns = () => (
    <div className={styles.campaignsList}>
      <div className={styles.listHeader}>
        <h3>Campaigns</h3>
        <Button onClick={() => setShowNewCampaignModal(true)}>
          <Icon name="add" /> New Campaign
        </Button>
      </div>
      
      {campaigns.length === 0 ? (
        <p>No campaigns yet</p>
      ) : (
        <div className={styles.campaignsGrid}>
          {campaigns.map(campaign => (
            <div key={campaign.id} className={styles.campaignCard}>
              <h4>{campaign.name}</h4>
              <div className={styles.campaignMeta}>
                <span>Sessions: {campaign.sessions.length}</span>
                <span>Players: {campaign.players.length}</span>
                <span className={`${styles.status} ${styles[campaign.status]}`}>
                  {campaign.status}
                </span>
              </div>
              <p>{campaign.description}</p>
              <div className={styles.campaignActions}>
                <Button
                  size="sm"
                  onClick={() => updateCampaign(campaign.id, { status: 'active' })}
                  disabled={campaign.status === 'active'}
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteCampaign(campaign.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.sessionManager}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'current' ? styles.active : ''}`}
          onClick={() => setActiveTab('current')}
        >
          <Icon name="chevron-right" /> Current Session
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'sessions' ? styles.active : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <Icon name="initiative" /> All Sessions
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'campaigns' ? styles.active : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <Icon name="encounter" /> Campaigns
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'current' && renderCurrentSession()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'campaigns' && renderCampaigns()}
      </div>

      {showNewSessionModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>New Session</h3>
            <TextInput
              label="Session Title"
              value={newSessionData.title}
              onChange={(value) => setNewSessionData({ ...newSessionData, title: value })}
              required
            />
            <Select
              label="Campaign"
              value={newSessionData.campaignId || ''}
              onChange={(value) => setNewSessionData({ ...newSessionData, campaignId: value as string })}
              options={[
                { value: '', label: 'No Campaign' },
                ...campaigns.map(campaign => ({
                  value: campaign.id,
                  label: campaign.name
                }))
              ]}
            />
            <TextInput
              label="Description"
              value={newSessionData.description}
              onChange={(value) => setNewSessionData({ ...newSessionData, description: value })}
            />
            <div className={styles.modalActions}>
              <Button onClick={() => setShowNewSessionModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleCreateSession}>Create</Button>
            </div>
          </div>
        </div>
      )}

      {showNewCampaignModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>New Campaign</h3>
            <TextInput
              label="Campaign Name"
              value={newCampaignData.name}
              onChange={(value) => setNewCampaignData({ ...newCampaignData, name: value })}
              required
            />
            <TextInput
              label="Description"
              value={newCampaignData.description}
              onChange={(value) => setNewCampaignData({ ...newCampaignData, description: value })}
            />
            <TextInput
              label="GM Notes"
              value={newCampaignData.gmNotes}
              onChange={(value) => setNewCampaignData({ ...newCampaignData, gmNotes: value })}
            />
            <div className={styles.modalActions}>
              <Button onClick={() => setShowNewCampaignModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};