import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SaveManager } from './SaveManager';
import { saveLoadService } from '@/services/saveLoadService';
import { useNotification } from '@/hooks/useNotification';
import { useStore } from '@/store/useStore';

// Mock dependencies
vi.mock('@/services/saveLoadService', () => ({
  saveLoadService: {
    getSaveSlots: vi.fn(),
    saveToSlot: vi.fn(),
    loadFromSlot: vi.fn(),
    deleteSaveSlot: vi.fn(),
    saveToFile: vi.fn(),
    loadFromFile: vi.fn(),
    saveAutosave: vi.fn(),
    loadAutosave: vi.fn(),
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
    
    (useNotification as any).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    (useStore as any).mockReturnValue({
      preferences: { autoSave: false },
    });

    (saveLoadService.getSaveSlots as any).mockReturnValue([]);
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
    (saveLoadService.saveToSlot as any).mockReturnValue({ id: 1 });
    
    render(<SaveManager />);
    
    // Open dialog
    const saveButton = screen.getByRole('button', { name: /save\/load/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      const saveGameButton = screen.getAllByText('Save Game')[1]; // Get the button inside dialog
      fireEvent.click(saveGameButton);
    });
    
    await waitFor(() => {
      expect(saveLoadService.saveToSlot).toHaveBeenCalled();
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