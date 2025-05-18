import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SaveManager } from './SaveManager';
import * as saveLoadService from '@/services/saveLoadService';
import * as notification from '@/hooks/useNotification';
import * as store from '@/store/useStore';

// Mock dependencies
vi.mock('@/services/saveLoadService', () => ({
  saveLoadService: {
    loadSaveSlots: vi.fn(),
    saveGame: vi.fn(),
    loadGame: vi.fn(),
    deleteSave: vi.fn(),
  }
}));

vi.mock('@/hooks/useNotification', () => ({
  useNotification: vi.fn(),
}));

vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('SaveManager', () => {
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (notification.useNotification as any).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    (store.useStore as any).mockReturnValue({
      preferences: { autoSave: false },
    });

    (saveLoadService.saveLoadService.loadSaveSlots as any).mockResolvedValue([]);
  });

  it('should render save manager button', () => {
    render(<SaveManager />);
    
    expect(screen.getByText('Save/Load')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save\/load/i })).toBeInTheDocument();
  });

  it('should open dialog when button is clicked', async () => {
    render(<SaveManager />);
    
    const saveButton = screen.getByRole('button', { name: /save\/load/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Save/Load Game')).toBeInTheDocument();
    });
  });

  it('should handle save game with proper dialog interaction', async () => {
    (saveLoadService.saveLoadService.saveGame as any).mockResolvedValue({ id: 1 });
    
    render(<SaveManager />);
    
    // Open dialog
    const saveButton = screen.getByRole('button', { name: /save\/load/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      const saveGameButton = screen.getAllByText('Save Game')[1]; // Get the button inside dialog
      fireEvent.click(saveGameButton);
    });
    
    await waitFor(() => {
      expect(saveLoadService.saveLoadService.saveGame).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalled();
    });
  });

  it('should close dialog when overlay is clicked', async () => {
    render(<SaveManager />);
    
    // Open dialog
    const saveButton = screen.getByRole('button', { name: /save\/load/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      const overlay = screen.getByRole('presentation');
      fireEvent.click(overlay);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle dialog close event', async () => {
    render(<SaveManager />);
    
    // Open dialog
    const saveButton = screen.getByRole('button', { name: /save\/load/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      // Simulate dialog close event
      const closeEvent = new Event('close', { bubbles: true });
      dialog.dispatchEvent(closeEvent);
    });
    
    // Dialog should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});